import mongoose from "mongoose";
import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import Timeline from "../models/timeline.model.js";
import { getIO } from "../socket/index.js";

class AuctionEngine {
  constructor() {
    this.activeAuctions = new Map();
    this.processingQueues = new Map(); // to ensure deterministic ordering of bids
  }

  // Load active auctions from DB on startup
  async loadActiveAuctions() {
    const now = new Date();
    await Auction.updateMany(
      { status: "upcoming", startTime: { $lte: now } },
      { $set: { status: "active" } }
    );
    const active = await Auction.find({ status: "active" });
    console.log(
      `[AuctionEngine] Found ${active.length} active auctions in DB.`,
    );
    active.forEach((auction) => {
      this._initializeAuctionState(auction);
    });
    console.log(
      `[AuctionEngine] Loaded ${active.length} active auctions into engine.`,
    );
  }

  // Add a newly created single auction to the engine dynamically
  addAuction(auction) {
    if (auction.status === "active") {
      const auctionId = auction._id.toString();
      if (!this.activeAuctions.has(auctionId)) {
        this._initializeAuctionState(auction);
        console.log(`[AuctionEngine] Added newly created auction ${auction._id} into engine.`);
      }
    }
  }

  removeAuction(auctionId) {
    const state = this.activeAuctions.get(auctionId);
    if (state) {
      clearInterval(state.timer);
      this.activeAuctions.delete(auctionId);
      this.processingQueues.delete(auctionId);
    }
  }

  _initializeAuctionState(auction) {
    const auctionId = auction._id.toString();
    this.activeAuctions.set(auctionId, {
      id: auctionId,
      currentHighestBid: auction.currentHighestBid || auction.startBid || 0,
      highestBidder: auction.highestBidder
        ? auction.highestBidder.toString()
        : null,
      endTime: auction.endTime.getTime(),
      timer: setInterval(() => this._tick(auctionId), 1000),
      activeBidders: new Set(),
    });
    this.processingQueues.set(auctionId, Promise.resolve());
  }

  _tick(auctionId) {
    const state = this.activeAuctions.get(auctionId);
    if (!state) return;

    const now = Date.now();
    const timeLeft = Math.max(0, Math.floor((state.endTime - now) / 1000));

    // Broadcast time left
    try {
      const io = getIO();
      io.to(auctionId).emit("timer-sync", { timeLeft });
    } catch (err) {
      console.error(`[AuctionEngine] Error emitting timer-sync for ${auctionId}:`, err);
    }

    // Check completion
    if (timeLeft <= 0) {
      if (!state.isCompleting) {
        state.isCompleting = true;
        const queue = this.processingQueues.get(auctionId) || Promise.resolve();
        const resultPromise = queue.then(() => this._completeAuction(auctionId));
        this.processingQueues.set(
          auctionId,
          resultPromise.catch((err) => {
            console.error(`[AuctionEngine] Error completing auction ${auctionId}:`, err);
            state.isCompleting = false; // Allow retry on next tick
          })
        );
      }
    }
  }

  async _completeAuction(auctionId) {
    const state = this.activeAuctions.get(auctionId);
    if (!state) return;

    // Update DB first
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return; // Auction no longer exists
    }
    
    auction.status = "completed";
    if (state.highestBidder) {
      auction.winner = state.highestBidder;
    }
    await auction.save();

    await Timeline.create({
      auction: auctionId,
      eventType: "completed",
      eventData: {
        winner: state.highestBidder,
        finalBid: state.currentHighestBid,
      },
    });

    // Cleanup state only after successful persistence
    clearInterval(state.timer);
    this.activeAuctions.delete(auctionId);
    this.processingQueues.delete(auctionId);

    try {
      const io = getIO();
      io.to(auctionId).emit("auction-completed", {
        winner: state.highestBidder,
        finalBid: state.currentHighestBid,
      });
    } catch (err) {
      console.error(`[AuctionEngine] Error emitting auction-completed for ${auctionId}:`, err);
    }
    console.log(`[AuctionEngine] Auction ${auctionId} completed!`);
  }

  // Submit a bid sequentially per auction
  async submitBid(auctionId, userId, amount) {
    if (!this.processingQueues.has(auctionId)) {
      throw new Error("Auction is not active");
    }

    // Queue the bid processing to ensure deterministic order
    const queue = this.processingQueues.get(auctionId);
    const resultPromise = queue.then(() =>
      this._processBid(auctionId, userId, amount),
    );
    this.processingQueues.set(
      auctionId,
      resultPromise.catch(() => {}),
    ); // Catch to prevent chain break

    return await resultPromise;
  }

  async _processBid(auctionId, userId, amount) {
    const state = this.activeAuctions.get(auctionId);
    if (!state) throw new Error("Auction is not active");
    if (Date.now() >= state.endTime) throw new Error("Auction has ended");

    const minIncrement = 10; // e.g., 10 units
    if (amount < state.currentHighestBid + minIncrement) {
      throw new Error(`Bid must be at least ${state.currentHighestBid + minIncrement}`);
    }

    let session = null;
    let useTransaction = false;

    try {
      session = await mongoose.startSession();
      session.startTransaction();
      useTransaction = true;
    } catch (e) {
      if (session) {
        await session.endSession();
        session = null;
      }
      console.warn("[AuctionEngine] MongoDB transactions not supported. Falling back to non-transactional writes.");
    }

    try {
      let query = Auction.findById(auctionId);
      if (useTransaction) query = query.session(session);
      
      const auction = await query;
      if (!auction) {
        throw new Error("Auction not found");
      }

      // Update State
      state.currentHighestBid = amount;
      state.highestBidder = userId.toString();
      state.activeBidders.add(userId.toString());

      // Update DB
      auction.currentHighestBid = amount;
      auction.highestBidder = userId;
      await auction.save(useTransaction ? { session } : undefined);

      const bidDocs = [{ auction: auctionId, bidder: userId, amount: amount }];
      await Bid.create(bidDocs, useTransaction ? { session } : undefined);

      const timelineDocs = [{ auction: auctionId, eventType: "bid_placed", eventData: { bidder: userId, amount: amount } }];
      await Timeline.create(timelineDocs, useTransaction ? { session } : undefined);
      
      if (useTransaction) {
        await session.commitTransaction();
        session.endSession();
      }
    } catch (err) {
      if (useTransaction) {
        await session.abortTransaction();
        session.endSession();
      }
      throw err;
    }

    // Broadcast
    const io = getIO();
    io.to(auctionId).emit("bid-update", {
      currentHighestBid: amount,
      highestBidder: userId,
      timestamp: new Date(),
    });

    return { success: true, currentHighestBid: amount };
  }
}

export const engine = new AuctionEngine();
