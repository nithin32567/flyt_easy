import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ContactInfoModal({
  isOpen,
  setIsOpen,
  onApply,
  initial = {}
}) {
  const [formData, setFormData] = useState({
    title: initial?.title || 'Mr',
    firstName: initial?.firstName || '',
    lastName: initial?.lastName || '',
    mobile: initial?.mobile || '',
    email: initial?.email || '',
    address: initial?.address || '',
    state: initial?.state || '',
    city: initial?.city || '',
    pin: initial?.pin || '',
    gstCompanyName: initial?.gstCompanyName || '',
    gstTin: initial?.gstTin || '',
    gstMobile: initial?.gstMobile || '',
    gstEmail: initial?.gstEmail || '',
    countryCode: initial?.countryCode || 'IN',
    mobileCountryCode: initial?.mobileCountryCode || '+91',
    updateProfile: initial?.updateProfile || true,
    isGuest: initial?.isGuest || false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && initial) {
      setFormData({
        title: initial?.title || 'Mr',
        firstName: initial?.firstName || '',
        lastName: initial?.lastName || '',
        mobile: initial?.mobile || '',
        email: initial?.email || '',
        address: initial?.address || '',
        state: initial?.state || '',
        city: initial?.city || '',
        pin: initial?.pin || '',
        gstCompanyName: initial?.gstCompanyName || '',
        gstTin: initial?.gstTin || '',
        gstMobile: initial?.gstMobile || '',
        gstEmail: initial?.gstEmail || '',
        countryCode: initial?.countryCode || 'IN',
        mobileCountryCode: initial?.mobileCountryCode || '+91',
        updateProfile: initial?.updateProfile || true,
        isGuest: initial?.isGuest || false
      });
      setErrors({});
    }
  }, [isOpen, initial]);

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateGST = (gstTin) => {
    if (!gstTin) return true;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstTin);
  };

  const validatePIN = (pin) => {
    const pinRegex = /^[0-9]{6}$/;
    return pinRegex.test(pin);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Required field validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
      isValid = false;
    }

    if (!formData.pin.trim()) {
      newErrors.pin = 'PIN code is required';
      isValid = false;
    } else if (!validatePIN(formData.pin)) {
      newErrors.pin = 'PIN code must be 6 digits';
      isValid = false;
    }

    // GST validation (optional fields)
    if (formData.gstTin && !validateGST(formData.gstTin)) {
      newErrors.gstTin = 'Please enter a valid GST TIN';
      isValid = false;
    }

    if (formData.gstMobile && !validateMobile(formData.gstMobile)) {
      newErrors.gstMobile = 'GST mobile number must be exactly 10 digits';
      isValid = false;
    }

    if (formData.gstEmail && !validateEmail(formData.gstEmail)) {
      newErrors.gstEmail = 'Please enter a valid GST email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onApply(formData);
      setIsOpen(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg border max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <select
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <div className="flex">
                  <select
                    value={formData.mobileCountryCode}
                    onChange={(e) => handleInputChange('mobileCountryCode', e.target.value)}
                    className="border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className={`flex-1 border rounded-r px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength="10"
                    placeholder="10 digit mobile number"
                    required
                  />
                </div>
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Code
                </label>
                <select
                  value={formData.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="IN">IN</option>
                  <option value="US">US</option>
                  <option value="UK">UK</option>
                  <option value="AE">AE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="2"
                required
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => handleInputChange('pin', e.target.value)}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.pin ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength="6"
                  placeholder="6 digit PIN code"
                  required
                />
                {errors.pin && (
                  <p className="text-red-500 text-xs mt-1">{errors.pin}</p>
                )}
              </div>
            </div>


            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#f48f22] hover:bg-[#16437c] text-white rounded font-semibold transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
