interface SearchContext {
  searchId: string;
  searchTracingKey: string;
  token: string;
  timestamp?: number;
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
}

interface ValidationResult {
  isValid: boolean;
  context: SearchContext | null;
  errors: string[];
  needsRefresh: boolean;
}

const SEARCH_CONTEXT_TTL = 30 * 60 * 1000; // 30 minutes

export function validateSearchContext(): ValidationResult {
  const errors: string[] = [];
  let needsRefresh = false;

  // console.log('=== VALIDATING SEARCH CONTEXT ===');

  // Check for required localStorage keys
  const searchId = localStorage.getItem('hotelSearchId') || 
                  localStorage.getItem('searchId') || 
                  (() => {
                    const results = localStorage.getItem('hotelSearchResults');
                    if (results) {
                      try {
                        const parsed = JSON.parse(results);
                        return parsed.searchId;
                      } catch (e) {
                        // console.warn('Failed to parse hotelSearchResults:', e);
                        return null;
                      }
                    }
                    return null;
                  })();

  let searchTracingKey = localStorage.getItem('searchTracingKey');
  
  // Fallback: try to get searchTracingKey from searchData if not found in main key
  if (!searchTracingKey) {
    try {
      const searchData = localStorage.getItem('hotelSearchData');
      if (searchData) {
        const parsed = JSON.parse(searchData);
        searchTracingKey = parsed.searchTracingKey;
        // console.log('Found searchTracingKey in hotelSearchData:', !!searchTracingKey);
      }
    } catch (e) {
      // console.warn('Failed to parse hotelSearchData for searchTracingKey:', e);
    }
  }
  
  const token = localStorage.getItem('token');

  // console.log('Search ID found:', !!searchId);
  // console.log('Search Tracing Key found:', !!searchTracingKey);
  // console.log('Token found:', !!token);
  
  // Additional logging for debugging
  // console.log('Search ID value:', searchId);
  // console.log('Search Tracing Key value:', searchTracingKey);
  // console.log('Token value (first 10 chars):', token ? token.substring(0, 10) + '...' : 'null');

  if (!searchId) {
    errors.push('Search ID is missing');
  }

  if (!searchTracingKey) {
    errors.push('Search Tracing Key is missing');
  }

  if (!token) {
    errors.push('Authentication token is missing');
  }

  // Check timestamp for staleness
  const lastSearchTime = localStorage.getItem('lastSearchTime');
  if (lastSearchTime) {
    const timeDiff = Date.now() - parseInt(lastSearchTime);
    if (timeDiff > SEARCH_CONTEXT_TTL) {
      needsRefresh = true;
      errors.push('Search context is stale (older than 30 minutes)');
      // console.log('Search context is stale, needs refresh');
    }
  }

  // If we have critical errors, return invalid
  if (errors.length > 0 && (!searchId || !searchTracingKey || !token)) {
    // console.log('=== SEARCH CONTEXT VALIDATION FAILED ===');
    // console.log('Errors:', errors);
    return {
      isValid: false,
      context: null,
      errors,
      needsRefresh
    };
  }

  // Try to get additional context from stored data
  let additionalContext = {};
  try {
    const searchData = localStorage.getItem('hotelSearchData');
    if (searchData) {
      const parsed = JSON.parse(searchData);
      additionalContext = {
        location: parsed.location,
        checkIn: parsed.checkIn,
        checkOut: parsed.checkOut,
        guests: parsed.guests,
        rooms: parsed.rooms
      };
    }
  } catch (e) {
    // console.warn('Failed to parse hotelSearchData:', e);
  }

  const context: SearchContext = {
    searchId: searchId!,
    searchTracingKey: searchTracingKey!,
    token: token!,
    timestamp: lastSearchTime ? parseInt(lastSearchTime) : Date.now(),
    ...additionalContext
  };

  // console.log('=== SEARCH CONTEXT VALIDATION SUCCESS ===');
  // console.log('Context:', context);

  return {
    isValid: true,
    context,
    errors,
    needsRefresh
  };
}

export function clearStaleSearchData(): void {
  // console.log('=== CLEARING STALE SEARCH DATA ===');
  
  const keysToCheck = [
    'hotelSearchId',
    'searchId', 
    'searchTracingKey',
    'hotelSearchData',
    'hotelSearchResults',
    'allHotels',
    'hotelDetailsData',
    'hotelPricingData',
    'hotelPricingError'
  ];

  keysToCheck.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        const parsed = JSON.parse(value);
        // Check if data has timestamp and is stale
        if (parsed.timestamp) {
          const timeDiff = Date.now() - parsed.timestamp;
          if (timeDiff > SEARCH_CONTEXT_TTL) {
            // console.log(`Removing stale data: ${key}`);
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        // If we can't parse, remove it
        // console.log(`Removing unparseable data: ${key}`);
        localStorage.removeItem(key);
      }
    }
  });

  // Also check lastSearchTime
  const lastSearchTime = localStorage.getItem('lastSearchTime');
  if (lastSearchTime) {
    const timeDiff = Date.now() - parseInt(lastSearchTime);
    if (timeDiff > SEARCH_CONTEXT_TTL) {
      // console.log('Clearing lastSearchTime');
      localStorage.removeItem('lastSearchTime');
    }
  }
}

export function updateSearchTimestamp(): void {
  localStorage.setItem('lastSearchTime', Date.now().toString());
  // console.log('Updated search timestamp');
}

export function ensureSearchTracingKeyMaintenance(): void {
  // console.log('=== ENSURING SEARCH TRACING KEY MAINTENANCE ===');
  
  // Check if searchTracingKey exists in main localStorage
  let searchTracingKey = localStorage.getItem('searchTracingKey');
  // console.log('Primary searchTracingKey found:', !!searchTracingKey);
  
  // If not found, try to restore from searchData
  if (!searchTracingKey) {
    try {
      const searchData = localStorage.getItem('hotelSearchData');
      if (searchData) {
        const parsed = JSON.parse(searchData);
        if (parsed.searchTracingKey) {
          localStorage.setItem('searchTracingKey', parsed.searchTracingKey);
          // console.log('Restored searchTracingKey from hotelSearchData');
        }
      }
    } catch (e) {
      // console.warn('Failed to restore searchTracingKey from hotelSearchData:', e);
    }
  }
  
  // Verify final state
  const finalSearchTracingKey = localStorage.getItem('searchTracingKey');
  // console.log('Final searchTracingKey state:', !!finalSearchTracingKey);
  // console.log('Final searchTracingKey value:', finalSearchTracingKey);
}
