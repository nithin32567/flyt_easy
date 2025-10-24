import mongoose from "mongoose";

const hotelBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    enum: ['current', 'completed', 'cancelled', 'pending'],
    default: 'current'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: String,
    required: true
  },
  tui: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'success'
  },
  hotelName: {
    type: String,
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  bookingConfirmationId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const HotelBooking = mongoose.model('HotelBooking', hotelBookingSchema);

export default HotelBooking;