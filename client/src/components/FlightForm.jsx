import React from 'react';
import MultiCitySearch from "./MultiCitySearch";

const FlightForm = ({
  tripType,
  setTripType,
  from,
  to,
  departureDate,
  returnDate,
  adults,
  children,
  infants,
  travelClass,
  isSearching,
  isDirect,
  isDefenceFare,
  isStudentFare,
  isSeniorCitizenFare,
  isNearbyAirport,
  setIsDirect,
  setIsDefenceFare,
  setIsStudentFare,
  setIsSeniorCitizenFare,
  setIsNearbyAirport,
  setIsOpen,
  setLabel,
  setIsCalanderModalOpen,
  setDateType,
  setTravellerModalOpen,
  handleExpressSearch,
  handleMultiCitySearch,
  airports
}) => {
  return (
    <div
      className="tab-pane fade show active"
      id="home"
      role="tabpanel"
      aria-labelledby="home-tab"
    >
      <div className="onewar-roundtrip">
        <ul>
          <li>
            <label>
              <input
                onChange={() => setTripType("ON")}
                type="radio"
                name="trip"
                id="oneway"
                checked={tripType === "ON"}
              />{" "}
              One Way
            </label>
          </li>
          <li>
            <label>
              <input
                onChange={() => setTripType("RT")}
                type="radio"
                name="trip"
                id="roundtrip"
                checked={tripType === "RT"}
              />{" "}
              Round Trip
            </label>
          </li>
          <li>
            <label>
              <input
                onChange={() => setTripType("MC")}
                type="radio"
                name="trip"
                id="multicity"
                checked={tripType === "MC"}
              />{" "}
              Multi City
            </label>
          </li>
        </ul>
      </div>
      {tripType === "MC" ? (
        <MultiCitySearch
          airports={airports}
          onSearch={handleMultiCitySearch}
          isSearching={isSearching}
          adults={adults}
          children={children}
          infants={infants}
          travelClass={travelClass}
          onTravellerClick={() => setTravellerModalOpen(true)}
        />
      ) : (
        <div className="row">
          <div className="col-lg-5">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <button
                  className="select-items"
                  onClick={() => {
                    setIsOpen(true);
                    setLabel("From");
                  }}
                >
                  <h6>FROM</h6>
                  <h2>
                    {from?.Name || "Mumbai"} {from?.Code || "BOM"}
                  </h2>
                  <p>
                    [{from?.Code || "BOM"}] {from?.Name || "Mumbai"}
                  </p>
                </button>
              </div>
              <div className="col-lg-6 col-md-6">
                <button
                  className="select-items"
                  onClick={() => {
                    setIsOpen(true);
                    setLabel("To");
                  }}
                >
                  <h6>To</h6>
                  <h2>
                    {to?.Name || "New Delhi"} {to?.Code || "DEL"}
                  </h2>
                  <p>
                    [{to?.Code || "DEL"}] {to?.Name || "New Delhi"}
                  </p>
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-6">
                <button
                  className="select-items"
                  onClick={() => {
                    setIsCalanderModalOpen(true);
                    setDateType("departure");
                  }}
                >
                  <h6>DEPART</h6>
                  <h2>
                    {departureDate.getDate()}{" "}
                    <span>
                      {departureDate.toLocaleString("default", {
                        month: "short",
                      })}
                    </span>
                  </h2>
                  <p>
                    {departureDate.toLocaleString("default", {
                      weekday: "long",
                    })}
                  </p>
                </button>
              </div>
              {tripType === "RT" && (
                <div className="col-lg-3 col-md-4 col-6">
                  <button
                    className="select-items"
                    onClick={() => {
                      setIsCalanderModalOpen(true);
                      setDateType("return");
                    }}
                  >
                    <h6>RETURN</h6>
                    <h2>
                      {returnDate.getDate()}{" "}
                      <span>
                        {returnDate.toLocaleString("default", {
                          month: "short",
                        })}
                      </span>
                    </h2>
                    <p>
                      {returnDate.toLocaleString("default", {
                        weekday: "long",
                      })}
                    </p>
                  </button>
                </div>
              )}
              <div className="col-lg-3 col-md-4">
                <button
                  className="select-items"
                  onClick={() => setTravellerModalOpen(true)}
                >
                  <h6>Travellers</h6>
                  <h2>
                    {adults + children + infants}{" "}
                    <span>Travellers</span>
                  </h2>
                  <p>{travelClass}</p>
                </button>
              </div>
              <div className="col-lg-3">
                <button
                  className="search-btn"
                  onClick={handleExpressSearch}
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bookingcheckbox">
        <ul>
          <li>
            <label>
              <input onChange={() => setIsDirect(!isDirect)} checked={isDirect} type="checkbox" name="" id="" /> Direct Flights
            </label>
          </li>
          <li>
            <label>
              <input onChange={() => setIsDefenceFare(!isDefenceFare)} checked={isDefenceFare} type="checkbox" name="" id="" /> Defence Fare
            </label>
          </li>
          <li>
            <label>
              <input onChange={() => setIsStudentFare(!isStudentFare)} checked={isStudentFare} type="checkbox" name="" id="" /> Student Fare
            </label>
          </li>
          <li>
            <label>
              <input onChange={() => setIsSeniorCitizenFare(!isSeniorCitizenFare)} checked={isSeniorCitizenFare} type="checkbox" name="" id="" /> Senior Citizen
              Fare
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FlightForm;
