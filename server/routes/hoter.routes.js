// routes/hotel.routes.js
import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  generateHotelToken,
  searchHotels,
  getHotelDetails,
  bookHotel,
  getHotelBooking,
  startHotelPayment,
  cancelHotelBooking,
} from "../controllers/hotel.controller.js";

const router = express.Router();

// Hotel Signature API - Generate token for hotel APIs
// router.post("/signature", generateHotelToken);

// Hotel Search API
router.post("/search", authenticateToken, searchHotels);

// Hotel Details API
router.post("/details", authenticateToken, getHotelDetails);

// Hotel Booking API
router.post("/book", authenticateToken, bookHotel);

// Hotel Booking Retrieval API
router.get("/booking/:bookingId", authenticateToken, getHotelBooking);

// Hotel Payment API
router.post("/payment", authenticateToken, startHotelPayment);

// Hotel Cancellation API
router.post("/cancel", authenticateToken, cancelHotelBooking);

export default router;
