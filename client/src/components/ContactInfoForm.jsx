import React, { useState, useEffect } from 'react';
import { validateContactInfo, validateField } from '../utils/validation';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ContactInfoForm = ({ contactData, onSave, onNext }) => {
  const { user, isAuthenticated } = useAuth();
  const [contactInfo, setContactInfo] = useState({
    Title: "Mr",
    FName: "",
    LName: "",
    Mobile: "",
    Phone: "",
    Email: "",
    Address: "",
    CountryCode: "IN",
    State: "",
    City: "",
    PIN: "",
    GSTCompanyName: "",
    GSTTIN: "",
    GSTMobile: "",
    GSTEmail: "",
    UpdateProfile: false,
    IsGuest: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [addressMessage, setAddressMessage] = useState('');

  useEffect(() => {
    if (contactData) {
      setContactInfo(contactData);
    }
  }, [contactData]);

  const handleInputChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation
    if (touched[field]) {
      validateFieldRealTime(field, value);
    }
  };

  const handleBlur = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateFieldRealTime(field, value);
  };

  const validateFieldRealTime = (field, value) => {
    let validationResult = { isValid: true, message: '' };

    switch (field) {
      case 'Email':
        validationResult = validateField(field, value, 'email');
        break;
      case 'Mobile':
        validationResult = validateField(field, value, 'mobile');
        break;
      case 'Phone':
        validationResult = validateField(field, value, 'phone');
        break;
      case 'PIN':
        validationResult = validateField(field, value, 'pin');
        break;
      case 'GSTTIN':
        validationResult = validateField(field, value, 'gsttin');
        break;
      case 'GSTMobile':
        validationResult = validateField(field, value, 'mobile');
        break;
      case 'GSTEmail':
        validationResult = validateField(field, value, 'email');
        break;
      default:
        validationResult = validateField(field, value, 'required');
    }

    setErrors(prev => ({
      ...prev,
      [field]: validationResult.isValid ? '' : validationResult.message
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const allFields = Object.keys(contactInfo);
    const newTouched = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate all fields
    const validation = validateContactInfo(contactInfo);
    setErrors(validation.errors);

    if (validation.isValid) {
      onSave(contactInfo);
      if (onNext) {
        onNext();
      }
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(validation.errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
  };

  const getFieldClassName = (fieldName) => {
    const hasError = getFieldError(fieldName);
    return `w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;
  };

  const loadUserAddress = async () => {
    if (!isAuthenticated) {
      setAddressMessage('Please log in to load your address');
      return;
    }

    setLoadingAddress(true);
    setAddressMessage('');

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
      const response = await axios.get(`${baseUrl}/api/user/profile`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.user && response.data.addresses) {
        const defaultAddress = response.data.addresses.find(addr => addr.isDefault) || response.data.addresses[0];
        
        if (defaultAddress) {
          // Map address data to contact form format
          const addressData = {
            Title: defaultAddress.title || user?.title || "Mr",
            FName: user?.name?.split(' ')[0] || "",
            LName: user?.name?.split(' ').slice(1).join(' ') || "",
            Mobile: defaultAddress.contactMobile || "",
            Phone: defaultAddress.contactPhone || "",
            Email: defaultAddress.contactEmail || user?.email || "",
            Address: defaultAddress.housename || "",
            CountryCode: defaultAddress.countryCode || "IN",
            State: defaultAddress.state || "",
            City: defaultAddress.city || "",
            PIN: defaultAddress.pin || "",
            GSTCompanyName: defaultAddress.gstCompanyName || "",
            GSTTIN: defaultAddress.gstTin || "",
            GSTMobile: defaultAddress.gstMobile || "",
            GSTEmail: defaultAddress.gstEmail || "",
            UpdateProfile: false,
            IsGuest: false
          };

          setContactInfo(addressData);
          setAddressMessage('Address loaded successfully!');
          
          // Clear any existing errors
          setErrors({});
        } else {
          setAddressMessage('No address found. Please add an address in your profile first.');
        }
      } else {
        setAddressMessage('Unable to load address data');
      }
    } catch (error) {
      // console.error('Error loading address:', error);
      setAddressMessage('Failed to load address. Please try again.');
    } finally {
      setLoadingAddress(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
          {isAuthenticated && (
            <button
              type="button"
              onClick={loadUserAddress}
              disabled={loadingAddress}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
            >
              {loadingAddress ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Load My Address
                </>
              )}
            </button>
          )}
        </div>

        {/* Address loading message */}
        {addressMessage && (
          <div className={`mb-4 p-3 rounded-md ${
            addressMessage.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {addressMessage}
          </div>
        )}

        {/* Info message for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-md">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">
                <strong>Tip:</strong> Log in to quickly load your saved address information.
              </span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <select
                  name="Title"
                  className={getFieldClassName('Title')}
                  value={contactInfo.Title}
                  onChange={(e) => handleInputChange('Title', e.target.value)}
                  onBlur={(e) => handleBlur('Title', e.target.value)}
                  required
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
                {getFieldError('Title') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('Title')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  name="FName"
                  type="text"
                  className={getFieldClassName('FName')}
                  value={contactInfo.FName}
                  onChange={(e) => handleInputChange('FName', e.target.value)}
                  onBlur={(e) => handleBlur('FName', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
                {getFieldError('FName') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('FName')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  name="LName"
                  type="text"
                  className={getFieldClassName('LName')}
                  value={contactInfo.LName}
                  onChange={(e) => handleInputChange('LName', e.target.value)}
                  onBlur={(e) => handleBlur('LName', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
                {getFieldError('LName') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('LName')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  name="Mobile"
                  type="tel"
                  className={getFieldClassName('Mobile')}
                  value={contactInfo.Mobile}
                  onChange={(e) => handleInputChange('Mobile', e.target.value)}
                  onBlur={(e) => handleBlur('Mobile', e.target.value)}
                  placeholder="Enter mobile number"
                  required
                />
                {getFieldError('Mobile') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('Mobile')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  name="Phone"
                  type="tel"
                  className={getFieldClassName('Phone')}
                  value={contactInfo.Phone}
                  onChange={(e) => handleInputChange('Phone', e.target.value)}
                  onBlur={(e) => handleBlur('Phone', e.target.value)}
                  placeholder="Enter phone number"
                />
                {getFieldError('Phone') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('Phone')}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  name="Email"
                  type="email"
                  className={getFieldClassName('Email')}
                  value={contactInfo.Email}
                  onChange={(e) => handleInputChange('Email', e.target.value)}
                  onBlur={(e) => handleBlur('Email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
                {getFieldError('Email') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('Email')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  name="Address"
                  type="text"
                  className={getFieldClassName('Address')}
                  value={contactInfo.Address}
                  onChange={(e) => handleInputChange('Address', e.target.value)}
                  onBlur={(e) => handleBlur('Address', e.target.value)}
                  placeholder="Enter address"
                  required
                />
                {getFieldError('Address') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('Address')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Code *
                </label>
                <input
                  name="CountryCode"
                  type="text"
                  className={getFieldClassName('CountryCode')}
                  value={contactInfo.CountryCode}
                  onChange={(e) => handleInputChange('CountryCode', e.target.value)}
                  onBlur={(e) => handleBlur('CountryCode', e.target.value)}
                  placeholder="e.g., IN"
                  required
                />
                {getFieldError('CountryCode') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('CountryCode')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  name="State"
                  type="text"
                  className={getFieldClassName('State')}
                  value={contactInfo.State}
                  onChange={(e) => handleInputChange('State', e.target.value)}
                  onBlur={(e) => handleBlur('State', e.target.value)}
                  placeholder="Enter state"
                  required
                />
                {getFieldError('State') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('State')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  name="City"
                  type="text"
                  className={getFieldClassName('City')}
                  value={contactInfo.City}
                  onChange={(e) => handleInputChange('City', e.target.value)}
                  onBlur={(e) => handleBlur('City', e.target.value)}
                  placeholder="Enter city"
                  required
                />
                {getFieldError('City') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('City')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code *
                </label>
                <input
                  name="PIN"
                  type="text"
                  className={getFieldClassName('PIN')}
                  value={contactInfo.PIN}
                  onChange={(e) => handleInputChange('PIN', e.target.value)}
                  onBlur={(e) => handleBlur('PIN', e.target.value)}
                  placeholder="Enter PIN code"
                  required
                />
                {getFieldError('PIN') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('PIN')}</p>
                )}
              </div>
            </div>
          </div>

          {/* GST Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">GST Information (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Company Name
                </label>
                <input
                  name="GSTCompanyName"
                  type="text"
                  className={getFieldClassName('GSTCompanyName')}
                  value={contactInfo.GSTCompanyName}
                  onChange={(e) => handleInputChange('GSTCompanyName', e.target.value)}
                  onBlur={(e) => handleBlur('GSTCompanyName', e.target.value)}
                  placeholder="Enter company name"
                />
                {getFieldError('GSTCompanyName') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('GSTCompanyName')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST TIN
                </label>
                <input
                  name="GSTTIN"
                  type="text"
                  className={getFieldClassName('GSTTIN')}
                  value={contactInfo.GSTTIN}
                  onChange={(e) => handleInputChange('GSTTIN', e.target.value)}
                  onBlur={(e) => handleBlur('GSTTIN', e.target.value)}
                  placeholder="Enter GST TIN"
                />
                {getFieldError('GSTTIN') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('GSTTIN')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Mobile
                </label>
                <input
                  name="GSTMobile"
                  type="tel"
                  className={getFieldClassName('GSTMobile')}
                  value={contactInfo.GSTMobile}
                  onChange={(e) => handleInputChange('GSTMobile', e.target.value)}
                  onBlur={(e) => handleBlur('GSTMobile', e.target.value)}
                  placeholder="Enter GST mobile number"
                />
                {getFieldError('GSTMobile') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('GSTMobile')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Email
                </label>
                <input
                  name="GSTEmail"
                  type="email"
                  className={getFieldClassName('GSTEmail')}
                  value={contactInfo.GSTEmail}
                  onChange={(e) => handleInputChange('GSTEmail', e.target.value)}
                  onBlur={(e) => handleBlur('GSTEmail', e.target.value)}
                  placeholder="Enter GST email"
                />
                {getFieldError('GSTEmail') && (
                  <p className="text-red-500 text-xs mt-1">{getFieldError('GSTEmail')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="updateProfile"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={contactInfo.UpdateProfile}
                onChange={(e) => handleInputChange('UpdateProfile', e.target.checked)}
              />
              <label htmlFor="updateProfile" className="ml-2 block text-sm text-gray-900">
                Update Profile
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isGuest"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={contactInfo.IsGuest}
                onChange={(e) => handleInputChange('IsGuest', e.target.checked)}
              />
              <label htmlFor="isGuest" className="ml-2 block text-sm text-gray-900">
                Is Guest
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#f48f22] hover:bg-[#16437c] text-white py-3 px-6 rounded-md font-semibold transition-colors"
            >
             Next
            </button>
            {onNext && (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-semibold transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactInfoForm; 