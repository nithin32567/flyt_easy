import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, SortAsc, Grid, List } from 'lucide-react';
import { Pagination, PaginationItem } from '@mui/material';
import HotelCard from '../../components/hotel/HotelCard';
import FilterSidebar from '../../components/hotel/FilterSidebar';
import useHeaderHeight from '../../hooks/useHeaderHeight';
import axios from 'axios';

const HotelResults = () => {
  const headerHeight = useHeaderHeight();
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);
  const [searchId, setSearchId] = useState(null);
  const [allHotels, setAllHotels] = useState([]);
  const [searchParams, setSearchParams] = useState({
    location: 'The Pod Cochin Homestay',
    checkIn: '2024-01-15',
    checkOut: '2024-01-17',
    guests: 2,
    rooms: 1
  });

  const fetchHotelPage = async (page, limit = 20) => {
    if (!searchId) {
      // Fallback to client-side pagination if no searchId
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      setFilteredHotels(allHotels.slice(startIndex, endIndex));
      setCurrentPage(page);
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/hotel/page`, {
        params: { searchId, page, limit },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { content, pagination } = response.data;
      
      if (content?.hotels) {
        setFilteredHotels(content.hotels);
        setTotalPages(pagination.totalPages);
        setTotalHotels(pagination.total);
        
        // Store all hotels in localStorage for client-side pagination
        const existingHotels = JSON.parse(localStorage.getItem('allHotels') || '[]');
        const newHotels = content.hotels.filter(hotel => 
          !existingHotels.some(existing => existing.id === hotel.id)
        );
        const updatedHotels = [...existingHotels, ...newHotels];
        localStorage.setItem('allHotels', JSON.stringify(updatedHotels));
        setAllHotels(updatedHotels);
      }
    } catch (error) {
      console.error('Error fetching hotel page:', error);
      // Fallback to client-side pagination on error
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      setFilteredHotels(allHotels.slice(startIndex, endIndex));
    } finally {
      setLoading(false);
    }
  };

  // Function to handle pagination change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchHotelPage(page);
  };

  useEffect(() => {
    // Load search results from localStorage
    setLoading(true);
    
    try {
      const storedResults = localStorage.getItem('hotelSearchResults');
      const storedSearchData = localStorage.getItem('hotelSearchData');
      const storedAllHotels = localStorage.getItem('allHotels');
      
      if (storedResults) {
        const results = JSON.parse(storedResults);
        setSearchResults(results);
        setFilters(results.filterData?.filters || []);
        setSearchId(results.searchId);
        
        // Set pagination info
        if (results.pagination) {
          setTotalPages(results.pagination.totalPages);
          setTotalHotels(results.pagination.total);
        }
        
        // Load hotels from localStorage if available
        if (storedAllHotels) {
          const allHotelsData = JSON.parse(storedAllHotels);
          setAllHotels(allHotelsData);
          setFilteredHotels(allHotelsData.slice(0, 20)); // Show first 20 hotels
          // Set client-side pagination
          setTotalPages(Math.ceil(allHotelsData.length / 20));
          setTotalHotels(allHotelsData.length);
        } else {
          const hotels = results.content?.hotels || [];
          setFilteredHotels(hotels);
          setAllHotels(hotels);
          setTotalPages(Math.ceil(hotels.length / 20));
          setTotalHotels(hotels.length);
        }
        
        // Update search params from stored data
        if (storedSearchData) {
          const searchData = JSON.parse(storedSearchData);
          setSearchParams({
            location: searchData.location || 'Unknown Location',
            checkIn: searchData.checkIn || 'N/A',
            checkOut: searchData.checkOut || 'N/A',
            guests: searchData.guests || 1,
            rooms: searchData.rooms || 1
          });
        }
      } else {
        // Fallback to mock data if no stored results
        console.log('No stored results found, using mock data');
        setSearchResults(mockSearchResults);
        setFilters(mockSearchResults.filterData?.filters || []);
        const hotels = mockSearchResults.content?.hotels || [];
        setFilteredHotels(hotels);
        setAllHotels(hotels);
        setTotalPages(Math.ceil(hotels.length / 20));
        setTotalHotels(hotels.length);
      }
    } catch (error) {
      console.error('Error loading search results:', error);
      // Fallback to mock data on error
      setSearchResults(mockSearchResults);
      setFilters(mockSearchResults.filterData?.filters || []);
      const hotels = mockSearchResults.content?.hotels || [];
      setFilteredHotels(hotels);
      setAllHotels(hotels);
      setTotalPages(Math.ceil(hotels.length / 20));
      setTotalHotels(hotels.length);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (newFilters) => {
    console.log('Filter changed:', newFilters);
    
    // Use allHotels if available, otherwise fallback to searchResults
    const hotelsToFilter = allHotels.length > 0 ? allHotels : (searchResults?.content?.hotels || []);
    
    if (hotelsToFilter.length === 0) return;
    
    let filtered = [...hotelsToFilter];
    
    // Apply filters
    Object.entries(newFilters).forEach(([category, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return;
      
      switch (category) {
        case 'HotelName':
          if (value) {
            filtered = filtered.filter(hotel => 
              hotel.name.toLowerCase().includes(value.toLowerCase())
            );
          }
          break;
          
        case 'PriceGroup':
          if (value && value.min !== undefined && value.max !== undefined) {
            filtered = filtered.filter(hotel => {
              if (!hotel.rate) return false;
              const price = hotel.rate.total;
              return price >= value.min && (value.max === -1 || price <= value.max);
            });
          }
          break;
          
        case 'StarRating':
          if (Array.isArray(value) && value.length > 0) {
            filtered = filtered.filter(hotel => 
              value.includes(hotel.starRating.toString())
            );
          }
          break;
          
        case 'Distance':
          if (value && value.min !== undefined && value.max !== undefined) {
            filtered = filtered.filter(hotel => 
              hotel.distance >= value.min && hotel.distance <= value.max
            );
          }
          break;
          
        case 'Facilities':
          if (Array.isArray(value) && value.length > 0) {
            filtered = filtered.filter(hotel => 
              value.some(facilityId => 
                hotel.facilities.some(facility => 
                  facility.id.toString() === facilityId
                )
              )
            );
          }
          break;
          
        case 'HotelChain':
          if (Array.isArray(value) && value.length > 0) {
            filtered = filtered.filter(hotel => 
              value.includes(hotel.chainName || 'Independent')
            );
          }
          break;
          
        case 'PropertyType':
          if (Array.isArray(value) && value.length > 0) {
            filtered = filtered.filter(hotel => 
              value.includes(hotel.propertyType?.toLowerCase() || 'hotel')
            );
          }
          break;
      }
    });
    
    setFilteredHotels(filtered);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    // Implement sorting logic here
  };

  const handleHotelSelect = (hotelId) => {
    console.log('Hotel selected:', hotelId);
    // Navigate to hotel details page
    window.location.href = `/hotel-details/${hotelId}`;
  };

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'distance', label: 'Distance' }
  ];

  return (
    <div 
      className="min-h-screen bg-[#f0f0f0] content-with-header"
      style={{ paddingTop: `${headerHeight + 20}px` }}
    >
      {/* Header */}
      <div className=" border-b ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center ">
              <h1 className="text-xl  font-semibold text-gray-900">
                Hotels in {searchParams.location}
              </h1>
              <div className="ml-4 text-sm text-gray-500">
                {searchParams.checkIn} - {searchParams.checkOut} • {searchParams.guests} guests
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <MapPin className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden`}>
            <FilterSidebar
              filters={filters}
              loading={loading}
              onFilterChange={handleFilterChange}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {totalHotels > 0 ? totalHotels : filteredHotels.length} hotels found
                  </h2>
                  <p className="text-gray-600">
                    Showing results for {searchParams.location}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Sort and View Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {/* Hotel Results */}
            {!loading && (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch' 
                  : 'space-y-4'
              }`}>
                {filteredHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onSelect={handleHotelSelect}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hotels found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredHotels.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-8 bg-white p-6 rounded-lg shadow-sm">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-600">Loading page...</span>
                  </div>
                ) : (
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    renderItem={(item) => (
                      <PaginationItem
                        {...item}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#2563eb',
                            },
                          },
                          '&:hover': {
                            backgroundColor: '#f3f4f6',
                          },
                          '&.MuiPaginationItem-root': {
                            margin: '0 4px',
                            borderRadius: '8px',
                            fontWeight: '500',
                          },
                        }}
                      />
                    )}
                  />
                )}
              </div>
            )}

            {/* Pagination Info */}
            {!loading && filteredHotels.length > 0 && (
              <div className="text-center mt-4 text-sm text-gray-600">
                Showing {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, totalHotels)} of {totalHotels} hotels
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelResults;