import React from 'react';

const HotelContent = ({ hotelContent, hotelContentLoading }) => {
  if (hotelContentLoading) {
    return (
      <div className="hotel-content-loading">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (!hotelContent) {
    return (
      <div className="hotel-content-empty">
        <div className="text-center p-4">
          <i className="fas fa-hotel fa-3x text-muted mb-3"></i>
          <h5>No hotel content available</h5>
          <p className="text-muted">Click "View Details" on a hotel to see more information</p>
        </div>
      </div>
    );
  }

  const renderRoomDetails = (rooms) => {
    if (!rooms || rooms.length === 0) {
      return (
        <div className="text-muted">
          <small>No room details available</small>
        </div>
      );
    }

    return rooms.map((room, index) => (
      <div key={index} className="card mb-3">
        <div className="card-body">
          <h6 className="card-title">{room.name || `Room ${index + 1}`}</h6>
          {room.description && (
            <p className="card-text text-muted">{room.description}</p>
          )}
          {room.amenities && room.amenities.length > 0 && (
            <div className="room-amenities">
              <h6 className="small">Amenities:</h6>
              <div className="d-flex flex-wrap gap-1">
                {room.amenities.map((amenity, amenityIndex) => (
                  <span key={amenityIndex} className="badge bg-secondary">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
          {room.images && room.images.length > 0 && (
            <div className="room-images mt-2">
              <h6 className="small">Images:</h6>
              <div className="row">
                {room.images.slice(0, 3).map((image, imageIndex) => (
                  <div key={imageIndex} className="col-4">
                    <img 
                      src={image.url || image} 
                      alt={image.alt || `Room image ${imageIndex + 1}`}
                      className="img-fluid rounded"
                      style={{ height: '100px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    ));
  };

  const renderHotelImages = (images) => {
    if (!images || images.length === 0) {
      return null;
    }

    return (
      <div className="hotel-images mb-4">
        <h5>Hotel Images</h5>
        <div className="row">
          {images.slice(0, 6).map((image, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-3">
              <img 
                src={image.url || image} 
                alt={image.alt || `Hotel image ${index + 1}`}
                className="img-fluid rounded shadow-sm"
                style={{ height: '200px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAmenities = (amenities) => {
    if (!amenities || amenities.length === 0) {
      return null;
    }

    return (
      <div className="hotel-amenities mb-4">
        <h5>Hotel Amenities</h5>
        <div className="d-flex flex-wrap gap-2">
          {amenities.map((amenity, index) => (
            <span key={index} className="badge bg-primary">
              {amenity}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="hotel-content">
      <div className="row">
        <div className="col-12">
          <h4 className="mb-3">
            <i className="fas fa-hotel me-2"></i>
            Hotel Details
          </h4>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                {hotelContent.name || 'Hotel Information'}
              </h5>
              
              {hotelContent.description && (
                <p className="card-text">{hotelContent.description}</p>
              )}
              
              {hotelContent.address && (
                <div className="hotel-address mb-3">
                  <h6>Address:</h6>
                  <p className="text-muted">{hotelContent.address}</p>
                </div>
              )}
              
              {hotelContent.rating && (
                <div className="hotel-rating mb-3">
                  <h6>Rating:</h6>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-warning me-2">
                      {hotelContent.rating} ⭐
                    </span>
                    {hotelContent.reviewCount && (
                      <small className="text-muted">
                        ({hotelContent.reviewCount} reviews)
                      </small>
                    )}
                  </div>
                </div>
              )}
              
              {renderHotelImages(hotelContent.images)}
              {renderAmenities(hotelContent.amenities)}
              
              <div className="hotel-rooms">
                <h5>Room Details</h5>
                {renderRoomDetails(hotelContent.rooms)}
              </div>
              
              {hotelContent.policies && (
                <div className="hotel-policies mt-4">
                  <h5>Hotel Policies</h5>
                  <div className="card">
                    <div className="card-body">
                      <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {hotelContent.policies}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelContent;
