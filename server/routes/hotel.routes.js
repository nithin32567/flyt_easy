import express from "express";
import { 
  autosuggest, 
  initHotelSearch, 
  fetchHotelContentAndRates, 
  fetchHotelPage, 
  fetchHotelDetailsWithContentAndRooms, 
  fetchHotelPricing,
  filterHotels,
  getFilterData,
  createItineraryForHotelRoom
} from "../controllers/hotel/hotel_controller_updated.js";
import { 
  createHotelRazorpayOrder, 
  verifyHotelPayment, 
  startHotelPay, 
  getHotelItineraryStatus 
} from "../controllers/hotelBooking.controller.js";

const router = express.Router();

router.get("/autosuggest", autosuggest);

router.post("/init", initHotelSearch);

router.get("/content-rates/:searchId", fetchHotelContentAndRates);

router.get("/page", fetchHotelPage);

router.get("/details/:searchId/:hotelId", fetchHotelDetailsWithContentAndRooms);

router.get("/pricing/:searchId/:hotelId/:priceProvider/:roomRecommendationId", fetchHotelPricing);

router.post("/filter/:searchId", filterHotels);

router.get("/filterdata/:searchId", getFilterData);

router.post("/create-itinerary", createItineraryForHotelRoom);

// Hotel Payment Routes
router.post("/create-razorpay-order", createHotelRazorpayOrder);
router.post("/verify-payment", verifyHotelPayment);
router.post("/start-pay", startHotelPay);
router.post("/get-itinerary-status", getHotelItineraryStatus);

export default router;