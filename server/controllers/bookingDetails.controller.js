import BookingDetails from '../models/bookingDetails.model.js';
import User from '../models/user.model.js';

export const saveBookingDetails = async (req, res) => {
  try {
    const { bookingData, transactionId, tui, totalAmount } = req.body;
    const userId = req.user.id; // Get user ID from authenticated user

    if (!bookingData || !transactionId || !tui || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingData, transactionId, tui, totalAmount'
      });
    }

    const bookingDetails = new BookingDetails({
      userId,
      bookingData,
      transactionId,
      tui,
      totalAmount,
      status: 'current',
      paymentStatus: 'success'
    });

    const savedBooking = await bookingDetails.save();

    res.status(201).json({
      success: true,
      message: 'Booking details saved successfully',
      data: savedBooking
    });
  } catch (error) {
    console.error('Error saving booking details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save booking details',
      error: error.message
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    const authenticatedUserId = req.user.id;

    console.log('getUserBookings - userId:', userId);
    console.log('getUserBookings - authenticatedUserId:', authenticatedUserId);
    console.log('getUserBookings - req.user:', req.user);

    // Ensure user can only access their own bookings
    if (userId !== authenticatedUserId) {
      console.log('Access denied - userId mismatch');
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own bookings.'
      });
    }

    let query = { userId };
    if (status) {
      query.status = status;
    }

    const bookings = await BookingDetails.find(query)
      .populate('userId', 'name email')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const authenticatedUserId = req.user.id;

    const booking = await BookingDetails.findById(bookingId)
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure user can only access their own bookings
    if (booking.userId._id.toString() !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own bookings.'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!['current', 'completed', 'cancelled', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: current, completed, cancelled, pending'
      });
    }

    const booking = await BookingDetails.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingDetails.findByIdAndUpdate(
      bookingId,
      { status: 'cancelled' },
      { new: true }
    ).populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};
