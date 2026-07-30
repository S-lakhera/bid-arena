import Auction from "../models/auction.model.js";

export const createAuction = async (auctionData) => {
  const auction = new Auction(auctionData);
  return await auction.save();
};

export const getAuctions = async (filters = {}) => {
  return await Auction.find(filters).populate("seller", "name email");
};

export const getAuctionById = async (id) => {
  return await Auction.findById(id).populate("seller", "name email").populate("highestBidder", "name email");
};

export const updateAuction = async (id, updateData) => {
  return await Auction.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteAuction = async (id) => {
  return await Auction.findByIdAndDelete(id);
};
