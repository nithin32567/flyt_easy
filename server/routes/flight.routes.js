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
import { startPay, getItineraryStatus, testGetItineraryStatusSimple } from "../controllers/bookFlight.controller.js";
import { getSSRServices, validateSSRSelection } from "../controllers/ssr.controller.js";
import { retrieveBooking } from "../controllers/retrieveBooking.controller.js";
import { testGetItineraryStatus, testRetrieveBooking } from "../controllers/test.controller.js";

const router = express.Router();

router.post("/express-search", expressSearchFlights);

router.get("/airports", getAirports);

router.post("/web-settings", getWebSettings);

router.post("/get-exp-search", getExpSearchFlights);

router.post("/smart-price", smartPricer);

router.post("/get-pricer", getPricer);

router.post("/create-itinerary", createItinerary);

router.post("/startpay", startPay);

router.post("/get-itinerary-status", getItineraryStatus);

router.post("/get-existing-itenary", getExistingItinerary);

router.post("/get-ssr-services", getSSRServices);

router.post("/validate-ssr-selection", validateSSRSelection);

router.post("/retrieve-booking", retrieveBooking);

// Test endpoints
router.post("/test-get-itinerary-status", testGetItineraryStatus);
router.post("/test-get-itinerary-status-simple", testGetItineraryStatusSimple);
router.post("/test-retrieve-booking", testRetrieveBooking);

export default router;
