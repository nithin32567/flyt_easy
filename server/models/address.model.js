import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Personal Information (for display purposes, references user data)
  title: {
    type: String,
    enum: ['Mr', 'Mrs', 'Ms', 'Dr'],
    default: 'Mr'
  },
  
  housename: {
    type: String,
    required: true,
    trim: true
  },
  countryCode: {
    type: String,
    required: true,
    default: 'IN'
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  // Address-specific contact information (can override user defaults)
  contactMobile: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  pin: {
    type: String,
    required: true,
    trim: true
  },
  gstCompanyName: {
    type: String,
    trim: true,
    default: ''
  },
  gstTin: {
    type: String,
    trim: true,
    default: ''
  },
  gstMobile: {
    type: String,
    trim: true,
    default: ''
  },
  gstEmail: {
    type: String,
    lowercase: true,
    trim: true,
    default: ''
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field before saving
addressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
addressSchema.index({ userId: 1 });
addressSchema.index({ contactEmail: 1 });
addressSchema.index({ isDefault: 1 });

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

const Address = mongoose.model("Address", addressSchema);

export default Address;
