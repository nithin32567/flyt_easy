import React from "react";
import banner01 from "../assets/img/banner-01.jpg";
import SearchForm from "./SearchForm";
import HeaderSection from "./HeaderSection";
import MiniHeader from "./MIni-Header";

const Demobanner = () => {
  return (
    <div className="w-full min-h-[60vh] md:h-[60vh] relative bg-red-900 z-10">
      <div className="w-full h-full absolute top-0 left-0 bg-[#16437c] opacity-90 z-10"></div>
      <div className="w-full h-full absolute top-0 left-0 z-10 ">
        <MiniHeader />
      </div>
      <img className="w-full h-full object-cover z-10" src={banner01} alt="" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center z-50 opacity-100 flex flex-col gap-2 md:gap-4 px-4 md:px-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl  leading-tight">
          Fast Booking. <br />
          Great Prices. Smooth Takeoff
        </h1>
        <h3 className="text-sm sm:text-base md:text-lg  leading-relaxed max-w-4xl mx-auto">
          With Flyteasy, booking your next flight is faster, easier, and more
          affordable — compare real-time prices, choose from top airlines, and
          take off on your dream journey in just a few clicks.
        </h3>
        <button className="hover:bg-[#f48f22] border-2 border-[#f48f22] w-full sm:w-[250px] md:w-[300px] mx-auto hover:text-white text-[#f48f22] cursor-pointer px-4 py-2 rounded-md text-sm md:text-base transition-colors duration-300">
          Book Now
        </button>
      </div>
      <div className="md:absolute lg:block hidden -translate-y-1/4 w-full h-full z-20 px-4 md:px-0">
        <SearchForm />
      </div>
    </div>
  );
};

export default Demobanner;
