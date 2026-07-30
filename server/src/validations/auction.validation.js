import { z } from "zod";

export const createAuctionSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().min(1, "Description is required"),
    startBid: z.number().min(0, "Starting bid must be non-negative"),
    duration: z
      .number()
      .min(60, "Duration must be at least 1 minute (60 seconds)"),
    startTime: z
      .string()
      .datetime("Invalid start time format (must be ISO-8601)"),
    image: z.string().optional(),
  }),
});

export const updateAuctionSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title is too long")
      .optional(),
    description: z.string().min(1, "Description is required").optional(),
    startBid: z.number().min(0, "Starting bid must be non-negative").optional(),
    duration: z
      .number()
      .min(60, "Duration must be at least 1 minute (60 seconds)")
      .optional(),
    startTime: z
      .string()
      .datetime("Invalid start time format (must be ISO-8601)")
      .optional(),
    image: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Auction ID is required"),
  }),
});
