# SSR (Special Service Request) Feature Implementation

## Overview

The SSR feature allows passengers to add additional services to their flight booking, such as meals, extra baggage, and priority check-in. Passengers can toggle this feature on/off and select specific services before creating their itinerary.

## Features

### 1. SSR Toggle
- **Component**: `SSRToggle.jsx`
- **Purpose**: Allows passengers to enable/disable SSR services
- **Features**:
  - Toggle switch with visual feedback
  - Shows available service categories when enabled
  - Displays service count and pricing preview
  - Responsive design with clear UI

### 2. SSR Services Selection
- **Component**: `SSRServicesSelection.jsx`
- **Purpose**: Detailed service selection interface
- **Features**:
  - Categorized services (Baggage, Meals, Priority Services)
  - Expandable service categories
  - Individual service selection with checkboxes
  - Real-time total calculation
  - Service details (code, description, pricing)
  - Selected services summary

### 3. Backend Integration
- **Controller**: `ssr.controller.js`
- **Endpoints**:
  - `GET /api/flights/get-ssr-services` - Fetch available SSR services
  - `POST /api/flights/validate-ssr-selection` - Validate selected services
- **Features**:
  - API integration with flight booking system
  - Service validation and compatibility checks
  - Error handling and response formatting

## Implementation Details

### Frontend Components

#### SSRToggle Component
```jsx
<SSRToggle
  isEnabled={ssrEnabled}
  onToggle={handleSSRToggle}
  availableServices={availableSSRServices}
/>
```

**Props:**
- `isEnabled`: Boolean - Current SSR toggle state
- `onToggle`: Function - Callback when toggle changes
- `availableServices`: Array - Available SSR services

#### SSRServicesSelection Component
```jsx
<SSRServicesSelection
  availableServices={availableSSRServices}
  selectedServices={selectedSSRServices}
  onServiceSelectionChange={handleSSRServiceSelection}
  travelers={travelers}
/>
```

**Props:**
- `availableServices`: Array - Available SSR services
- `selectedServices`: Array - Currently selected services
- `onServiceSelectionChange`: Function - Callback when selection changes
- `travelers`: Array - Passenger information

### Backend API

#### Get SSR Services
```javascript
POST /api/flights/get-ssr-services
{
  "TUI": "transaction-unique-id",
  "PaidSSR": true,
  "ClientID": "bitest",
  "Source": "SF",
  "FareType": "ON"
}
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "services": [
      {
        "ID": 1,
        "Code": "FFWD",
        "Description": "Priority Check-In",
        "Charge": 450.0,
        "Type": "8",
        "VAT": 0.0,
        "Discount": 0.0
      }
    ],
    "currencyCode": "INR",
    "paidSSR": true
  }
}
```

#### Validate SSR Selection
```javascript
POST /api/flights/validate-ssr-selection
{
  "TUI": "transaction-unique-id",
  "selectedServices": [...],
  "travelers": [...]
}
```

## Integration with Booking Flow

### Updated Booking Steps
1. **Contact Information** - Collect passenger contact details
2. **Travelers** - Add passenger information
3. **Additional Services** - **NEW** - SSR selection step
4. **Review & Submit** - Review and create itinerary

### SSR Step Features
- Toggle to enable/disable SSR
- Service categories (Baggage, Meals, Priority)
- Individual service selection
- Real-time pricing calculation
- Service compatibility validation

### Review Step Enhancements
- SSR services summary
- Total amount breakdown
- Service details in review
- Clear pricing display

## Service Types

### 1. Baggage Services (Type: "2")
- Excess baggage options
- Weight-based pricing
- Multiple weight categories (3kg, 5kg, 10kg, 15kg, 20kg, 30kg)

### 2. Meal Services (Type: "1")
- In-flight meal options
- Various meal types
- Dietary preferences

### 3. Priority Services (Type: "8")
- Priority check-in
- Fast-track services
- Premium boarding

## Data Flow

### 1. SSR Toggle
```
User Toggle → handleSSRToggle() → fetchSSRServices() → API Call → Update State
```

### 2. Service Selection
```
User Selection → handleSSRServiceSelection() → Update State → Calculate Total
```

### 3. Itinerary Creation
```
Create Itinerary → Include SSR Data → Backend Validation → API Submission
```

## Error Handling

### Frontend
- Loading states during API calls
- Error messages for failed requests
- Validation feedback for selections
- Graceful fallbacks for missing data

### Backend
- API error handling and logging
- Service validation
- Duplicate service detection
- Compatibility checks

## Testing

### Test Component
- `SSRTest.jsx` - Standalone test component
- Mock data for testing
- Debug information display
- Component isolation testing

### Test Scenarios
1. **SSR Toggle**
   - Enable/disable functionality
   - State management
   - API integration

2. **Service Selection**
   - Individual service selection
   - Multiple service selection
   - Service deselection
   - Total calculation

3. **Integration**
   - Booking flow integration
   - Data persistence
   - API communication

## Configuration

### Environment Variables
```env
FLIGHT_URL=https://api.flight-booking-system.com
```

### API Configuration
- Authentication token required
- Content-Type: application/json
- Accept: application/json

## Future Enhancements

### Planned Features
1. **Service Recommendations**
   - AI-powered service suggestions
   - Travel history-based recommendations

2. **Advanced Pricing**
   - Dynamic pricing based on demand
   - Seasonal pricing adjustments

3. **Service Bundles**
   - Pre-packaged service combinations
   - Discounted bundle pricing

4. **Real-time Availability**
   - Live service availability checking
   - Inventory management

### Technical Improvements
1. **Performance Optimization**
   - Service caching
   - Lazy loading of service details

2. **Enhanced UI/UX**
   - Animated transitions
   - Better mobile responsiveness
   - Accessibility improvements

3. **Analytics Integration**
   - Service selection tracking
   - User behavior analysis
   - Conversion optimization

## Troubleshooting

### Common Issues

1. **SSR Services Not Loading**
   - Check TUI validity
   - Verify API endpoint
   - Check authentication token

2. **Service Selection Issues**
   - Validate service data structure
   - Check for duplicate services
   - Verify service compatibility

3. **Pricing Calculation Errors**
   - Check service charge values
   - Verify currency formatting
   - Validate total calculation logic

### Debug Tools
- Browser developer tools
- Network tab for API calls
- Console logging
- SSRTest component for isolation testing

## Security Considerations

1. **Data Validation**
   - Input sanitization
   - Service validation
   - Price verification

2. **API Security**
   - Token-based authentication
   - Request validation
   - Error message sanitization

3. **User Privacy**
   - Minimal data collection
   - Secure data transmission
   - GDPR compliance

## Performance Metrics

### Key Metrics
- SSR adoption rate
- Service selection conversion
- Average order value increase
- User satisfaction scores

### Monitoring
- API response times
- Error rates
- User interaction patterns
- Service popularity trends 