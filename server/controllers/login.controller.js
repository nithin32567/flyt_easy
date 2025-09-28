import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    console.log("Google login attempt received");
    const { token } = req.body;

    if (!token) {
      console.log("No token provided");
      return res.status(400).json({ message: "No token provided" });
    }

    console.log("Verifying Google token...");
    
    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    console.log("Token verified successfully for user:", payload.email);

    // Extract user info
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists in DB, if not create new user
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log("Creating new user:", email);
      user = new User({
        email,
        name,
        picture,
        googleId,
        lastLogin: new Date()
      });
      await user.save();
      console.log("New user created successfully");
    } else {
      console.log("Existing user found:", email);
      // Update last login and picture if changed
      user.lastLogin = new Date();
      if (picture && user.picture !== picture) {
        user.picture = picture;
      }
      await user.save();
    }

    // Generate JWT (your own session token)
    const jwtToken = jwt.sign({ id: email }, process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "7d", // Extended to 7 days for better UX
    });

    // Set secure HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: '/'
    };

    res.cookie('authToken', jwtToken, cookieOptions);

    console.log("JWT token generated and set as cookie successfully");
    
    // Return user data without sensitive information
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      lastLogin: user.lastLogin
    };

    return res.json({ 
      message: "Login successful",
      user: userResponse 
    });
  } catch (err) {
    console.error("Google login error:", err.message);
    console.error("Full error:", err);
    res.status(401).json({ message: "Invalid Google Token", error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the auth cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    console.log("User logged out successfully");
    return res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // This endpoint should be protected by auth middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Get current user error:", error.message);
    return res.status(500).json({ message: "Failed to get user", error: error.message });
  }
};

export const googleCallback = async (req, res) => {
  // This function is for OAuth callback flow, but since you're using ID token flow,
  // this might not be needed. Keeping it for completeness.
  res.json({ message: "Google callback endpoint" });
};
