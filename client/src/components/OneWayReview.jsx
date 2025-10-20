import React from 'react'
import { useNavigate } from 'react-router-dom'

const OneWayReview = () => {
    const navigate = useNavigate()
    const oneWayReviewData = JSON.parse(localStorage.getItem("oneWayReviewData"))
    console.log(oneWayReviewData, "oneWayReviewData=========================")

    if (!oneWayReviewData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Booking Data Found</h2>
                    <p className="text-gray-600">Please complete a flight search to view booking details.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Flight Booking Review</h1>
                    <p className="text-gray-600">Please review your flight booking details before proceeding</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Flight Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Flight Details</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">From:</span>
                                <span className="text-gray-800 font-semibold">{oneWayReviewData.FromName}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">To:</span>
                                <span className="text-gray-800 font-semibold">{oneWayReviewData.ToName}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Departure Date:</span>
                                <span className="text-gray-800 font-semibold">{oneWayReviewData.OnwardDate}</span>
                            </div>

                            {oneWayReviewData.ReturnDate && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Return Date:</span>
                                    <span className="text-gray-800 font-semibold">{oneWayReviewData.ReturnDate}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Fare Type:</span>
                                <span className="text-gray-800 font-semibold">{oneWayReviewData.FareType}</span>
                            </div>
                        </div>
                    </div>

                    {/* Passenger Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Passenger Details</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Adults (ADT):</span>
                                <span className="text-gray-800 font-semibold">{oneWayReviewData.ADT}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Children (CHD):</span>
                                <span className="text-gray-800 font-semibold">{oneWayReviewData.CHD}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Infants (INF):</span>
                                <span className="text-gray-800 font-semibold">{oneWayReviewData.INF}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Pricing Details</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Currency:</span>
                                <span className="text-gray-800 font-semibold">{oneWayReviewData.CurrencyCode}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Gross Amount:</span>
                                <span className="text-gray-800 font-semibold">₹{oneWayReviewData.GrossAmount?.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Net Amount:</span>
                                <span className="text-gray-800 font-semibold">₹{oneWayReviewData.NetAmount?.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Insurance Premium:</span>
                                <span className="text-gray-800 font-semibold">₹{oneWayReviewData.InsPremium}</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Booking Information</h2>

                        <div className="space-y-4">
                            {/* <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Status Code:</span>
                                <span className={`px-2 py-1 rounded text-sm font-medium ${oneWayReviewData.Code === "200" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}>
                                    {oneWayReviewData.Code}
                                </span>
                            </div> */}

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Source:</span>
                                <span className="text-gray-800 font-semibold">{oneWayReviewData.Source}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Private Fare:</span>
                                <span className={`px-2 py-1 rounded text-sm font-medium ${oneWayReviewData.IsPrivateFare ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                                    }`}>
                                    {oneWayReviewData.IsPrivateFare ? "Yes" : "No"}
                                </span>
                            </div>

                            {oneWayReviewData.CeilingInfo && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Ceiling Info:</span>
                                    <span className="text-gray-800 font-semibold">{oneWayReviewData.CeilingInfo}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {/* {oneWayReviewData.Msg && oneWayReviewData.Msg.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Messages</h2>
                        <div className="space-y-2">
                            {oneWayReviewData.Msg.map((message, index) => (
                                <div key={index} className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span className="text-gray-700">{message}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}

                {/* Technical Details */}
                {/* <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Technical Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">


                            {oneWayReviewData.AlternateTrips && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Alternate Trips:</span>
                                    <span className="text-gray-800 font-semibold">{oneWayReviewData.AlternateTrips}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-x-4">
                            {oneWayReviewData.SSR && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">SSR Charges:</span>
                                    <span className="text-gray-800 font-semibold">{oneWayReviewData.SSR.map((item,index)=>{
                                        return (
                                            <div className='flex justify-between items-center' key={index}>
                                                <p><span>{item?.Code}</span> {item?.Description} <span>INR: {item.Charge}</span></p>
                                            </div>
                                        )
                                    })}</span>
                                </div>
                            )}

                            {oneWayReviewData.SSRChange && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">SSR Change:</span>
                                    <span className="text-gray-800 font-semibold">{oneWayReviewData.SSRChange}</span>
                                </div>
                            )}

                            {oneWayReviewData.HoldInfo && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Hold Info:</span>
                                    <span className="text-gray-800 font-semibold">{oneWayReviewData.HoldInfo}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div> */}

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <button className="px-6 py-3 bg-gray-500 w-[300px] text-white rounded-lg hover:bg-gray-600 transition-colors">
                            Cancel Booking
                        </button>
                        <button onClick={() => {
                            navigate("/create-itenary")
                        }} className="px-6 py-3 bg-orange-400 w-[300px] text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OneWayReview