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
    }
  }, [isOpen, initial]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(formData);
    setIsOpen(false);
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
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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
                    className="flex-1 border border-gray-300 rounded-r px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                required
              />
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
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => handleInputChange('pin', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">GST Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.gstCompanyName}
                    onChange={(e) => handleInputChange('gstCompanyName', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST TIN
                  </label>
                  <input
                    type="text"
                    value={formData.gstTin}
                    onChange={(e) => handleInputChange('gstTin', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Mobile
                  </label>
                  <input
                    type="tel"
                    value={formData.gstMobile}
                    onChange={(e) => handleInputChange('gstMobile', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Email
                  </label>
                  <input
                    type="email"
                    value={formData.gstEmail}
                    onChange={(e) => handleInputChange('gstEmail', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
