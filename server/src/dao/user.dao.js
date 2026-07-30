import User from "../models/user.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+password"); // Explicitly select password
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const findUserByGoogleId = async (googleId) => {
  return await User.findOne({ googleId });
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const addRefreshToken = async (userId, token) => {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { refreshTokens: token } },
    { new: true },
  );
};

export const removeRefreshToken = async (userId, token) => {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { refreshTokens: token } },
    { new: true },
  );
};

export const clearRefreshTokens = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { refreshTokens: [] },
    { returnDocument: "after" },
  );
};
