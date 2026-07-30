import { StatusCodes } from "http-status-codes";
import * as auctionService from "../services/auction.service.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * @desc Create new Auction
 * @route POST /api/v1/auctions
 * @access Protected
 * @body {title, description, startBid, duration, startTime, image}
 * @success 201 Auction created successfully
 * @error 401 Not authorized to access this route
 */
export const createAuction = async (req, res) => {
  const auctionData = {
    ...req.body,
    status: new Date(req.body.startTime) <= new Date() ? "active" : "upcoming",
    seller: req.user._id,
  };
  const auction = await auctionService.createAuction(auctionData);
  res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        "Auction created successfully",
        auction,
      ),
    );
};

/**
 * @desc Get All Auctions
 * @route GET /api/v1/auctions
 * @access Public
 * @success 200 Auctions retrieved successfully
 * @query {status: "active" | "upcoming" | "completed"} Status to filter auctions by
 */
export const getAuctions = async (req, res) => {
  const filters = {};
  if (req.query.status) {
    filters.status = req.query.status;
  }
  const auctions = await auctionService.getAuctions(filters);
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        "Auctions retrieved successfully",
        auctions,
      ),
    );
};

/**
 * @desc Get Auction by ID
 * @route GET /api/v1/auctions/:id
 * @access Public
 * @success 200 Auction retrieved successfully
 * @error 404 Auction not found
 */
export const getAuctionById = async (req, res) => {
  const auction = await auctionService.getAuctionById(req.params.id);
  if (!auction) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(new ApiResponse(StatusCodes.NOT_FOUND, "Auction not found"));
  }
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        "Auction retrieved successfully",
        auction,
      ),
    );
};

/**
 * @desc Update Auction
 * @route PATCH /api/v1/auctions/:id
 * @access Protected
 * @body {title, description, startBid, duration, startTime, image}
 * @success 200 Auction updated successfully
 * @error 401 Not authorized to access this route
 * @error 404 Auction not found
 */
export const updateAuction = async (req, res) => {
  const auction = await auctionService.getAuctionById(req.params.id);
  if (!auction) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(new ApiResponse(StatusCodes.NOT_FOUND, "Auction not found"));
  }

  // Verify seller is updating
  if (auction.seller._id.toString() !== req.user._id.toString()) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json(
        new ApiResponse(
          StatusCodes.FORBIDDEN,
          "Not authorized to update this auction",
        ),
      );
  }

  const updatedAuction = await auctionService.updateAuction(
    req.params.id,
    req.body,
  );
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        "Auction updated successfully",
        updatedAuction,
      ),
    );
};

/**
 * @desc Delete Auction
 * @route DELETE /api/v1/auctions/:id
 * @access Protected
 * @success 200 Auction deleted successfully
 * @error 401 Not authorized to access this route
 * @error 404 Auction not found
 */
export const deleteAuction = async (req, res) => {
  const auction = await auctionService.getAuctionById(req.params.id);
  if (!auction) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(new ApiResponse(StatusCodes.NOT_FOUND, "Auction not found"));
  }

  // Verify seller is deleting
  if (auction.seller._id.toString() !== req.user._id.toString()) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json(
        new ApiResponse(
          StatusCodes.FORBIDDEN,
          "Not authorized to delete this auction",
        ),
      );
  }

  await auctionService.deleteAuction(req.params.id);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, "Auction deleted successfully"));
};
