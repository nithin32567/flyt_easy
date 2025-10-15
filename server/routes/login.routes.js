import express from 'express'
import { googleLogin, googleCallback, logout, getCurrentUser } from '../controllers/login.controller.js'
import { authenticateUser } from '../middleware/authenticateToken.js'

const router = express.Router()

// Public routes
router.post("/google-login", googleLogin)
router.get("/google/callback", googleCallback)

// Protected routes
router.post("/logout", logout)
router.get("/me", authenticateUser, getCurrentUser)

export default router