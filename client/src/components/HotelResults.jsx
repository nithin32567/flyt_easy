import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HotelResults = ({ 
  hotelRates, 
  hotelRatesLoading, 
  currency = 'INR',
  onViewDetails,
  searchId
}) => {
  const navigate = useNavigate();
  const [loadingHotelId, setLoadingHotelId] = useState(null);
  if (hotelRatesLoading) {
    return (
      <div className="hotel-results-loading">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Searching for hotels...</p>
        </div>
      </div>
    );
  }

  if (!hotelRates || hotelRates.length === 0) {
    return (
      <div className="hotel-results-empty">
        <div className="text-center p-4">
          <i className="fas fa-hotel fa-3x text-muted mb-3"></i>
          <h5>No hotels found</h5>
          <p className="text-muted">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getRateComponents = (rate) => {
    if (!rate.otherRateComponents || rate.otherRateComponents.length === 0) {
      return null;
    }

    // Filter out commission-related components
    const filteredComponents = rate.otherRateComponents.filter(component => 
      !component.type.toLowerCase().includes('commission') && 
      !component.description.toLowerCase().includes('commission')
    );

    if (filteredComponents.length === 0) {
      return null;
    }

    return (
      <div className="rate-components mt-2">
        <small className="text-muted">
          {filteredComponents.map((component, index) => (
            <span key={index} className="me-2">
              {component.description}: {formatPrice(component.amount)}
            </span>
          ))}
        </small>
      </div>
    );
  };

  return (
    <div className="hotel-results">
      <div className="row">
        <div className="col-12">
          <h4 className="mb-3">
            <i className="fas fa-hotel me-2"></i>
            Hotel Search Results ({hotelRates.length} hotels found)
          </h4>
          <div className="mb-3">
            <button 
              className="btn btn-warning btn-sm" 
              onClick={() => {
                console.log('=== TEST NAVIGATION ===');
                console.log('Search ID:', searchId);
                console.log('Navigating to test hotel details');
                navigate('/hotel-details/test-hotel-id');
              }}
            >
              <i className="fas fa-test-tube me-1"></i>
              Test Navigation
            </button>
          </div>
        </div>
      </div>
      
      <div className="row">
        {hotelRates.map((hotel, index) => {
          console.log(`Hotel ${index}:`, hotel);
          return (
          <div key={hotel.id || index} className="col-lg-6 col-xl-4 mb-4">
            <div className="card hotel-card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title mb-0">
                    {hotel.name || hotel.rate.provider || `Hotel ${index + 1}`}
                  </h5>
                  {hotel.isRecommended && (
                    <span className="badge bg-success">
                      <i className="fas fa-star me-1"></i>
                      Recommended
                    </span>
                  )}
                </div>

                <div className="hotel-rate-info">
                  <div className="rate-summary">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h4 text-primary mb-0">
                        {formatPrice(hotel.rate.total)}
                      </span>
                      <small className="text-muted">
                        Base: {formatPrice(hotel.rate.baseRate)}
                      </small>
                    </div>
                    
                    <div className="rate-details mt-2">
                      <div className="row text-center">
                        <div className="col-6">
                          <small className="text-muted d-block">Discounts</small>
                          <small className="fw-bold">{formatPrice(hotel.rate.discounts)}</small>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Taxes</small>
                          <small className="fw-bold">{formatPrice(hotel.rate.taxes)}</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {getRateComponents(hotel.rate)}

                  <div className="hotel-features mt-3">
                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted d-block">Provider</small>
                        <span className="badge bg-info">{hotel.rate.provider}</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Refundable</small>
                        <span className={`badge ${hotel.isRefundable ? 'bg-success' : 'bg-danger'}`}>
                          {hotel.isRefundable ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hotel-options mt-3">
                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted d-block">Free Cancellation</small>
                        <span className={`badge ${hotel.freeCancellation ? 'bg-success' : 'bg-secondary'}`}>
                          {hotel.freeCancellation ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Pay at Hotel</small>
                        <span className={`badge ${hotel.payAtHotel ? 'bg-warning' : 'bg-info'}`}>
                          {hotel.payAtHotel ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {hotel.moreRatesExpected && (
                    <div className="mt-3">
                      <small className="text-info">
                        <i className="fas fa-info-circle me-1"></i>
                        More rates may be available
                      </small>
                    </div>
                  )}
                </div>

                <div className="card-footer bg-transparent border-0 p-0 mt-3">
                  <button 
                    className="btn btn-primary w-100"
                    disabled={loadingHotelId === (hotel.id || hotel.rate.provider || `hotel-${index}`)}
                    onClick={() => {
                      console.log('=== VIEW DETAILS CLICKED ===');
                      console.log('Hotel data:', hotel);
                      console.log('Search ID:', searchId);
                      console.log('Hotel ID:', hotel.id || hotel.rate.provider);
                      
                      const hotelId = hotel.id || hotel.rate.provider || `hotel-${index}`;
                      setLoadingHotelId(hotelId);
                      
                      // Store searchId in localStorage for the details page
                      if (searchId) {
                        localStorage.setItem('hotelSearchId', searchId);
                        console.log('Search ID stored in localStorage:', searchId);
                      } else {
                        console.warn('No searchId available');
                      }
                      
                      console.log('Navigating to hotel details with ID:', hotelId);
                      console.log('Full hotel object for debugging:', JSON.stringify(hotel, null, 2));
                      
                      // Navigate to hotel details page
                      navigate(`/hotel-details/${hotelId}`);
                    }}
                  >
                    {loadingHotelId === (hotel.id || hotel.rate.provider || `hotel-${index}`) ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-eye me-2"></i>
                        View Details
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotelResults;
