import React from "react";
import whychoose from "../assets/img/whychoose-icon.png";
import easyflight from "../assets/img/easy-flight-booking.png";
import flyacross from "../assets/img/fly-across-india.png";

const Footer1 = () => {
  return (
    <div className="footertop-section-wrap bg-gray-300">
      <div className="container flex  gap-2 py-16 items-center justify-center max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 grid-cols-1 px-10 md:px-0 gap-2 ">
          <div className="col-lg-4 col-md-12 flex flex-col gap-4 mx-auto items-start text-start  py-12">
            <span>
              <img
                className="w-[50px] h-[50px]"
                src={whychoose}
                alt="Why Choose Us"
              />
            </span>
            <h4>Why Choose Us</h4>
            <p className="text-sm text-gray-500">
              Flyteasy is designed to make travel simple, fast, and affordable.
              From comparing top airlines to securing the best deals, we ensure
              a smooth booking experience from start to finish.
            </p>
          </div>
          <div className="col-lg-4 col-md-12 flex flex-col gap-4 mx-auto items-start text-start  py-12 justify-center">
            <span>
              <img
                className="w-[50px] h-[50px]"
                src={easyflight}
                alt="Easy Flight Booking"
              />
            </span>
            <h4>Easy Flight Booking</h4>
            <p className="text-sm text-gray-500">
              Skip the long queues and complex processes — with Flyteasy, you
              can search, select, and book your flight in just a few clicks,
              anytime, anywhere.
            </p>
          </div>
          <div className="col-lg-4 col-md-12 flex flex-col gap-4 mx-auto items-start text-start  py-12 justify-center">
            <span>
              <img
                className="w-[50px] h-[50px]"
                src={flyacross}
                alt="Fly Across India"
              />
            </span>
            <h4>Fly Across India</h4>
            <p className="text-sm text-gray-500">
              Explore India’s top destinations with ease. Whether it’s a quick
              business trip or a weekend getaway, Flyteasy offers reliable
              domestic flight options at great prices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer1;
