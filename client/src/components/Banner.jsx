import React from 'react'
import banner01 from '../assets/img/banner-01.jpg'

const Banner = () => {
    return (
        <section className="banner-wrapper">
            <div id="carouselExample" className="carousel slide">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className='h-full w-full object-cover' src={banner01} alt="Flyteasy" />
                        <div className="container">
                            <div className="bannerwrap-text">
                                <div className="">
                                    <div className="">
                                        <div className=" w-full text-center text-white">
                                            <h1 style={{ color: '#fff', fontSize: '42px', fontWeight: '400', zIndex: '900' }}>
                                                Fast Booking. <br />
                                                Great Prices. Smooth Takeoff
                                            </h1>
                                            <p style={{ color: '#fff', fontSize: '16px', fontWeight: '400', zIndex: '0', width: '80%', margin: '0 auto' }}>
                                                With Flyteasy, booking your next flight is faster, easier,
                                                and more affordable — compare real-time prices, choose
                                                from top airlines, and take off on your dream journey in
                                                just a few clicks.
                                            </p>
                                            <button className="border-2 border-[#f48f22] text-[#f48f22] px-8 py-3 rounded-lg font-semibold 
                                              my-4 hover:text-white hover:bg-[#f48f22] hover:ring-2 hover:cursor-pointer">Sign In / Register</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </section>
    )
}

export default Banner