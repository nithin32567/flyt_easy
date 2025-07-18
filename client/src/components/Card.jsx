import React from 'react';
import topdestinations from '../assets/img/topdestinations.jpg';
import { Link } from 'react-router-dom';

const Card = ({ image }) => {
    return (
        <div className="rounded-lg shadow-md mr-4 bg-gray-200 p-2 w-[300px] group relative overflow-hidden">
            <Link to="#" className="flex flex-col items-center justify-center">
                <div className="relative w-full h-[200px] overflow-hidden rounded-xl">
                    {/* Background Image */}
                    <img
                        src={image}
                        alt="Tamil Nadu's Charming Hill Town"
                        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-40 rounded-xl"
                    />

                    {/* Sliding Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[#16437c]/50 backdrop-blur-sm text-white px-4 text-center transition-transform duration-500 ease-in-out translate-y-[-100%] group-hover:translate-y-0">
                        <h3 className="text-lg font-semibold">
                            For You: MakeMyTrip ICICI Bank Credit Card!
                        </h3>
                    </div>
                </div>

                <h5 className="text-lg font-bold text-center mt-2">
                    For You: MakeMyTrip ICICI Bank Credit Card!
                </h5>
                <h3 className="text-sm font-bold text-[#f48f22]">Book Now</h3>
            </Link>
        </div>
    );
};

export default Card;
