import express from "express";
import { bookFlight, verifyPayment } from "../controllers/bookFlight.controller.js";
const router = express.Router();

router.post('/bookFlight', bookFlight);
router.post('/verifyPayment', verifyPayment);

export default router;