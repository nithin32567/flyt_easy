import User from '../models/user.model.js';
import Address from '../models/address.model.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .populate('defaultAddressId')
      .select('-googleId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all addresses for the user
    const addresses = await Address.find({ userId, isActive: true })
      .sort({ isDefault: -1, createdAt: -1 });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        profile: user.profile,
        defaultAddressId: user.defaultAddressId,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      },
      addresses
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profile } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        profile: { ...profile },
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-googleId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        profile: user.profile,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new address
export const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressData = { ...req.body, userId };

    // If this is set as default, unset other default addresses
    if (addressData.isDefault) {
      await Address.updateMany(
        { userId, _id: { $ne: null } },
        { isDefault: false }
      );
    }

    const address = new Address(addressData);
    await address.save();

    // Update user's default address if this is set as default
    if (addressData.isDefault) {
      await User.findByIdAndUpdate(userId, { defaultAddressId: address._id });
    }

    res.status(201).json({
      message: 'Address created successfully',
      address
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all addresses for user
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const addresses = await Address.find({ userId, isActive: true })
      .sort({ isDefault: -1, createdAt: -1 });

    res.json({ addresses });
  } catch (error) {
    console.error('Error getting user addresses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const updateData = req.body;

    // Check if address belongs to user
    const existingAddress = await Address.findOne({ _id: addressId, userId });
    if (!existingAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If setting as default, unset other default addresses
    if (updateData.isDefault && !existingAddress.isDefault) {
      await Address.updateMany(
        { userId, _id: { $ne: addressId } },
        { isDefault: false }
      );
      
      // Update user's default address
      await User.findByIdAndUpdate(userId, { defaultAddressId: addressId });
    }

    const address = await Address.findByIdAndUpdate(
      addressId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Address updated successfully',
      address
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    // Check if address belongs to user
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If deleting default address, set another address as default
    if (address.isDefault) {
      const nextAddress = await Address.findOne({ userId, _id: { $ne: addressId }, isActive: true });
      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
        await User.findByIdAndUpdate(userId, { defaultAddressId: nextAddress._id });
      } else {
        await User.findByIdAndUpdate(userId, { defaultAddressId: null });
      }
    }

    // Soft delete the address
    address.isActive = false;
    await address.save();

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    // Check if address belongs to user
    const address = await Address.findOne({ _id: addressId, userId, isActive: true });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Unset other default addresses
    await Address.updateMany(
      { userId, _id: { $ne: addressId } },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    // Update user's default address
    await User.findByIdAndUpdate(userId, { defaultAddressId: addressId });

    res.json({
      message: 'Default address updated successfully',
      address
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
