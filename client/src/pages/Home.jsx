import React from "react";

import googleplay from "../assets/img/googleplay.png";
import appstore from "../assets/img/appstore.png";
import qrCode from "../assets/img/qr-code.jpg";

import BannerWrapper from "../components/Banner-Wrapper";
import FlightHotelWearchWrapper from "../components/flight-hotel-search-wrapper";

import UnveilMagicCarousal from "../components/UnveilMagicCarousal";
import FlightLogosCarousal from "../components/FlightLogosCarousal";
import HomeBotttom from "../components/HomeBotttom";

const Home = () => {
  return (
    <>
      <BannerWrapper />
      <FlightHotelWearchWrapper/>
      <UnveilMagicCarousal />
      <FlightLogosCarousal />
      <div className="container">
        <div className="getappnow-wrapper">
          <div className="row">
            <div className="col-lg-6">
              <h3>
                Plan, Book &amp; Travel On-the-Go <br />
                Get the App Now!
              </h3>
              <div className="row">
                <div className="col-lg-8 col-md-8">
                  <input type="text" placeholder="Enter Your Mobile Number" />
                </div>
                <div className="col-lg-4 col-md-4">
                  <button>Send</button>
                </div>
              </div>
            </div>
            <div className="col-lg-2" />
            <div className="col-lg-4">
              <div className="apps-qrcode">
                <div className="downloadapp-buttons">
                  <a href="">
                    <img src={googleplay} alt="Goolge Play" />
                  </a>
                  <a href="">
                    <img src={appstore} alt="Appstore" />
                  </a>
                </div>
                <span>
                  <img src={qrCode} alt="QR Code" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeBotttom />
     
    </>
  );
};

export default Home;
