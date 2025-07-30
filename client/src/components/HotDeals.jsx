import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import topdestinations from "../assets/img/topdestinations.jpg";
import "./HotDealsCarousel.css";

const HotDealsCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: false,
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

  const hotDealsData = [
    {
      id: 1,
      title: "For You: MakeMyTrip ICICI Bank Credit Card!",
      image: topdestinations,
      alt: "Tamil Nadu's Charming Hill Town",
    },
    {
      id: 2,
      title: "For You: MakeMyTrip ICICI Bank Credit Card!",
      image: topdestinations,
      alt: "Tamil Nadu's Charming Hill Town",
    },
    {
      id: 3,
      title: "For You: MakeMyTrip ICICI Bank Credit Card!",
      image: topdestinations,
      alt: "Tamil Nadu's Charming Hill Town",
    },
    {
      id: 4,
      title: "For You: MakeMyTrip ICICI Bank Credit Card!",
      image: topdestinations,
      alt: "Tamil Nadu's Charming Hill Town",
    },
    {
      id: 5,
      title: "For You: MakeMyTrip ICICI Bank Credit Card!",
      image: topdestinations,
      alt: "Tamil Nadu's Charming Hill Town",
    },
  ];

  return (
    <div>
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
          <div className="hotdeals-carousel">
            <Slider {...settings}>
              {hotDealsData.map((deal) => (
                <div key={deal.id} className="carousel-item-wrapper">
                  <a href="" className="hotdeals-item">
                    <span>
                      <i className="fa-solid fa-link" />
                      <img src={deal.image} alt={deal.alt} />
                    </span>
                    <h5>{deal.title}</h5>
                    <h6>Book Now</h6>
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

export default HotDealsCarousel;
