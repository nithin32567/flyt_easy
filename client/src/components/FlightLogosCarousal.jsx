import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousal.css";
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

const FlightLogosCarousal = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const flightLogos = [
    { id: 1, image: indigo, alt: "indigo" },
    { id: 2, image: flydubai, alt: "flydubai" },
    { id: 3, image: airarabia, alt: "airarabia" },
    { id: 4, image: spicejet, alt: "spicejet" },
    { id: 5, image: ethihad, alt: "ethihad" },
    { id: 6, image: saudiArabiaAirlines, alt: "saudi-arabia-airlines" },
    { id: 7, image: malaysia, alt: "malaysia" },
    { id: 8, image: iarindia, alt: "airindia" },
    { id: 9, image: thai, alt: "thai" },
    { id: 10, image: emirates, alt: "emirates" },
    { id: 11, image: singaporeAirlines, alt: "singapore-airlines" },
    { id: 12, image: pia, alt: "pia" },
    { id: 13, image: gulfAir, alt: "gulf-air" },
  ];

  return (
    <div>
      <section className="flight-logos-wrap magicofindia-wrap">
        <div className="container">
          <div className="row partners-scroll">
            <div className="carousel-container">
              <Slider {...settings}>
                {flightLogos.map((logo) => (
                  <div key={logo.id} className="slide-item">
                    <div className="partners-logo">
                      <span>
                        <img src={logo.image} alt={logo.alt} />
                      </span>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FlightLogosCarousal