import React from "react";
import banner01 from "../assets/img/banner-01.jpg";
import { useAuth } from "../contexts/AuthContext";

const BannerWrapper = () => {
  const { isAuthenticated, user } = useAuth();
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
                          With Flyteasy, booking your next flight is faster,
                          easier, and more affordable — compare real-time
                          prices, choose from top airlines, and take off on your
                          dream journey in just a few clicks.
                        </p>
                      {
                        isAuthenticated ? (
                          <button className="signin-btn">Welcome {user?.name}</button>
                        ):  <button onClick={() => navigate("/login")} className="signin-btn">
                        Sign In / Register
                      </button>
                      }
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
    </div>
  );
};

export default BannerWrapper;
