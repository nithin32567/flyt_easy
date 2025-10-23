import express from 'express';
import { authenticateUser } from '../middleware/authenticateToken.js';
import {
  getUserProfile,
  updateUserProfile,
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/user.controller.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// User profile routes
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);

// Address management routes
router.post('/addresses', authenticateUser, createAddress);
router.get('/addresses',  getUserAddresses);
router.put('/addresses/:addressId', authenticateUser, updateAddress);
router.delete('/addresses/:addressId', authenticateUser, deleteAddress);
router.patch('/addresses/:addressId/default', authenticateUser, setDefaultAddress);

export default router;
