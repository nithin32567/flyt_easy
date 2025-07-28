import React from 'react'

const HotelSearch = () => {
    return (
        <div>
            <div
                className="tab-pane fade"
                id="profile"
                role="tabpanel"
                aria-labelledby="profile-tab"
            >
                {/* TRIP TYPE RADIO BUTTONS */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 border-b pt-4 pb-8 md:pb-12 border-gray-200">
                    <ul className="flex flex-wrap items-center gap-2 md:gap-4 text-sm md:text-base">
                        <li className="flex px-2 md:px-4 rounded-3xl hover:bg-gray-200 py-1 md:py-2 cursor-pointer">
                            <label className="cursor-pointer">
                                <input className="mr-2" type="radio" name="trips" id="" defaultChecked="" />
                                Upto 4 Rooms
                            </label>
                        </li>
                        <li className="flex px-2 md:px-4 rounded-3xl hover:bg-gray-200 py-1 md:py-2 cursor-pointer">
                            <label className="cursor-pointer">
                                <input type="radio" name="trips" id="" className="mr-2" />
                                Group Deals
                            </label>
                        </li>
                    </ul>
                </div>

                {/* FORM SUBMIT SECTIONS */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 border-b border-gray-200">
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="w-full sm:w-1/2 cursor-pointer">
                                <button className="text-left bg-white rounded-md p-3 md:p-4 w-full h-full cursor-pointer hover:bg-gray-100">
                                    <h6 className="text-xs md:text-sm uppercase">City, Property name or Location</h6>
                                    <h2 className="text-lg md:text-2xl font-bold">Goa</h2>
                                    <p className="text-xs text-gray-500">India</p>
                                </button>
                            </div>
                            <div className="w-full sm:w-1/2 cursor-pointer">
                                <button className="text-left bg-white rounded-md p-3 md:p-4 w-full h-full cursor-pointer hover:bg-gray-100">
                                    <h6 className="text-xs md:text-sm text-gray-500">Rooms &amp; Guests</h6>
                                    <h2 className="text-lg md:text-xl font-bold">
                                        1 <span className="text-black text-base md:text-lg">Rooms</span> 2 <span className="text-black text-base md:text-lg">Adults</span>
                                    </h2>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="w-full sm:w-1/3 cursor-pointer">
                                <button className="text-left bg-white rounded-md p-3 md:p-4 w-full h-full cursor-pointer hover:bg-gray-100">
                                    <h6 className="text-xs md:text-sm uppercase">Check-In</h6>
                                    <h2 className="text-lg md:text-xl font-bold">
                                        16 <span className="text-black text-base md:text-lg">Jul'25</span>
                                    </h2>
                                    <p className="text-xs text-gray-500 truncate">Sunday</p>
                                </button>
                            </div>
                            <div className="w-full sm:w-1/3 cursor-pointer">
                                <button className="text-left bg-white rounded-md p-3 md:p-4 w-full h-full cursor-pointer hover:bg-gray-100">
                                    <h6 className="text-xs md:text-sm uppercase">Check-Out</h6>
                                    <h2 className="text-lg md:text-xl font-bold">
                                        16 <span className="text-black text-base md:text-lg">Jul'25</span>
                                    </h2>
                                    <p className="text-xs text-gray-500 truncate">Sunday</p>
                                </button>
                            </div>
                            <div className="w-full sm:w-1/3 cursor-pointer">
                                <button className="text-left bg-white rounded-md p-3 md:p-4 w-full h-full cursor-pointer hover:bg-gray-100">
                                    <h6 className="text-xs md:text-sm uppercase">Price per Night</h6>
                                    <h2 className="text-base md:text-lg font-bold">
                                        <span>₹0-₹1500</span>
                                    </h2>
                                </button>
                            </div>
                            <div className="w-full sm:w-1/3">
                                <button className="bg-[#f48f22] font-semibold text-white rounded-md px-6 md:px-12 py-3 w-full text-sm md:text-base">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TRENDING SEARCHES */}
                <div className="flex flex-col gap-4 py-4 md:py-8">
                    <h5 className="text-base md:text-lg font-bold">Trending Searches:</h5>
                    <ul className="flex flex-wrap gap-2 md:gap-4">
                        <li className="bg-gray-200 rounded-md p-2">
                            <button className="text-xs md:text-sm">Dubai, United Arab Emirates</button>
                        </li>
                        <li className="bg-gray-200 rounded-md p-2">
                            <button className="text-xs md:text-sm">Mumbai, India</button>
                        </li>
                        <li className="bg-gray-200 rounded-md p-2">
                            <button className="text-xs md:text-sm">London, United Kingdom</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HotelSearch