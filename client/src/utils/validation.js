// Validation utility functions for contact information and traveler data

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, message: 'Email is required' };
  if (!emailRegex.test(email)) return { isValid: false, message: 'Please enter a valid email address' };
  return { isValid: true, message: '' };
};

// Phone number validation
export const validatePhone = (phone, isRequired = false) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phone && isRequired) return { isValid: false, message: 'Phone number is required' };
  if (phone && !phoneRegex.test(phone)) return { isValid: false, message: 'Please enter a valid phone number (10-15 digits)' };
  return { isValid: true, message: '' };
};

// Mobile number validation
export const validateMobile = (mobile) => {
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobile) return { isValid: false, message: 'Mobile number is required' };
  if (!mobileRegex.test(mobile)) return { isValid: false, message: 'Please enter a valid 10-digit mobile number' };
  return { isValid: true, message: '' };
};

// PIN code validation
export const validatePIN = (pin) => {
  const pinRegex = /^[0-9]{6}$/;
  if (!pin) return { isValid: false, message: 'PIN code is required' };
  if (!pinRegex.test(pin)) return { isValid: false, message: 'Please enter a valid 6-digit PIN code' };
  return { isValid: true, message: '' };
};

// Age validation with passenger type consideration
export const validateAge = (age, passengerType = null) => {
  if (!age) return { isValid: false, message: 'Age is required' };
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) return { isValid: false, message: 'Age must be a number' };
  
  // Validate age based on passenger type
  if (passengerType) {
    switch (passengerType.toUpperCase()) {
      case 'ADT': // Adult
        if (ageNum < 12) return { isValid: false, message: 'Adult age must be 12 or above' };
        if (ageNum > 120) return { isValid: false, message: 'Age must be 120 or below' };
        break;
      case 'CHD': // Child
        if (ageNum < 2) return { isValid: false, message: 'Child age must be 2 or above' };
        if (ageNum >= 12) return { isValid: false, message: 'Child age must be below 12' };
        break;
      case 'INF': // Infant
        if (ageNum < 0) return { isValid: false, message: 'Infant age cannot be negative' };
        if (ageNum >= 2) return { isValid: false, message: 'Infant age must be below 2' };
        break;
      default:
        // Generic validation for unknown passenger types
        if (ageNum < 0 || ageNum > 120) return { isValid: false, message: 'Age must be between 0 and 120' };
    }
  } else {
    // Generic validation when passenger type is not specified
    if (ageNum < 0 || ageNum > 120) return { isValid: false, message: 'Age must be between 0 and 120' };
  }
  
  return { isValid: true, message: '' };
};

// Date validation
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) return { isValid: false, message: `${fieldName} is required` };
  
  const selectedDate = new Date(date);
  const today = new Date();
  
  if (isNaN(selectedDate.getTime())) return { isValid: false, message: `Please enter a valid ${fieldName.toLowerCase()}` };
  
  return { isValid: true, message: '' };
};

// Date of birth validation
export const validateDOB = (dob) => {
  if (!dob) return { isValid: false, message: 'Date of birth is required' };
  
  const dobDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  
  if (isNaN(dobDate.getTime())) return { isValid: false, message: 'Please enter a valid date of birth' };
  if (dobDate > today) return { isValid: false, message: 'Date of birth cannot be in the future' };
  if (age > 120) return { isValid: false, message: 'Date of birth seems invalid (age > 120)' };
  
  return { isValid: true, message: '' };
};

// Passport expiry date validation
export const validatePassportExpiry = (pdoe) => {
  if (!pdoe) return { isValid: true, message: '' }; // Optional field
  
  const expiryDate = new Date(pdoe);
  const today = new Date();
  
  if (isNaN(expiryDate.getTime())) return { isValid: false, message: 'Please enter a valid passport expiry date' };
  if (expiryDate <= today) return { isValid: false, message: 'Passport must be valid (not expired)' };
  
  return { isValid: true, message: '' };
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

// GST TIN validation
export const validateGSTTIN = (gsttin) => {
  if (!gsttin) return { isValid: true, message: '' }; // Optional field
  
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstRegex.test(gsttin)) {
    return { isValid: false, message: 'Please enter a valid GST TIN (15 characters)' };
  }
  return { isValid: true, message: '' };
};

