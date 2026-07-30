import { StatusCodes } from "http-status-codes";
import Auction from "../models/auction.model.js";
import Timeline from "../models/timeline.model.js";
import { paymentService } from "../services/payment.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getIO } from "../socket/index.js";

/**
 * @desc Create Checkout Session
 * @route POST /api/v1/payments/create-order/:auctionId
 * @access Protected
 */
export const createCheckoutSession = async (req, res) => {
  const { auctionId } = req.params;
  const userId = req.user._id;

  const auction = await Auction.findById(auctionId);
  
  if (!auction) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(new ApiResponse(StatusCodes.NOT_FOUND, "Auction not found"));
  }

  if (auction.status !== "completed") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiResponse(StatusCodes.BAD_REQUEST, "Auction is not completed yet"));
  }

  if (!auction.winner || auction.winner.toString() !== userId.toString()) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json(new ApiResponse(StatusCodes.FORBIDDEN, "Only the winner can initiate payment"));
  }

  if (auction.paymentStatus === "paid") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new ApiResponse(StatusCodes.BAD_REQUEST, "Auction is already paid"));
  }

  const lockedAuction = await Auction.findOneAndUpdate(
    { _id: auctionId, paymentStatus: { $ne: "paid" }, razorpayOrderId: { $exists: false } },
    { $set: { razorpayOrderId: "pending_creation" } },
    { new: true }
  );

  if (!lockedAuction) {
    const currentAuction = await Auction.findById(auctionId);
    if (currentAuction?.paymentStatus === "paid") {
      return res.status(StatusCodes.BAD_REQUEST).json(new ApiResponse(StatusCodes.BAD_REQUEST, "Auction is already paid"));
    }
    return res.status(StatusCodes.CONFLICT).json(new ApiResponse(StatusCodes.CONFLICT, "Order creation already in progress or completed"));
  }

  try {
    const amount = lockedAuction.currentHighestBid;
    const order = await paymentService.createRazorpayOrder(amount, auctionId);
    
    // Save actual order id to auction
    lockedAuction.razorpayOrderId = order.id;
    await lockedAuction.save();

    res
      .status(StatusCodes.CREATED)
      .json(new ApiResponse(StatusCodes.CREATED, "Order created successfully", order));
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    await Auction.updateOne({ _id: auctionId }, { $unset: { razorpayOrderId: 1 } });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new ApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error creating payment order"));
  }
};

/**
 * @desc Verify Payment
 * @route POST /api/v1/payments/verify
 * @access Protected
 */
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const isValid = paymentService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(new ApiResponse(StatusCodes.BAD_REQUEST, "Invalid signature"));
    }

    // Find auction by order id
    const auction = await Auction.findOne({ razorpayOrderId: razorpay_order_id });
    if (!auction) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new ApiResponse(StatusCodes.NOT_FOUND, "Auction not found for this order"));
    }

    if (auction.paymentStatus === "paid") {
      return res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, "Payment verified successfully"));
    }

    auction.paymentStatus = "paid";
    await auction.save();

    // Create Timeline event
    await Timeline.create({
      auction: auction._id,
      eventType: "payment_success",
      eventData: {
        paymentId: razorpay_payment_id,
        amount: auction.currentHighestBid,
      },
    });

    // Emit socket event
    try {
      const io = getIO();
      io.to(auction._id.toString()).emit("payment-success", {
        auctionId: auction._id,
        paymentStatus: "paid",
      });
    } catch (err) {
      console.error(`Error emitting payment-success for ${auction._id}:`, err);
    }

    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, "Payment verified successfully"));
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new ApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Error verifying payment"));
  }
};
