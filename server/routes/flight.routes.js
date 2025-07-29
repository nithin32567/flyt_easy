import express from "express";
import {
  expressSearchFlights,
  getExpSearchFlights,
} from "../controllers/searchFlights.controller.js";

import { getAirports } from "../controllers/airport.controller.js";
import { smartPricer } from "../controllers/smartprice.controller.js";
import { getWebSettings } from "../controllers/websettings.controller.js";
import { getPricer } from "../controllers/getpricer.controller.js";
import { createItinerary, getExistingItinerary } from "../controllers/createItenary.controller.js";
import { startPay } from "../controllers/bookFlight.controller.js";

const router = express.Router();

router.post("/express-search", expressSearchFlights);

router.get("/airports", getAirports);

router.post("/web-settings", getWebSettings);

router.post("/get-exp-search", getExpSearchFlights);

router.post("/smart-price", smartPricer);

router.post("/get-pricer", getPricer);

router.post("/create-itinerary", createItinerary);

router.post("/startpay", startPay);

router.post("/get-existing-itenary", getExistingItinerary);

export default router;
