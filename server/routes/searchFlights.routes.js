import express from "express";
import * as flightController from "../controllers/searchFlights.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { getExpSearchFlights } from "../controllers/searchFlights.controller.js";
const router = express.Router();

router.post(
  "/express-search",
  authenticateToken,
  flightController.expressSearchFlights
);
router.post("/get/getExpSearch", authenticateToken, getExpSearchFlights);

export default router;
