import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MapPin, Star, SortAsc, Grid, List, Menu, X } from 'lucide-react';
import { Pagination, PaginationItem } from '@mui/material';
import HotelCard from '../../components/hotel/HotelCard';
import FilterSidebar from '../../components/hotel/FilterSidebar';
import useHeaderHeight from '../../hooks/useHeaderHeight';
import axios from 'axios';

// Mock data for fallback
const mockSearchResults = {
  content: {
    hotels: [
      {
        id: "1",
        name: "Hotel Mumbai Central",
        starRating: 4,
        rate: { total: 2500, baseRate: 2500, currency: "INR", ratePerNight: 2500 },
        address: "Mumbai Central, Mumbai",
        distance: 2.5,
        heroImage: null,
        facilities: [
          { id: 1, groupId: 1, name: "WiFi" },
          { id: 2, groupId: 2, name: "Pool" },
          { id: 3, groupId: 3, name: "Restaurant" }
        ],
        userReview: { provider: "Booking.com", count: 150, rating: 4.2 },
        isRecommended: true,
        freeBreakfast: true,
        freeCancellation: true,
        payAtHotel: false
      },
      {
        id: "2",
        name: "Budget Hotel Mumbai",
        starRating: 2,
        rate: { total: 800, baseRate: 800, currency: "INR", ratePerNight: 800 },
        address: "Mumbai, Maharashtra",
        distance: 5.0,
        heroImage: null,
        facilities: [
          { id: 1, groupId: 1, name: "WiFi" }
        ],
        userReview: { provider: "Booking.com", count: 50, rating: 3.5 },
        isRecommended: false,
        freeBreakfast: false,
        freeCancellation: true,
        payAtHotel: true
      },
      {
        id: "3",
        name: "Luxury Hotel Mumbai",
        starRating: 5,
        rate: { total: 8000, baseRate: 8000, currency: "INR", ratePerNight: 8000 },
        address: "Mumbai, Maharashtra",
        distance: 1.0,
        heroImage: null,
        facilities: [
          { id: 1, groupId: 1, name: "WiFi" },
          { id: 2, groupId: 2, name: "Pool" },
          { id: 3, groupId: 3, name: "Spa" },
          { id: 4, groupId: 4, name: "Restaurant" }
        ],
        userReview: { provider: "Booking.com", count: 300, rating: 4.8 },
        isRecommended: true,
        freeBreakfast: true,
        freeCancellation: true,
        payAtHotel: false
      },
      {
        id: "4",
        name: "Mid-range Hotel Mumbai",
        starRating: 3,
        rate: { total: 1500, baseRate: 1500, currency: "INR", ratePerNight: 1500 },
        address: "Mumbai, Maharashtra",
        distance: 3.5,
        heroImage: null,
        facilities: [
          { id: 1, groupId: 1, name: "WiFi" },
          { id: 2, groupId: 2, name: "Restaurant" }
        ],
        userReview: { provider: "Booking.com", count: 100, rating: 4.0 },
        isRecommended: false,
        freeBreakfast: true,
        freeCancellation: true,
        payAtHotel: false
      }
    ]
  },
  filterData: {
    filters: [
      {
        category: "PriceGroup",
        type: "range",
        name: "Price Range",
        label: "Price Range",
        options: [
          { label: "Under ₹1000", min: 0, max: 1000, count: 1 },
          { label: "₹1000 - ₹2000", min: 1000, max: 2000, count: 2 },
          { label: "₹2000 - ₹5000", min: 2000, max: 5000, count: 1 },
          { label: "₹5000+", min: 5000, max: -1, count: 1 }
        ]
      },
      {
        category: "StarRating",
        type: "list",
        name: "Star Rating",
        label: "Star Rating",
        options: [
          { label: "2 Star", value: "2", count: 1 },
          { label: "3 Star", value: "3", count: 1 },
          { label: "4 Star", value: "4", count: 1 },
          { label: "5 Star", value: "5", count: 1 }
        ]
      }
    ]
  },
  pagination: {
    totalPages: 1,
    total: 4
  }
};

