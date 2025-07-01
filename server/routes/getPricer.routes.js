import express from "express";
import { getPricer } from "../controllers/getPricer.controller.js";

const router = express.Router();

router.post("/", getPricer);

export default router;
