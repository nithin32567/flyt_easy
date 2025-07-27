import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validateTraveler, validateField } from '../../utils/validation';

const TravelerDetailsModal = ({ isOpen, setIsOpen, onSave, traveler, isEdit = false }) => {
  const [travelerData, setTravelerData] = useState({
    ID: 1,
    Title: "",
    FName: "",
    LName: "",
    Age: "",
    DOB: "",
    Gender: "",
    PTC: "ADT",
    Nationality: "IN",
    PassportNo: "",
    PLI: "",
    PDOE: "",
    VisaType: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (traveler && isEdit) {
      setTravelerData(traveler);
    } else {
      setTravelerData({
        ID: traveler?.ID || 1,
        Title: "",
        FName: "",
        LName: "",
        Age: "",
        DOB: "",
        Gender: "",
        PTC: "ADT",
        Nationality: "IN",
        PassportNo: "",
        PLI: "",
        PDOE: "",
        VisaType: ""
      });
    }
    // Reset errors and touched when modal opens/closes
    setErrors({});
    setTouched({});
  }, [traveler, isEdit, isOpen]);

  const handleInputChange = (field, value) => {
    setTravelerData(prev => ({
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
      case 'Age':
        validationResult = validateField(field, value, 'age');
        break;
      case 'DOB':
        validationResult = validateField(field, value, 'dob');
        break;
      case 'PDOE':
        validationResult = validateField(field, value, 'passportExpiry');
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
    const allFields = Object.keys(travelerData);
    const newTouched = {};
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate all fields
    const validation = validateTraveler(travelerData);
    setErrors(validation.errors);

    if (validation.isValid) {
      onSave(travelerData);
      setIsOpen(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEdit ? 'Edit Traveler' : 'Add New Traveler'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <select
                name="Title"
                className={getFieldClassName('Title')}
                value={travelerData.Title}
                onChange={(e) => handleInputChange('Title', e.target.value)}
                onBlur={(e) => handleBlur('Title', e.target.value)}
                required
              >
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
              {getFieldError('Title') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('Title')}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                name="FName"
                type="text"
                className={getFieldClassName('FName')}
                value={travelerData.FName}
                onChange={(e) => handleInputChange('FName', e.target.value)}
                onBlur={(e) => handleBlur('FName', e.target.value)}
                placeholder="Enter first name"
                required
              />
              {getFieldError('FName') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('FName')}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                name="LName"
                type="text"
                className={getFieldClassName('LName')}
                value={travelerData.LName}
                onChange={(e) => handleInputChange('LName', e.target.value)}
                onBlur={(e) => handleBlur('LName', e.target.value)}
                placeholder="Enter last name"
                required
              />
              {getFieldError('LName') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('LName')}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age *
              </label>
              <input
                name="Age"
                type="number"
                className={getFieldClassName('Age')}
                value={travelerData.Age}
                onChange={(e) => handleInputChange('Age', e.target.value)}
                onBlur={(e) => handleBlur('Age', e.target.value)}
                placeholder="Enter age"
                min="0"
                max="120"
                required
              />
              {getFieldError('Age') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('Age')}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                name="DOB"
                type="date"
                className={getFieldClassName('DOB')}
                value={travelerData.DOB}
                onChange={(e) => handleInputChange('DOB', e.target.value)}
                onBlur={(e) => handleBlur('DOB', e.target.value)}
                required
              />
              {getFieldError('DOB') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('DOB')}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                name="Gender"
                className={getFieldClassName('Gender')}
                value={travelerData.Gender}
                onChange={(e) => handleInputChange('Gender', e.target.value)}
                onBlur={(e) => handleBlur('Gender', e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              {getFieldError('Gender') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('Gender')}</p>
              )}
            </div>

            {/* Passenger Type Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passenger Type *
              </label>
              <select
                name="PTC"
                className={getFieldClassName('PTC')}
                value={travelerData.PTC}
                onChange={(e) => handleInputChange('PTC', e.target.value)}
                onBlur={(e) => handleBlur('PTC', e.target.value)}
                required
              >
                <option value="ADT">Adult</option>
                <option value="CHD">Child</option>
                <option value="INF">Infant</option>
              </select>
              {getFieldError('PTC') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('PTC')}</p>
              )}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality *
              </label>
              <input
                name="Nationality"
                type="text"
                className={getFieldClassName('Nationality')}
                value={travelerData.Nationality}
                onChange={(e) => handleInputChange('Nationality', e.target.value)}
                onBlur={(e) => handleBlur('Nationality', e.target.value)}
                placeholder="e.g., IN"
                required
              />
              {getFieldError('Nationality') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('Nationality')}</p>
              )}
            </div>

            {/* Passport Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passport Number
              </label>
              <input
                name="PassportNo"
                type="text"
                className={getFieldClassName('PassportNo')}
                value={travelerData.PassportNo}
                onChange={(e) => handleInputChange('PassportNo', e.target.value)}
                onBlur={(e) => handleBlur('PassportNo', e.target.value)}
                placeholder="Enter passport number"
              />
              {getFieldError('PassportNo') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('PassportNo')}</p>
              )}
            </div>

            {/* Passport Issuing Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passport Issuing Location
              </label>
              <input
                name="PLI"
                type="text"
                className={getFieldClassName('PLI')}
                value={travelerData.PLI}
                onChange={(e) => handleInputChange('PLI', e.target.value)}
                onBlur={(e) => handleBlur('PLI', e.target.value)}
                placeholder="e.g., Kochi"
              />
              {getFieldError('PLI') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('PLI')}</p>
              )}
            </div>

            {/* Passport Date of Expiry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passport Date of Expiry
              </label>
              <input
                name="PDOE"
                type="date"
                className={getFieldClassName('PDOE')}
                value={travelerData.PDOE}
                onChange={(e) => handleInputChange('PDOE', e.target.value)}
                onBlur={(e) => handleBlur('PDOE', e.target.value)}
              />
              {getFieldError('PDOE') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('PDOE')}</p>
              )}
            </div>

            {/* Visa Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visa Type
              </label>
              <input
                name="VisaType"
                type="text"
                className={getFieldClassName('VisaType')}
                value={travelerData.VisaType}
                onChange={(e) => handleInputChange('VisaType', e.target.value)}
                onBlur={(e) => handleBlur('VisaType', e.target.value)}
                placeholder="e.g., Tourist Visa"
              />
              {getFieldError('VisaType') && (
                <p className="text-red-500 text-xs mt-1">{getFieldError('VisaType')}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#f48f22] hover:bg-[#16437c] text-white py-2 px-4 rounded-md font-semibold transition-colors"
            >
              {isEdit ? 'Update Traveler' : 'Add Traveler'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelerDetailsModal; 