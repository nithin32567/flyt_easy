// Validation test functions - This file demonstrates how to test the validation functions
// You can run these tests to verify the validation logic

import {
  validateEmail,
  validateMobile,
  validatePhone,
  validatePIN,
  validateAge,
  validateDOB,
  validatePassportExpiry,
  validateGSTTIN,
  validateRequired,
  validateContactInfo,
  validateTraveler,
  validateItinerary,
  validateField
} from './validation';

// Test function to run all validation tests
export const runValidationTests = () => {
  console.log('🧪 Running Validation Tests...\n');

  // Email validation tests
  console.log('📧 Email Validation Tests:');
  testEmailValidation();

  // Mobile validation tests
  console.log('\n📱 Mobile Validation Tests:');
  testMobileValidation();

  // Phone validation tests
  console.log('\n☎️ Phone Validation Tests:');
  testPhoneValidation();

  // PIN validation tests
  console.log('\n📍 PIN Validation Tests:');
  testPINValidation();

  // Age validation tests
  console.log('\n👤 Age Validation Tests:');
  testAgeValidation();

  // Date of Birth validation tests
  console.log('\n🎂 Date of Birth Validation Tests:');
  testDOBValidation();

  // Passport expiry validation tests
  console.log('\n🛂 Passport Expiry Validation Tests:');
  testPassportExpiryValidation();

  // GST TIN validation tests
  console.log('\n🏢 GST TIN Validation Tests:');
  testGSTTINValidation();

  // Contact Info validation tests
  console.log('\n👤 Contact Info Validation Tests:');
  testContactInfoValidation();

  // Traveler validation tests
  console.log('\n✈️ Traveler Validation Tests:');
  testTravelerValidation();

  // Complete itinerary validation tests
  console.log('\n📋 Complete Itinerary Validation Tests:');
  testItineraryValidation();

  console.log('\n✅ All validation tests completed!');
};

// Email validation tests
const testEmailValidation = () => {
  const testCases = [
    { email: 'test@example.com', expected: true, description: 'Valid email' },
    { email: 'invalid-email', expected: false, description: 'Invalid email format' },
    { email: '', expected: false, description: 'Empty email' },
    { email: 'test@.com', expected: false, description: 'Invalid domain' },
    { email: '@example.com', expected: false, description: 'Missing username' }
  ];

  testCases.forEach(({ email, expected, description }) => {
    const result = validateEmail(email);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} ${description}: ${email} - ${result.message}`);
  });
};

// Mobile validation tests
const testMobileValidation = () => {
  const testCases = [
    { mobile: '9876543210', expected: true, description: 'Valid 10-digit mobile' },
    { mobile: '1234567890', expected: true, description: 'Valid 10-digit mobile' },
    { mobile: '123456789', expected: false, description: '9-digit mobile' },
    { mobile: '12345678901', expected: false, description: '11-digit mobile' },
    { mobile: '', expected: false, description: 'Empty mobile' },
    { mobile: 'abc1234567', expected: false, description: 'Non-numeric mobile' }
  ];

  testCases.forEach(({ mobile, expected, description }) => {
    const result = validateMobile(mobile);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} ${description}: ${mobile} - ${result.message}`);
  });
};

// Phone validation tests
const testPhoneValidation = () => {
  const testCases = [
    { phone: '1234567890', expected: true, description: 'Valid 10-digit phone' },
    { phone: '123456789012345', expected: true, description: 'Valid 15-digit phone' },
    { phone: '', expected: true, description: 'Empty phone (optional)' },
    { phone: '123456789', expected: false, description: '9-digit phone' },
    { phone: '1234567890123456', expected: false, description: '16-digit phone' }
  ];

  testCases.forEach(({ phone, expected, description }) => {
    const result = validatePhone(phone, false);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} ${description}: ${phone} - ${result.message}`);
  });
};

// PIN validation tests
const testPINValidation = () => {
  const testCases = [
    { pin: '123456', expected: true, description: 'Valid 6-digit PIN' },
    { pin: '000000', expected: true, description: 'Valid 6-digit PIN' },
    { pin: '12345', expected: false, description: '5-digit PIN' },
    { pin: '1234567', expected: false, description: '7-digit PIN' },
    { pin: '', expected: false, description: 'Empty PIN' },
    { pin: 'abc123', expected: false, description: 'Non-numeric PIN' }
  ];

  testCases.forEach(({ pin, expected, description }) => {
    const result = validatePIN(pin);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} ${description}: ${pin} - ${result.message}`);
  });
};

