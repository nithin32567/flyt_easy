import React from "react";
import whychooseIcon from "../assets/img/whychoose-icon.png";
import easyFlightBooking from "../assets/img/easy-flight-booking.png";
import flyAcrossIndia from "../assets/img/fly-across-india.png";

const Footer = () => {
  return (
    <div>
      <section className="footertop-section-wrap">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-12">
              <span>
                <img src={whychooseIcon} alt="Why Choose Us" />
              </span>
              <h4>Why Choose Us</h4>
              <p>
                Flyteasy is designed to make travel simple, fast, and
                affordable. From comparing top airlines to securing the best
                deals, we ensure a smooth booking experience from start to
                finish.
              </p>
            </div>
            <div className="col-lg-4 col-md-12">
              <span>
                <img src={easyFlightBooking} alt="Easy Flight Booking" />
              </span>
              <h4>Easy Flight Booking</h4>
              <p>
                Skip the long queues and complex processes — with Flyteasy, you
                can search, select, and book your flight in just a few clicks,
                anytime, anywhere.
              </p>
            </div>
            <div className="col-lg-4 col-md-12">
              <span>
                <img src={flyAcrossIndia} alt="Fly Across India" />
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
    </div>
  );
};

export default Footer;
