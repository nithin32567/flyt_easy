import express from "express";
import { getSmartPrice } from "../controllers/smartprice.controller.js";
const router = express.Router();

router.post("/", getSmartPrice);

export default router;