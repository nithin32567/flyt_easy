import React from 'react'
import flightIcon from '../assets/img/flight-icon.png'
import hotelIcon from '../assets/img/hotel-booking.png'
import banner01 from '../assets/img/banner-01.jpg'
import topdestinations from '../assets/img/topdestinations.jpg'

const Dmo = () => {
    return (
        <div>
            <section className="banner-wrapper">
                <div id="carouselExample" className="carousel slide">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={banner01} alt="Flyteasy" />
                            <div className="container">
                                <div className="bannerwrap-text">
                                    <div className="bannerwrap-middlealign">
                                        <div className="row justify-content-center">
                                            <div className="col-lg-8">
                                                <h1>
                                                    Fast Booking. <br />
                                                    Great Prices. Smooth Takeoff
                                                </h1>
                                                <p>
                                                    With Flyteasy, booking your next flight is faster, easier,
                                                    and more affordable — compare real-time prices, choose
                                                    from top airlines, and take off on your dream journey in
                                                    just a few clicks.
                                                </p>
                                                <button className="signin-btn">Sign In / Register</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>
            <section>
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
                                    <img src={hotelIcon} alt="Hotel Booking" /> Hotel
                                    Booking
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
                                                <input type="radio" name="trip" id="" defaultChecked="" />{" "}
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
                                                <input type="checkbox" name="" id="" /> Senior Citizen Fare
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="profile"
                                role="tabpanel"
                                aria-labelledby="profile-tab"
                            >
                                <div className="onewar-roundtrip">
                                    <ul>
                                        <li>
                                            <label>
                                                <input type="radio" name="trips" id="" defaultChecked="" />{" "}
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
                                            <div className="col-lg-7 col-md-6">
                                                <button className="select-items">
                                                    <h6>City, Property name or Location</h6>
                                                    <h2>Goa</h2>
                                                    <p>India</p>
                                                </button>
                                            </div>
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
                                                <button className="search-btn">Search</button>
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
                    </div>
                </div>
            </section>
            <section className="hotdeals-wrapper">
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
            </section>
            <section className="stays-selected-wrap">
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
            </section>
            <section>
                <div className="container">
                    <div className="redefine-travel-wrap">
                        <div className="row">
                            <div className="col-lg-5">
                                <img src="img/redefine-travel.jpg" alt="Redefining Travel" />
                            </div>
                            <div className="col-lg-7">
                                <h3>
                                    Redefining Travel <br />
                                    Elegance with Emirates
                                </h3>
                                <p>
                                    Experience world-class comfort, gourmet dining, and award-winning
                                    service — all in partnership with Emirates, your gateway to
                                    luxurious travel.
                                </p>
                                <button className="viewall-btn">
                                    View All <i className="fa-regular fa-square-caret-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="magicofindia-wrap">
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
                                    src="img/topdestinations.jpg"
                                    alt="Tamil Nadu's Charming Hill Town"
                                />
                                <h4>Tamil Nadu's Charming Hill Town</h4>
                            </a>
                        </div>
                        <div className="col-lg-3">
                            <a href="#" className="popular-destinations-item">
                                <i className="fa-solid fa-link" />
                                <img
                                    src="img/topdestinations.jpg"
                                    alt="Tamil Nadu's Charming Hill Town"
                                />
                                <h4>Tamil Nadu's Charming Hill Town</h4>
                            </a>
                        </div>
                        <div className="col-lg-3">
                            <a href="#" className="popular-destinations-item">
                                <i className="fa-solid fa-link" />
                                <img
                                    src="img/topdestinations.jpg"
                                    alt="Tamil Nadu's Charming Hill Town"
                                />
                                <h4>Tamil Nadu's Charming Hill Town</h4>
                            </a>
                        </div>
                        <div className="col-lg-3">
                            <a href="#" className="popular-destinations-item">
                                <i className="fa-solid fa-link" />
                                <img
                                    src="img/topdestinations.jpg"
                                    alt="Tamil Nadu's Charming Hill Town"
                                />
                                <h4>Tamil Nadu's Charming Hill Town</h4>
                            </a>
                        </div>
                        <div className="col-lg-3">
                            <a href="#" className="popular-destinations-item">
                                <i className="fa-solid fa-link" />
                                <img
                                    src="img/topdestinations.jpg"
                                    alt="Tamil Nadu's Charming Hill Town"
                                />
                                <h4>Tamil Nadu's Charming Hill Town</h4>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="flight-logos-wrap">
                <div className="container">
                    <div className="row partners-scroll">
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/indigo.jpg" alt="indigo" />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/flydubai.jpg" alt="flydubai" />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/airarabia.jpg" alt="airarabia" />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/spicejet.jpg" alt="spicejet" />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/ethihad.jpg" alt="ethihad" />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img
                                        src="img/saudi-arabia-airlines.jpg"
                                        alt="saudi-arabia-airlines"
                                    />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/malaysia.jpg" alt="malaysia" />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/iarindia.jpg" alt="airindia" />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/thai.jpg" alt="thai" />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/emirates.jpg" alt="emirates" />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/singapore-airlines.jpg" alt="singapore-airlines" />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/pia.jpg" alt="pia" />
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="partners-logo">
                                <span>
                                    <img src="img/gulf-air.jpg" alt="gulf-air" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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
                                        <img src="img/googleplay.png" alt="Goolge Play" />
                                    </a>
                                    <a href="">
                                        <img src="img/appstore.png" alt="Appstore" />
                                    </a>
                                </div>
                                <span>
                                    <img src="img/qr-code.jpg" alt="QR Code" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="homebottom-text">
                <div className="container">
                    <h4>Flyteasy</h4>
                    <p>
                        About Us, Careers, Investor Info, Sustainability at Flyteasy, Flyteasy
                        Foundation, Legal Policies, CSR &amp; Committees, Flyteasy for Business
                        Travel, Travel Agent Portal, List Your Property, Our Partners – Redbus,
                        Goibibo with Flyteasy, Promote with Flyteasy, Franchise Opportunities,
                        Currency &amp; Forex Services, Ferry Booking Malaysia, Ferry Booking
                        Singapore, Travel with Flyteasy Vietnam, Flyteasy Cambodia, Things to Do
                        in Malaysia, Things to Do in Singapore
                    </p>
                    <h4>Quick Links</h4>
                    <p>
                        Delhi–Chennai Flights, Delhi–Mumbai Flights, Delhi–Goa Flights,
                        Chennai–Mumbai Flights, Mumbai–Hyderabad Flights, Kolkata to Rupsi
                        Flights, Rupsi to Guwahati Flights, Pasighat to Guwahati Flights, Delhi
                        to Khajuraho Flights, Cochin to Agatti Island Flights, Hotels in Delhi,
                        Hotels in Mumbai, Hotels in Goa, Hotels in Jaipur, Hotels in Ooty,
                        Hotels in Udaipur, Hotels in Puri, Hotels in North Goa, Hotels in
                        Rishikesh, Honeymoon Packages, Kerala Holidays, Kashmir Getaways, Ladakh
                        Adventures, Goa Escapes, Thailand Trips, Sri Lanka Visa, Thailand Visa,
                        Explore Goa, Explore Manali, Explore Shimla, Explore Jaipur, Explore
                        Srinagar
                    </p>
                    <h4>Site Info</h4>
                    <p>
                        Customer Help, Payment &amp; Security, Privacy Policy, Cookie
                        Preferences, Terms of Use, Franchise Locations, Quick Payments, Work
                        With Us, Grievance Redressal, Report a Security Concern
                    </p>
                    <h4>Useful Links</h4>
                    <p>
                        Cheap Flight Deals, Live Flight Status, Pilgrimage Offers, Domestic
                        Airlines, International Airlines, IndiGo, SpiceJet, AirAsia, Air India,
                        IRCTC Rail Bookings, Travel Guides, Beach Vacations, Romantic Holidays,
                        Top Destinations, Resorts in Udaipur, Munnar Resorts, Lonavala Villas,
                        Hotels in Thailand, Villas in Goa, Domestic Flight Offers, International
                        Flight Deals, UAE Flight Discounts, USA Travel Offers, Travel to UAE,
                        Saudi Arabia, UK Travel, Oman Flights
                    </p>
                    <h4>Corporate Travel Solutions</h4>
                    <p>
                        Business Travel Plans, Corporate Flight &amp; Hotel Booking, Expense
                        Management Tools, Flight GST Billing, Hotel GST Invoicing, Train/Bus GST
                        Invoices, T&amp;E Tools, Flyteasy for Small Businesses, Free
                        Cancellation on Intl Flights, Smart Travel for SMEs
                    </p>
                    <h4>Flyteasy Services</h4>
                    <p>
                        Flight Bookings, International Flights, Charter Flights, Hotel
                        Reservations, Overseas Hotels, Online Visa Applications, Villas &amp;
                        Homestays, Tour Activities, Indian Holidays, International Packages, Cab
                        Booking, Bus Tickets, Train Booking, Book Flights from USA/UAE, Plan My
                        Trip, Forex Cards, Buy Currency, Travel Insurance (India &amp;
                        International), Gift Cards for Every Occasion, Blog &amp; Travel Tips,
                        Track Your PNR, Flyteasy Ads Platform, One-Way Cab Booking
                    </p>
                    <h4>Top Hotels in India</h4>
                    <p>
                        Fairmont Jaipur, St. Regis Goa, Six Senses Fort Barwara, W Goa, Grand
                        Hyatt Goa, Taj Rishikesh, Shangri-La Bengaluru, JW Marriott Mumbai, Taj
                        Lake Palace Udaipur, The Leela Palace Udaipur, Rambagh Palace Jaipur,
                        The Oberoi New Delhi, ITC Grand Chola Chennai, The Taj Mahal Palace
                        Mumbai, and many more.
                    </p>
                    <h4>Top International Hotels</h4>
                    <p>
                        Atlantis The Palm Dubai, Taj Dubai, JW Marriott Singapore, Coco Bodu
                        Hithi Maldives, Marina Bay Sands Singapore, Amari Phuket, Caesars
                        Palace, Pan Pacific Singapore, Hilton Pattaya, Taj Samudra Colombo,
                        Village Hotel Bugis, Reethi Beach Resort, The Plaza New York, and more.
                    </p>
                    <h4>Visa Services</h4>
                    <p>
                        Visa for Dubai, Malaysia, Thailand, Singapore, Vietnam, Indonesia,
                        Japan, Australia, UK, Canada, China, Sri Lanka, Hong Kong, Georgia, USA
                    </p>
                    <h4>Book Hotels in Popular Indian Destinations</h4>
                    <p>
                        Hotels in Jaipur, Hotels in Goa, Hotels in Delhi, Hotels in Udaipur,
                        Hotels in Mumbai, Hotels in Bangalore, Hotels in Rishikesh, Hotels in
                        Manali, Hotels in Shimla, Hotels in Agra, Hotels in Kasauli, Hotels in
                        Munnar, Hotels in Ayodhya, Hotels in Gulmarg, Hotels in Hyderabad, and
                        more.
                    </p>
                </div>
            </section>
            <section className="footertop-section-wrap">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-12">
                            <span>
                                <img src="img/whychoose-icon.png" alt="Why Choose Us" />
                            </span>
                            <h4>Why Choose Us</h4>
                            <p>
                                Flyteasy is designed to make travel simple, fast, and affordable.
                                From comparing top airlines to securing the best deals, we ensure a
                                smooth booking experience from start to finish.
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-12">
                            <span>
                                <img src="img/easy-flight-booking.png" alt="Easy Flight Booking" />
                            </span>
                            <h4>Easy Flight Booking</h4>
                            <p>
                                Skip the long queues and complex processes — with Flyteasy, you can
                                search, select, and book your flight in just a few clicks, anytime,
                                anywhere.
                            </p>
                        </div>
                        <div className="col-lg-4 col-md-12">
                            <span>
                                <img src="img/fly-across-india.png" alt="Fly Across India" />
                            </span>
                            <h4>Fly Across India</h4>
                            <p>
                                Explore India’s top destinations with ease. Whether it’s a quick
                                business trip or a weekend getaway, Flyteasy offers reliable
                                domestic flight options at great prices.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="footer-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <ul className="socialmedia-icons">
                                <li>
                                    <a href="#" className="fb" target="_blank">
                                        <i className="fab fa-facebook-f" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="li" target="_blank">
                                        <i className="fab fa-linkedin-in" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="tw" target="_blank">
                                        <i className="fa-brands fa-x-twitter" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="in" target="_blank">
                                        <i className="fab fa-instagram" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="em" target="_blank">
                                        <i className="fa-regular fa-envelope" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <p>2025 © Flyteasy. All Right Reserved.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    )
}

export default Dmo
