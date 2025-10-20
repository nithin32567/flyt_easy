import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import BookingAccordion from '../components/booking/BookingAccordion';
import SearchAndFilterBar from '../components/booking/SearchAndFilterBar';

const BookingDetailsAccordion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedBookings, setExpandedBookings] = useState(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user && user.id) {
      console.log('User authenticated, fetching bookings...');
      fetchBookings();
    } else {
      console.log('User object missing id:', user);
    }
  }, [user, navigate]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchQuery, filter]);

  // Sync allExpanded state with actual expanded state
  useEffect(() => {
    if (filteredBookings.length > 0) {
      const allExpanded = filteredBookings.every(booking => expandedBookings.has(booking._id));
      setAllExpanded(allExpanded);
    }
  }, [expandedBookings, filteredBookings]);

  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings for user:', user);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/bookings/user/${user.id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Failed to fetch bookings: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Bookings data:', data);
      setBookings(data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(booking => booking.status === filter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => {
        const bookingData = booking.bookingData;
        const route = `${bookingData?.From || ''} ${bookingData?.To || ''}`.toLowerCase();
        const passengerName = bookingData?.Pax?.[0] 
          ? `${bookingData.Pax[0].FName} ${bookingData.Pax[0].LName}`.toLowerCase()
          : '';
        const transactionId = booking.transactionId?.toLowerCase() || '';
        
        return route.includes(query) || 
               passengerName.includes(query) || 
               transactionId.includes(query);
      });
    }

    setFilteredBookings(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (filterValue) => {
    setFilter(filterValue);
  };

  const toggleBooking = (bookingId) => {
    const newExpanded = new Set(expandedBookings);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedBookings(newExpanded);
  };

  const toggleAllBookings = () => {
    if (allExpanded) {
      setExpandedBookings(new Set());
      setAllExpanded(false);
    } else {
      const allIds = new Set(filteredBookings.map(booking => booking._id));
      setExpandedBookings(allIds);
      setAllExpanded(true);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      all: bookings?.length || 0,
      current: bookings?.filter(b => b.status === 'current').length || 0,
      completed: bookings?.filter(b => b.status === 'completed').length || 0,
      cancelled: bookings?.filter(b => b.status === 'cancelled').length || 0,
      pending: bookings?.filter(b => b.status === 'pending').length || 0
    };
    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Search and Filter */}
        <SearchAndFilterBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          totalBookings={bookings.length}
        />

        {/* Expand/Collapse All Control */}
        {filteredBookings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleAllBookings}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {allExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span>Collapse All</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span>Expand All</span>
                    </>
                  )}
                </button>
                <div className="text-sm text-gray-600">
                  {expandedBookings.size} of {filteredBookings.length} expanded
                </div>
              </div>
              
              {/* Status Summary */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span>Current: {statusCounts.current}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span>Completed: {statusCounts.completed}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span>Cancelled: {statusCounts.cancelled}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
          >
            <div className="text-gray-400 text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {filter === 'all' ? 'No bookings found' : `No ${filter} bookings found`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'You haven\'t made any bookings yet.' 
                : `You don't have any ${filter} bookings.`
              }
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Book a Flight
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <BookingAccordion
                    booking={booking}
                    isActive={booking.status === 'current'}
                    isOpen={expandedBookings.has(booking._id)}
                    onToggle={() => toggleBooking(booking._id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsAccordion;
