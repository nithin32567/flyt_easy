import React from "react";

const FlightCard = ({ flight, setSelectedFlight, isSelected = false, tripType = "onward" }) => {
  const {
    AirlineName,
    From,
    FromName,
    To,
    ToName,
    DepartureTime,
    ArrivalTime,
    Duration,
    GrossFare,
    FlightNo,
    Refundable
  } = flight;

  const formatTime = (timeStr) => new Date(timeStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",


    
    hour12: true,
  });

  return (
    <div className={`bg-white shadow-sm shadow-black rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md transition-all duration-300 ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
    }`}>
      {/* Trip Type Badge */}
      {tripType === "return" && (
        <div className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full w-fit">
          Return Flight
        </div>
      )}
      
      {/* Airline Info */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">{AirlineName.split("|")[0]}</h2>
        <p className="text-sm text-gray-500">Flight #{FlightNo.trim()}</p>
      </div>

      {/* Route & Timing */}
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div>
            <p className="text-lg font-bold">{From}</p>
            <p className="text-sm text-gray-500">{formatTime(DepartureTime)}</p>
          </div>
          <div className="flex flex-col items-center justify-center text-xs text-gray-500">
            <span>{Duration.trim()}</span>
            <div className="h-[1px] w-12 bg-gray-300 my-1"></div>
            <span>Non-stop</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{To}</p>
            <p className="text-sm text-gray-500">{formatTime(ArrivalTime)}</p>
          </div>
        </div>
      </div>

      {/* Pricing & Booking */}
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="text-xl font-bold text-green-600">₹ {GrossFare}</p>
          <p className="text-xs text-gray-400">{Refundable === "Y" ? "Refundable" : "Non-refundable"}</p>
        </div>
        <button
          onClick={() => setSelectedFlight(flight)}
          className={`text-sm px-4 py-2 rounded-md transition-all duration-300 ease-in cursor-pointer ${
            isSelected 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
