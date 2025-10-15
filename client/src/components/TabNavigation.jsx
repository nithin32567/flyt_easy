import React from 'react';
import flightIcon from "../assets/img/flight-icon.png";
import hotelIcon from "../assets/img/hotel-booking.png";

const TabNavigation = ({ isActiveFlightTab, setIsActiveFlightTab }) => {
  return (
    <ul className="nav nav-tabs" id="myTab" role="tablist">
      <li className="nav-item items-center justify-center" role="presentation">
        <button
          onClick={() => setIsActiveFlightTab(true)}
          className={`nav-link ${isActiveFlightTab ? "active" : ""} `}
          id="home-tab"
          data-bs-toggle="tab"
          data-bs-target="#home"
          type="button"
          role="tab"
          aria-controls="home"
          aria-selected={isActiveFlightTab}
        >
          <img src={flightIcon} alt="Flight Booking" />
          Flight Booking
        </button>
      </li>
      <li className="nav-item items-center justify-center" role="presentation">
        <button
          onClick={() => setIsActiveFlightTab(false)}
          className={`nav-link ${!isActiveFlightTab ? "active" : ""}`}
          id="profile-tab"
          data-bs-toggle="tab"
          data-bs-target="#profile"
          type="button"
          role="tab"
          aria-controls="profile"
          aria-selected={!isActiveFlightTab}
        >
          <img src={hotelIcon} alt="Hotel Booking" /> Hotel Booking
        </button>
      </li>
    </ul>
  );
};

export default TabNavigation;
