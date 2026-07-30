import express from "express";
import { createCheckoutSession, verifyPayment } from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyPaymentSchema } from "../validations/payment.validation.js";

const router = express.Router();

router.use(protect); // All payment routes are protected

router.post("/create-order/:auctionId", createCheckoutSession);
router.post("/verify", validate(verifyPaymentSchema), verifyPayment);

export default router;
