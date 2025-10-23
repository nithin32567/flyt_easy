import React, { useState, useEffect } from 'react';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Star,
  MapPin,
  RefreshCw,
  ArrowUpDown,
  RotateCcw,
  Search,
  Hotel,
  Users,
  Clock,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Mountain,
  Plane,
  Calendar,
  CheckCircle
} from 'lucide-react';

const FilterSidebar = ({ 
  filters = [], 
  loading = false, 
  onFilterChange,
  isOpen = true,
  onToggle
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rating: true,
    location: true,
    amenities: true,
    sort: true,
  });

  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchTexts, setSearchTexts] = useState({});

  // Handlers
  const handleFilterChange = (category, value, type) => {
    console.log('=== FILTERSIDEBAR: HANDLE FILTER CHANGE ===');
    console.log('Category:', category);
    console.log('Value:', value);
    console.log('Type:', type);
    console.log('Current selectedFilters:', selectedFilters);
    
    const newFilters = { ...selectedFilters };
    
    if (type === 'list') {
      if (!newFilters[category]) {
        newFilters[category] = [];
      }
      
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(v => v !== value);
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
    } else if (type === 'range') {
      console.log('=== FILTERSIDEBAR: RANGE FILTER UPDATE ===');
      console.log('Setting range filter for category:', category);
      console.log('Range value:', value);
      newFilters[category] = value;
    } else if (type === 'text') {
      newFilters[category] = value;
    }
    
    console.log('=== FILTERSIDEBAR: NEW FILTERS ===');
    console.log('Updated filters:', newFilters);
    
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleTextSearch = (category, value) => {
    setSearchTexts(prev => ({ ...prev, [category]: value }));
    handleFilterChange(category, value, 'text');
  };

  const toggleSection = (key) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSearchTexts({});
    onFilterChange?.({});
  };

  const getFilterIcon = (filterName) => {
    const name = filterName.toLowerCase();
    
    if (name.includes('price') || name.includes('cost')) return <DollarSign className="w-5 h-5 text-gray-600" />;
    if (name.includes('rating') || name.includes('star')) return <Star className="w-5 h-5 text-gray-600" />;
    if (name.includes('location') || name.includes('area')) return <MapPin className="w-5 h-5 text-gray-600" />;
    if (name.includes('amenities') || name.includes('facilities')) return <Wifi className="w-5 h-5 text-gray-600" />;
    if (name.includes('room') || name.includes('bed')) return <Hotel className="w-5 h-5 text-gray-600" />;
    if (name.includes('guest') || name.includes('people')) return <Users className="w-5 h-5 text-gray-600" />;
    if (name.includes('time') || name.includes('duration')) return <Clock className="w-5 h-5 text-gray-600" />;
    if (name.includes('date') || name.includes('check')) return <Calendar className="w-5 h-5 text-gray-600" />;
    
    return <Filter className="w-5 h-5 text-gray-600" />;
  };

  const renderFilterOptions = (filter) => {
    if (!filter.options || filter.options.length === 0) {
      return (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">No options available</p>
        </div>
      );
    }

    switch (filter.type) {
      case 'range':
        return (
          <div className="space-y-2">
            {filter.options.map((option, index) => {
              // Check if this option is selected
              const isSelected = selectedFilters[filter.category]?.label === option.label;
              
              return (
                <label
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      console.log('=== FRONTEND: RANGE FILTER SELECTED (CHECKBOX) ===');
                      console.log('Selected option:', option);
                      console.log('Min:', option.min, 'Max:', option.max);
                      
                      if (isSelected) {
                        // If already selected, deselect it
                        handleFilterChange(filter.category, null, 'range');
                      } else {
                        // If not selected, select it
                        const rangeValue = {
                          min: option.min,
                          max: option.max,
                          label: option.label
                        };
                        handleFilterChange(filter.category, rangeValue, 'range');
                      }
                    }}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span className="text-gray-700">{option.label}</span>
                  <span className="ml-auto text-xs text-gray-500">({option.count})</span>
                </label>
              );
            })}
          </div>
        );

      case 'list':
        return (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {filter.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters[filter.category]?.includes(option.value || option.label) || false}
                  onChange={() => handleFilterChange(filter.category, option.value || option.label, 'list')}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-gray-700">{option.label}</span>
                <span className="ml-auto text-xs text-gray-500">({option.count})</span>
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${filter.name.toLowerCase()}...`}
                value={searchTexts[filter.category] || ''}
                onChange={(e) => handleTextSearch(filter.category, e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">Filter type not supported</p>
          </div>
        );
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.values(selectedFilters).forEach(filter => {
      if (Array.isArray(filter)) {
        if (filter.length > 0) count++;
      } else if (filter && filter !== '') {
        count++;
      }
    });
    return count;
  };

  const getTotalFilteredCount = () => {
    // This would be calculated based on current filtered results
    return 0;
  };

  const getTotalCount = () => {
    // This would be the total number of hotels
    return 0;
  };

  // Local Section Component
  const FilterSection = ({ title, icon: Icon, sectionKey, children }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-3 px-3 hover:bg-gray-50 rounded-lg transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--PrimaryColor)] text-[15px]">{title}</span>
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
            Available Hotels ({getTotalFilteredCount()} / {getTotalCount()})
          </h6>
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
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
            {Object.entries(selectedFilters).map(([category, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                return (
                  <span key={category} className="tag-chip bg-blue-100 text-blue-800">
                    {category}: {value.join(', ')}
                  </span>
                );
              } else if (value && value !== '') {
                // Handle object values (like range filters)
                const displayValue = typeof value === 'object' 
                  ? (value.label || `${value.min || 0} - ${value.max || '∞'}`)
                  : value;
                return (
                  <span key={category} className="tag-chip bg-green-100 text-green-800">
                    {category}: {displayValue}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading filters...</span>
          </div>
        ) : !filters || filters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No filters available</h3>
            <p className="text-gray-500 text-sm">Try searching for hotels first</p>
          </div>
        ) : (
          filters.map((filter, index) => (
            <FilterSection
              key={filter.category || index}
              title={filter.name}
              icon={getFilterIcon(filter.name)}
              sectionKey={filter.category}
            >
              {renderFilterOptions(filter)}
            </FilterSection>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 p-3">
        <button
          onClick={clearAllFilters}
          className="w-full flex items-center justify-center gap-2 bg-[var(--PrimaryColor)] hover:bg-opacity-90 text-white font-semibold py-2 rounded-lg transition-transform hover:scale-[1.02]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Internal Scoped Styling */}
      <style>{`
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
