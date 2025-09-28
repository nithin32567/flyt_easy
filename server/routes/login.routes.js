import express from 'express'
import { googleLogin, googleCallback } from '../controllers/login.controller.js'


const router=express.Router()

// router.post("/login", login)
router.post("/google-login", googleLogin)
router.get("/google/callback", googleCallback)

export default router