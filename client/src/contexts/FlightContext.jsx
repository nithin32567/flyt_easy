import React, { createContext, useContext, useState, useEffect } from 'react';

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  // Flight data
  const [flights, setFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  
  // Filtered data
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filteredReturnFlights, setFilteredReturnFlights] = useState([]);
  
  // Selected flights
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 100000 },
    airlines: [],
    stops: 'all',
    refundable: 'all',
    departureTime: 'all',
    duration: { min: 0, max: 24 },
    sortBy: 'price',
    sortOrder: 'asc'
  });

  // Load flights from localStorage
  useEffect(() => {
    try {
      const trips = JSON.parse(localStorage.getItem("trips"));
      if (trips && trips.length > 0) {
        const flightsData = trips[0]?.Journey || [];
        const returnFlightsData = trips.length > 1 ? trips[1]?.Journey || [] : [];
        
        setFlights(flightsData);
        setReturnFlights(returnFlightsData);
        setFilteredFlights(flightsData);
        setFilteredReturnFlights(returnFlightsData);
        
        // Set initial price range from actual data
        const allFlights = [...flightsData, ...returnFlightsData];
        const prices = allFlights.map(flight => flight.GrossFare || 0).filter(price => price > 0);
        if (prices.length > 0) {
          setFilters(prev => ({
            ...prev,
            priceRange: {
              min: Math.min(...prices),
              max: Math.max(...prices)
            }
          }));
        } else {
          // If no prices found, set a default range
          setFilters(prev => ({
            ...prev,
            priceRange: {
              min: 0,
              max: 100000
            }
          }));
        }
      }
    } catch (error) {
      // console.error('Error loading flights:', error);
    }
  }, []);

  // Update filtered flights when flights or returnFlights change
  useEffect(() => {
    // Apply current filters to the updated flight data
    const filtered = applyFilters(flights, filters);
    const filteredReturn = applyFilters(returnFlights, filters);
    
    // Apply sorting
    const sorted = sortFlights(filtered, filters.sortBy, filters.sortOrder);
    const sortedReturn = sortFlights(filteredReturn, filters.sortBy, filters.sortOrder);
    
    setFilteredFlights(sorted);
    setFilteredReturnFlights(sortedReturn);
  }, [flights, returnFlights, filters]);

  // Apply filters function
  const applyFilters = (flightsToFilter, currentFilters) => {
    if (!flightsToFilter || flightsToFilter.length === 0) return [];

    return flightsToFilter.filter(flight => {
      // Skip flights that don't have the required properties for filtering
      // This handles the simplified flight objects that only have basic properties
      if (!flight.GrossFare && !flight.AirlineName && !flight.DepartureTime) {
        // For simplified flight objects, we'll include them by default
        // and let the stops filter handle them if needed
        if (currentFilters.stops !== 'all') {
          const stops = String(flight.Stops || 0);
          switch (currentFilters.stops) {
            case 'direct':
              if (stops !== '0') return false;
              break;
            case '1-stop':
              if (stops !== '1') return false;
              break;
            case '2-stops':
              if (stops !== '2') return false;
              break;
          }
        }
        return true;
      }

      // Price filter - only apply if GrossFare exists
      if (flight.GrossFare && (flight.GrossFare < currentFilters.priceRange.min || flight.GrossFare > currentFilters.priceRange.max)) {
        return false;
      }

      // Airline filter - only apply if AirlineName or Provider exists
      if (currentFilters.airlines.length > 0) {
        let airlineCode = '';
        if (flight.AirlineName) {
          airlineCode = flight.AirlineName.split('|')[0] || '';
        } else if (flight.Provider) {
          airlineCode = flight.Provider;
        }
        
        if (airlineCode && !currentFilters.airlines.includes(airlineCode)) {
          return false;
        }
      }

      // Stops filter - handle both string and number types
      if (currentFilters.stops !== 'all') {
        const stops = String(flight.Stops || 0);
        switch (currentFilters.stops) {
          case 'direct':
            if (stops !== '0') return false;
            break;
          case '1-stop':
            if (stops !== '1') return false;
            break;
          case '2-stops':
            if (stops !== '2') return false;
            break;
        }
      }

      // Refundable filter - only apply if Refundable exists
      if (currentFilters.refundable !== 'all' && flight.Refundable) {
        const isRefundable = flight.Refundable === 'Y';
        if (currentFilters.refundable === 'refundable' && !isRefundable) return false;
        if (currentFilters.refundable === 'non-refundable' && isRefundable) return false;
      }

      // Departure time filter - only apply if DepartureTime exists
      if (currentFilters.departureTime !== 'all' && flight.DepartureTime) {
        const departureTime = new Date(flight.DepartureTime);
        const hour = departureTime.getHours();
        
        switch (currentFilters.departureTime) {
          case 'morning':
            if (hour < 6 || hour >= 12) return false;
            break;
          case 'afternoon':
            if (hour < 12 || hour >= 18) return false;
            break;
          case 'evening':
            if (hour < 18 || hour >= 22) return false;
            break;
          case 'night':
            if (hour < 22 && hour >= 6) return false;
            break;
        }
      }

      return true;
    });
  };

  // Sort function
  const sortFlights = (flightsToSort, sortBy, sortOrder) => {
    return [...flightsToSort].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.GrossFare || 0;
          bValue = b.GrossFare || 0;
          break;
        case 'duration':
          const parseDuration = (durationStr) => {
            if (!durationStr) return 0;
            const match = durationStr.match(/(\d+)h\s*(\d+)?m/);
            if (match) {
              const hours = parseInt(match[1]) || 0;
              const minutes = parseInt(match[2]) || 0;
              return hours + (minutes / 60);
            }
            return 0;
          };
          aValue = parseDuration(a.Duration);
          bValue = parseDuration(b.Duration);
          break;
        case 'departure':
          aValue = new Date(a.DepartureTime);
          bValue = new Date(b.DepartureTime);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  };

  // Update filters and apply them
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset filters
  const resetFilters = () => {
    // Get price range from current data
    const allFlights = [...flights, ...returnFlights];
    const prices = allFlights.map(flight => flight.GrossFare || 0).filter(price => price > 0);
    const priceRange = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices)
    } : { min: 0, max: 100000 };

    setFilters({
      priceRange,
      airlines: [],
      stops: 'all',
      refundable: 'all',
      departureTime: 'all',
      duration: { min: 0, max: 24 },
      sortBy: 'price',
      sortOrder: 'asc'
    });
  };

  // Get unique airlines
  const getUniqueAirlines = () => {
    const allFlights = [...flights, ...returnFlights];
    const airlines = new Set();
    allFlights.forEach(flight => {
      if (flight.AirlineName) {
        const airlineCode = flight.AirlineName.split('|')[0];
        airlines.add(airlineCode);
      } else if (flight.Provider) {
        // For simplified flight objects, use Provider field
        airlines.add(flight.Provider);
      }
    });
    return Array.from(airlines).sort();
  };

  // Get price range
  const getPriceRange = () => {
    const allFlights = [...flights, ...returnFlights];
    if (allFlights.length === 0) return { min: 0, max: 100000 };
    
    const prices = allFlights.map(flight => flight.GrossFare || 0).filter(price => price > 0);
    if (prices.length === 0) return { min: 0, max: 100000 };
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  const value = {
    flights,
    returnFlights,
    filteredFlights,
    filteredReturnFlights,
    selectedFlight,
    selectedReturnFlight,
    filters,
    setFlights,
    setReturnFlights,
    setSelectedFlight,
    setSelectedReturnFlight,
    updateFilters,
    resetFilters,
    getUniqueAirlines,
    getPriceRange
  };

  return (
    <FlightContext.Provider value={value}>
      {children}
    </FlightContext.Provider>
  );
};

export const useFlight = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error('useFlight must be used within a FlightProvider');
  }
  return context;
};

export default FlightContext;