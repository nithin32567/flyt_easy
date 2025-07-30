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

const Dmo = () => {
  return (
    <>
      {/* <HeaderWrapper /> */}

      <BannerWrapper />
      
      {/* <section>
        <div className="container">
          <div className="booking-tabs-wrapper">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  <img src={flightIcon} alt="Flight Booking" />
                  Flight Booking
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  type="button"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  <img src={hotelIcon} alt="Hotel Booking" /> Hotel Booking
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div className="onewar-roundtrip">
                  <ul>
                    <li>
                      <label>
                        <input
                          type="radio"
                          name="trip"
                          id=""
                          defaultChecked=""
                        />{" "}
                        One Way
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="radio" name="trip" id="" /> Round Trip
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="radio" name="trip" id="" /> Multi City
                      </label>
                    </li>
                  </ul>
                </div>
                <div className="row">
                  <div className="col-lg-5">
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <button className="select-items">
                          <h6>FROM</h6>
                          <h2>Mumbai</h2>
                          <p>[BOM] Chhatrapati Shivaji International</p>
                        </button>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <button className="select-items">
                          <h6>To</h6>
                          <h2>New Delhi</h2>
                          <p>[BOM] Chhatrapati Shivaji International</p>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="row">
                      <div className="col-lg-3 col-md-4 col-6">
                        <button className="select-items">
                          <h6>DEPART</h6>
                          <h2>
                            16 <span>Jul'25</span>
                          </h2>
                          <p>Wednesday</p>
                        </button>
                      </div>
                      <div className="col-lg-3 col-md-4 col-6">
                        <button className="select-items">
                          <h6>RETURN</h6>
                          <h2>
                            16 <span>Jul'25</span>
                          </h2>
                          <p>Tuesday</p>
                        </button>
                      </div>
                      <div className="col-lg-3 col-md-4">
                        <button className="select-items">
                          <h6>Travellers</h6>
                          <h2>
                            2 <span>Travellers</span>
                          </h2>
                          <p>Economy</p>
                        </button>
                      </div>
                      <div className="col-lg-3">
                        <button className="search-btn">Search</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bookingcheckbox">
                  <ul>
                    <li>
                      <label>
                        <input type="checkbox" name="" id="" /> Direct Flights
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" name="" id="" /> Defence Fare
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" name="" id="" /> Student Fare
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" name="" id="" /> Senior Citizen
                        Fare
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </section> */}
      <FlightHotelWearchWrapper />
      {/* <section className="hotdeals-wrapper">
        <div className="container">
          <div className="row home-headings">
            <div className="col-lg-9 col-md-9">
              <h3>Hot Deals on the Move!</h3>
            </div>
            <div className="col-lg-3 col-md-3">
              <button className="viewall-btn">
                View All <i className="fa-regular fa-square-caret-right" />
              </button>
            </div>
          </div>
          <div className="hotdeals-scroll">
            <div className="col-lg-3">
              <a href="" className="hotdeals-item">
                <span>
                  <i className="fa-solid fa-link" />
                  <img
                    src={topdestinations}
                    alt="Tamil Nadu's Charming Hill Town"
                  />
                </span>
                <h5>For You: MakeMyTrip ICICI Bank Credit Card!</h5>
                <h6>Book Now</h6>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="" className="hotdeals-item">
                <span>
                  <i className="fa-solid fa-link" />
                  <img
                    src={topdestinations}
                    alt="Tamil Nadu's Charming Hill Town"
                  />
                </span>
                <h5>For You: MakeMyTrip ICICI Bank Credit Card!</h5>
                <h6>Book Now</h6>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="" className="hotdeals-item">
                <span>
                  <i className="fa-solid fa-link" />
                  <img
                    src={topdestinations}
                    alt="Tamil Nadu's Charming Hill Town"
                  />
                </span>
                <h5>For You: MakeMyTrip ICICI Bank Credit Card!</h5>
                <h6>Book Now</h6>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="" className="hotdeals-item">
                <span>
                  <i className="fa-solid fa-link" />
                  <img
                    src={topdestinations}
                    alt="Tamil Nadu's Charming Hill Town"
                  />
                </span>
                <h5>For You: MakeMyTrip ICICI Bank Credit Card!</h5>
                <h6>Book Now</h6>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="" className="hotdeals-item">
                <span>
                  <i className="fa-solid fa-link" />
                  <img
                    src={topdestinations}
                    alt="Tamil Nadu's Charming Hill Town"
                  />
                </span>
                <h5>For You: MakeMyTrip ICICI Bank Credit Card!</h5>
                <h6>Book Now</h6>
              </a>
            </div>
          </div>
        </div>
      </section> */}
      <HotDeals />
      {/* <section className="stays-selected-wrap">
        <div className="container">
          <div className="row home-headings">
            <div className="col-lg-9 col-md-9">
              <h3>Stays Selected with Care</h3>
            </div>
            <div className="col-lg-3 col-md-3">
              <button className="viewall-btn">
                View All <i className="fa-regular fa-square-caret-right" />
              </button>
            </div>
          </div>
          <div className="services-scroll">
            <div className="col-lg-3">
              <a href="#" className="popular-destinations-item">
                <i className="fa-solid fa-link" />
                <img
                  src={topdestinations}
                  alt="Tamil Nadu's Charming Hill Town"
                />
                <h4>Stays in &amp; Around Delhi for a Weekend Getaway</h4>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="#" className="popular-destinations-item">
                <i className="fa-solid fa-link" />
                <img
                  src={topdestinations}
                  alt="Tamil Nadu's Charming Hill Town"
                />
                <h4>Stays in &amp; Around Delhi for a Weekend Getaway</h4>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="#" className="popular-destinations-item">
                <i className="fa-solid fa-link" />
                <img
                  src={topdestinations}
                  alt="Tamil Nadu's Charming Hill Town"
                />
                <h4>Stays in &amp; Around Delhi for a Weekend Getaway</h4>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="#" className="popular-destinations-item">
                <i className="fa-solid fa-link" />
                <img
                  src={topdestinations}
                  alt="Tamil Nadu's Charming Hill Town"
                />
                <h4>Stays in &amp; Around Delhi for a Weekend Getaway</h4>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="#" className="popular-destinations-item">
                <i className="fa-solid fa-link" />
                <img
                  src={topdestinations}
                  alt="Tamil Nadu's Charming Hill Town"
                />
                <h4>Stays in &amp; Around Delhi for a Weekend Getaway</h4>
              </a>
            </div>
          </div>
        </div>
      </section> */}
      <StaysCarousal />
      <section>
        <div className="container">
          <div className="redefine-travel-wrap">
            <div className="row">
              <div className="col-lg-5">
                <img src={redefineTravel} alt="Redefining Travel" />
              </div>
              <div className="col-lg-7">
                <h3>
                  Redefining Travel <br />
                  Elegance with Emirates
                </h3>
                <p>
                  Experience world-class comfort, gourmet dining, and
                  award-winning service — all in partnership with Emirates, your
                  gateway to luxurious travel.
                </p>
                <button className="viewall-btn">
                  View All <i className="fa-regular fa-square-caret-right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="magicofindia-wrap">
        <div className="container">
          <div className="row home-headings">
            <div className="col-lg-9 col-md-9">
              <h3>Unveil the Magic of India</h3>
            </div>
            <div className="col-lg-3 col-md-3">
              <button className="viewall-btn">
                View All <i className="fa-regular fa-square-caret-right" />
              </button>
            </div>
          </div>
          <div className="services-scroll">
            <div className="col-lg-3">
              <a href="#" className="popular-destinations-item">
                <i className="fa-solid fa-link" />
                <img
                  src={topdestinations}
                  alt="Tamil Nadu's Charming Hill Town"
                />
                <h4>Tamil Nadu's Charming Hill Town</h4>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="#" className="popular-destinations-item">
                <i className="fa-solid fa-link" />
                <img
                  src={topdestinations}
                  alt="Tamil Nadu's Charming Hill Town"
                />
                <h4>Tamil Nadu's Charming Hill Town</h4>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="#" className="popular-destinations-item">
                <i className="fa-solid fa-link" />
                <img
                  src={topdestinations}
                  alt="Tamil Nadu's Charming Hill Town"
                />
                <h4>Tamil Nadu's Charming Hill Town</h4>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="#" className="popular-destinations-item">
                <i className="fa-solid fa-link" />
                <img
                  src={topdestinations}
                  alt="Tamil Nadu's Charming Hill Town"
                />
                <h4>Tamil Nadu's Charming Hill Town</h4>
              </a>
            </div>
            <div className="col-lg-3">
              <a href="#" className="popular-destinations-item">
                <i className="fa-solid fa-link" />
                <img
                  src={topdestinations}
                  alt="Tamil Nadu's Charming Hill Town"
                />
                <h4>Tamil Nadu's Charming Hill Town</h4>
              </a>
            </div>
          </div>
        </div>
      </section> */}
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

export default Dmo;
