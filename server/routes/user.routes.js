import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
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
router.use(authenticateToken);

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Address management routes
router.post('/addresses', createAddress);
router.get('/addresses', getUserAddresses);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.patch('/addresses/:addressId/default', setDefaultAddress);

export default router;