// Age validation tests
const testAgeValidation = () => {
  const testCases = [
    { age: '25', expected: true, description: 'Valid age' },
    { age: '0', expected: true, description: 'Minimum age' },
    { age: '120', expected: true, description: 'Maximum age' },
    { age: '-1', expected: false, description: 'Negative age' },
    { age: '121', expected: false, description: 'Age over 120' },
    { age: '', expected: false, description: 'Empty age' },
    { age: 'abc', expected: false, description: 'Non-numeric age' }
  ];

  testCases.forEach(({ age, expected, description }) => {
    const result = validateAge(age);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} ${description}: ${age} - ${result.message}`);
  });
};

// Date of Birth validation tests
const testDOBValidation = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const future = new Date(today);
  future.setDate(today.getDate() + 1);
  const veryOld = new Date(today);
  veryOld.setFullYear(today.getFullYear() - 150);

  const testCases = [
    { dob: yesterday.toISOString().split('T')[0], expected: true, description: 'Valid DOB (yesterday)' },
    { dob: future.toISOString().split('T')[0], expected: false, description: 'Future DOB' },
    { dob: veryOld.toISOString().split('T')[0], expected: false, description: 'Very old DOB' },
    { dob: '', expected: false, description: 'Empty DOB' },
    { dob: 'invalid-date', expected: false, description: 'Invalid date format' }
  ];

  testCases.forEach(({ dob, expected, description }) => {
    const result = validateDOB(dob);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} ${description}: ${dob} - ${result.message}`);
  });
};

