import Razorpay from "razorpay";
import crypto from "crypto";
import envConfig from "../config/env.config.js";

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: envConfig.RAZORPAY_KEY_ID,
      key_secret: envConfig.RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * Create a new Razorpay order
   * @param {number} amount in INR (will be converted to paise)
   * @param {string} receiptId typically the auction ID
   * @returns {Promise<Object>} order object from Razorpay
   */
  async createRazorpayOrder(amount, receiptId) {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: receiptId,
    };
    return await this.razorpay.orders.create(options);
  }

  /**
   * Verify the Razorpay payment signature
   * @param {string} orderId 
   * @param {string} paymentId 
   * @param {string} signature 
   * @returns {boolean} true if signature is valid
   */
  verifySignature(orderId, paymentId, signature) {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", envConfig.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === signature;
  }
}

export const paymentService = new PaymentService();
