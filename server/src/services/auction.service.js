import Auction from "../models/auction.model.js";
import Timeline from "../models/timeline.model.js";
import { engine } from "./auction-engine.service.js";

export const createAuction = async (auctionData) => {
  if (auctionData.currentHighestBid === undefined && auctionData.startBid !== undefined) {
    auctionData.currentHighestBid = auctionData.startBid;
  }
  const auction = new Auction(auctionData);
  const savedAuction = await auction.save();
  engine.addAuction(savedAuction);
  return savedAuction;
};

export const getAuctions = async (filters = {}) => {
  return await Auction.find(filters).populate("seller", "name");
};

export const getAuctionById = async (id) => {
  return await Auction.findById(id).populate("seller", "name").populate("highestBidder", "name");
};

export const updateAuction = async (id, updateData) => {
  return await Auction.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteAuction = async (id) => {
  const deleted = await Auction.findByIdAndDelete(id);
  if (deleted) {
    engine.removeAuction(id);
  }
  return deleted;
};

export const getAuctionTimeline = async (id) => {
  return await Timeline.find({ auction: id }).sort({ timestamp: -1 });
};
