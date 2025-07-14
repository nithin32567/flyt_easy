import express from "express";
import { bookFlight, verifyPayment } from "../controllers/bookFlight.controller.js";
import { createHotelRazorpayOrder } from "../controllers/hotelBooking.controller.js";
const router = express.Router();

router.post('/bookFlight', bookFlight);
router.post('/verifyPayment', verifyPayment);
router.post('/hotelBooking', createHotelRazorpayOrder);
// router.post('/hotel-booking', hotelBooking);

export default router;