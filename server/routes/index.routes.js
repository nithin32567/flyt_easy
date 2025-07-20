import express from "express";
import { generateToken } from "../controllers/signature.controller.js";

const router = express.Router();

router.get("/signature", generateToken);

export default router;
