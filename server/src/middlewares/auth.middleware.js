import { verifyToken } from '../utils/jwt.util.js';
import User from '../models/user.model.js';
import { sendError } from '../utils/apiResponse.util.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Alternatively, check cookies if we decide to store it there
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // Make sure token exists
  if (!token) {
    return sendError(res, 401, 'Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = verifyToken(token, process.env.JWT_SECRET || 'fallback_secret');

    if (!decoded) {
      return sendError(res, 401, 'Not authorized to access this route, invalid token');
    }

    // Attach user to request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return sendError(res, 401, 'User no longer exists');
    }

    next();
  } catch (error) {
    return sendError(res, 401, 'Not authorized to access this route');
  }
};
