import React from 'react';
import redefineImg from '../assets/img/redefine-travel.jpg'; // Make sure to adjust the import path

const RedefineTravel = () => {
    return (
        <div className="bg-[#16437c] rounded-xl  lg:flex items-center justify-between overflow-hidden">
            {/* Image Section */}
            <div className="lg:w-1/3 w-full mb-6 lg:mb-0">
                <img
                    src={redefineImg}
                    alt="Redefining Travel"
                    className="rounded-r-[40%] w-full h-auto object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="lg:w-2/3 w-full text-white px-2 lg:px-10">
                <h3 className="text-2xl lg:text-3xl font-bold leading-snug mb-4">
                    Redefining Travel <br className="hidden sm:block" />
                    Elegance with Emirates
                </h3>
                <p className="text-base lg:text-sm leading-relaxed mb-6 text-gray-300">
                    Experience world-class comfort, gourmet dining, and award-winning service —
                    all in partnership with Emirates, your gateway to luxurious travel.
                </p>
                <button className=" text-orange-400 font-semibold py-2 px-5 rounded-md  transition-all duration-300">
                    View All <i className="fa-regular fa-square-caret-right ml-2"></i>
                </button>
            </div>
        </div>
    );
};

export default RedefineTravel;
