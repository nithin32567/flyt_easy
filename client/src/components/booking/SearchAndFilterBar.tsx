import React, { useState } from 'react';
import { Search, Filter, Calendar, User, MapPin } from 'lucide-react';

interface SearchAndFilterBarProps {
  onSearch: (query: string) => void;
  onFilter: (filter: string) => void;
  totalBookings: number;
  statusCounts?: {
    current: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  initialFilter?: string;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({ 
  onSearch, 
  onFilter, 
  totalBookings, 
  statusCounts = { current: 0, completed: 0, cancelled: 0, pending: 0 },
  initialFilter = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    onFilter(filter);
  };

  const filterOptions = [
    { value: 'all', label: 'All Bookings', count: totalBookings },
    { value: 'current', label: 'Current', count: statusCounts.current },
    { value: 'completed', label: 'Completed', count: statusCounts.completed },
    { value: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
    { value: 'pending', label: 'Pending', count: statusCounts.pending }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
          <p className="text-gray-600">{totalBookings} booking{totalBookings !== 1 ? 's' : ''} found</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by route, passenger, or booking ID..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filterOptions.slice(1).map((option) => (
          <button
            key={option.value}
            onClick={() => handleFilterChange(option.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedFilter === option.value
                ? 'bg-[var(--PrimaryColor)] text-white'
                : 'bg-[var(--LightBg)] text-[var(--PrimaryColor)] hover:bg-[var(--LightBg)]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilterBar;
