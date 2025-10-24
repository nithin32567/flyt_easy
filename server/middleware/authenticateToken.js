import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticateToken = (req, res, next) => {
  try {
    let token = req.cookies.authToken;
    console.log(token,"token");
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No authentication token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    
    req.userId = decoded.id;
    req.userEmail = decoded.id;
    req.token = token;
    
    next();
  } catch (error) {
    console.log("Authentication error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authenticateUser = async (req, res, next) => {
  try {
    let token = req.cookies.authToken;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No authentication token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    
    const user = await User.findOne({ email: decoded.id });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = {
      id: user._id.toString(),
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
