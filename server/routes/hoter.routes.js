import express from "express";
import {  autosuggest } from "../controllers/hotel.controller.js";
const router = express.Router();


router.get("/autosuggest", autosuggest);  

export default router;