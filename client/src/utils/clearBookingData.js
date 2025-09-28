/**
 * Utility function to clear all booking-related localStorage items
 * This prevents conflicts when starting a new booking after completing one
 */
export const clearBookingData = () => {
  const itemsToRemove = [
    'bookingSuccess',
    'oneWayReviewData',
    'TUI',
    'pricerTUI',
    'pricerData',
    'TransactionID',
    'itineraryTUI',
    'trips',
    'searchTUI',
    'searchPayload',
    'travelCheckList',
    'bookingDetails',
    'contactInfo',
    'travellers',
    'netamount',
    'sessionStartTime'
  ];

  itemsToRemove.forEach(item => {
    localStorage.removeItem(item);
  });

  console.log('✅ All booking-related localStorage items cleared');
};

/**
 * Utility function to clear only search-related localStorage items
 * This is used when starting a new search
 */
export const clearSearchData = () => {
  const itemsToRemove = [
    'trips',
    'TUI',
    'pricerTUI',
    'pricerData',
    'searchTUI',
    'searchPayload',
    'oneWayReviewData',
    'netamount',
    'TransactionID',
    'itineraryTUI',
    'travelCheckList',
    'contactInfo',
    'travellers',
    'sessionStartTime'
  ];

  itemsToRemove.forEach(item => {
    localStorage.removeItem(item);
  });

  console.log('✅ Search-related localStorage items cleared');
};

/**
 * Utility function to clear ALL localStorage items except essential ones
 * This is used for debugging and complete reset
 */
export const clearAllBookingData = () => {
  // Keep only essential items
  const essentialItems = ['token', 'ClientID'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!essentialItems.includes(key)) {
      localStorage.removeItem(key);
    }
  });

  console.log('✅ All booking-related localStorage items cleared (except essential)');
};

/**
 * Debug function to show current localStorage state
 */
export const debugLocalStorage = () => {
  console.log('🔍 Current localStorage state:');
  Object.keys(localStorage).forEach(key => {
    console.log(`- ${key}:`, localStorage.getItem(key));
  });
};
