import React, { useState } from 'react';

const AddressForm = ({ onSave, onCancel, initialData = null, userData = null }) => {
  
  const [formData, setFormData] = useState({
    // Personal Information (from user or address override)
    title: initialData?.title || userData?.title || 'Mr',
    fullName: userData?.name || '',
    
    // Contact Information (address-specific)
    contactMobile: initialData?.contactMobile || '',
    contactPhone: initialData?.contactPhone || '',
    contactEmail: initialData?.contactEmail || userData?.email || '',
    
    // Address Information
    housename: initialData?.housename || '',
    countryCode: initialData?.countryCode || 'IN',
    state: initialData?.state || '',
    city: initialData?.city || '',
    pin: initialData?.pin || '',
    
    // GST Information
    gstCompanyName: initialData?.gstCompanyName || '',
    gstTin: initialData?.gstTin || '',
    gstMobile: initialData?.gstMobile || '',
    gstEmail: initialData?.gstEmail || '',
    
    // Address Settings
    isDefault: initialData?.isDefault || false
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Contact Information validation
    if (!formData.contactMobile.trim()) newErrors.contactMobile = 'Mobile number is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';
    
    // Address Information validation
    if (!formData.housename.trim()) newErrors.housename = 'House name is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pin.trim()) newErrors.pin = 'PIN code is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (formData.contactMobile && !mobileRegex.test(formData.contactMobile)) {
      newErrors.contactMobile = 'Please enter a valid 10-digit mobile number';
    }
    
    // PIN validation
    const pinRegex = /^\d{6}$/;
    if (formData.pin && !pinRegex.test(formData.pin)) {
      newErrors.pin = 'Please enter a valid 6-digit PIN code';
    }
    
    // GST Email validation (if provided)
    if (formData.gstEmail && !emailRegex.test(formData.gstEmail)) {
      newErrors.gstEmail = 'Please enter a valid GST email address';
    }
    
    // GST Mobile validation (if provided)
    if (formData.gstMobile && !mobileRegex.test(formData.gstMobile)) {
      newErrors.gstMobile = 'Please enter a valid GST mobile number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        {initialData ? 'Edit Address' : 'Add New Address'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              >
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                value={formData.fullName}
                readOnly
                placeholder="Your full name from Google account"
              />
              <p className="text-xs text-gray-500 mt-1">This is your name from your Google account</p>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Contact Details</h4>
          <p className="text-sm text-gray-600 mb-4">These contact details will be used for this specific address. Each address can have different contact information.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contactMobile ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.contactMobile}
                onChange={(e) => handleInputChange('contactMobile', e.target.value)}
                placeholder="Enter mobile number"
              />
              {errors.contactMobile && (
                <p className="text-red-500 text-xs mt-1">{errors.contactMobile}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="Enter email address"
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Address Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House Name/Address *
              </label>
              <input
                type="text"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.housename ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.housename}
                onChange={(e) => handleInputChange('housename', e.target.value)}
                placeholder="Enter house name or address"
              />
              {errors.housename && (
                <p className="text-red-500 text-xs mt-1">{errors.housename}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country Code *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.countryCode}
                onChange={(e) => handleInputChange('countryCode', e.target.value)}
                placeholder="e.g., IN"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Enter state"
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pin ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.pin}
                onChange={(e) => handleInputChange('pin', e.target.value)}
                placeholder="Enter PIN code"
              />
              {errors.pin && (
                <p className="text-red-500 text-xs mt-1">{errors.pin}</p>
              )}
            </div>
          </div>
        </div>

        {/* GST Information */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">GST Information (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Company Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.gstCompanyName}
                onChange={(e) => handleInputChange('gstCompanyName', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST TIN
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.gstTin}
                onChange={(e) => handleInputChange('gstTin', e.target.value)}
                placeholder="Enter GST TIN"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Mobile
              </label>
              <input
                type="tel"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.gstMobile ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.gstMobile}
                onChange={(e) => handleInputChange('gstMobile', e.target.value)}
                placeholder="Enter GST mobile number"
              />
              {errors.gstMobile && (
                <p className="text-red-500 text-xs mt-1">{errors.gstMobile}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Email
              </label>
              <input
                type="email"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.gstEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.gstEmail}
                onChange={(e) => handleInputChange('gstEmail', e.target.value)}
                placeholder="Enter GST email"
              />
              {errors.gstEmail && (
                <p className="text-red-500 text-xs mt-1">{errors.gstEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Default Address Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.isDefault}
            onChange={(e) => handleInputChange('isDefault', e.target.checked)}
          />
          <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
            Set as default address
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-md font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : (initialData ? 'Update Address' : 'Add Address')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
