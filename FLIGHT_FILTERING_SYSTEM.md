# Flight Filtering System

## Overview

A comprehensive flight filtering system that allows users to filter flight search results based on multiple criteria including price, airline, stops, refundable status, departure time, duration, and more.

## Features

### 🎯 Smart Filtering
- **Price Range**: Filter flights by minimum and maximum price
- **Airline Selection**: Multi-select airlines from available options
- **Stops**: Filter by direct flights, 1-stop, 2+ stops
- **Refund Policy**: Filter by refundable vs non-refundable flights
- **Departure Time**: Filter by time of day (morning, afternoon, evening, night)
- **Duration**: Filter by flight duration range
- **Sorting**: Sort by price, duration, or departure time (ascending/descending)

### 🚀 Advanced Features
- **Real-time Filtering**: Filters apply immediately as you change criteria
- **Filter Statistics**: Shows total vs filtered flight counts
- **Quick Filter Tags**: Visual indicators of active filters
- **Expandable Interface**: Collapsible filter panel for better UX
- **Context Management**: Global state management for flight data and filters
- **Connection Information**: Enhanced flight cards showing stop details and inclusions

## Architecture

### Components

#### 1. FlightContext (`/client/src/contexts/FlightContext.jsx`)
- **Purpose**: Global state management for flight data and filters
- **Features**:
  - Manages flight data from localStorage
  - Handles filter state and application
  - Provides sorting functionality
  - Offers utility functions for data analysis

#### 2. FlightFilter (`/client/src/components/FlightFilter.jsx`)
- **Purpose**: Main filtering interface
- **Features**:
  - Expandable/collapsible design
  - Multiple filter types (price, airline, stops, etc.)
  - Real-time filter application
  - Quick filter tags display
  - Reset functionality

#### 3. FlightCard (`/client/src/components/FlightCard.jsx`)
- **Purpose**: Enhanced flight display with connection information
- **Features**:
  - Shows connection details and stops
  - Displays inclusions (baggage, meals)
  - Cabin class information
  - Refundable status
  - Enhanced visual design

#### 4. FlightFilterDemo (`/client/src/components/FlightFilterDemo.jsx`)
- **Purpose**: Statistics and filter status display
- **Features**:
  - Shows total vs filtered flight counts
  - Displays available airlines count
  - Shows price range information
  - Lists active filters
  - Provides helpful messages when no results found

#### 5. ListFlights (`/client/src/pages/ListFlights.jsx`)
- **Purpose**: Updated main flight listing page
- **Features**:
  - Integrates with FlightContext
  - Uses filtered flight data
  - Shows loading and error states
  - Maintains existing booking functionality

## Data Structure

### Flight Object Properties
```javascript
{
  AirlineName: "IndiGo|IndiGo|IndiGo",
  From: "BOM",
  FromName: "Chhatrapati Shivaji |Mumbai",
  To: "DEL", 
  ToName: "Indira Gandhi International |New Delhi",
  DepartureTime: "2025-09-10T02:25:00",
  ArrivalTime: "2025-09-10T06:35:00",
  Duration: "04h 10m ",
  GrossFare: 9261,
  FlightNo: "5243",
  Refundable: "Y",
  Stops: "1",
  Segments: [...],
  Connections: [...],
  Inclusions: {
    Baggage: null,
    Meals: null,
    PieceDescription: null
  },
  FareClass: "R",
  Cabin: "E",
  Index: "6E|104"
}
```

### Filter State Structure
```javascript
{
  priceRange: { min: 0, max: 100000 },
  airlines: [],
  stops: 'all', // 'all', 'direct', '1-stop', '2-stops'
  refundable: 'all', // 'all', 'refundable', 'non-refundable'
  departureTime: 'all', // 'all', 'morning', 'afternoon', 'evening', 'night'
  duration: { min: 0, max: 24 },
  sortBy: 'price', // 'price', 'duration', 'departure'
  sortOrder: 'asc' // 'asc', 'desc'
}
```

## Usage

### Basic Implementation

1. **Wrap your app with FlightProvider**:
```jsx
import { FlightProvider } from './contexts/FlightContext';

function App() {
  return (
    <FlightProvider>
      {/* Your app components */}
    </FlightProvider>
  );
}
```

