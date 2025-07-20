import React from 'react';
import googleplay from '../assets/img/googleplay.png';
import appstore from '../assets/img/appstore.png';
import qrcode from '../assets/img/qr-code.jpg';

const AppAvailableComponent = () => {
    return (
        <section className=" px-4 md:px-8 lg:px-16 my-12">
            <div className="w-full bg-white border-2 border-orange-400 rounded-lg shadow-sm p-6 md:p-12">
                <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-10">
                    {/* Left Content */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight">
                                Plan, Book & Travel On-the-Go
                            </h3>
                            <p className="text-lg font-semibold text-orange-500">
                                Get the App Now!
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                            <input
                                type="text"
                                placeholder="Enter Your Mobile Number"
                                className="w-full border border-gray-300 py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                            <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                                SEND
                            </button>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-center justify-center gap-6">
                        {/* Store Buttons */}
                        <div className="flex flex-col gap-4">
                            <a href="#" className="transition-transform hover:scale-105">
                                <img
                                    src={googleplay}
                                    alt="Google Play"
                                    className="w-[160px] md:w-[185px] h-auto"
                                />
                            </a>
                            <a href="#" className="transition-transform hover:scale-105">
                                <img
                                    src={appstore}
                                    alt="App Store"
                                    className="w-[160px] md:w-[185px] h-auto"
                                />
                            </a>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <img
                                src={qrcode}
                                alt="QR Code"
                                className="w-[100px] md:w-[125px] h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppAvailableComponent;
