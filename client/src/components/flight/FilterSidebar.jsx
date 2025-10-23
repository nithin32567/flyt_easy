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
    returnFlights,
  } = useFlight();

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    airlines: true,
    stops: true,
    refundable: true,
    sort: true,
  });

  const priceRange = getPriceRange();
  const availableAirlines = getUniqueAirlines();

  // Handlers
  const handlePriceChange = (type, value) => {
    updateFilters({
      priceRange: { ...filters.priceRange, [type]: parseInt(value) || 0 },
    });
  };

  const handleAirlineToggle = (airline) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter((a) => a !== airline)
      : [...filters.airlines, airline];
    updateFilters({ airlines: newAirlines });
  };

  const handleFilterChange = (type, value) => updateFilters({ [type]: value });

  const toggleSection = (key) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const clearAllFilters = () => resetFilters();

  const getTotalFilteredCount = () =>
    filteredFlights.length + filteredReturnFlights.length;

  const getTotalCount = () => flights.length + returnFlights.length;

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.airlines.length > 0) count++;
    if (filters.stops !== 'all') count++;
    if (filters.refundable !== 'all') count++;
    if (
      filters.priceRange.min !== priceRange.min ||
      filters.priceRange.max !== priceRange.max
    )
      count++;
    return count;
  };

  // Local Section Component
  const FilterSection = ({ title, icon: Icon, sectionKey, children }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-3 px-3 hover:bg-gray-50 rounded-lg transition-all"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-800 text-[15px]">{title}</span>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expandedSections[sectionKey]
            ? 'max-h-[400px] opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-2 px-3">{children}</div>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col h-full bg-white shadow-xl rounded-lg overflow-y-auto"
      style={{
        width: '100%',
        maxWidth: '340px',
        border: '1px solid #e5e7eb',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-[var(--PrimaryColor)]">
        <div className="flex items-center gap-2">
          <h6 className="text-sm font-semibold text-white">
            Available Flights ({getTotalFilteredCount()} / {getTotalCount()})
          </h6>
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex justify-between mb-2 items-center">
            <span className="font-medium text-blue-800 text-sm">
              Active Filters ({getActiveFilterCount()})
            </span>
            <button
              onClick={clearAllFilters}
              className="text-blue-600 text-sm font-medium hover:text-blue-800 underline"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.airlines.length > 0 && (
              <span className="tag-chip bg-blue-100 text-blue-800">
                Airlines: {filters.airlines.join(', ')}
              </span>
            )}
            {filters.stops !== 'all' && (
              <span className="tag-chip bg-green-100 text-green-800">
                {filters.stops}
              </span>
            )}
            {filters.refundable !== 'all' && (
              <span className="tag-chip bg-purple-100 text-purple-800">
                {filters.refundable}
              </span>
            )}
            <span className="tag-chip bg-gray-100 text-gray-800">
              ₹{filters.priceRange.min} - ₹{filters.priceRange.max}
            </span>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
        {/* Price Range */}
        <FilterSection title="Price Range" icon={DollarSign} sectionKey="price">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Min</label>
              <input
                type="number"
                value={filters.priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="filter-input"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Max</label>
              <input
                type="number"
                value={filters.priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Available range: ₹{priceRange.min} - ₹{priceRange.max}
          </p>
        </FilterSection>

        {/* Airlines */}
        <FilterSection title="Airlines" icon={Plane} sectionKey="airlines">
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {availableAirlines.map((airline) => (
              <label
                key={airline}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineToggle(airline)}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-gray-700">{airline}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Stops */}
        <FilterSection title="Stops" icon={MapPin} sectionKey="stops">
          {[
            { value: 'all', label: 'All Flights' },
            { value: 'direct', label: 'Direct' },
            { value: '1-stop', label: '1 Stop' },
            { value: '2-stops', label: '2+ Stops' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer text-sm"
            >
              <input
                type="radio"
                name="stops"
                value={option.value}
                checked={filters.stops === option.value}
                onChange={(e) => handleFilterChange('stops', e.target.value)}
                className="accent-blue-600 w-4 h-4"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </FilterSection>

        {/* Refundable */}
        <FilterSection
          title="Refund Policy"
          icon={RefreshCw}
          sectionKey="refundable"
        >
          {[
            { value: 'all', label: 'All Flights' },
            { value: 'refundable', label: 'Refundable' },
            { value: 'non-refundable', label: 'Non-refundable' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer text-sm"
            >
              <input
                type="radio"
                name="refundable"
                value={option.value}
                checked={filters.refundable === option.value}
                onChange={(e) => handleFilterChange('refundable', e.target.value)}
                className="accent-blue-600 w-4 h-4"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </FilterSection>

        {/* Sort */}
        <FilterSection title="Sort By" icon={ArrowUpDown} sectionKey="sort">
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-input"
              >
                <option value="price">Price</option>
                <option value="duration">Duration</option>
                <option value="departure">Departure Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="filter-input"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </FilterSection>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 p-3">
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 bg-[var(--PrimaryColor)] hover:bg-opacity-90 text-white font-semibold py-2 rounded-lg transition-transform hover:scale-[1.02]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Internal Scoped Styling */}
      <style jsx>{`
        .filter-input {
          width: 100%;
          padding: 0.6rem 0.75rem;
          font-size: 0.9rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          outline: none;
          transition: all 0.2s ease;
        }
        .filter-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        .tag-chip {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default FilterSidebar;
