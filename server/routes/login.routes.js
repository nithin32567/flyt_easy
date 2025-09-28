import express from 'express'
import { googleLogin, googleCallback, logout, getCurrentUser } from '../controllers/login.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.post("/google-login", googleLogin)
router.get("/google/callback", googleCallback)

// Protected routes
router.post("/logout", logout)
router.get("/me", authenticateToken, getCurrentUser)

export default router