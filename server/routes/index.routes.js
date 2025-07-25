import express from "express";
import { generateToken } from "../controllers/signature.controller.js";
import flightRoutes from "./flight.routes.js";
// import hotelRoutes from "./hoter.routes.js";
import razorpayRoutes from "./razorpay.routes.js";
const router = express.Router();

router.get("/signature", generateToken);

router.use("/flights", flightRoutes);
// router.use("/hotels", hotelRoutes);
router.use("/razorpay", razorpayRoutes);
export default router;
