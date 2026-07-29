import * as authService from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/apiResponse.util.js";
import { verifyToken } from "../utils/jwt.util.js";

/**
  @desc: Register a new user
  @route: POST /api/v1/auth/register
  @access: Public
  @body: { name, email, password }
  @responses:
  - 201: User registered successfully
  - 400: User already exists
  - 500: Server Error
  */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, "Please provide name, email and password");
    }

    const data = await authService.registerUser(req.body);
    setTokenCookies(res, data.accessToken, data.refreshToken);

    sendSuccess(res, 201, "User registered successfully", data);
  } catch (error) {
    if (error.message === "User already exists") {
      return sendError(res, 400, error.message);
    }
    console.log(error);

    sendError(res, 500, "Server Error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Please provide email and password");
    }

    const data = await authService.loginUser(email, password);
    setTokenCookies(res, data.accessToken, data.refreshToken);

    sendSuccess(res, 200, "Login successful", data);
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return sendError(res, 401, error.message);
    }
    sendError(res, 500, "Server Error");
  }
};

export const getMe = async (req, res) => {
  try {
    sendSuccess(res, 200, "User profile fetched", req.user);
  } catch (error) {
    sendError(res, 500, "Server Error");
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.body.refreshToken || req.cookies.refreshToken;

    if (!token) {
      return sendError(res, 403, "Refresh token is required");
    }

    const decoded = verifyToken(
      token,
      process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret",
    );
    if (!decoded) {
      return sendError(res, 403, "Invalid refresh token");
    }

    const data = await authService.refreshToken(decoded.id, token);
    setTokenCookies(res, data.accessToken, data.refreshToken);

    sendSuccess(res, 200, "Token refreshed successfully", data);
  } catch (error) {
    sendError(res, 403, error.message || "Invalid refresh token");
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.body.refreshToken || req.cookies.refreshToken;

    if (req.user && token) {
      await authService.logoutUser(req.user._id, token);
    }

    // Clear cookies
    res.cookie("accessToken", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.cookie("refreshToken", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    sendSuccess(res, 200, "User logged out successfully");
  } catch (error) {
    sendError(res, 500, "Server Error");
  }
};

// Handle Google OAuth Callback
export const googleAuthCallback = async (req, res) => {
  try {
    // req.user has been set by Passport
    if (!req.user) {
      return res.redirect("/login?error=auth_failed");
    }

    const data = await authService.getTokensForUser(req.user);
    setTokenCookies(res, data.accessToken, data.refreshToken);

    // Redirect to frontend with successful auth
    // In production, this would be an environment variable
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}?auth=success`);
  } catch (error) {
    res.redirect("/login?error=auth_failed");
  }
};

// Helper for cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
