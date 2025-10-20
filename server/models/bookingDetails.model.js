import mongoose from "mongoose";

const bookingDetailsSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true
});

const BookingDetails = mongoose.model('BookingDetails', bookingDetailsSchema);

export default BookingDetails;