export const handleChat = (io, socket) => {
  socket.on("send-message", ({ auctionId, message }) => {
    // Basic validation
    if (!auctionId || !message) return;

    const user = socket.data.user;

    // Broadcast message to everyone in the room
    io.to(auctionId).emit("receive-message", {
      user: { name: user.name, _id: user._id },
      message,
      timestamp: new Date(),
    });
  });
};
