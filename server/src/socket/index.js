import { Server } from "socket.io";
import envConfig from "../config/env.config.js";
import { engine } from "../services/auction-engine.service.js";
import { handleChat } from "./chat.handler.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: envConfig.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a specific auction room
    socket.on("join-room", (auctionId) => {
      socket.join(auctionId);
      console.log(`Socket ${socket.id} joined room ${auctionId}`);
    });

    // Handle bids
    socket.on("place-bid", async ({ auctionId, userId, amount }, callback) => {
      try {
        const result = await engine.submitBid(auctionId, userId, amount);
        if (callback) callback(result);
      } catch (error) {
        if (callback) callback({ success: false, error: error.message });
      }
    });

    // Handle Chat
    handleChat(io, socket);

    // Leave a specific auction room
    socket.on("leave-room", (auctionId) => {
      socket.leave(auctionId);
      console.log(`Socket ${socket.id} left room ${auctionId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
