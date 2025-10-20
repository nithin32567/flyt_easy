import React, { useState, useEffect } from 'react';
import { useFlight } from '../../contexts/FlightContext';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Plane, 
  MapPin, 
  RefreshCw, 
  ArrowUpDown, 
  RotateCcw,
  Menu
} from 'lucide-react';

const FilterSidebar = ({ onClose }) => {
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

  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    airlines: true,
    stops: true,
    refundable: true,
    sort: true
  });

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getTotalFilteredCount = () => {
    return filteredFlights.length + filteredReturnFlights.length;
  };

  const getTotalCount = () => {
    return flights.length + returnFlights.length;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.airlines.length > 0) count++;
    if (filters.stops !== 'all') count++;
    if (filters.refundable !== 'all') count++;
    if (filters.priceRange.min !== priceRange.min || filters.priceRange.max !== priceRange.max) count++;
    return count;
  };

  const clearAllFilters = () => {
    resetFilters();
  };

  const FilterSection = ({ title, icon: Icon, sectionKey, children }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-3 text-left hover:bg-gray-50 rounded-lg px-2 transition-colors"
        aria-expanded={expandedSections[sectionKey]}
        aria-controls={`filter-${sectionKey}`}
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <span className="text-lg font-semibold text-gray-800">{title}</span>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      <div
        id={`filter-${sectionKey}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expandedSections[sectionKey] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-2">
          {children}
        </div>
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Filter className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">
            Filters ({getTotalFilteredCount()} of {getTotalCount()})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label="Close filters"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-medium text-blue-800">
              Active Filters ({getActiveFilterCount()})
            </span>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.airlines.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                Airlines: {filters.airlines.join(', ')}
              </span>
            )}
            {filters.stops !== 'all' && (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                {filters.stops === 'direct' ? 'Direct' : filters.stops}
              </span>
            )}
            {filters.refundable !== 'all' && (
              <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                {filters.refundable}
              </span>
            )}
            <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
              ₹{filters.priceRange.min} - ₹{filters.priceRange.max}
            </span>
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Price Range */}
        <FilterSection title="Price Range" icon={DollarSign} sectionKey="price">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min={priceRange.min}
                  max={priceRange.max}
                  aria-label="Minimum price"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-600 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min={priceRange.min}
                  max={priceRange.max}
                  aria-label="Maximum price"
                />
              </div>
            </div>
            <div className="text-base text-gray-500 bg-gray-50 p-3 rounded-lg">
              Range: ₹{priceRange.min} - ₹{priceRange.max}
            </div>
          </div>
        </FilterSection>

        {/* Airlines */}
        <FilterSection title="Airlines" icon={Plane} sectionKey="airlines">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableAirlines.map((airline) => (
              <label 
                key={airline} 
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineToggle(airline)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  aria-label={`Filter by ${airline} airline`}
                />
                <span className="text-base text-gray-700 flex-1">{airline}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Stops */}
        <FilterSection title="Stops" icon={MapPin} sectionKey="stops">
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Flights' },
              { value: 'direct', label: 'Direct Flights' },
              { value: '1-stop', label: '1 Stop' },
              { value: '2-stops', label: '2+ Stops' }
            ].map((option) => (
              <label 
                key={option.value} 
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="stops"
                  value={option.value}
                  checked={filters.stops === option.value}
                  onChange={(e) => handleFilterChange('stops', e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  aria-label={`Filter by ${option.label}`}
                />
                <span className="text-base text-gray-700 flex-1">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Refundable */}
        <FilterSection title="Refund Policy" icon={RefreshCw} sectionKey="refundable">
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Flights' },
              { value: 'refundable', label: 'Refundable' },
              { value: 'non-refundable', label: 'Non-refundable' }
            ].map((option) => (
              <label 
                key={option.value} 
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="refundable"
                  value={option.value}
                  checked={filters.refundable === option.value}
                  onChange={(e) => handleFilterChange('refundable', e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  aria-label={`Filter by ${option.label}`}
                />
                <span className="text-base text-gray-700 flex-1">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Sort Options */}
        <FilterSection title="Sort By" icon={ArrowUpDown} sectionKey="sort">
          <div className="space-y-3">
            <div>
              <label className="block text-base font-medium text-gray-600 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                aria-label="Sort flights by"
              >
                <option value="price">Price</option>
                <option value="duration">Duration</option>
                <option value="departure">Departure Time</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-gray-600 mb-2">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                aria-label="Sort order"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </FilterSection>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-4 px-4 rounded-lg transition-all duration-200 hover:scale-105"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-base">Reset Filters</span>
        </button>
      </div>
    </div>
  );

  return sidebarContent;
};

export default FilterSidebar;