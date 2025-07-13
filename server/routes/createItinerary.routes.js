import express from "express";
import { createItinerary } from "../controllers/createItenary.controller.js";
const router = express.Router();

router.post('/', createItinerary);

export default router;