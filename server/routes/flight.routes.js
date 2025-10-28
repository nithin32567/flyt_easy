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
import { startPay, getItineraryStatus, pollItineraryStatusEndpoint } from "../controllers/bookFlight.controller.js";
import { getSSRServices, validateSSRSelection } from "../controllers/ssr.controller.js";
import { retrieveBooking } from "../controllers/retrieveBooking.controller.js";
import { getTravelCheckList } from "../controllers/getTravelCheckList.controller.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/airports", getAirports);
router.post("/web-settings", getWebSettings);

// Public routes (no authentication required)
router.post("/express-search", expressSearchFlights);
router.post("/get-exp-search", getExpSearchFlights);
router.post("/smart-price", smartPricer);
router.post("/get-pricer", getPricer);
router.post("/create-itinerary", createItinerary);
router.post("/startpay", startPay);
router.post("/get-itinerary-status", getItineraryStatus);
router.post("/poll-itinerary-status", pollItineraryStatusEndpoint);
router.post("/get-existing-itenary", getExistingItinerary);
router.post("/get-ssr-services", getSSRServices);
router.post("/validate-ssr-selection", validateSSRSelection);
router.post("/get-travel-check-list", getTravelCheckList);
router.post("/retrieve-booking", retrieveBooking);



export default router;
