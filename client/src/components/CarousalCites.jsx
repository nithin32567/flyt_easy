import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousal.css";
import bali from "../assets/img/bali.jpg";

const CarousalCites = ({ Card }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    centerPadding: "0px",
    lazyLoad: "ondemand",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          dots: false,
        },
      },
    ],
  };

  const cites = [
    {
      id: 1,

      image: bali,
    },
    {
      id: 2,

      image: bali,
    },
    {
      id: 3,

      image: bali,
    },
    {
      id: 4,

      image: bali,
    },
  ];

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {cites.map((cite) => (
          <div key={cite.id} className="slide-item flex justify-center">
            <Card className="w-full mx-auto" image={cite.image} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarousalCites;
