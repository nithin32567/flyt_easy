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
                <div className="onewar-roundtrip">
                    <ul className='flex items-center gap-4'>
                        <li className='flex items-center gap-2 hover:bg-gray-200 rounded-3xl p-2'>
                            <label>
                                <input className='' type="radio" name="trips" id="" defaultChecked="" />{" "}
                                Upto 4 Rooms
                            </label>
                        </li>
                        <li className='flex items-center gap-2 hover:bg-gray-200 rounded-3xl p-2'>
                            <label>
                                <input type="radio" name="trips" id="" /> Group Deals
                            </label>
                        </li>
                    </ul>
                </div>
                <div className="row flex items-center gap-4 border-b border-gray-200">
                    <div className="col-lg-5 w-1/2">
                        <div className="row flex  gap-4">
                            <div className="col-lg-7 col-md-6 w-1/2">
                                <button className="select-items bg-white rounded-3xl p-4 text-left">
                                    <h6 className='text-xs uppercase'>City, Property name or Location</h6>
                                    <h2 className='text-2xl font-bold'>Goa</h2>
                                    <p className='text-xs'>India</p>
                                </button>
                            </div>
                            <div className="col-lg-5 col-md-6 w-1/2">
                                <button className="select-items bg-white rounded-3xl p-4">
                                    <h6 className='text-sm text-gray-500'>Rooms &amp; Guests</h6>
                                    <h2 className='text-2xl font-bold'>
                                        1 <span className='text-black text-lg'>Rooms</span> 2 <span className='text-black text-lg'>Adults</span>
                                    </h2>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 w-1/2">
                        <div className="row flex  gap-4">
                            <div className="col-lg-3 col-md-4 col-6 w-1/2 text-left ">
                                <button className="select-items bg-white rounded-3xl p-4">
                                    <h6 className='text-sm uppercase'>Check-In</h6>
                                    <h2 className='text-2xl font-bold'>
                                        16 <span className='text-black text-lg'>Jul'25</span>
                                    </h2>
                                    <p className='text-xs text-gray-500 truncate'>Sunday</p>
                                </button>
                            </div>
                            <div className="col-lg-3 col-md-4 col-6 w-1/2">
                                <button className="select-items bg-white rounded-3xl p-4">
                                    <h6 className='text-sm uppercase'>Check-Out</h6>
                                    <h2 className='text-2xl font-bold'>
                                        16 <span className='text-black text-lg'>Jul'25</span>
                                    </h2>
                                    <p className='text-xs text-gray-500 truncate'>Sunday</p>
                                </button>
                            </div>
                            <div className="col-lg-3 col-md-4 w-1/2">
                                <button className="select-items bg-white rounded-3xl p-4 ">
                                    <h6 className='text-sm uppercase'>Price per Night</h6>
                                    <h2 className='text-lg font-bold'>
                                        <span>₹0-₹1500</span>
                                    </h2>
                                </button>
                            </div>
                            <div className="col-lg-3 w-1/2 my-auto">
                                <button className="search-btn bg-[#f48f22] text-white rounded-md px-16 py-3">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h5 className='text-lg font-bold'>Trending Searches:</h5>
                    <ul className='flex gap-4'>
                        <li className='bg-gray-200 rounded-md p-2'>
                            <button>Dubai, United Arab Emirates</button>
                        </li>
                        <li className='bg-gray-200 rounded-md p-2'>
                            <button>Mumbai, India</button>
                        </li>
                        <li className='bg-gray-200 rounded-md p-2'>
                            <button>London, United Kingdom</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HotelSearch