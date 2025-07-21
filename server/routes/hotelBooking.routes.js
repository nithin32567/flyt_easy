import express from "express";
import { createHotelRazorpayOrder } from "../controllers/hotelBooking.controller.js";

const router = express.Router();

// POST /api/hotel-booking/razorpay/hotelBooking
router.post("/razorpay/hotelBooking", createHotelRazorpayOrder);

export default router;