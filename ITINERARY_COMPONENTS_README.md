# Itinerary Creation Components

This document describes the new components created for entering contact information and traveler data for flight itineraries, including comprehensive validation functions.

## Components Overview

### 1. ContactInfoForm (`client/src/components/ContactInfoForm.jsx`)
A comprehensive form component for collecting contact information including:
- Personal details (Name, Title)
- Contact information (Mobile, Phone, Email)
- Address details (Address, City, State, PIN, Country Code)
- GST information (optional)
- Additional options (Update Profile, Is Guest)
- **Real-time validation** with error messages

### 2. TravelerDetailsModal (`client/src/components/modals/TravelerDetailsModal.jsx`)
A modal component for adding/editing traveler details with fields:
- Personal information (Name, Age, DOB, Gender)
- Travel details (Passenger Type, Nationality)
- Passport information (Passport Number, Issuing Location, Expiry Date)
- Visa information (Visa Type)
- **Comprehensive validation** with field-specific error messages

### 3. TravelersList (`client/src/components/TravelersList.jsx`)
A component to display and manage travelers with features:
- List all travelers with detailed information
- Add new travelers via modal
- Edit existing travelers
- Delete travelers
- Summary statistics (total travelers, adults, children, infants)

### 4. Createitenary Page (`client/src/pages/Createitenary.jsx`)
A multi-step page that combines all components:
- Step 1: Contact Information
- Step 2: Travelers Management
- Step 3: Review and Submit
- **Final validation** before submission

## Validation System

### Validation Utility (`client/src/utils/validation.js`)

The validation system provides comprehensive validation for all form fields:

#### Individual Field Validations:
- **Email**: Validates email format
- **Mobile**: Validates 10-digit mobile numbers
- **Phone**: Validates 10-15 digit phone numbers (optional)
- **PIN**: Validates 6-digit PIN codes
- **Age**: Validates age between 0-120
- **Date of Birth**: Validates past dates and reasonable age
- **Passport Expiry**: Validates future dates
- **GST TIN**: Validates 15-character GST TIN format
- **Required Fields**: Validates non-empty required fields

#### Form-Level Validations:
- **validateContactInfo()**: Validates complete contact information
- **validateTraveler()**: Validates complete traveler information
- **validateItinerary()**: Validates complete itinerary data

#### Real-time Validation Features:
- Field-level validation on blur
- Visual error indicators (red borders)
- Error messages below each field
- Form submission validation
- Scroll to first error on submission

### Validation Test Suite (`client/src/utils/validation.test.js`)

Comprehensive test functions to verify validation logic:

```javascript
// Run all validation tests in browser console
import { runValidationTests } from './utils/validation.test.js';
runValidationTests();
```

## Data Structure

### ContactInfo Structure
```javascript
{
  "Title": "Mr",
  "FName": "John",
  "LName": "Doe",
  "Mobile": "9876543210",
  "Phone": "0484123456",
  "Email": "john.doe@example.com",
  "Address": "123, MG Road",
  "CountryCode": "IN",
  "State": "Kerala",
  "City": "Kochi",
  "PIN": "682001",
  "GSTCompanyName": "Doe Enterprises",
  "GSTTIN": "32ABCDE1234F1Z5",
  "GSTMobile": "9876543210",
  "GSTEmail": "gst@example.com",
  "UpdateProfile": false,
  "IsGuest": false
}
```

### Traveler Structure
```javascript
{
  "ID": 1,
  "Title": "Mr",
  "FName": "Alex",
  "LName": "Mason",
  "Age": 30,
  "DOB": "1994-01-15",
  "Gender": "M",
  "PTC": "ADT",
  "Nationality": "IN",
  "PassportNo": "M1234567",
  "PLI": "Kochi",
  "PDOE": "2027-12-15",
  "VisaType": "Tourist Visa"
}
```

## Usage

### Accessing the Page
Navigate to `/create-itenary` in your application to access the itinerary creation page.

### Features
1. **Multi-step Process**: The page guides users through a 3-step process
2. **Form Validation**: All required fields are validated with real-time feedback
3. **Sample Data**: Click "Load Sample Data" to populate with example data
4. **Responsive Design**: Works on desktop and mobile devices
5. **Modern UI**: Uses Tailwind CSS with consistent styling
6. **Error Handling**: Comprehensive error messages and validation feedback

### Validation Features
1. **Real-time Validation**: Fields are validated as users type/leave fields
2. **Visual Feedback**: Invalid fields show red borders and error messages
3. **Form Submission**: Complete validation before allowing submission
4. **Error Navigation**: Automatically scrolls to first error on submission
5. **Field-specific Messages**: Custom error messages for each validation rule

### Navigation
- **Step 1**: Enter contact information (with validation)
- **Step 2**: Add/edit travelers (at least one traveler required)
- **Step 3**: Review all information before submission (with final validation)

### API Integration
The final data structure matches your API requirements:
```javascript
{
  "ContactInfo": { /* contact information */ },
  "Travellers": [ /* array of travelers */ ]
}
```

## Validation Rules

### Contact Information Validation:
- **Title**: Required, must be selected
- **First Name**: Required, non-empty
- **Last Name**: Required, non-empty
- **Mobile**: Required, exactly 10 digits
- **Phone**: Optional, 10-15 digits if provided
- **Email**: Required, valid email format
- **Address**: Required, non-empty
- **Country Code**: Required, non-empty
- **State**: Required, non-empty
- **City**: Required, non-empty
- **PIN**: Required, exactly 6 digits
- **GST Fields**: Optional, but validated if provided

### Traveler Validation:
- **Title**: Required, must be selected
- **First Name**: Required, non-empty
- **Last Name**: Required, non-empty
- **Age**: Required, number between 0-120
- **Date of Birth**: Required, must be in the past
- **Gender**: Required, must be selected
- **Passenger Type**: Required, must be selected
- **Nationality**: Required, non-empty
- **Passport Number**: Optional, but validated if provided
- **Passport Issuing Location**: Optional, but validated if provided
- **Passport Expiry**: Optional, must be future date if provided
- **Visa Type**: Optional

## Dependencies
- React 19.1.0
- Lucide React (for icons)
- Tailwind CSS (for styling)
- React Router DOM (for routing)

## Styling
The components use a consistent color scheme:
- Primary: `#f48f22` (orange)
- Secondary: `#16437c` (dark blue)
- Success: `#10b981` (green)
- Error: `#ef4444` (red)
- Gray shades for neutral elements

## Testing Validation

To test the validation functions in the browser console:

```javascript
// Import and run validation tests
import { runValidationTests } from './utils/validation.test.js';
runValidationTests();
```

This will run comprehensive tests for all validation functions and display results in the console.

## Future Enhancements
1. Add form persistence (save draft)
2. Add file upload for passport/documents
3. Add validation for passport numbers and dates
4. Add country/state dropdowns
5. Add API integration for saving data
6. Add print/export functionality
7. Add unit tests with Jest
8. Add accessibility improvements (ARIA labels, keyboard navigation) 