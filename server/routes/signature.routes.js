import express from "express";
import { generateToken } from "../controllers/signature.controller.js";

const router = express.Router();

router.get("/", generateToken);

export default router;
