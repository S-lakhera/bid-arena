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
    const active = await Auction.find({ status: "active" });
    active.forEach((auction) => {
      this._initializeAuctionState(auction);
    });
    console.log(`Loaded ${active.length} active auctions into engine.`);
  }

  _initializeAuctionState(auction) {
    const auctionId = auction._id.toString();
    this.activeAuctions.set(auctionId, {
      id: auctionId,
      currentHighestBid: auction.currentHighestBid,
      highestBidder: auction.highestBidder ? auction.highestBidder.toString() : null,
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
    const io = getIO();
    io.to(auctionId).emit("timer-sync", { timeLeft });

    // Check completion
    if (timeLeft <= 0) {
      this._completeAuction(auctionId);
    }
  }

  async _completeAuction(auctionId) {
    const state = this.activeAuctions.get(auctionId);
    if (!state) return;

    clearInterval(state.timer);
    this.activeAuctions.delete(auctionId);
    this.processingQueues.delete(auctionId);

    // Update DB
    const auction = await Auction.findById(auctionId);
    auction.status = "completed";
    if (state.highestBidder) {
      auction.winner = state.highestBidder;
    }
    await auction.save();

    await Timeline.create({
      auction: auctionId,
      eventType: "Completed",
      metadata: { winner: state.highestBidder, finalBid: state.currentHighestBid },
    });

    const io = getIO();
    io.to(auctionId).emit("auction-completed", { winner: state.highestBidder, finalBid: state.currentHighestBid });
    console.log(`Auction ${auctionId} completed.`);
  }

  // Submit a bid sequentially per auction
  async submitBid(auctionId, userId, amount) {
    if (!this.processingQueues.has(auctionId)) {
      throw new Error("Auction is not active");
    }

    // Queue the bid processing to ensure deterministic order
    const queue = this.processingQueues.get(auctionId);
    const resultPromise = queue.then(() => this._processBid(auctionId, userId, amount));
    this.processingQueues.set(auctionId, resultPromise.catch(() => {})); // Catch to prevent chain break

    return await resultPromise;
  }

  async _processBid(auctionId, userId, amount) {
    const state = this.activeAuctions.get(auctionId);
    if (!state) throw new Error("Auction is not active");
    if (Date.now() >= state.endTime) throw new Error("Auction has ended");

    const auction = await Auction.findById(auctionId);
    const minIncrement = 10; // e.g., 10 units

    if (amount < state.currentHighestBid + minIncrement) {
      throw new Error(`Bid must be at least ${state.currentHighestBid + minIncrement}`);
    }

    // Update State
    state.currentHighestBid = amount;
    state.highestBidder = userId.toString();
    state.activeBidders.add(userId.toString());

    // Update DB (Atomic-ish)
    auction.currentHighestBid = amount;
    auction.highestBidder = userId;
    await auction.save();

    await Bid.create({
      auction: auctionId,
      bidder: userId,
      amount: amount,
    });

    await Timeline.create({
      auction: auctionId,
      eventType: "BidPlaced",
      metadata: { bidder: userId, amount: amount },
    });

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
