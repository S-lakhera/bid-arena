export const handleChat = (io, socket) => {
  socket.on("send-message", ({ auctionId, message, user }) => {
    // Basic validation
    if (!auctionId || !message) return;

    // Broadcast message to everyone in the room
    io.to(auctionId).emit("receive-message", {
      user: user || { name: "Anonymous" }, // In a real app, infer user from socket auth
      message,
      timestamp: new Date(),
    });
  });
};
