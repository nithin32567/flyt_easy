import express from "express";
import { getWebSettings } from "../controllers/websettings.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
const router = express.Router();

router.post("/", authenticateToken, getWebSettings);

export default router;
