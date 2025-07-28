import React from "react";
import redefineImg from "../assets/img/redefine-travel.jpg"; // Make sure to adjust the import path
import { SquarePlay } from "lucide-react";

const RedefineTravel = () => {
  return (
    <div className="bg-[#16437c] rounded-xl  lg:flex items-center justify-between overflow-hidden py-12">
      {/* Image Section */}
      <div className="lg:w-1/3 w-full mb-6 lg:mb-0">
        <img
          src={redefineImg}
          alt="Redefining Travel"
          className="md:rounded-l-[40%] md:w-full md:h-auto  md:mt-0
           rounded-full h-[200px] w-[200px] mx-auto object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="lg:w-2/3 w-full text-white px-2 lg:px-10">
        <h3 className="text-2xl lg:text-3xl font-bold leading-snug mb-4 text-center md:text-left">
          Redefining Travel <br className="hidden sm:block" />
          Elegance with Emirates
        </h3>
        <p className="text-base lg:text-sm leading-relaxed mb-6 text-gray-300 text-center md:text-left">
          Experience world-class comfort, gourmet dining, and award-winning
          service — all in partnership with Emirates, your gateway to luxurious
          travel.
        </p>
        <button className=" flex text-orange-400 cursor-pointer text-xs flex-row items-center gap-2 px-4 py-2 font-bold  rounded-md mx-auto md:mx-0">
          <span>View All </span>
          <SquarePlay className="w-4 h-4 text-orange-400 font-bold" />
        </button>
      </div>
    </div>
  );
};

export default RedefineTravel;
