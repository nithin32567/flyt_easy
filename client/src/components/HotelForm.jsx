import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

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
  checkInDate,
  checkOutDate,
  rooms,
  priceRange,
  handleDateSelect,
  handleRoomsSelect,
  handlePriceSelect,
  setRooms,
  setPriceRange
}) => {
  const [showResults, setShowResults] = useState(false);
  const [autosuggestResults, setAutosuggestResults] = useState([]);
  const [isAutosuggestLoading, setIsAutosuggestLoading] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

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

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleAutoSuggest = async () => {
    if (searchterm.length < 3) {
      setAutosuggestResults([]);
      return;
    }



    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce the API call
    debounceTimeoutRef.current = setTimeout(async () => {
      setIsAutosuggestLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/hotel/autosuggest`, {
          params: { term: searchterm },
        });

        console.log('Autosuggest API response:', response.data);

        // Handle different possible response structures
        let results = [];
        if (response.data) {
          if (response.data.locations) {
            results = response.data.locations;
          } else if (response.data.data) {
            results = response.data.data;
          } else if (Array.isArray(response.data)) {
            results = response.data;
          } else if (response.data.results) {
            results = response.data.results;
          } else if (response.data.suggestions) {
            results = response.data.suggestions;
          } else if (response.data.items) {
            results = response.data.items;
          }
        }

        console.log('Processed autosuggest results:', results);
        console.log('Number of results:', results.length);
        setAutosuggestResults(results);
      } catch (error) {
        console.error('Autosuggest error:', error);
        setAutosuggestResults([]);
      } finally {
        setIsAutosuggestLoading(false);
      }
    }, 300); // 300ms debounce
  };

  const handleLocationSelect = (location) => {
    handleHotelLocationSelect(location);
    setSearchterm(location.fullName);
    setShowResults(false);
  };
  return (
    <div className=' relative '>
      <div

        style={{ overflow: 'visible', position: '' }}
        className="tab-pane fade show active "
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
                      if (e.target.value.length >= 3) {
                        handleAutoSuggest();
                      } else {
                        setAutosuggestResults([]);
                      }
                    }}
                    onFocus={() => setShowResults(searchterm.length >= 3 && (autosuggestResults.length > 0 || isAutosuggestLoading))}
                  />
                  {(isLoading || isAutosuggestLoading) && (
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
                    className=" bg-white border rounded shadow-lg w-100 mt-1 z-3"
                    style={{
                      top: '100%',
                      left: 0,
                      maxHeight: '300px',
                      overflowY: 'auto',
                      zIndex: 1050
                    }}
                  >
                    {console.log('Current autosuggestResults:', autosuggestResults)}
                    {isAutosuggestLoading ? (
                      <div className="p-3 text-center">
                        <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                        Searching...
                      </div>
                    ) : autosuggestResults.length > 0 ? (
                      autosuggestResults.map((location, index) => (
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
                <button
                  className="select-items"
                  onClick={handleRoomsSelect}
                >
                  <h6>Rooms &amp; Guests</h6>
                  <h2>
                    {rooms} <span>Rooms</span> {adults} <span>Adults</span>
                    {children > 0 && ` ${children} Children`}
                  </h2>
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-6">
                <button
                  className="select-items"
                  onClick={() => handleDateSelect('checkIn')}
                >
                  <h6>Check-In</h6>
                  <h2>
                    {checkInDate.getDate()} <span>{checkInDate.toLocaleDateString('en-US', { month: 'short' })}'{checkInDate.getFullYear().toString().slice(-2)}</span>
                  </h2>
                  <p>{checkInDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                </button>
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <button
                  className="select-items"
                  onClick={() => handleDateSelect('checkOut')}
                >
                  <h6>Check-Out</h6>
                  <h2>
                    {checkOutDate.getDate()} <span>{checkOutDate.toLocaleDateString('en-US', { month: 'short' })}'{checkOutDate.getFullYear().toString().slice(-2)}</span>
                  </h2>
                  <p>{checkOutDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                </button>
              </div>
              <div className="col-lg-3 col-md-4">
                <button
                  className="select-items"
                  onClick={handlePriceSelect}
                >
                  <h6>Price per Night</h6>
                  <h2>
                    <span>₹{priceRange.min}-₹{priceRange.max}</span>
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
      </div>
    </div>
  );
};

export default HotelForm;
