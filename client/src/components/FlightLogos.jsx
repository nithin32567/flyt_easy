import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import indigo from "../assets/img/indigo.jpg";
import flydubai from "../assets/img/flydubai.jpg";
import airarabia from "../assets/img/airarabia.jpg";
import spicejet from "../assets/img/spicejet.jpg";
import ethihad from "../assets/img/ethihad.jpg";
import saudi from "../assets/img/saudi-arabia-airlines.jpg";
import malaysia from "../assets/img/malaysia.jpg";
import airindia from "../assets/img/iarindia.jpg";
import thai from "../assets/img/thai.jpg";
import emirates from "../assets/img/emirates.jpg";
import singapore from "../assets/img/singapore-airlines.jpg";
import pia from "../assets/img/pia.jpg";
import gulfair from "../assets/img/gulf-air.jpg";
import LogoCard from "./LogoCard";

const images = [
  { src: indigo, alt: "Indigo" },
  { src: flydubai, alt: "Flydubai" },
  { src: airarabia, alt: "Air Arabia" },
  { src: spicejet, alt: "SpiceJet" },
  { src: ethihad, alt: "Etihad" },
  { src: saudi, alt: "Saudi Arabia Airlines" },
  { src: malaysia, alt: "Malaysia Airlines" },
  { src: airindia, alt: "Air India" },
  { src: thai, alt: "Thai Airways" },
  { src: emirates, alt: "Emirates" },
  { src: singapore, alt: "Singapore Airlines" },
  { src: pia, alt: "PIA" },
  { src: gulfair, alt: "Gulf Air" },
];

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1280 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 1280, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
  },
  smallTablet: {
    breakpoint: { max: 768, min: 640 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1,
  },
};

const FlightLogos = () => {
  return (
    <div className="my-12 w-full flex justify-center items-center">
      <div className="w-full max-w-7xl px-4">
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={3000}
          arrows={false}
          showDots={false}
          swipeable
          draggable
          containerClass="carousel-container"
          itemClass="carousel-item-padding-40-px"
          centerMode={true}
        >
          {images.map((image, index) => (
            <div key={index} className="flex justify-center items-center px-2">
              <LogoCard image={image.src} alt={image.alt} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default FlightLogos;
