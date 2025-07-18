import React from 'react'
import googleplay from '../assets/img/googleplay.png'
import appstore from '../assets/img/appstore.png'
import qrcode from '../assets/img/qr-code.jpg'

const AppAvailableComponent = () => {
    return (
        <div className="border-2 border-orange-400 rounded-lg p-8 md:p-12 w-full my-12 bg-white shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Left Section - Text and Mobile Input */}
                <div className="flex flex-col items-start justify-start gap-6 flex-1">
                    <div className="space-y-2">
                        <h3 className='text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight'>
                            Plan, Book &amp; Travel On-the-Go <br />
                            Get the App Now!
                        </h3>
                        <p className='text-lg font-semibold text-orange-500'>
                            Get the App Now!
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 w-full max-w-md">
                        <div className="flex-1">
                            <input
                                className='border border-gray-300 py-3 px-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent'
                                type="text"
                                placeholder="Enter Your Mobile Number"
                            />
                        </div>
                        <div className="w-full sm:w-auto">
                            <button className='bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 w-full sm:w-auto'>
                                SEND
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Section - App Store Buttons and QR Code */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-8">
                    <div className="flex flex-col gap-4">
                        <a href="#" className="transition-transform duration-200 hover:scale-105">
                            <img className='w-[160px] md:w-[185px] h-auto' src={googleplay} alt="Google Play" />
                        </a>
                        <a href="#" className="transition-transform duration-200 hover:scale-105">
                            <img className='w-[160px] md:w-[185px] h-auto' src={appstore} alt="App Store" />
                        </a>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <img className='w-[100px] md:w-[125px] h-auto object-cover' src={qrcode} alt="QR Code" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppAvailableComponent