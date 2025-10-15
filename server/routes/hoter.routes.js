import express from "express";
import {  autosuggest, initHotelSearch, getHotelRates, getHotelFilterData, getHotelContent, getHotelRooms, getHotelPricing, createItinerary } from "../controllers/hotel.controller.js";
import { authenticateUser } from "../middleware/authenticateToken.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/autosuggest", autosuggest);  

// Protected routes (authentication required)
router.post("/init", authenticateUser, initHotelSearch);
router.get("/rates/:searchId", authenticateUser, getHotelRates);
router.get("/filters/:searchId", authenticateUser, getHotelFilterData);
router.get("/content/:searchId/:hotelId", authenticateUser, getHotelContent);
router.get("/rooms/:searchId/:hotelId", authenticateUser, getHotelRooms);
router.get("/pricing/:searchId/:hotelId/:providerName/:recommendationId", authenticateUser, getHotelPricing);
router.post("/create-itinerary", authenticateUser, createItinerary);

// Test endpoint to verify the route is working
router.get("/test", (req, res) => {
  res.json({ 
    message: "Hotel API is working", 
    timestamp: new Date().toISOString(),
    routes: [
      "GET /api/hotel/autosuggest",
      "POST /api/hotel/init", 
      "GET /api/hotel/rates/:searchId",
      "GET /api/hotel/filters/:searchId",
      "GET /api/hotel/content/:searchId/:hotelId",
      "GET /api/hotel/rooms/:searchId/:hotelId",
      "GET /api/hotel/pricing/:searchId/:hotelId/:providerName/:recommendationId",
      "POST /api/hotel/create-itinerary"
    ]
  });
});

export default router;