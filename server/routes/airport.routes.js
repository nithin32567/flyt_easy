import express from "express";
import { getAirports } from "../controllers/airport.controller.js";

const router = express.Router();

router.get("/", getAirports);

export default router;
