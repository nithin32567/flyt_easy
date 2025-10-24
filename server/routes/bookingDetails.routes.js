import express from 'express';
import {
  saveBookingDetails,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingDetails.controller.js';
import { authenticateUser } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/save', authenticateUser, saveBookingDetails);
router.get('/user/:userId', authenticateUser, getUserBookings);
router.get('/:bookingId', authenticateUser, getBookingById);
router.put('/:bookingId/status', authenticateUser, updateBookingStatus);
router.put('/:bookingId/cancel', authenticateUser, cancelBooking);

export default router;
