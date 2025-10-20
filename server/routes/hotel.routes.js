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

export default router;