2. **Use the filtering system in your components**:
```jsx
import { useFlight } from './contexts/FlightContext';
import FlightFilter from './components/FlightFilter';

function FlightListPage() {
  const { filteredFlights, updateFilters } = useFlight();
  
  return (
    <div>
      <FlightFilter />
      {filteredFlights.map(flight => (
        <FlightCard key={flight.Index} flight={flight} />
      ))}
    </div>
  );
}
```

### Filter Operations

#### Apply Filters
```javascript
const { updateFilters } = useFlight();

// Update price range
updateFilters({ 
  priceRange: { min: 5000, max: 15000 } 
});

// Select specific airlines
updateFilters({ 
  airlines: ['6E', 'AI'] 
});

// Filter by stops
updateFilters({ 
  stops: 'direct' 
});

// Multiple filters at once
updateFilters({
  priceRange: { min: 5000, max: 15000 },
  airlines: ['6E'],
  stops: 'direct',
  refundable: 'refundable'
});
```

#### Reset Filters
```javascript
const { resetFilters } = useFlight();
resetFilters();
```

#### Get Filter Statistics
```javascript
const { 
  getUniqueAirlines, 
  getPriceRange,
  filteredFlights,
  flights 
} = useFlight();

const airlines = getUniqueAirlines();
const priceRange = getPriceRange();
const totalFlights = flights.length;
const filteredCount = filteredFlights.length;
```

## Filter Logic

### Price Filtering
- Filters flights within the specified price range
- Automatically calculates min/max from available flights
- Supports real-time price range updates

### Airline Filtering
- Multi-select functionality
- Extracts airline codes from AirlineName field
- Case-insensitive matching

### Stops Filtering
- Direct flights: Stops === '0'
- 1-stop flights: Stops === '1'
- 2+ stops: Stops >= '2'

### Refundable Filtering
- Refundable: Refundable === 'Y'
- Non-refundable: Refundable !== 'Y'

### Departure Time Filtering
- Morning: 6 AM - 12 PM
- Afternoon: 12 PM - 6 PM
- Evening: 6 PM - 10 PM
- Night: 10 PM - 6 AM

### Duration Filtering
- Parses duration strings (e.g., "04h 10m")
- Converts to hours for range filtering
- Supports decimal hours (e.g., 2.5 hours)

### Sorting
- **Price**: Sorts by GrossFare
- **Duration**: Sorts by parsed duration in hours
- **Departure**: Sorts by DepartureTime
- **Order**: Ascending or descending

## Performance Considerations

- **Efficient Filtering**: Filters are applied only when needed
- **Memoization**: Context prevents unnecessary re-renders
- **Local Storage**: Flight data persists across page refreshes
- **Lazy Loading**: Filter components load only when expanded

## Error Handling

- **Data Validation**: Handles missing or malformed flight data
- **Loading States**: Shows loading indicators during data processing
- **Error Messages**: Displays user-friendly error messages
- **Fallback Values**: Provides default values for missing data

## Future Enhancements

### Potential Improvements
1. **Advanced Filters**:
   - Airport terminal filtering
   - Aircraft type filtering
   - Meal preferences
   - Seat selection preferences

2. **Performance Optimizations**:
   - Virtual scrolling for large flight lists
   - Debounced filter inputs
   - Cached filter results

3. **User Experience**:
   - Saved filter preferences
   - Filter presets (e.g., "Budget", "Business", "Quick")
   - Filter comparison tools
   - Price alerts

4. **Analytics**:
   - Filter usage tracking
   - Popular filter combinations
   - User behavior insights

## Testing

### Test Cases
1. **Filter Functionality**:
   - Price range filtering
   - Airline selection
   - Stops filtering
   - Refundable filtering
   - Time-based filtering
   - Duration filtering

2. **Sorting**:
   - Price sorting (asc/desc)
   - Duration sorting (asc/desc)
   - Departure time sorting (asc/desc)

3. **Edge Cases**:
   - Empty flight data
   - Invalid filter values
   - No matching results
   - Large datasets

4. **Integration**:
   - Context state management
   - Component communication
   - Data persistence

## Dependencies

- React 18+
- React Context API
- Local Storage API
- Date manipulation utilities

## Browser Support

- Modern browsers with ES6+ support
- Local Storage support required
- Responsive design for mobile devices

---

This filtering system provides a robust, user-friendly way to filter flight search results with comprehensive features and excellent performance.
