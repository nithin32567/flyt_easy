import express from "express";
import { generateToken } from "../controllers/signature.controller.js";
import { getAirports } from "../controllers/airport.controller.js";
import { expressSearchFlights } from "../controllers/searchFlights.controller.js";

const router = express.Router();

router.get("/signature", generateToken);
router.get("/airport", getAirports);
router.post("/express-search", expressSearchFlights);

export default router;
