import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import topdestinations from "../assets/img/topdestinations.jpg";
import "./StaysCarousel.css";

const StaysCarousal = () => {
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

  const staysData = [
    {
      id: 1,
      title: "Stays in & Around Delhi for a Weekend Getaway",
      image: topdestinations,
      alt: "Delhi Weekend Getaway",
    },
    {
      id: 2,
      title: "Luxury Stays in Mumbai for Business Travel",
      image: topdestinations,
      alt: "Mumbai Business Travel",
    },
    {
      id: 3,
      title: "Beach Resorts in Goa for Summer Vacation",
      image: topdestinations,
      alt: "Goa Beach Resorts",
    },
    {
      id: 4,
      title: "Heritage Hotels in Jaipur for Cultural Experience",
      image: topdestinations,
      alt: "Jaipur Heritage Hotels",
    },
    {
      id: 5,
      title: "Mountain Retreats in Shimla for Peaceful Stay",
      image: topdestinations,
      alt: "Shimla Mountain Retreats",
    },
  ];

  return (
    <div>
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
          <div className="stays-carousel">
            <Slider {...settings}>
              {staysData.map((stay) => (
                <div key={stay.id} className="carousel-item-wrapper">
                  <a href="#" className="popular-destinations-item">
                    <i className="fa-solid fa-link" />
                    <img
                      src={stay.image}
                      alt={stay.alt}
                    />
                    <h4>{stay.title}</h4>
                  </a>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StaysCarousal