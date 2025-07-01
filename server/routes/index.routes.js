import express from "express";
import flightRoutes from "./searchFlights.routes.js";
import signatureRoutes from "./signature.routes.js";
import webSettingsRoutes from "./websetting.routes.js";
import airportRoutes from "./airport.routes.js";
import smartPriceRoutes from "./smartPrice.routes.js";
import getPricerRoutes from "./getPricer.routes.js";
import razorpayRoutes from "./razorpay.routes.js";
const router = express.Router();

    router.use("/flight", flightRoutes);
router.use("/signature", signatureRoutes);
router.use("/websetting", webSettingsRoutes);
router.use("/airport", airportRoutes);
router.use("/smartPrice", smartPriceRoutes);
router.use("/getPricer", getPricerRoutes);
router.use('/razorpay', razorpayRoutes);
export default router;