// Passport expiry validation tests
const testPassportExpiryValidation = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const testCases = [
    { pdoe: tomorrow.toISOString().split('T')[0], expected: true, description: 'Future expiry date' },
    { pdoe: today.toISOString().split('T')[0], expected: false, description: 'Today expiry date' },
    { pdoe: yesterday.toISOString().split('T')[0], expected: false, description: 'Past expiry date' },
    { pdoe: '', expected: true, description: 'Empty expiry date (optional)' },
    { pdoe: 'invalid-date', expected: false, description: 'Invalid date format' }
  ];

  testCases.forEach(({ pdoe, expected, description }) => {
    const result = validatePassportExpiry(pdoe);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} ${description}: ${pdoe} - ${result.message}`);
  });
};

// GST TIN validation tests
const testGSTTINValidation = () => {
  const testCases = [
    { gsttin: '32ABCDE1234F1Z5', expected: true, description: 'Valid GST TIN' },
    { gsttin: '', expected: true, description: 'Empty GST TIN (optional)' },
    { gsttin: '32ABCDE1234F1Z', expected: false, description: 'Invalid GST TIN format' },
    { gsttin: '123456789012345', expected: false, description: 'Numeric only' },
    { gsttin: 'ABCDEFGHIJKLMNO', expected: false, description: 'Alphabetic only' }
  ];

  testCases.forEach(({ gsttin, expected, description }) => {
    const result = validateGSTTIN(gsttin);
    const passed = result.isValid === expected;
    console.log(`${passed ? '✅' : '❌'} ${description}: ${gsttin} - ${result.message}`);
  });
};

// Contact Info validation tests
const testContactInfoValidation = () => {
  const validContactInfo = {
    Title: "Mr",
    FName: "John",
    LName: "Doe",
    Mobile: "9876543210",
    Phone: "0484123456",
    Email: "john.doe@example.com",
    Address: "123, MG Road",
    CountryCode: "IN",
    State: "Kerala",
    City: "Kochi",
    PIN: "682001",
    GSTCompanyName: "",
    GSTTIN: "",
    GSTMobile: "",
    GSTEmail: "",
    UpdateProfile: false,
    IsGuest: false
  };

  const invalidContactInfo = {
    Title: "",
    FName: "",
    LName: "",
    Mobile: "123",
    Phone: "",
    Email: "invalid-email",
    Address: "",
    CountryCode: "",
    State: "",
    City: "",
    PIN: "123",
    GSTCompanyName: "",
    GSTTIN: "",
    GSTMobile: "",
    GSTEmail: "",
    UpdateProfile: false,
    IsGuest: false
  };

  const validResult = validateContactInfo(validContactInfo);
  const invalidResult = validateContactInfo(invalidContactInfo);

  console.log(`✅ Valid contact info: ${validResult.isValid ? 'PASS' : 'FAIL'}`);
  console.log(`❌ Invalid contact info: ${invalidResult.isValid ? 'FAIL' : 'PASS'}`);
  
  if (!validResult.isValid) {
    console.log('Valid contact info errors:', validResult.errors);
  }
  if (invalidResult.isValid) {
    console.log('Invalid contact info should have errors but passed');
  }
};

// Traveler validation tests
const testTravelerValidation = () => {
  const validTraveler = {
    ID: 1,
    Title: "Mr",
    FName: "Alex",
    LName: "Mason",
    Age: 30,
    DOB: "1994-01-15",
    Gender: "M",
    PTC: "ADT",
    Nationality: "IN",
    PassportNo: "M1234567",
    PLI: "Kochi",
    PDOE: "2027-12-15",
    VisaType: "Tourist Visa"
  };

  const invalidTraveler = {
    ID: 1,
    Title: "",
    FName: "",
    LName: "",
    Age: -5,
    DOB: "2025-01-15",
    Gender: "",
    PTC: "",
    Nationality: "",
    PassportNo: "",
    PLI: "",
    PDOE: "2020-01-01",
    VisaType: ""
  };

  const validResult = validateTraveler(validTraveler);
  const invalidResult = validateTraveler(invalidTraveler);

  console.log(`✅ Valid traveler: ${validResult.isValid ? 'PASS' : 'FAIL'}`);
  console.log(`❌ Invalid traveler: ${invalidResult.isValid ? 'FAIL' : 'PASS'}`);
  
  if (!validResult.isValid) {
    console.log('Valid traveler errors:', validResult.errors);
  }
  if (invalidResult.isValid) {
    console.log('Invalid traveler should have errors but passed');
  }
};

// Complete itinerary validation tests
const testItineraryValidation = () => {
  const validContactInfo = {
    Title: "Mr",
    FName: "John",
    LName: "Doe",
    Mobile: "9876543210",
    Phone: "0484123456",
    Email: "john.doe@example.com",
    Address: "123, MG Road",
    CountryCode: "IN",
    State: "Kerala",
    City: "Kochi",
    PIN: "682001",
    GSTCompanyName: "",
    GSTTIN: "",
    GSTMobile: "",
    GSTEmail: "",
    UpdateProfile: false,
    IsGuest: false
  };

  const validTraveler = {
    ID: 1,
    Title: "Mr",
    FName: "Alex",
    LName: "Mason",
    Age: 30,
    DOB: "1994-01-15",
    Gender: "M",
    PTC: "ADT",
    Nationality: "IN",
    PassportNo: "M1234567",
    PLI: "Kochi",
    PDOE: "2027-12-15",
    VisaType: "Tourist Visa"
  };

  const validResult = validateItinerary(validContactInfo, [validTraveler]);
  const invalidResult = validateItinerary(null, []);

  console.log(`✅ Valid itinerary: ${validResult.isValid ? 'PASS' : 'FAIL'}`);
  console.log(`❌ Invalid itinerary: ${invalidResult.isValid ? 'FAIL' : 'PASS'}`);
  
  if (!validResult.isValid) {
    console.log('Valid itinerary errors:', validResult.errors);
  }
  if (invalidResult.isValid) {
    console.log('Invalid itinerary should have errors but passed');
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.runValidationTests = runValidationTests;
}

export { runValidationTests }; 