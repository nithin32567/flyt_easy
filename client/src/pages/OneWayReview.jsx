import React from 'react'
import { useNavigate } from 'react-router-dom'

const OneWayReview = () => {
  const navigate = useNavigate()
  const flightInfo = JSON.parse(localStorage.getItem('oneWayReviewData'))
  console.log(flightInfo, 'flightInfo')

  if (!flightInfo) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          No flight data found. Please try again.
          <button
            onClick={() => navigate('/search')}
            className="block mt-4 bg-blue-900 text-white px-4 py-2 rounded"
          >
            Go Back to Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      <div className="max-w-4xl mx-auto mt-8 px-4">
        {/* Header Section */}
        <div className="bg-blue-900 text-white rounded-t-lg px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="font-bold text-xl">
              {flightInfo.FromName?.split('|')[0]} → {flightInfo.ToName?.split('|')[0]}
            </div>
            <div className="text-sm mt-2 md:mt-0">
              {flightInfo.OnwardDate} | {flightInfo.FareType === 'ON' ? 'One Way' : 'Round Trip'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-lg shadow-lg p-6">
          {/* Basic Flight Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-700 mb-2">Route Information</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-semibold">From:</span> {flightInfo.FromName}</div>
                <div><span className="font-semibold">To:</span> {flightInfo.ToName}</div>
                <div><span className="font-semibold">From Code:</span> {flightInfo.From}</div>
                <div><span className="font-semibold">To Code:</span> {flightInfo.To}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-700 mb-2">Travel Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-semibold">Departure Date:</span> {flightInfo.OnwardDate}</div>
                {flightInfo.ReturnDate && (
                  <div><span className="font-semibold">Return Date:</span> {flightInfo.ReturnDate}</div>
                )}
                <div><span className="font-semibold">Trip Type:</span> {flightInfo.FareType === 'ON' ? 'One Way' : 'Round Trip'}</div>
                <div><span className="font-semibold">Source:</span> {flightInfo.Source}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-700 mb-2">Passenger Count</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-semibold">Adults:</span> {flightInfo.ADT}</div>
                <div><span className="font-semibold">Children:</span> {flightInfo.CHD}</div>
                <div><span className="font-semibold">Infants:</span> {flightInfo.INF}</div>
                <div><span className="font-semibold">Youth:</span> {flightInfo.YTH || 0}</div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="font-bold text-blue-900 text-lg mb-4">Pricing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">₹{flightInfo.GrossAmount?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Gross Amount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹{flightInfo.NetAmount?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Net Amount</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700">₹{flightInfo.InsPremium?.toLocaleString() || '0'}</div>
                <div className="text-sm text-gray-600">Insurance Premium</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700">{flightInfo.CurrencyCode}</div>
                <div className="text-sm text-gray-600">Currency</div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          {flightInfo.Trips && flightInfo.Trips.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-gray-700 text-lg mb-4">Trip Information</h3>
              {flightInfo.Trips.map((trip, tripIndex) => (
                <div key={tripIndex} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-900 mb-3">Trip {tripIndex + 1}</h4>
                  {trip.Journey && trip.Journey.map((journey, journeyIndex) => (
                    <div key={journeyIndex} className="border-l-4 border-blue-500 pl-4 mb-4">
                      {/* Journey Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-semibold">Provider:</span> {journey.Provider}
                        </div>
                        <div>
                          <span className="font-semibold">Duration:</span> {journey.Duration}
                        </div>
                        <div>
                          <span className="font-semibold">Channel Code:</span> {journey.ChannelCode || 'N/A'}
                        </div>
                        <div>
                          <span className="font-semibold">Order ID:</span> {journey.OrderID}
                        </div>
                        <div>
                          <span className="font-semibold">Promo:</span> {journey.Promo || 'N/A'}
                        </div>
                        <div>
                          <span className="font-semibold">FC Type:</span> {journey.FCType}
                        </div>
                        <div>
                          <span className="font-semibold">Seat Hold:</span> {journey.SeatHold ? 'Yes' : 'No'}
                        </div>
                        <div>
                          <span className="font-semibold">Gross Fare:</span> ₹{journey.GrossFare?.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-semibold">Net Fare:</span> ₹{journey.NetFare?.toLocaleString()}
                        </div>
                      </div>

                      {/* Segments Information */}
                      {journey.Segments && journey.Segments.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-gray-700 mb-3">Flight Segments</h5>
                          {journey.Segments.map((segment, segmentIndex) => (
                            <div key={segmentIndex} className="bg-white p-3 rounded border mb-3">
                              <div className="font-medium text-sm text-blue-800 mb-2">
                                Segment {segmentIndex + 1}
                              </div>
                              
                              {/* Flight Details */}
                              {segment.Flight && (
                                <div className="space-y-3 mb-3">
                                  {/* Basic Flight Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    <div><span className="font-semibold">Airline:</span> {segment.Flight.Airline}</div>
                                    <div><span className="font-semibold">Flight No:</span> {segment.Flight.FlightNo}</div>
                                    <div><span className="font-semibold">FUID:</span> {segment.Flight.FUID}</div>
                                    <div><span className="font-semibold">Duration:</span> {segment.Flight.Duration}</div>
                                  </div>

                                  {/* Departure Details */}
                                  <div className="bg-blue-50 p-2 rounded">
                                    <div className="font-medium text-xs text-blue-800 mb-1">Departure</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                      <div><span className="font-semibold">Time:</span> {segment.Flight.DepartureTime}</div>
                                      <div><span className="font-semibold">Airport:</span> {segment.Flight.DepAirportName}</div>
                                      <div><span className="font-semibold">Code:</span> {segment.Flight.DepartureCode}</div>
                                      <div><span className="font-semibold">Terminal:</span> {segment.Flight.DepartureTerminal}</div>
                                    </div>
                                  </div>

                                  {/* Arrival Details */}
                                  <div className="bg-green-50 p-2 rounded">
                                    <div className="font-medium text-xs text-green-800 mb-1">Arrival</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                      <div><span className="font-semibold">Time:</span> {segment.Flight.ArrivalTime}</div>
                                      <div><span className="font-semibold">Airport:</span> {segment.Flight.ArrAirportName}</div>
                                      <div><span className="font-semibold">Code:</span> {segment.Flight.ArrivalCode}</div>
                                      <div><span className="font-semibold">Terminal:</span> {segment.Flight.ArrivalTerminal}</div>
                                    </div>
                                  </div>

                                  {/* Aircraft & Equipment */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    <div><span className="font-semibold">Aircraft:</span> {segment.Flight.AirCraft}</div>
                                    <div><span className="font-semibold">Equipment Type:</span> {segment.Flight.EquipmentType}</div>
                                    <div><span className="font-semibold">Carbon Emissions:</span> {segment.Flight.CarbonEmissions}</div>
                                    <div><span className="font-semibold">Hops:</span> {segment.Flight.Hops || 'N/A'}</div>
                                  </div>

                                  {/* Airline Codes */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                    <div><span className="font-semibold">VAC:</span> {segment.Flight.VAC}</div>
                                    <div><span className="font-semibold">MAC:</span> {segment.Flight.MAC}</div>
                                    <div><span className="font-semibold">OAC:</span> {segment.Flight.OAC}</div>
                                  </div>

                                  {/* Fare & Booking Details */}
                                  <div className="bg-gray-50 p-2 rounded">
                                    <div className="font-medium text-xs text-gray-700 mb-1">Fare & Booking Details</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                      <div><span className="font-semibold">Fare Class:</span> {segment.Flight.FareClass}</div>
                                      <div><span className="font-semibold">Cabin:</span> {segment.Flight.Cabin}</div>
                                      <div><span className="font-semibold">RBD:</span> {segment.Flight.RBD}</div>
                                      <div><span className="font-semibold">FBC:</span> {segment.Flight.FBC}</div>
                                      <div><span className="font-semibold">FC Begin:</span> {segment.Flight.FCBegin || 'N/A'}</div>
                                      <div><span className="font-semibold">FC End:</span> {segment.Flight.FCEnd || 'N/A'}</div>
                                      <div><span className="font-semibold">Refundable:</span> {segment.Flight.Refundable === 'Y' ? 'Yes' : 'No'}</div>
                                      <div><span className="font-semibold">Available Seats:</span> {segment.Flight.Seats}</div>
                                    </div>
                                  </div>

                                  {/* Additional Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    <div><span className="font-semibold">Brand ID:</span> {segment.Flight.BrandID || 'N/A'}</div>
                                    <div><span className="font-semibold">Farelink:</span> {segment.Flight.Farelink || 'N/A'}</div>
                                    <div><span className="font-semibold">Amenities:</span> {segment.Flight.Amenities || 'N/A'}</div>
                                  </div>
                                </div>
                              )}

                              {/* Fares Information */}
                              {segment.Fares && (
                                <div className="bg-gray-100 p-3 rounded">
                                  <div className="font-medium text-sm text-gray-700 mb-2">Fare Breakdown</div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                    <div><span className="font-semibold">Gross Fare:</span> ₹{segment.Fares.GrossFare?.toLocaleString()}</div>
                                    <div><span className="font-semibold">Net Fare:</span> ₹{segment.Fares.NetFare?.toLocaleString()}</div>
                                    <div><span className="font-semibold">Base Fare:</span> ₹{segment.Fares.TotalBaseFare?.toLocaleString()}</div>
                                    <div><span className="font-semibold">Total Tax:</span> ₹{segment.Fares.TotalTax?.toLocaleString()}</div>
                                    <div><span className="font-semibold">Commission:</span> ₹{segment.Fares.TotalCommission?.toLocaleString()}</div>
                                    <div><span className="font-semibold">Service Tax:</span> ₹{segment.Fares.TotalServiceTax?.toLocaleString()}</div>
                                  </div>

                                  {/* PTC Fare Details */}
                                  {segment.Fares.PTCFare && segment.Fares.PTCFare.length > 0 && (
                                    <div className="mt-3">
                                      <div className="font-medium text-xs text-gray-600 mb-2">Passenger Type Fare Details</div>
                                      {segment.Fares.PTCFare.map((ptc, ptcIndex) => (
                                        <div key={ptcIndex} className="bg-white p-2 rounded border text-xs">
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <div><span className="font-semibold">PTC:</span> {ptc.PTC}</div>
                                            <div><span className="font-semibold">Fare:</span> ₹{ptc.Fare?.toLocaleString()}</div>
                                            <div><span className="font-semibold">Tax:</span> ₹{ptc.Tax?.toLocaleString()}</div>
                                            <div><span className="font-semibold">Gross:</span> ₹{ptc.GrossFare?.toLocaleString()}</div>
                                            <div><span className="font-semibold">Net:</span> ₹{ptc.NetFare?.toLocaleString()}</div>
                                            <div><span className="font-semibold">Agent Markup:</span> ₹{ptc.AgentMarkUp?.toLocaleString()}</div>
                                            <div><span className="font-semibold">YQ:</span> ₹{ptc.YQ?.toLocaleString()}</div>
                                            <div><span className="font-semibold">PSF:</span> ₹{ptc.PSF?.toLocaleString()}</div>
                                            <div><span className="font-semibold">Transaction Fee:</span> ₹{ptc.TransactionFee?.toLocaleString()}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Notices */}
                      {journey.Notices && journey.Notices.length > 0 && (
                        <div className="mt-3">
                          <div className="font-medium text-sm text-orange-700 mb-2">Notices</div>
                          {journey.Notices.map((notice, noticeIndex) => (
                            <div key={noticeIndex} className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                              {notice}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Rules Section */}
          {flightInfo.Rules && flightInfo.Rules.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-gray-700 text-lg mb-4">Fare Rules</h3>
              {flightInfo.Rules.map((rule, index) => (
                <div key={index} className="bg-yellow-50 p-4 rounded-lg mb-3 border-l-4 border-yellow-400">
                  <div className="font-semibold text-yellow-800 mb-2">
                    {rule.OrginDestination || `Rule ${index + 1}`}
                  </div>
                  {rule.Rule && rule.Rule.map((r, ruleIndex) => (
                    <div key={ruleIndex} className="mb-2">
                      <div className="font-medium text-sm text-yellow-700">{r.Head}:</div>
                      {r.Info && r.Info.map((info, infoIndex) => (
                        <div key={infoIndex} className="text-xs text-gray-600 ml-2">
                          {info.Description} {info.AdultAmount && `(₹${info.AdultAmount})`}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-700 mb-2">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-semibold">TUI:</span> {flightInfo.TUI}</div>
                <div><span className="font-semibold">Code:</span> {flightInfo.Code}</div>
                <div><span className="font-semibold">Message:</span> {flightInfo.Msg?.join(', ')}</div>
                <div><span className="font-semibold">Is Private Fare:</span> {flightInfo.IsPrivateFare ? 'Yes' : 'No'}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-700 mb-2">Additional Info</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-semibold">Ceiling Info:</span> {flightInfo.CeilingInfo || 'N/A'}</div>
                <div><span className="font-semibold">Hold Info:</span> {flightInfo.HoldInfo || 'N/A'}</div>
                <div><span className="font-semibold">SSR:</span> {flightInfo.SSR ? 'Available' : 'Not Available'}</div>
                <div><span className="font-semibold">Alternate Trips:</span> {flightInfo.AlternateTrips ? 'Available' : 'Not Available'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex items-center justify-between px-8 py-4 z-50">
        <div className="text-lg font-bold">
          Total Amount<br />
          <span className="text-2xl text-blue-900">₹{flightInfo.GrossAmount?.toLocaleString() || '--'}</span>
        </div>
        <button
          onClick={() => navigate('/pax-details', { state: { flightInfo } })}
          className="bg-blue-900 text-white px-8 py-3 rounded font-bold text-lg hover:bg-blue-800 transition-colors"
        >
          Continue to Passenger Details
        </button>
      </div>
    </div>
  )
}

export default OneWayReview