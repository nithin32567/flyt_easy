import express from "express";
import { autosuggest, initHotelSearchWithRatesAndContents, fetchHotelPage, fetchHotelDetailsWithContentAndRooms } from "../controllers/hotel/hotel_controller_updated.js";
// import { initHotelSearch } from "../controllers/hotel.controller.js";

const router = express.Router();

router.get("/autosuggest", autosuggest);

// router.get("/init", initHotelSearch);

router.post("/search-with-rates-content", initHotelSearchWithRatesAndContents);

router.get("/page", fetchHotelPage);

router.get("/details/:searchId/:hotelId", fetchHotelDetailsWithContentAndRooms);

export default router;