import React from "react";
import Navbar from "../components/Navbar";
import SearchForm from "../components/SearchForm";
import Banner from "../components/Banner";
import CarousalCites from "../components/CarousalCites";
import { Outlet } from "react-router-dom";
import Demobanner from "../components/Demobanner";
import Card from "../components/Card";
import StayCard from "../components/StayCard";
import RedefineTravel from "../components/RedefineTravel";
import MagicCard from "../components/MagicCard";
import FlightLogos from "../components/FlightLogos";
import AppAvailableComponent from "../components/AppAvailableComponent";

const FlightSearch = () => {
  return (
    <div className=" flex flex-col max-w-screen">
      <div className="w-full min-h-full ">
        <Demobanner />
      </div>

      <div className="w-full md:w-[95%] mx-auto relative z-20 md:-translate-y-1/7 -translate-y-1/6 ">
        <SearchForm />
      </div>

      <div className="flex flex-col  h-full mx-auto    px-4 md:px-0">
        <div className="flex items-center justify-between">
          <h3 className="md:text-3xl text-xl font-extrabold">Hot Deals on the Move!</h3>
          <button className="text-sm text-orange-600">View All</button>
        </div>
        <div>
          <CarousalCites Card={Card} />
        </div>
      </div>
      <div className="flex flex-col  h-full mx-auto    px-4 md:px-0">
        <div className="flex items-center justify-between">
          <h3 className="md:text-3xl text-xl font-extrabold">Stays Selected with Care</h3>
          <button className="text-sm text-orange-600">View All</button>
        </div>
        <div>
          <CarousalCites Card={StayCard} />
        </div>
      </div>
      <div className=" h-full mx-auto    px-4 md:px-0 mb-10">
        <RedefineTravel />
      </div>
      <div className="flex flex-col  h-full mx-auto    px-4 md:px-0">
        <div className="flex items-center justify-between">
          <h3 className="md:text-3xl text-xl font-extrabold">Unveil the Magic of India</h3>
          <button className="text-sm text-orange-600">View All</button>
        </div>
        <div>
          <CarousalCites Card={MagicCard} />
        </div>
      </div>
        <div className="md:max-w-[95%] h-full mx-auto  ">
          <FlightLogos />
      </div>
      <div className="w-full  md:max-w-[95%] h-full mx-auto mb-12 ">
        <AppAvailableComponent />
      </div>
    </div>
  );
};

export default FlightSearch;
