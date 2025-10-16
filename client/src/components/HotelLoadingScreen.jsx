import React from 'react';

const HotelLoadingScreen = ({ 
  isVisible, 
  title = "Searching Hotels", 
  subtitle = "Finding the best hotels for your stay...",
  showProgress = true,
  showDots = true,
  customMessage = null
}) => {
  if (!isVisible) return null;

  return (
    <div className="hotel-loading-overlay">
      <div className="hotel-loading-container">
        <div className="hotel-loading-spinner"></div>
        <h3 className="hotel-loading-title">{title}</h3>
        <p className="hotel-loading-subtitle">
          {customMessage || subtitle}
        </p>
        {showProgress && (
          <div className="hotel-loading-progress">
            <div className="hotel-loading-progress-bar"></div>
          </div>
        )}
        {showDots && (
          <div className="hotel-loading-dots">
            <div className="hotel-loading-dot"></div>
            <div className="hotel-loading-dot"></div>
            <div className="hotel-loading-dot"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelLoadingScreen;