// Contact Information Validation
export const validateContactInfo = (contactInfo) => {
  const errors = {};
  let isValid = true;

  // Personal Information
  const titleValidation = validateRequired(contactInfo.Title, 'Title');
  if (!titleValidation.isValid) {
    errors.Title = titleValidation.message;
    isValid = false;
  }

  const fnameValidation = validateRequired(contactInfo.FName, 'First Name');
  if (!fnameValidation.isValid) {
    errors.FName = fnameValidation.message;
    isValid = false;
  }

  const lnameValidation = validateRequired(contactInfo.LName, 'Last Name');
  if (!lnameValidation.isValid) {
    errors.LName = lnameValidation.message;
    isValid = false;
  }

  // Contact Details
  const mobileValidation = validateMobile(contactInfo.Mobile);
  if (!mobileValidation.isValid) {
    errors.Mobile = mobileValidation.message;
    isValid = false;
  }

  const phoneValidation = validatePhone(contactInfo.Phone, false);
  if (!phoneValidation.isValid) {
    errors.Phone = phoneValidation.message;
    isValid = false;
  }

  const emailValidation = validateEmail(contactInfo.Email);
  if (!emailValidation.isValid) {
    errors.Email = emailValidation.message;
    isValid = false;
  }

  // Address Information
  const addressValidation = validateRequired(contactInfo.Address, 'Address');
  if (!addressValidation.isValid) {
    errors.Address = addressValidation.message;
    isValid = false;
  }

  const countryCodeValidation = validateRequired(contactInfo.CountryCode, 'Country Code');
  if (!countryCodeValidation.isValid) {
    errors.CountryCode = countryCodeValidation.message;
    isValid = false;
  }

  const stateValidation = validateRequired(contactInfo.State, 'State');
  if (!stateValidation.isValid) {
    errors.State = stateValidation.message;
    isValid = false;
  }

  const cityValidation = validateRequired(contactInfo.City, 'City');
  if (!cityValidation.isValid) {
    errors.City = cityValidation.message;
    isValid = false;
  }

  const pinValidation = validatePIN(contactInfo.PIN);
  if (!pinValidation.isValid) {
    errors.PIN = pinValidation.message;
    isValid = false;
  }

  // GST Information (Optional but validate if provided)
  if (contactInfo.GSTCompanyName || contactInfo.GSTTIN || contactInfo.GSTMobile || contactInfo.GSTEmail) {
    const gsttinValidation = validateGSTTIN(contactInfo.GSTTIN);
    if (!gsttinValidation.isValid) {
      errors.GSTTIN = gsttinValidation.message;
      isValid = false;
    }

    if (contactInfo.GSTMobile) {
      const gstMobileValidation = validateMobile(contactInfo.GSTMobile);
      if (!gstMobileValidation.isValid) {
        errors.GSTMobile = gstMobileValidation.message;
        isValid = false;
      }
    }

    if (contactInfo.GSTEmail) {
      const gstEmailValidation = validateEmail(contactInfo.GSTEmail);
      if (!gstEmailValidation.isValid) {
        errors.GSTEmail = gstEmailValidation.message;
        isValid = false;
      }
    }
  }

  return { isValid, errors };
};

// Traveler Validation
export const validateTraveler = (traveler) => {
  const errors = {};
  let isValid = true;

  // Personal Information
  const titleValidation = validateRequired(traveler.Title, 'Title');
  if (!titleValidation.isValid) {
    errors.Title = titleValidation.message;
    isValid = false;
  }

  const fnameValidation = validateRequired(traveler.FName, 'First Name');
  if (!fnameValidation.isValid) {
    errors.FName = fnameValidation.message;
    isValid = false;
  }

  const lnameValidation = validateRequired(traveler.LName, 'Last Name');
  if (!lnameValidation.isValid) {
    errors.LName = lnameValidation.message;
    isValid = false;
  }

  const ageValidation = validateAge(traveler.Age, traveler.PTC);
  if (!ageValidation.isValid) {
    errors.Age = ageValidation.message;
    isValid = false;
  }

  const dobValidation = validateDOB(traveler.DOB);
  if (!dobValidation.isValid) {
    errors.DOB = dobValidation.message;
    isValid = false;
  }

  const genderValidation = validateRequired(traveler.Gender, 'Gender');
  if (!genderValidation.isValid) {
    errors.Gender = genderValidation.message;
    isValid = false;
  }

  // Travel Details
  const ptcValidation = validateRequired(traveler.PTC, 'Passenger Type');
  if (!ptcValidation.isValid) {
    errors.PTC = ptcValidation.message;
    isValid = false;
  }

  const nationalityValidation = validateRequired(traveler.Nationality, 'Nationality');
  if (!nationalityValidation.isValid) {
    errors.Nationality = nationalityValidation.message;
    isValid = false;
  }

  // Passport Information (Optional but validate if provided)
  if (traveler.PassportNo) {
    const passportValidation = validateRequired(traveler.PassportNo, 'Passport Number');
    if (!passportValidation.isValid) {
      errors.PassportNo = passportValidation.message;
      isValid = false;
    }
  }

  if (traveler.PLI) {
    const pliValidation = validateRequired(traveler.PLI, 'Passport Issuing Location');
    if (!pliValidation.isValid) {
      errors.PLI = pliValidation.message;
      isValid = false;
    }
  }

  const pdoeValidation = validatePassportExpiry(traveler.PDOE);
  if (!pdoeValidation.isValid) {
    errors.PDOE = pdoeValidation.message;
    isValid = false;
  }

  return { isValid, errors };
};

// Validate complete itinerary data
export const validateItinerary = (contactInfo, travelers) => {
  const contactValidation = validateContactInfo(contactInfo);
  const travelerValidations = travelers.map(traveler => validateTraveler(traveler));
  
  const errors = {
    contactInfo: contactValidation.errors,
    travelers: travelerValidations.map(validation => validation.errors)
  };

  const isValid = contactValidation.isValid && 
                  travelerValidations.every(validation => validation.isValid) &&
                  travelers.length > 0;

  if (travelers.length === 0) {
    errors.general = 'At least one traveler is required';
  }

  return { isValid, errors };
};

// Real-time validation helpers
export const validateField = (fieldName, value, validationType, passengerType = null) => {
  switch (validationType) {
    case 'email':
      return validateEmail(value);
    case 'mobile':
      return validateMobile(value);
    case 'phone':
      return validatePhone(value);
    case 'pin':
      return validatePIN(value);
    case 'age':
      return validateAge(value, passengerType);
    case 'dob':
      return validateDOB(value);
    case 'passportExpiry':
      return validatePassportExpiry(value);
    case 'gsttin':
      return validateGSTTIN(value);
    case 'required':
      return validateRequired(value, fieldName);
    default:
      return { isValid: true, message: '' };
  }
}; 