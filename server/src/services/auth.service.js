import * as userDao from '../dao/user.dao.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util.js';

export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await userDao.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await userDao.createUser({
    name,
    email,
    password,
  });

  return await getTokensForUser(user);
};

export const loginUser = async (email, password) => {
  const user = await userDao.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return await getTokensForUser(user);
};

export const refreshToken = async (userId, token) => {
  const user = await userDao.findUserById(userId);
  
  if (!user || !user.refreshTokens.includes(token)) {
    throw new Error('Invalid refresh token');
  }

  return await getTokensForUser(user);
};

export const logoutUser = async (userId, token) => {
  await userDao.removeRefreshToken(userId, token);
};

// Helper to generate tokens and update DB
export const getTokensForUser = async (user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await userDao.addRefreshToken(user._id, refreshToken);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    },
    accessToken,
    refreshToken,
  };
};
