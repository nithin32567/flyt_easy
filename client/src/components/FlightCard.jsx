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
    Refundable,
    Stops,
    Segments,
    Connections,
    Inclusions,
    FareClass,
    Cabin
  } = flight;

  const formatTime = (timeStr) => new Date(timeStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const getStopsText = () => {
    const stops = Stops || '0';
    if (stops === '0') return 'Non-stop';
    if (stops === '1') return '1 Stop';
    return `${stops} Stops`;
  };

  const getConnectionInfo = () => {
    if (Stops === '0' || !Connections || Connections.length === 0) return null;
    
    return Connections.map((connection, index) => {
      if (!connection || Object.keys(connection).length === 0) return null;
      return (
        <div key={index} className="text-xs text-gray-500 mt-1">
          Via {connection.airport || 'Connection'}
        </div>
      );
    }).filter(Boolean);
  };

  const getInclusionsText = () => {
    if (!Inclusions) return null;
    
    const inclusions = [];
    if (Inclusions.Baggage) inclusions.push('Baggage');
    if (Inclusions.Meals) inclusions.push('Meals');
    if (Inclusions.PieceDescription) inclusions.push(Inclusions.PieceDescription);
    
    return inclusions.length > 0 ? inclusions.join(', ') : null;
  };

  const getCabinClass = () => {
    switch (Cabin) {
      case 'E': return 'Economy';
      case 'PE': return 'Premium Economy';
      case 'B': return 'Business';
      case 'F': return 'First';
      default: return 'Economy';
    }
  };

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
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{AirlineName?.split("|")[0] || 'Unknown Airline'}</h2>
          <p className="text-xs text-gray-500">{getCabinClass()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Flight #{FlightNo?.trim() || 'N/A'}</p>
          {FareClass && <p className="text-xs text-gray-400">Class: {FareClass}</p>}
        </div>
      </div>

      {/* Route & Timing */}
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div>
            <p className="text-lg font-bold">{From}</p>
            <p className="text-sm text-gray-500">{formatTime(DepartureTime)}</p>
          </div>
          <div className="flex flex-col items-center justify-center text-xs text-gray-500">
            <span>{Duration?.trim() || 'N/A'}</span>
            <div className="h-[1px] w-12 bg-gray-300 my-1"></div>
            <span>{getStopsText()}</span>
            {getConnectionInfo()}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{To}</p>
            <p className="text-sm text-gray-500">{formatTime(ArrivalTime)}</p>
          </div>
        </div>
      </div>

      {/* Inclusions */}
      {getInclusionsText() && (
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Included:</span> {getInclusionsText()}
          </p>
        </div>
      )}

      {/* Pricing & Booking */}
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="text-xl font-bold text-green-600">₹ {GrossFare || 'N/A'}</p>
          <div className="flex flex-col">
            <p className="text-xs text-gray-400">
              {Refundable === "Y" ? "Refundable" : "Non-refundable"}
            </p>
            {Stops && Stops !== '0' && (
              <p className="text-xs text-blue-600 font-medium">
                {Stops} {Stops === '1' ? 'Stop' : 'Stops'}
              </p>
            )}
          </div>
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
