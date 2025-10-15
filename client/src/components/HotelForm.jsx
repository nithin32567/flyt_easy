import React, { useState, useRef, useEffect } from 'react';
import HotelResults from './HotelResults';
import HotelFilters from './HotelFilters';
import HotelContent from './HotelContent';

const HotelForm = ({
  searchterm,
  setSearchterm,
  adults,
  children,
  hotelSearch,
  hotelSearchResults,
  handleHotelLocationSelect,
  selectedHotelLocation,
  isLoading,
  hotelRates,
  hotelRatesLoading,
  hotelFilters,
  hotelFiltersLoading,
  hotelContent,
  hotelContentLoading,
  fetchHotelContent,
  searchId
}) => {
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) && 
          resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocationSelect = (location) => {
    handleHotelLocationSelect(location);
    setSearchterm(location.fullName);
    setShowResults(false);
  };

  const handleViewDetails = async (hotelId) => {
    if (searchId && fetchHotelContent) {
      try {
        await fetchHotelContent(searchId, hotelId);
      } catch (error) {
        console.error('Failed to fetch hotel content:', error);
      }
    }
  };
  return (
    <div
      className="tab-pane fade show active"
      id="profile"
      role="tabpanel"
      aria-labelledby="profile-tab"
    >
      <div className="onewar-roundtrip">
        <ul>
          <li>
            <label>
              <input
                type="radio"
                name="trips"
                id=""
                defaultChecked=""
              />{" "}
              Upto 4 Rooms
            </label>
          </li>
          <li>
            <label>
              <input type="radio" name="trips" id="" /> Group Deals
            </label>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-5">
          <div className="row">
            <div className="col-lg-7 col-md-6 border py-2 px-4 rounded-lg position-relative" ref={searchRef}>
              <div className="position-relative">
                <input 
                  className="select-items w-full" 
                  type="text" 
                  placeholder="City, Property name or Location" 
                  value={searchterm}
                  onChange={(e) => {
                    setSearchterm(e.target.value);
                    setShowResults(e.target.value.length >= 3);
                  }}
                  onFocus={() => setShowResults(searchterm.length >= 3 && (hotelSearchResults.length > 0 || isLoading))}
                />
                {isLoading && (
                  <div className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </div>
              {showResults && (
                <div 
                  ref={resultsRef}
                  className="position-absolute bg-white border rounded shadow-lg w-100 mt-1 z-3"
                  style={{ top: '100%', left: 0, maxHeight: '300px', overflowY: 'auto' }}
                >
                  {isLoading ? (
                    <div className="p-3 text-center">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Searching...
                    </div>
                  ) : hotelSearchResults.length > 0 ? (
                    hotelSearchResults.map((location, index) => (
                      <div
                        key={index}
                        className="p-2 border-bottom cursor-pointer hover-bg-light"
                        onClick={() => handleLocationSelect(location)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="fw-bold">{location.name}</div>
                        <div className="text-muted small">{location.fullName}</div>
                        {location.type && (
                          <span className="badge bg-secondary ms-2">{location.type}</span>
                        )}
                      </div>
                    ))
                  ) : searchterm.length >= 3 ? (
                    <div className="p-3 text-muted text-center">
                      No results found for "{searchterm}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            {selectedHotelLocation && (
              <div className="col-12 mt-2">
                <div className="alert alert-success d-flex align-items-center" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  <div>
                    <strong>Selected:</strong> {selectedHotelLocation.name} ({selectedHotelLocation.type})
                  </div>
                </div>
              </div>
            )}
            <div className="col-lg-5 col-md-6">
              <button className="select-items">
                <h6>Rooms &amp; Guests</h6>
                <h2>
                  1 <span>Rooms</span> 2 <span>Adults</span>
                </h2>
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-6">
              <button className="select-items">
                <h6>Check-In</h6>
                <h2>
                  16 <span>Jul'25</span>
                </h2>
                <p>Sunday</p>
              </button>
            </div>
            <div className="col-lg-3 col-md-4 col-6">
              <button className="select-items">
                <h6>Check-Out</h6>
                <h2>
                  16 <span>Jul'25</span>
                </h2>
                <p>Sunday</p>
              </button>
            </div>
            <div className="col-lg-3 col-md-4">
              <button className="select-items">
                <h6>Price per Night</h6>
                <h2>
                  <span>₹0-₹1500</span>
                </h2>
              </button>
            </div>
            <div className="col-lg-3">
              <button 
                onClick={hotelSearch} 
                className="search-btn"
                disabled={!selectedHotelLocation}
                style={{ 
                  opacity: selectedHotelLocation ? 1 : 0.6,
                  cursor: selectedHotelLocation ? 'pointer' : 'not-allowed'
                }}
              >
                {selectedHotelLocation ? 'Hotel Search' : 'Select Location First'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="trendingsearches">
        <h5>Trending Searches:</h5>
        <ul>
          <li>
            <button>Dubai, United Arab Emirates</button>
          </li>
          <li>
            <button>Mumbai, India</button>
          </li>
          <li>
            <button>London, United Kingdom</button>
          </li>
        </ul>
      </div>
      
      {/* Hotel Filters Section */}
      {(hotelFilters.length > 0 || hotelFiltersLoading) && (
        <div className="mt-4">
          <HotelFilters 
            hotelFilters={hotelFilters}
            hotelFiltersLoading={hotelFiltersLoading}
          />
        </div>
      )}
      
      {/* Hotel Results Section */}
      {(hotelRates.length > 0 || hotelRatesLoading) && (
        <div className="mt-4">
          <HotelResults 
            hotelRates={hotelRates}
            hotelRatesLoading={hotelRatesLoading}
            onViewDetails={handleViewDetails}
            searchId={searchId}
          />
        </div>
      )}
      
      {/* Hotel Content Section */}
      {(hotelContent || hotelContentLoading) && (
        <div className="mt-4">
          <HotelContent 
            hotelContent={hotelContent}
            hotelContentLoading={hotelContentLoading}
          />
        </div>
      )}
    </div>
  );
};

export default HotelForm;
