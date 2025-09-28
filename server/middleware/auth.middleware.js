import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookies first, then from Authorization header as fallback
    let token = req.cookies?.authToken;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ 
        message: "Access denied. No token provided.",
        code: "NO_TOKEN"
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    
    // Find user in database
    const user = await User.findOne({ email: decoded.id, isActive: true });
    
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid token. User not found.",
        code: "USER_NOT_FOUND"
      });
    }

    // Add user info to request object
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: "Invalid token.",
        code: "INVALID_TOKEN"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token expired.",
        code: "TOKEN_EXPIRED"
      });
    }

    return res.status(500).json({ 
      message: "Internal server error during authentication.",
      code: "AUTH_ERROR"
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.authToken;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      const user = await User.findOne({ email: decoded.id, isActive: true });
      
      if (user) {
        req.user = {
          id: user._id,
          email: user.email,
          name: user.name,
          picture: user.picture
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
};
