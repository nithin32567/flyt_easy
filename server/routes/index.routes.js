import express from "express";
import { generateToken } from "../controllers/signature.controller.js";
import flightRoutes from "./flight.routes.js";
// import hotelRoutes from "./hoter.routes.js";
import razorpayRoutes from "./razorpay.routes.js";
import loginRoutes from "./login.routes.js";
import hotelRoutes from "./hotel.routes.js";
import userRoutes from "./user.routes.js";
import bookingDetailsRoutes from "./bookingDetails.routes.js";
const router = express.Router();

router.get("/signature", generateToken);

router.use("/flights", flightRoutes);
// router.use("/hotels", hotelRoutes);
router.use("/razorpay", razorpayRoutes);
router.use("/hotel", hotelRoutes);
// router.use("/hotel", hotelRoutes);



router.use("/login", loginRoutes);
router.use("/user", userRoutes);
router.use("/bookings", bookingDetailsRoutes);
export default router;
