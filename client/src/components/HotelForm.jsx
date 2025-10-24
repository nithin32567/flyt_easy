import React from 'react';

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
  handleLocationSelect,
  setRooms,
  setPriceRange
}) => {
  return (
    <div className=' relative  '>
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
        <div className="row py-4">
          <div className="col-lg-5">
            <div className="row">
              <div className="col-lg-7 col-md-6">
                <button
                  className="select-items w-100 text-start"
                  onClick={handleLocationSelect}
                >
                  <h6>Where are you going?</h6>
                  <h2>
                    {selectedHotelLocation ? selectedHotelLocation.name : 'Select Location'}
                  </h2>
                  {selectedHotelLocation && (
                    <p className="text-muted small mb-0">{selectedHotelLocation.fullName}</p>
                  )}
                </button>
              </div>
              
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
                  {selectedHotelLocation ? 'Search Hotels' : 'Select Location'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedHotelLocation && (
                <div className="col-12 mt-3 ">
                  <div className="selected-location-card">
                    <div className="selected-location-content">
                      <div className="selected-location-icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div className="selected-location-details">
                        <div className="selected-location-title">
                          {selectedHotelLocation.name}
                        </div>
                        <div className="selected-location-subtitle">
                          {selectedHotelLocation.fullName}
                        </div>
                        <div className="selected-location-badge">
                          {selectedHotelLocation.type}
                        </div>
                      </div>
                      <div className="selected-location-actions">
                        <button 
                          className="selected-location-change-btn"
                          onClick={handleLocationSelect}
                          title="Change Location"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </div>
                    <div className="selected-location-footer">
                      <div className="selected-location-status">
                        <i className="fas fa-check-circle"></i>
                        <span>Location Selected</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
    </div>
  );
};

export default HotelForm;