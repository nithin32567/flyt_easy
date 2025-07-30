import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import topdestinations from "../assets/img/topdestinations.jpg";
import "./carousal.css";

const UnveilMagicCarousal = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const destinationsData = [
    {
      id: 1,
      title: "Tamil Nadu's Charming Hill Town",
      image: topdestinations,
      alt: "Tamil Nadu's Charming Hill Town",
    },
    {
      id: 2,
      title: "Kerala's Backwater Paradise",
      image: topdestinations,
      alt: "Kerala's Backwater Paradise",
    },
    {
      id: 3,
      title: "Rajasthan's Golden Fortress",
      image: topdestinations,
      alt: "Rajasthan's Golden Fortress",
    },
    {
      id: 4,
      title: "Goa's Beach Bliss",
      image: topdestinations,
      alt: "Goa's Beach Bliss",
    },
    {
      id: 5,
      title: "Himachal's Mountain Magic",
      image: topdestinations,
      alt: "Himachal's Mountain Magic",
    },
    {
      id: 6,
      title: "Uttarakhand's Spiritual Retreat",
      image: topdestinations,
      alt: "Uttarakhand's Spiritual Retreat",
    },
  ];

  return (
    <div>
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
          <div className="carousel-container">
            <Slider {...settings}>
              {destinationsData.map((destination) => (
                <div key={destination.id} className="slide-item">
                  <a href="#" className="popular-destinations-item">
                    <i className="fa-solid fa-link" />
                    <img src={destination.image} alt={destination.alt} />
                    <h4>{destination.title}</h4>
                  </a>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UnveilMagicCarousal;
