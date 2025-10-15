import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticateToken = (req, res, next) => {
  try {
    // Check for token in cookies first (for web authentication)
    let token = req.cookies.authToken;
    
    // If no cookie token, check Authorization header (for API calls)
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No authentication token provided" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    
    // Attach user info to request
    req.userId = decoded.id;
    req.userEmail = decoded.id; // In this case, id is the email
    req.token = token;
    
    next();
  } catch (error) {
    console.log("Authentication error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authenticateUser = async (req, res, next) => {
  try {
    // Check for token in cookies first
    let token = req.cookies.authToken;
    
    // If no cookie token, check Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No authentication token provided" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    
    // Fetch user from database
    const user = await User.findOne({ email: decoded.id });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Attach user object to request
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      lastLogin: user.lastLogin
    };
    
    next();
  } catch (error) {
    console.log("Authentication error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
