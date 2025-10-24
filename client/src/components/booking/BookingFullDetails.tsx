import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Phone, Mail, CreditCard, Luggage, FileText } from 'lucide-react';

interface BookingFullDetailsProps {
  booking: any;
}

const BookingFullDetails: React.FC<BookingFullDetailsProps> = ({ booking }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const bookingData = booking.bookingData;
  const trips = bookingData?.Trips || [];
  const passengers = bookingData?.Pax || [];
  const contactInfo = bookingData?.ContactInfo || [];
  const ssr = bookingData?.SSR || [];
  const rules = bookingData?.Rules || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Flight Information */}
      {trips.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-[var(--textcolor)] mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Flight Information
          </h3>
          <div className="space-y-4">
            {trips.map((trip: any, tripIndex: number) => (
              <div key={tripIndex}>
                {trip.Journey?.map((journey: any, journeyIndex: number) => {
                  // Get flight details from the first segment
                  const flight = journey.Segments?.[0]?.Flight;
                  const departureTime = flight?.DepartureTime;
                  const arrivalTime = flight?.ArrivalTime;
                  const departureCode = flight?.DepartureCode || bookingData?.From;
                  const arrivalCode = flight?.ArrivalCode || bookingData?.To;
                  const airline = flight?.Airline?.split('|')[0] || 'Flight';
                  const flightNo = flight?.FlightNo || 'N/A';
                  const depAirportName = flight?.DepAirportName || bookingData?.FromName;
                  const arrAirportName = flight?.ArrAirportName || bookingData?.ToName;
                  const duration = flight?.Duration || journey.Duration;

                  return (
                    <div key={journeyIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-[var(--YellowColor)]">
                            {departureCode}
                          </div>
                          <div className="text-gray-400">→</div>
                          <div className="text-2xl font-bold text-[var(--YellowColor)]">
                            {arrivalCode}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[var(--textcolor)]">{airline}</div>
                          <div className="text-sm text-[var(--textcolor)]">{flightNo}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-[var(--YellowColor)]" />
                            <span className="text-sm text-[var(--textcolor)]">Departure</span>
                          </div>
                          <div className="font-medium">{departureTime ? formatDate(departureTime) : 'N/A'}</div>
                          <div className="text-sm text-[var(--textcolor)]">{departureTime ? formatTime(departureTime) : 'N/A'}</div>
                          <div className="text-sm text-[var(--textcolor)]">{depAirportName}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-[var(--YellowColor)]" />
                              <span className="text-sm text-[var(--textcolor)]">Arrival</span>
                          </div>
                          <div className="font-medium">{arrivalTime ? formatDate(arrivalTime) : 'N/A'}</div>
                          <div className="text-sm text-[var(--textcolor)]">{arrivalTime ? formatTime(arrivalTime) : 'N/A'}</div>
                          <div className="text-sm text-[var(--textcolor)]">{arrAirportName}</div>
                        </div>
                      </div>
                      
                      {duration && (
                        <div className="mt-3 text-sm text-[var(--textcolor)]">
                          <span className="font-medium text-[var(--YellowColor)]">Duration:</span> {duration}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Passenger Information */}
      {passengers.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-[var(--textcolor)] mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-[var(--YellowColor)]" />
            Passenger Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passengers.map((passenger: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-[var(--textcolor)]">
                      {passenger.Title} {passenger.FName} {passenger.LName}
                    </div>
                    <div className="text-sm text-[var(--textcolor)]">
                      {passenger.PTC} • {passenger.Gender} • Age: {passenger.Age}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-[var(--LightBg)] text-[var(--YellowColor)] rounded-full text-xs font-medium">
                    {passenger.PTC}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--textcolor)]">Date of Birth:</span>
                    <span className="text-[var(--textcolor)]">{formatDate(passenger.DOB)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--textcolor)]">Nationality:</span>
                    <span className="text-[var(--textcolor)]">{passenger.Nationality}</span>
                  </div>
                  {passenger.PassportNo && (
                    <div className="flex justify-between">
                      <span className="text-[var(--textcolor)]">Passport:</span>
                      <span className="text-[var(--textcolor)]">{passenger.PassportNo}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      {contactInfo.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-[var(--textcolor)] mb-4 flex items-center">
            <Phone className="h-5 w-5 mr-2 text-[var(--YellowColor)]" />
            Contact Information
          </h3>
          <div className="space-y-4">
            {contactInfo.map((contact: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-[var(--textcolor)]">
                      {contact.Title} {contact.FName} {contact.LName}
                    </div>
                    <div className="text-sm text-[var(--textcolor)]">
                      {contact.IsGuest ? 'Guest' : 'Registered User'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-[var(--textcolor)]" />
                      <span className="text-gray-600">{contact.Email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{contact.MobileCountryCode} {contact.Mobile}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-gray-600">
                      <div className="font-medium">Address:</div>
                      <div>{contact.Address}, {contact.City}, {contact.State} {contact.PIN}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Services */}
      {ssr.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-[var(--textcolor)] mb-4 flex items-center">
            <Luggage className="h-5 w-5 mr-2 text-[var(--YellowColor)]" />
            Special Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ssr.map((service: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-[var(--textcolor)]">{service.Description}</div>
                    <div className="text-sm text-[var(--textcolor)]">{service.Code}</div>
                    {service.PieceDescription && (
                      <div className="text-sm text-[var(--textcolor)]">{service.PieceDescription}</div>
                    )}
                  </div>
                  {service.Charge > 0 && (
                    <div className="text-right">
                      <div className="font-semibold text-[var(--textcolor)]">₹{service.Charge}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-[var(--textcolor)] mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-[var(--YellowColor)]" />
          Payment Summary
        </h3>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
                <div className="text-sm text-[var(--textcolor)]">Total Amount</div>
                <div className="text-2xl font-bold text-[var(--textcolor)]">₹{booking.totalAmount}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-[var(--textcolor)]">Payment Status</div>
              <div className="text-lg font-semibold text-[var(--YellowColor)] capitalize">
                {booking.paymentStatus}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-[var(--textcolor)]">Booking Date</div>
              <div className="text-lg font-semibold text-[var(--textcolor)]">
                {formatDate(booking.bookingDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Rules */}
      {rules.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-[var(--textcolor)] mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Booking Rules
          </h3>
          <div className="space-y-4">
            {rules.map((rule: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="font-medium text-[var(--textcolor)] mb-2">
                  {rule.OrginDestination} - {rule.Provider}
                </div>
                {rule.Rule && rule.Rule.length > 0 && (
                  <div className="space-y-2">
                    {rule.Rule.map((ruleItem: any, ruleIndex: number) => (
                      <div key={ruleIndex}>
                        {ruleItem.Head && (
                          <div className="font-medium text-[var(--textcolor)] mb-1">{ruleItem.Head}</div>
                        )}
                        {ruleItem.Info && ruleItem.Info.length > 0 && (
                          <div className="ml-4 space-y-1">
                            {ruleItem.Info.map((info: any, infoIndex: number) => (
                              <div key={infoIndex} className="text-sm text-[var(--textcolor)]">
                                {info.Description}: ₹{info.AdultAmount}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BookingFullDetails;