const HotelResults = () => {
  const headerHeight = useHeaderHeight();
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);
  const [searchId, setSearchId] = useState(null);
  const [allHotels, setAllHotels] = useState([]);
  const [forceRender, setForceRender] = useState(0);
  const [searchParams, setSearchParams] = useState({
    location: 'The Pod Cochin Homestay',
    checkIn: '2024-01-15',
    checkOut: '2024-01-17',
    guests: 2,
    rooms: 1
  });
  const initialLoadTriggered = useRef(false);
  const fetchTimeoutRef = useRef(null);

  // Mobile detection and header height calculation
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    const calculateHeaderHeight = () => {
      const headerDiv = document.querySelector('.header-wrapper-div');
      if (headerDiv) {
        const height = headerDiv.offsetHeight;
        // console.log('=== HOTEL RESULTS: HEADER HEIGHT CALCULATION ===');
        // console.log('Header height:', height);
        document.documentElement.style.setProperty('--header-height', `${height}px`);
        window.dispatchEvent(new CustomEvent('headerHeightChanged', { 
          detail: { height } 
        }));
      } else {
        // Fallback heights based on screen size
        const width = window.innerWidth;
        if (width < 540) {
          document.documentElement.style.setProperty('--header-height', '80px');
        } else if (width < 768) {
          document.documentElement.style.setProperty('--header-height', '90px');
        } else {
          document.documentElement.style.setProperty('--header-height', '128px');
        }
      }
    };

    checkMobile();
    calculateHeaderHeight();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', calculateHeaderHeight);
    window.addEventListener('scroll', calculateHeaderHeight);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', calculateHeaderHeight);
      window.removeEventListener('scroll', calculateHeaderHeight);
    };
  }, []);

  // Standardized API response handler
  const handleApiResponse = (response) => {
    // console.log('=== FRONTEND: HANDLING API RESPONSE ===');
    // console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    const responseData = response.data;
    
    // Handle different response structures
    if (responseData.hotels?.content?.hotels) {
      // console.log('=== FRONTEND: HOTELS.CONTENT.HOTELS FORMAT ===');
      return {
        hotels: responseData.hotels.content.hotels,
        total: responseData.hotels.pagination?.total || responseData.hotels.content.hotels.length,
        totalPages: Math.ceil((responseData.hotels.pagination?.total || responseData.hotels.content.hotels.length) / 50)
      };
    } else if (Array.isArray(responseData.hotels)) {
      // console.log('=== FRONTEND: HOTELS ARRAY FORMAT ===');
      return {
        hotels: responseData.hotels,
        total: responseData.hotels.length,
        totalPages: Math.ceil(responseData.hotels.length / 50)
      };
    } else if (responseData.content?.hotels) {
      // console.log('=== FRONTEND: CONTENT.HOTELS FORMAT ===');
      return {
        hotels: responseData.content.hotels,
        total: responseData.content.total || responseData.content.hotels.length,
        totalPages: Math.ceil((responseData.content.total || responseData.content.hotels.length) / 50)
      };
    } else if (responseData.data?.content?.hotels) {
      // console.log('=== FRONTEND: DATA.CONTENT.HOTELS FORMAT ===');
      return {
        hotels: responseData.data.content.hotels,
        total: responseData.data.pagination?.total || responseData.data.content.hotels.length,
        totalPages: Math.ceil((responseData.data.pagination?.total || responseData.data.content.hotels.length) / 50)
      };
    } else if (Array.isArray(responseData)) {
      // console.log('=== FRONTEND: DIRECT ARRAY FORMAT ===');
      return {
        hotels: responseData,
        total: responseData.length,
        totalPages: Math.ceil(responseData.length / 50)
      };
    } else if (responseData.hotels && Array.isArray(responseData.hotels)) {
      // console.log('=== FRONTEND: HOTELS PROPERTY ARRAY FORMAT ===');
      return {
        hotels: responseData.hotels,
        total: responseData.total || responseData.hotels.length,
        totalPages: Math.ceil((responseData.total || responseData.hotels.length) / 50)
      };
    } else if (responseData.data && Array.isArray(responseData.data)) {
      // console.log('=== FRONTEND: DATA ARRAY FORMAT ===');
      return {
        hotels: responseData.data,
        total: responseData.data.length,
        totalPages: Math.ceil(responseData.data.length / 50)
      };
    } else if (responseData.hotels && responseData.hotels.hotels && Array.isArray(responseData.hotels.hotels)) {
      // console.log('=== FRONTEND: HOTELS.HOTELS ARRAY FORMAT ===');
      return {
        hotels: responseData.hotels.hotels,
        total: responseData.hotels.total || responseData.hotels.hotels.length,
        totalPages: Math.ceil((responseData.hotels.total || responseData.hotels.hotels.length) / 50)
      };
    } else if (responseData.status === 'success' && Array.isArray(responseData.hotels)) {
      // console.log('=== FRONTEND: POSTMAN COLLECTION FORMAT ===');
      return {
        hotels: responseData.hotels,
        total: responseData.total || responseData.hotels.length,
        totalPages: Math.ceil((responseData.total || responseData.hotels.length) / 50)
      };
    }
    
    // console.log('=== FRONTEND: NO HOTELS FOUND IN RESPONSE ===');
    // console.log('Response structure:', Object.keys(responseData));
    // console.log('Available keys:', Object.keys(responseData));
    // console.log('Response data type:', typeof responseData);
    return { hotels: [], total: 0, totalPages: 1 };
  };

  const fetchHotelPage = async (page, limit = 50) => {
    // Prevent multiple simultaneous calls
    if (loading) {
      // console.log('=== FRONTEND: ALREADY LOADING, SKIPPING REQUEST ===');
      return;
    }

    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Debounce the API call
    fetchTimeoutRef.current = setTimeout(async () => {
      if (!searchId) {
        // console.log('=== FRONTEND: NO SEARCH ID, SKIPPING REQUEST ===');
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const searchTracingKey = localStorage.getItem('searchTracingKey');

        console.log('=== HOTEL PAGE API CALL ===');
        console.log('Hotel Page Payload ===>');
        console.log(JSON.stringify({
          searchId: searchId,
          page: page,
          limit: limit,
          searchTracingKey: searchTracingKey
        }, null, 2));
        console.log('=== END HOTEL PAGE PAYLOAD ===');
        
        console.log('Hotel Page Headers ===>');
        console.log(JSON.stringify({
          Authorization: `Bearer ${token}`,
          'search-tracing-key': searchTracingKey || ''
        }, null, 2));
        console.log('=== END HOTEL PAGE HEADERS ===');

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/hotel/page`, {
          params: { searchId, page, limit },
          headers: {
            Authorization: `Bearer ${token}`,
            'search-tracing-key': searchTracingKey || ''
          }
        });

        console.log('=== HOTEL PAGE API RESPONSE ===');
        console.log('Hotel Page Response JSON ===>');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('=== END HOTEL PAGE RESPONSE ===');

        const { hotels, total, totalPages } = handleApiResponse(response);

        setFilteredHotels(hotels);
        setTotalPages(totalPages);
        setTotalHotels(total);
        setCurrentPage(page);

        // console.log('=== FRONTEND: HOTELS UPDATED ===');
        // console.log('Hotels count:', hotels.length);
        // console.log('Total hotels:', total);
        // console.log('Total pages:', totalPages);
      } catch (error) {
        // console.error('=== FRONTEND: HOTEL PAGE ERROR ===');
        // console.error('Error:', error.message);
        // if (error.response) {
        //   console.error('Response Status:', error.response.status);
        //   console.error('Response Data:', error.response.data);
        // }
        // Show error message to user
        setFilteredHotels([]);
        setTotalPages(1);
        setTotalHotels(0);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce
  };

  // Function to handle pagination change
  const handlePageChange = (event, page) => {
    // console.log('=== FRONTEND: PAGINATION CHANGE ===');
    // console.log('Changing to page:', page);
    // console.log('Current page:', currentPage);
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
          // console.log('=== FRONTEND: SETTING PAGINATION FROM RESULTS ===');
          // console.log('Total Pages:', results.pagination.totalPages);
          // console.log('Total Hotels:', results.pagination.total);
          setTotalPages(results.pagination.totalPages);
          setTotalHotels(results.pagination.total);
        }

        // Load hotels from localStorage if available (for initial display only)
        if (storedAllHotels) {
          const allHotelsData = JSON.parse(storedAllHotels);
          setAllHotels(allHotelsData);
          setFilteredHotels(allHotelsData.slice(0, 50)); // Show first 50 hotels
          // Use server-side pagination info if available
          if (results.pagination) {
            setTotalPages(results.pagination.totalPages);
            setTotalHotels(results.pagination.total);
          } else {
            setTotalPages(Math.ceil(allHotelsData.length / 50));
            setTotalHotels(allHotelsData.length);
          }
        } else {
          const hotels = results.content?.hotels || [];
          setFilteredHotels(hotels);
          setAllHotels(hotels);
          // Use server-side pagination info if available
          if (results.pagination) {
            setTotalPages(results.pagination.totalPages);
            setTotalHotels(results.pagination.total);
          } else {
            setTotalPages(Math.ceil(hotels.length / 50));
            setTotalHotels(hotels.length);
          }
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
        // console.log('No stored results found, using mock data');
        setSearchResults(mockSearchResults);
        setFilters(mockSearchResults.filterData?.filters || []);
        const hotels = mockSearchResults.content?.hotels || [];
        setFilteredHotels(hotels);
        setAllHotels(hotels);
        setTotalPages(Math.ceil(hotels.length / 50));
        setTotalHotels(hotels.length);
      }
    } catch (error) {
      // console.error('Error loading search results:', error);
      // Fallback to mock data on error
      setSearchResults(mockSearchResults);
      setFilters(mockSearchResults.filterData?.filters || []);
      const hotels = mockSearchResults.content?.hotels || [];
      setFilteredHotels(hotels);
      setAllHotels(hotels);
      setTotalPages(Math.ceil(hotels.length / 50));
      setTotalHotels(hotels.length);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch filter data when searchId is available
  useEffect(() => {
    const fetchFilterData = async () => {
      if (!searchId || filters.length > 0) return;
      
      setFilterLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const searchTracingKey = localStorage.getItem('searchTracingKey');

        console.log('=== HOTEL FILTER DATA API CALL ===');
        console.log('Hotel Filter Data Payload ===>');
        console.log(JSON.stringify({
          searchId: searchId,
          searchTracingKey: searchTracingKey
        }, null, 2));
        console.log('=== END HOTEL FILTER DATA PAYLOAD ===');
        
        console.log('Hotel Filter Data Headers ===>');
        console.log(JSON.stringify({
          Authorization: `Bearer ${token}`,
          'search-tracing-key': searchTracingKey || ''
        }, null, 2));
        console.log('=== END HOTEL FILTER DATA HEADERS ===');

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/hotel/filterdata/${searchId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'search-tracing-key': searchTracingKey || ''
            }
          }
        );

        console.log('=== HOTEL FILTER DATA API RESPONSE ===');
        console.log('Hotel Filter Data Response JSON ===>');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('=== END HOTEL FILTER DATA RESPONSE ===');

        // Handle the API response structure
        if (response.data.filterData?.filters) {
          setFilters(response.data.filterData.filters);
          // console.log('=== FRONTEND: FILTERS UPDATED ===');
          // console.log('Filter count:', response.data.filterData.filters.length);
        } else if (response.data.JSON?.filters) {
          setFilters(response.data.JSON.filters);
          // console.log('=== FRONTEND: FILTERS UPDATED (JSON FORMAT) ===');
          // console.log('Filter count:', response.data.JSON.filters.length);
        } else if (response.data.filters) {
          setFilters(response.data.filters);
          // console.log('=== FRONTEND: FILTERS UPDATED (FALLBACK) ===');
          // console.log('Filter count:', response.data.filters.length);
        } else {
          // console.warn('No filter data received from API');
          // console.log('Available response keys:', Object.keys(response.data));
        }
      } catch (error) {
        // console.error('=== FRONTEND: FILTER DATA ERROR ===');
        // console.error('Error:', error.message);
        // if (error.response) {
        //   console.error('Response Status:', error.response.status);
        //   console.error('Response Data:', error.response.data);
        // }
        setError('Failed to load filter options. Please try again.');
      } finally {
        setFilterLoading(false);
      }
    };

    fetchFilterData();
  }, [searchId]);

  // Monitor filtered hotels state changes
  useEffect(() => {
    // console.log('=== FRONTEND: FILTERED HOTELS STATE CHANGED ===');
    // console.log('Filtered hotels count:', filteredHotels.length);
    // console.log('Total hotels:', totalHotels);
    // console.log('Total pages:', totalPages);
    // console.log('Current page:', currentPage);
  }, [filteredHotels, totalHotels, totalPages, currentPage]);

  // Trigger initial page load if we have searchId but no hotels loaded yet
  useEffect(() => {
    if (searchId && filteredHotels.length === 0 && !loading && !initialLoadTriggered.current) {
      // console.log('=== FRONTEND: TRIGGERING INITIAL PAGE LOAD ===');
      // console.log('Search ID:', searchId);
      // console.log('Current filtered hotels:', filteredHotels.length);
      initialLoadTriggered.current = true;
      fetchHotelPage(1);
    }
  }, [searchId, filteredHotels.length, loading]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  const handleFilterChange = async (newFilters) => {
    // console.log('=== FRONTEND: FILTER CHANGE TRIGGERED ===');
    // console.log('New filters:', JSON.stringify(newFilters, null, 2));
    // console.log('Filter keys:', Object.keys(newFilters));
    // console.log('Filter values:', Object.values(newFilters));
    // console.log('Current filtered hotels count:', filteredHotels.length);
    // console.log('Current total hotels:', totalHotels);
    // console.log('Search ID available:', !!searchId);
    // console.log('All hotels count:', allHotels.length);
    // console.log('Search results available:', !!searchResults);

    // Check if filters are being cleared
    if (Object.keys(newFilters).length === 0) {
      // console.log('=== FRONTEND: FILTERS CLEARED - RESETTING TO ORIGINAL DATA ===');
      // Reset to original data when filters are cleared
      const originalHotels = searchResults?.content?.hotels || [];
      setFilteredHotels(originalHotels);
      setAllHotels(originalHotels);
      setTotalPages(Math.ceil(originalHotels.length / 50));
      setTotalHotels(originalHotels.length);
      setCurrentPage(1);
      setError(null); // Clear any errors
      return;
    }

    // Debug: Log filter structure for troubleshooting
    // console.log('=== FILTER DEBUG INFO ===');
    // console.log('Filter structure check:');
    // Object.entries(newFilters).forEach(([key, value]) => {
    //   console.log(`  ${key}:`, {
    //     type: typeof value,
    //     isArray: Array.isArray(value),
    //     length: Array.isArray(value) ? value.length : 'N/A',
    //     value: value
    //   });
    // });

    // Clean up empty filters before sending to API
    const cleanedFilters = {};
    Object.entries(newFilters).forEach(([key, value]) => {
      // console.log(`=== FILTER CLEANING: ${key} ===`);
      // console.log('Value:', value);
      // console.log('Value type:', typeof value);
      // console.log('Is array:', Array.isArray(value));
      // console.log('Is null/undefined:', value === null || value === undefined);
      
      // Skip empty arrays
      if (Array.isArray(value) && value.length === 0) {
        // console.log(`Skipping empty filter: ${key}`);
        return;
      }
      
      // Skip empty strings
      if (typeof value === 'string' && value.trim() === '') {
        // console.log(`Skipping empty string filter: ${key}`);
        return;
      }
      
      // Skip null/undefined values
      if (value === null || value === undefined) {
        // console.log(`Skipping null/undefined filter: ${key}`);
        return;
      }
      
      // Special handling for range filters (PriceGroup, Distance)
      if (key === 'PriceGroup' || key === 'Distance') {
        if (value && typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
          // console.log(`Including range filter: ${key} = ${JSON.stringify(value)}`);
          cleanedFilters[key] = value;
        } else {
          // console.log(`Skipping invalid range filter: ${key} (missing min/max)`);
        }
        return;
      }
      
      // Include valid filters
      cleanedFilters[key] = value;
      // console.log(`Including filter: ${key} = ${JSON.stringify(value)}`);
    });

    // console.log('=== CLEANED FILTERS ===');
    // console.log('Original filters:', JSON.stringify(newFilters, null, 2));
    // console.log('Cleaned filters:', JSON.stringify(cleanedFilters, null, 2));

    // If no valid filters, reset to show all hotels
    if (Object.keys(cleanedFilters).length === 0) {
      // console.log('=== NO VALID FILTERS - RESETTING TO ALL HOTELS ===');
      const originalHotels = searchResults?.content?.hotels || allHotels;
      setFilteredHotels(originalHotels);
      setAllHotels(originalHotels);
      setTotalPages(Math.ceil(originalHotels.length / 50));
      setTotalHotels(originalHotels.length);
      setCurrentPage(1);
      setError(null);
      return;
    }

    if (!searchId) {
      // console.log('No searchId available, using client-side filtering');
      // Fallback to client-side filtering if no searchId
      const hotelsToFilter = allHotels.length > 0 ? allHotels : (searchResults?.content?.hotels || []);

      if (hotelsToFilter.length === 0) return;

      let filtered = [...hotelsToFilter];

      // Apply filters
      Object.entries(cleanedFilters).forEach(([category, value]) => {
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
              // console.log('=== FRONTEND: APPLYING PRICE FILTER ===');
              // console.log('Price range:', { min: value.min, max: value.max, label: value.label });
              // console.log('Hotels before price filter:', filtered.length);
              
              filtered = filtered.filter(hotel => {
                if (!hotel.rate || hotel.rate.total === undefined || hotel.rate.total === null) {
                  // console.log('Hotel has no valid rate:', hotel.name, 'Rate object:', hotel.rate);
                  return false;
                }
                const price = parseFloat(hotel.rate.total);
                if (isNaN(price)) {
                  // console.log('Hotel has invalid price:', hotel.name, 'Price:', hotel.rate.total);
                  return false;
                }
                // Handle "& More" case where max is -1
                const matches = price >= value.min && (value.max === -1 || value.max === undefined || price <= value.max);
                if (matches) {
                  // console.log(`Hotel ${hotel.name} matches price filter: ₹${price} (range: ₹${value.min}-${value.max === -1 ? '∞' : value.max})`);
                } else {
                  // console.log(`Hotel ${hotel.name} does not match price filter: ₹${price} (range: ₹${value.min}-${value.max === -1 ? '∞' : value.max})`);
                }
                return matches;
              });
              
              // console.log('Hotels after price filter:', filtered.length);
            }
            break;

          case 'StarRating':
            if (Array.isArray(value) && value.length > 0) {
              filtered = filtered.filter(hotel => {
                const hotelRating = hotel.starRating?.toString() || '0';
                return value.includes(hotelRating);
              });
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
              // console.log('=== FRONTEND: APPLYING FACILITIES FILTER ===');
              // console.log('Facilities to filter:', value);
              // console.log('Hotels before facilities filter:', filtered.length);
              
              filtered = filtered.filter(hotel => {
                if (!hotel.facilities || !Array.isArray(hotel.facilities)) {
                  // console.log('Hotel has no facilities:', hotel.name);
                  return false;
                }
                
                const hasFacility = value.some(facilityId => {
                  const found = hotel.facilities.some(facility => 
                    facility.id.toString() === facilityId.toString()
                  );
                  if (found) {
                    // console.log(`Hotel ${hotel.name} has facility ${facilityId}`);
                  }
                  return found;
                });
                
                return hasFacility;
              });
              
              // console.log('Hotels after facilities filter:', filtered.length);
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

          case 'Locations':
            if (Array.isArray(value) && value.length > 0) {
              filtered = filtered.filter(hotel =>
                value.some(locationId =>
                  hotel.locationId === locationId || hotel.locationIds?.includes(locationId)
                )
              );
            }
            break;

          case 'Attraction':
            if (Array.isArray(value) && value.length > 0) {
              filtered = filtered.filter(hotel =>
                value.some(attractionId =>
                  hotel.attractionIds?.includes(attractionId) || 
                  hotel.nearbyAttractions?.some(attr => attr.id === attractionId)
                )
              );
            }
            break;
        }
      });

      setFilteredHotels(filtered);
      return;
    }

    // Use server-side filtering with the new API
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const searchTracingKey = localStorage.getItem('searchTracingKey');

      console.log('=== HOTEL FILTER API CALL ===');
      console.log('Hotel Filter Payload ===>');
      console.log(JSON.stringify({
        searchId: searchId,
        filters: cleanedFilters,
        searchTracingKey: searchTracingKey
      }, null, 2));
      console.log('=== END HOTEL FILTER PAYLOAD ===');
      
      console.log('Hotel Filter Headers ===>');
      console.log(JSON.stringify({
        Authorization: `Bearer ${token}`,
        'search-tracing-key': searchTracingKey || '',
        'Content-Type': 'application/json'
      }, null, 2));
      console.log('=== END HOTEL FILTER HEADERS ===');
      
      // Special logging for pricing filters
      if (cleanedFilters.PriceGroup) {
        // console.log('=== PRICING FILTER DETAILS ===');
        // console.log('PriceGroup filter:', cleanedFilters.PriceGroup);
        // console.log('Min price:', cleanedFilters.PriceGroup.min);
        // console.log('Max price:', cleanedFilters.PriceGroup.max);
        // console.log('Label:', cleanedFilters.PriceGroup.label);
      }

      // Special logging for facilities filters
      if (cleanedFilters.Facilities) {
        // console.log('=== FACILITIES FILTER DETAILS ===');
        // console.log('Facilities filter:', cleanedFilters.Facilities);
        // console.log('Facilities type:', typeof cleanedFilters.Facilities);
        // console.log('Facilities is array:', Array.isArray(cleanedFilters.Facilities));
        // console.log('Facilities length:', cleanedFilters.Facilities.length);
        // console.log('Facilities values:', cleanedFilters.Facilities);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/hotel/filter/${searchId}`,
        cleanedFilters,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'search-tracing-key': searchTracingKey || '',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('=== HOTEL FILTER API RESPONSE ===');
      console.log('Hotel Filter Response JSON ===>');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('=== END HOTEL FILTER RESPONSE ===');

      // Debug the response structure (based on Postman collection)
      // console.log('=== RESPONSE STRUCTURE DEBUG ===');
      // console.log('Response data keys:', Object.keys(response.data));
      // console.log('Response status:', response.data.status);
      
      // Check for different response structures based on Postman collection
      if (response.data.hotels) {
        // console.log('Hotels in response:', response.data.hotels);
        // console.log('Hotels type:', typeof response.data.hotels);
        // console.log('Hotels is array:', Array.isArray(response.data.hotels));
        // if (Array.isArray(response.data.hotels)) {
        //   console.log('Hotels length:', response.data.hotels.length);
        // }
      }
      if (response.data.data) {
        // console.log('Data in response:', response.data.data);
        // console.log('Data type:', typeof response.data.data);
        // console.log('Data is array:', Array.isArray(response.data.data));
        // if (Array.isArray(response.data.data)) {
        //   console.log('Data length:', response.data.data.length);
        // }
      }
      
      // Check for Postman collection response format
      if (response.data.status === 'success' && response.data.hotels) {
        // console.log('=== POSTMAN FORMAT DETECTED ===');
        // console.log('Status:', response.data.status);
        // console.log('Hotels count:', response.data.hotels.length);
      }

      const { hotels, total, totalPages } = handleApiResponse(response);

      // console.log('=== FRONTEND: FILTER API SUCCESS ===');
      // console.log('Hotels received:', hotels.length);
      // console.log('Total hotels:', total);
      // console.log('Total pages:', totalPages);

      // Check if we got 0 results but should have results
      if (hotels.length === 0 && total === 0) {
        // console.log('=== FRONTEND: ZERO RESULTS FROM API ===');
        // console.log('This might indicate an issue with the filter API or external service');
        // console.log('Applied filters:', JSON.stringify(newFilters, null, 2));
        
        // Try client-side filtering as fallback
        // console.log('Attempting client-side filtering as fallback...');
        
        // Use the hotels from the API response if available, otherwise fall back to stored data
        let hotelsToFilter = [];
        
        // First, try to get hotels from the API response
        if (response.data.hotels?.hotels && Array.isArray(response.data.hotels.hotels)) {
          hotelsToFilter = response.data.hotels.hotels;
          // console.log('Using hotels from API response:', hotelsToFilter.length);
        } else if (response.data.hotels && Array.isArray(response.data.hotels)) {
          hotelsToFilter = response.data.hotels;
          // console.log('Using hotels from API response (direct array):', hotelsToFilter.length);
        } else if (allHotels.length > 0) {
          hotelsToFilter = allHotels;
          // console.log('Using stored allHotels:', hotelsToFilter.length);
        } else if (searchResults?.content?.hotels) {
          hotelsToFilter = searchResults.content.hotels;
          // console.log('Using searchResults hotels:', hotelsToFilter.length);
        } else {
          // console.log('No hotels available for client-side filtering');
          setFilteredHotels([]);
          setTotalPages(1);
          setTotalHotels(0);
          setAllHotels([]);
          return;
        }
        
        if (hotelsToFilter.length > 0) {
          let filtered = [...hotelsToFilter];
          
          // Apply the same filters client-side
          Object.entries(cleanedFilters).forEach(([category, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return;

            switch (category) {
              case 'PriceGroup':
                // console.log('=== CLIENT-SIDE PRICE FILTER DEBUG ===');
                // console.log('Price filter value:', value);
                // console.log('Value type:', typeof value);
                // console.log('Value min:', value?.min);
                // console.log('Value max:', value?.max);
                // console.log('Value label:', value?.label);
                
                if (value && value.min !== undefined && value.max !== undefined) {
                  // console.log('=== CLIENT-SIDE PRICE FILTER ===');
                  // console.log('Price range:', { min: value.min, max: value.max, label: value.label });
                  // console.log('Hotels before price filter:', filtered.length);
                  
                  // Debug: Show first few hotels and their rates
                  // console.log('=== HOTEL RATE DEBUG ===');
                  // filtered.slice(0, 3).forEach((hotel, index) => {
                  //   console.log(`Hotel ${index + 1}:`, {
                  //     name: hotel.name,
                  //     rate: hotel.rate,
                  //     rateTotal: hotel.rate?.total,
                  //     hasRate: !!hotel.rate
                  //   });
                  // });
                  
                  filtered = filtered.filter(hotel => {
                    // Check if hotel has rate data
                    if (!hotel.rate || typeof hotel.rate !== 'object' || hotel.rate.total === undefined || hotel.rate.total === null) {
                      // console.log('Hotel has no valid rate:', hotel.name, 'Rate object:', hotel.rate);
                      return false;
                    }
                    
                    const price = parseFloat(hotel.rate.total);
                    if (isNaN(price)) {
                      // console.log('Hotel has invalid price:', hotel.name, 'Price:', hotel.rate.total);
                      return false;
                    }
                    
                    // Handle "& More" case where max is -1
                    const matches = price >= value.min && (value.max === -1 || value.max === undefined || price <= value.max);
                    
                    if (matches) {
                      // console.log(`Hotel ${hotel.name} matches price filter: ₹${price} (range: ₹${value.min}-${value.max === -1 ? '∞' : value.max})`);
                    } else {
                      // console.log(`Hotel ${hotel.name} does not match price filter: ₹${price} (range: ₹${value.min}-${value.max === -1 ? '∞' : value.max})`);
                    }
                    
                    return matches;
                  });
                  
                  // console.log('Hotels after price filter:', filtered.length);
                } else {
                  // console.log('=== PRICE FILTER: INVALID VALUE ===');
                  // console.log('Value is null/undefined or missing min/max properties');
                }
                break;

              case 'Distance':
                if (value && value.min !== undefined && value.max !== undefined) {
                  // console.log('=== CLIENT-SIDE DISTANCE FILTER ===');
                  // console.log('Distance range:', { min: value.min, max: value.max, label: value.label });
                  // console.log('Hotels before distance filter:', filtered.length);
                  
                  filtered = filtered.filter(hotel => {
                    // Check if hotel has distance data
                    if (hotel.distance === undefined || hotel.distance === null) {
                      // console.log('Hotel has no distance data:', hotel.name);
                      return false;
                    }
                    
                    const distance = hotel.distance;
                    const matches = distance >= value.min && distance <= value.max;
                    
                    if (matches) {
                      // console.log(`Hotel ${hotel.name} matches distance filter: ${distance}km (range: ${value.min}-${value.max}km)`);
                    } else {
                      // console.log(`Hotel ${hotel.name} does not match distance filter: ${distance}km (range: ${value.min}-${value.max}km)`);
                    }
                    
                    return matches;
                  });
                  
                  // console.log('Hotels after distance filter:', filtered.length);
                }
                break;

              case 'Facilities':
                if (Array.isArray(value) && value.length > 0) {
                  // console.log('=== CLIENT-SIDE FACILITIES FILTER ===');
                  // console.log('Filtering for facilities:', value);
                  // console.log('Hotels before filter:', filtered.length);
                  
                  filtered = filtered.filter(hotel => {
                    if (!hotel.facilities || !Array.isArray(hotel.facilities)) {
                      // console.log('Hotel has no facilities:', hotel.name);
                      return false;
                    }
                    
                    const hasFacility = value.some(facilityId =>
                      hotel.facilities.some(facility =>
                        facility.id.toString() === facilityId
                      )
                    );
                    
                    if (hasFacility) {
                      // console.log(`Hotel ${hotel.name} has facility ${value}`);
                    }
                    
                    return hasFacility;
                  });
                  
                  // console.log('Hotels after facilities filter:', filtered.length);
                }
                break;

              case 'StarRating':
                if (Array.isArray(value) && value.length > 0) {
                  // console.log('=== CLIENT-SIDE STAR RATING FILTER ===');
                  // console.log('Filtering for star ratings:', value);
                  // console.log('Hotels before filter:', filtered.length);
                  
                  filtered = filtered.filter(hotel => {
                    const hotelRating = hotel.starRating?.toString() || '0';
                    const matches = value.includes(hotelRating);
                    if (matches) {
                      // console.log(`Hotel ${hotel.name} matches star rating filter: ${hotelRating} stars`);
                    }
                    return matches;
                  });
                  
                  // console.log('Hotels after star rating filter:', filtered.length);
                }
                break;

              case 'HotelName':
                if (value && typeof value === 'string' && value.trim() !== '') {
                  // console.log('=== CLIENT-SIDE HOTEL NAME FILTER ===');
                  // console.log('Filtering for hotel name:', value);
                  // console.log('Hotels before filter:', filtered.length);
                  
                  filtered = filtered.filter(hotel =>
                    hotel.name.toLowerCase().includes(value.toLowerCase())
                  );
                  
                  // console.log('Hotels after hotel name filter:', filtered.length);
                }
                break;
            }
          });
          
          // console.log('=== CLIENT-SIDE FILTERING RESULT ===');
          // console.log('Filtered hotels count:', filtered.length);
          
          if (filtered.length > 0) {
            // console.log('=== CLIENT-SIDE FILTERING SUCCESS ===');
            // console.log('Using client-side filtered results');
            // console.log('Filtered hotels count:', filtered.length);
            // console.log('Total hotels:', filtered.length);
            // console.log('Total pages:', Math.ceil(filtered.length / 50));
            
            // Update all states at once to avoid race conditions
            const newFilteredHotels = [...filtered];
            const newTotalHotels = filtered.length;
            const newTotalPages = Math.ceil(filtered.length / 50);
            
            // console.log('=== UPDATING STATES ===');
            // console.log('Setting filtered hotels:', newFilteredHotels.length);
            // console.log('Setting total hotels:', newTotalHotels);
            // console.log('Setting total pages:', newTotalPages);
            
            // Update all states in a single batch
            setFilteredHotels(newFilteredHotels);
            setTotalHotels(newTotalHotels);
            setTotalPages(newTotalPages);
            setCurrentPage(1);
            setAllHotels(newFilteredHotels);
            
            // Force re-render
            setForceRender(prev => prev + 1);
            
            // console.log('=== STATES UPDATED ===');
            // console.log('All states have been updated with filtered results');
            // console.log('Force render triggered');
          } else {
            // console.log('=== CLIENT-SIDE FILTERING: NO RESULTS ===');
            // console.log('Client-side filtering returned 0 results');
            // console.log('Resetting to original hotels');
            
            setFilteredHotels(hotels);
            setTotalPages(totalPages);
            setTotalHotels(total);
            setAllHotels(hotels);
          }
        } else {
          // console.log('No hotels available for client-side filtering');
          setFilteredHotels(hotels);
          setTotalPages(totalPages);
          setTotalHotels(total);
          setAllHotels(hotels);
        }
      } else {
        // Normal case - use server results
        setFilteredHotels(hotels);
        setTotalPages(totalPages);
        setTotalHotels(total);
        setCurrentPage(1); // Reset to first page when filtering
        setError(null); // Clear any previous errors
        
        // Update allHotels to reflect filtered results
        setAllHotels(hotels);
      }
      
      // State updates are complete - no need for additional timeout
      // console.log('=== FRONTEND: FILTER PROCESSING COMPLETE ===');
      // console.log('All state updates have been applied');
    } catch (error) {
      // console.error('=== FRONTEND: FILTER API ERROR ===');
      // console.error('Error:', error.message);
      // if (error.response) {
      //   console.error('Response Status:', error.response.status);
      //   console.error('Response Data:', error.response.data);
      // }
      
      // Check if it's a network error or API error
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('Network error. Please check your connection and try again.');
      } else if (error.response?.status === 404) {
        setError('Filter API endpoint not found. Please contact support.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        setError(`Failed to apply filters: ${error.response?.data?.message || error.message}`);
      }
      
      // Fallback to client-side filtering on error
      // console.log('Falling back to client-side filtering');
      
      // Use the best available hotel data
      let hotelsToFilter = [];
      if (allHotels.length > 0) {
        hotelsToFilter = allHotels;
        // console.log('Using stored allHotels for error fallback:', hotelsToFilter.length);
      } else if (searchResults?.content?.hotels) {
        hotelsToFilter = searchResults.content.hotels;
        // console.log('Using searchResults hotels for error fallback:', hotelsToFilter.length);
      } else {
        // console.log('No hotels available for error fallback');
        setFilteredHotels([]);
        setTotalPages(1);
        setTotalHotels(0);
        setAllHotels([]);
        return;
      }
      
      // Apply client-side filtering as fallback
      let filtered = [...hotelsToFilter];
      Object.entries(cleanedFilters).forEach(([category, value]) => {
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
                if (!hotel.rate || !hotel.rate.total) return false;
                const price = parseFloat(hotel.rate.total);
                if (isNaN(price)) return false;
                // Handle "& More" case where max is -1
                return price >= value.min && (value.max === -1 || value.max === undefined || price <= value.max);
              });
            }
            break;
          case 'Distance':
            if (value && value.min !== undefined && value.max !== undefined) {
              // console.log('=== DISTANCE FILTER DEBUG ===');
              // console.log('Distance range:', { min: value.min, max: value.max, label: value.label });
              // console.log('Hotels before distance filter:', filtered.length);
              
              filtered = filtered.filter(hotel => {
                if (hotel.distance === undefined || hotel.distance === null) {
                  console.log('Hotel has no distance data:', hotel.name);
                  return false;
                }
                const distance = parseFloat(hotel.distance);
                if (isNaN(distance)) {
                  // console.log('Hotel has invalid distance:', hotel.name, 'Distance:', hotel.distance);
                  return false;
                }
                const matches = distance >= value.min && distance <= value.max;
                if (matches) {
                  console.log(`Hotel ${hotel.name} matches distance filter: ${distance}km (range: ${value.min}-${value.max}km)`);
                } else {
                  console.log(`Hotel ${hotel.name} does not match distance filter: ${distance}km (range: ${value.min}-${value.max}km)`);
                }
                return matches;
              });
              
              console.log('Hotels after distance filter:', filtered.length);
            }
            break;
          case 'StarRating':
            if (Array.isArray(value) && value.length > 0) {
              filtered = filtered.filter(hotel => {
                const hotelRating = hotel.starRating?.toString() || '0';
                return value.includes(hotelRating);
              });
            }
            break;
          case 'Facilities':
            if (Array.isArray(value) && value.length > 0) {
              // console.log('=== CLIENT-SIDE FACILITIES FILTER ===');
              // console.log('Filtering for facilities:', value);
              // console.log('Hotels before filter:', filtered.length);
              
              filtered = filtered.filter(hotel => {
                if (!hotel.facilities || !Array.isArray(hotel.facilities)) {
                  // console.log('Hotel has no facilities:', hotel.name);
                  return false;
                }
                
                const hasFacility = value.some(facilityId =>
                  hotel.facilities.some(facility =>
                    facility.id.toString() === facilityId.toString()
                  )
                );
                
                if (hasFacility) {
                  console.log(`Hotel ${hotel.name} has facility ${value}`);
                }
                
                return hasFacility;
              });
              
              // console.log('Hotels after facilities filter:', filtered.length);
            }
            break;
        }
      });
      
      setFilteredHotels(filtered);
      setTotalHotels(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 50));
      setForceRender(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    // Implement sorting logic here
  };

  const handleHotelSelect = (hotelId) => {
    // console.log('Hotel selected:', hotelId);
    
    // Validate search context before navigation
    const searchId = localStorage.getItem('hotelSearchId') || 
                    localStorage.getItem('searchId') || 
                    (localStorage.getItem('hotelSearchResults') && JSON.parse(localStorage.getItem('hotelSearchResults')).searchId);
    
    if (!searchId) {
      // console.error('No search session found, redirecting to home');
      window.location.href = '/';
      return;
    }
    
    // Navigate to hotel details page
    window.location.href = `/hotel-details/${hotelId}`;
  };

  // Test function to validate filtering system
  const testFilteringSystem = () => {
    // console.log('=== TESTING FILTERING SYSTEM ===');
    // console.log('Current filtered hotels:', filteredHotels.length);
    // console.log('Total hotels:', totalHotels);
    // console.log('Search ID:', searchId);
    // console.log('All hotels count:', allHotels.length);
    
    // Test price filtering with sample data
    if (filteredHotels.length > 0) {
      const sampleHotel = filteredHotels[0];
      // console.log('Sample hotel data:', {
      //   name: sampleHotel.name,
      //   rate: sampleHotel.rate,
      //   facilities: sampleHotel.facilities,
      //   starRating: sampleHotel.starRating
      // });
      
      // Test price validation
      if (sampleHotel.rate && sampleHotel.rate.total) {
        // console.log('Price validation test:', {
        //   price: sampleHotel.rate.total,
        //   isValid: typeof sampleHotel.rate.total === 'number' && sampleHotel.rate.total > 0
        // });
      }
      
      // Test facilities validation
      if (sampleHotel.facilities && Array.isArray(sampleHotel.facilities)) {
        // console.log('Facilities validation test:', {
        //   facilitiesCount: sampleHotel.facilities.length,
        //   hasValidStructure: sampleHotel.facilities.every(f => f.id && f.name)
        // });
      }
    }
  };

  // Call test function when component mounts
  useEffect(() => {
    if (filteredHotels.length > 0) {
      testFilteringSystem();
    }
  }, [filteredHotels]);

  // const sortOptions = [
  //   { value: 'relevance', label: 'Relevance' },
  //   { value: 'price-low', label: 'Price: Low to High' },
  //   { value: 'price-high', label: 'Price: High to Low' },
  //   { value: 'rating', label: 'Rating' },
  //   { value: 'distance', label: 'Distance' }
  // ];

  // console.log('=== HOTEL RESULTS HEADER HEIGHT ===');
  // console.log('Header height from hook:', headerHeight);
  // console.log('CSS custom property:', getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
  
  // console.log('=== FILTERS DEBUG ===');
  // console.log('Filters state:', filters);
  // console.log('Filters length:', filters?.length);
  // console.log('Loading state:', loading);
  // console.log('=== HOTEL COUNTS DEBUG ===');
  // console.log('Total hotels:', totalHotels);
  // console.log('Filtered hotels count:', filteredHotels.length);
  // console.log('Filtered hotels array:', filteredHotels);

  // Monitor state changes
  useEffect(() => {
    // console.log('=== STATE CHANGE DETECTED ===');
    // console.log('Filtered hotels count:', filteredHotels.length);
    // console.log('Total hotels:', totalHotels);
    // console.log('Current page:', currentPage);
    // console.log('Total pages:', totalPages);
    // console.log('Force render count:', forceRender);
  }, [filteredHotels, totalHotels, currentPage, totalPages, forceRender]);

  return (
    <div className="hotel-list-main ">
      {/* Filter Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hotel-filter-toggle"
          style={{ top: `${headerHeight + 20}px` }}
          aria-label="Toggle filters"
        >
          {isMobile ? <Menu className="w-4 h-4 sm:w-5 sm:h-5" /> : <Filter className="w-4 h-4 sm:w-5 sm:h-5" />}
          <span className="text-xs sm:text-sm font-medium">
            {isMobile ? 'Filters' : 'Show Filters'}
          </span>
        </button>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="hotel-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`hotel-sidebar transition-transform duration-300 mx-4 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <FilterSidebar
          filters={filters}
          loading={filterLoading}
          onFilterChange={handleFilterChange}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          totalHotels={totalHotels}
          filteredHotels={filteredHotels.length}
        />
      </div>

      {/* Main Content */}
      <div
        className={`hotel-list-content transition-all duration-300 ${sidebarOpen && !isMobile ? 'sidebar-open' : ''}`}
        style={{ paddingTop: `${Math.max(headerHeight - 40, 20)}px` }}
      >
        {/* Content Container */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          {/* Results Header */}
          <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {totalHotels > 0 ? totalHotels : filteredHotels.length} hotels found
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Showing results for {searchParams.location}
              </p>
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-3 rounded-md transition-all min-h-[44px] flex items-center justify-center ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-3 rounded-md transition-all min-h-[44px] flex items-center justify-center ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setError(null)}
                        className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Loading hotels...</span>
              </div>
            )}

            {/* Hotel Results */}
            {!loading && (
              <div className={`${viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 items-stretch'
                  : 'space-y-4 sm:space-y-6'
                }`}>
                {filteredHotels.map((hotel, index) => (
                  <HotelCard
                    key={hotel.id ? `hotel-${hotel.id}` : `hotel-${index}-${hotel.name?.replace(/\s+/g, '-') || 'unknown'}`}
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
              <div className="flex justify-center mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-600 text-sm">Loading page...</span>
                  </div>
                ) : (
                  <>
                    {/* Custom Pagination */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handlePageChange(null, Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                      >
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
                          return (
                            <button
                              key={`page-${pageNum}-${i}`}
                              onClick={() => handlePageChange(null, pageNum)}
                              className={`px-2 sm:px-3 py-2 border rounded-md text-xs sm:text-sm font-medium min-h-[44px] flex items-center justify-center ${currentPage === pageNum
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(null, Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                      </button>
                    </div>

                    {/* Material-UI Pagination (fallback) */}
                    <div className="ml-2 sm:ml-4 hidden sm:block">
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
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Pagination Info */}
            {!loading && filteredHotels.length > 0 && (
              <div className="text-center mt-4 text-xs sm:text-sm text-gray-600 space-y-1">
                <p>Showing {filteredHotels.length} hotels on page {currentPage} of {totalPages}</p>
                <p className="hidden sm:block">Total hotels: {totalHotels}</p>
                <p className="hidden sm:block">Displaying {((currentPage - 1) * 50) + 1} - {Math.min(currentPage * 50, totalHotels)} of {totalHotels} hotels</p>
              </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default HotelResults;