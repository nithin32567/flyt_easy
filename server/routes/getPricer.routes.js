import express from "express";
import { getPricer } from "../controllers/getpricer.controller.js";

const router = express.Router();

router.post("/", getPricer);

export default router;
