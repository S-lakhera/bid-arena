import express from "express";
import * as auctionController from "../controllers/auction.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createAuctionSchema,
  updateAuctionSchema,
} from "../validations/auction.validation.js";

const router = express.Router();

// Public routes
router.get("/", auctionController.getAuctions);
router.get("/:id", auctionController.getAuctionById);

// Protected routes
router.use(protect);

router.post(
  "/",
  validate(createAuctionSchema),
  auctionController.createAuction,
);

router.patch(
  "/:id",
  validate(updateAuctionSchema),
  auctionController.updateAuction,
);
router.delete("/:id", auctionController.deleteAuction);

export default router;
