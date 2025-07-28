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
import { SquarePlay } from "lucide-react";

const FlightSearch = () => {
  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="relative z-20">
        <Demobanner />
      </div>

      <div className="relative z-20 w-full flex flex-col gap-4 px-4 py-8 md:max-w-7xl mx-auto ">
        <SearchForm />
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-2xl font-bold">Stays Selected With Care</h2>
            <button className=" flex text-orange-400 cursor-pointer text-xs flex-row items-center gap-2 px-4 py-2 rounded-md">
              <span>View All </span>
              <SquarePlay className="w-2 h-2" />
            </button>
          </div>
          <CarousalCites Card={Card} />
        </div>
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-2xl font-bold">Stays Selected With Care</h2>
            <button className=" flex text-orange-400 cursor-pointer text-xs flex-row items-center gap-2 px-4 py-2 rounded-md">
              <span>View All </span>
              <SquarePlay className="w-2 h-2" />
            </button>
          </div>
          <CarousalCites Card={StayCard} />
        </div>
        <div className="w-full max-w-7xl mx-auto">
          <RedefineTravel />
        </div>
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-2xl font-bold">Unveil the Magic of india</h2>
            <button className=" flex text-orange-400 cursor-pointer text-xs flex-row items-center gap-2 px-4 py-2 rounded-md">
              <span>View All </span>
              <SquarePlay className="w-2 h-2" />
            </button>
          </div>
          <CarousalCites Card={StayCard} />
        </div>
        <div className="w-full max-w-7xl mx-auto">
          <FlightLogos />
        </div>
        <div className="w-full max-w-7xl mx-auto">
          <AppAvailableComponent />
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
