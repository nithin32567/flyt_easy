import React from 'react';
import { FaLink } from "react-icons/fa";

const StayCard = ({ image }) => {
    return (
        <div className="rounded-xl shadow-md w-[95%] h-[340px] overflow-hidden relative group">
            {/* Image */}
            <img
                src={image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 rounded-xl"
            />

            {/* Overlay with center-outward opacity effect */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-full h-full bg-gradient-to-b from-[#16437c]/0 via-[#16437c]/60 to-[#16437c]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out rounded-xl flex items-center justify-center">
                    <FaLink className="text-white text-2xl" />
                </div>
            </div>

            {/* Text */}
            <div className="absolute bottom-4 left-4 text-white z-20 w-[90%]">
                <h3 className="text-left text-lg font-semibold">
                    For You: MakeMyTrip ICICI Bank Credit Card!
                </h3>
            </div>
        </div>
    );
};

export default StayCard;
