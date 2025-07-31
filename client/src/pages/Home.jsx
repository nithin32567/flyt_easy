import React from "react";
import flightIcon from "../assets/img/flight-icon.png";
import hotelIcon from "../assets/img/hotel-booking.png";
import topdestinations from "../assets/img/topdestinations.jpg";
import flyteasyLogo from "../assets/img/flyteasy-logo.png";
import redefineTravel from "../assets/img/redefine-travel.jpg";
import indigo from "../assets/img/indigo.jpg";
import flydubai from "../assets/img/flydubai.jpg";
import airarabia from "../assets/img/airarabia.jpg";
import spicejet from "../assets/img/spicejet.jpg";
import ethihad from "../assets/img/ethihad.jpg";
import saudiArabiaAirlines from "../assets/img/saudi-arabia-airlines.jpg";
import malaysia from "../assets/img/malaysia.jpg";
import iarindia from "../assets/img/iarindia.jpg";
import thai from "../assets/img/thai.jpg";
import emirates from "../assets/img/emirates.jpg";
import singaporeAirlines from "../assets/img/singapore-airlines.jpg";
import pia from "../assets/img/pia.jpg";
import gulfAir from "../assets/img/gulf-air.jpg";
import googleplay from "../assets/img/googleplay.png";
import appstore from "../assets/img/appstore.png";
import qrCode from "../assets/img/qr-code.jpg";
import whychooseIcon from "../assets/img/whychoose-icon.png";
import easyFlightBooking from "../assets/img/easy-flight-booking.png";
import flyAcrossIndia from "../assets/img/fly-across-india.png";
import BannerWrapper from "../components/Banner-Wrapper";
import HeaderWrapper from "../components/HeaderWrapper";
import FlightHotelWearchWrapper from "../components/flight-hotel-search-wrapper";
import HotDeals from "../components/HotDeals";
import StaysCarousal from "../components/StaysCarousal";
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
