import { Server } from "socket.io";
import envConfig from "../config/env.config.js";
import { engine } from "../services/auction-engine.service.js";
import { handleChat } from "./chat.handler.js";
import { verifyToken } from "../utils/jwt.util.js";
import User from "../models/user.model.js";

let io;

export const initializeSocket = (server) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT_SECRET environment variable is missing.");
  }

  io = new Server(server, {
    cors: {
      origin: envConfig.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      let token;
      if (socket.handshake.auth && socket.handshake.auth.token) {
        token = socket.handshake.auth.token;
      } else if (socket.handshake.headers && socket.handshake.headers.authorization) {
        const authHeader = socket.handshake.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        }
      }
      
      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }

      const decoded = verifyToken(token, process.env.JWT_SECRET);
      if (!decoded) {
        return next(new Error("Authentication error: Invalid token"));
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.data.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a specific auction room
    socket.on("join-room", (auctionId) => {
      socket.join(auctionId);
      console.log(`Socket ${socket.id} joined room ${auctionId}`);

      const state = engine.getAuctionState(auctionId);
      if (state) {
        socket.emit("timer-sync", { timeLeft: state.timeLeft });
        socket.emit("bid-update", {
          currentHighestBid: state.currentHighestBid,
          highestBidder: state.highestBidder,
          timestamp: new Date(),
        });
        socket.emit("active-bidders-count", { count: state.activeBiddersCount });
      }
    });

    // Handle bids
    socket.on("place-bid", async ({ auctionId, amount }, callback) => {
      try {
        const userId = socket.data.user._id;
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
