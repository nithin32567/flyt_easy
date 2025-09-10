import React, { useState } from 'react';
import { useFlight } from '../contexts/FlightContext';

const FlightFilter = () => {
  const { 
    filters, 
    updateFilters, 
    resetFilters, 
    getUniqueAirlines, 
    getPriceRange,
    filteredFlights,
    filteredReturnFlights,
    flights,
    returnFlights
  } = useFlight();

  const [isExpanded, setIsExpanded] = useState(false);

  const availableAirlines = getUniqueAirlines();
  const priceRange = getPriceRange();

  const handlePriceChange = (type, value) => {
    updateFilters({
      priceRange: {
        ...filters.priceRange,
        [type]: parseInt(value) || 0
      }
    });
  };

  const handleAirlineToggle = (airline) => {
    const currentAirlines = filters.airlines || [];
    const newAirlines = currentAirlines.includes(airline)
      ? currentAirlines.filter(a => a !== airline)
      : [...currentAirlines, airline];
    
    updateFilters({ airlines: newAirlines });
  };

  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value });
  };

  const getTotalFilteredCount = () => {
    return filteredFlights.length + filteredReturnFlights.length;
  };

  const getTotalCount = () => {
    return flights.length + returnFlights.length;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Filters ({getTotalFilteredCount()} of {getTotalCount()} flights)
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? 'Collapse' : 'Expand'} Filters
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={priceRange.min}
                  max={priceRange.max}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={priceRange.min}
                  max={priceRange.max}
                />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Range: ₹{priceRange.min} - ₹{priceRange.max}
            </div>
          </div>

          {/* Airlines */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Airlines</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableAirlines.map((airline) => (
                <label key={airline} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.airlines.includes(airline)}
                    onChange={() => handleAirlineToggle(airline)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{airline}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stops */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Stops</h4>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Flights' },
                { value: 'direct', label: 'Direct Flights' },
                { value: '1-stop', label: '1 Stop' },
                { value: '2-stops', label: '2+ Stops' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="stops"
                    value={option.value}
                    checked={filters.stops === option.value}
                    onChange={(e) => handleFilterChange('stops', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Refundable */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Refund Policy</h4>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Flights' },
                { value: 'refundable', label: 'Refundable' },
                { value: 'non-refundable', label: 'Non-refundable' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="refundable"
                    value={option.value}
                    checked={filters.refundable === option.value}
                    onChange={(e) => handleFilterChange('refundable', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Sort By</h4>
            <div className="flex space-x-4">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="price">Price</option>
                <option value="duration">Duration</option>
                <option value="departure">Departure Time</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center pt-4 border-t">
            <button
              onClick={resetFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Quick Filter Tags */}
      {!isExpanded && (
        <div className="flex flex-wrap gap-2">
          {filters.airlines.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Airlines: {filters.airlines.join(', ')}
            </span>
          )}
          {filters.stops !== 'all' && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {filters.stops === 'direct' ? 'Direct' : filters.stops}
            </span>
          )}
          {filters.refundable !== 'all' && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              {filters.refundable}
            </span>
          )}
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
            ₹{filters.priceRange.min} - ₹{filters.priceRange.max}
          </span>
        </div>
      )}
    </div>
  );
};

export default FlightFilter;