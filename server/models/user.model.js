import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  picture: { 
    type: String,
    default: null
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // allows null values but ensures uniqueness when present
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  defaultAddressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    default: null
  },
  profile: {
    firstName: {
      type: String,
      trim: true
      
    },
    lastName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    nationality: {
      type: String,
      default: 'Indian'
    },
    passportNumber: {
      type: String,
      trim: true
    },
    passportExpiry: {
      type: Date
    }
  }
}, {
  timestamps: true // automatically manages createdAt and updatedAt
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

const User = mongoose.model("User", userSchema);

export default User;
