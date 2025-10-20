export const extractBookingData = (apiResponse) => {
  if (!apiResponse) return null;

  return {
    TUI: apiResponse.TUI,
    TransactionID: apiResponse.TransactionID,
    NetAmount: apiResponse.NetAmount,
    GrossAmount: apiResponse.GrossAmount,
    CustomerFare: apiResponse.CustomerFare,
    PaymentStatus: apiResponse.PaymentStatus,
    Status: apiResponse.Status,
    BookingDate: apiResponse.BookingDate,
    TripType: apiResponse.TripType,
    From: apiResponse.From,
    To: apiResponse.To,
    FromName: apiResponse.FromName,
    ToName: apiResponse.ToName,
    OnwardDate: apiResponse.OnwardDate,
    ReturnDate: apiResponse.ReturnDate,
    Trips: apiResponse.Trips || [],
    Pax: apiResponse.Pax || [],
    ContactInfo: apiResponse.ContactInfo || [],
    SSR: apiResponse.SSR || [],
    Rules: apiResponse.Rules || [],
    Remarks: apiResponse.Remarks || []
  };
};

export const formatBookingSummary = (bookingData) => {
  if (!bookingData) return null;

  const firstTrip = bookingData.Trips?.[0]?.Journey?.[0];
  const passengers = bookingData.Pax || [];
  const contactInfo = bookingData.ContactInfo || [];

  return {
    route: firstTrip ? `${firstTrip.From} → ${firstTrip.To}` : 'Flight Booking',
    airline: firstTrip?.AirlineName || 'Unknown',
    flightNumber: firstTrip?.FlightNumber || 'N/A',
    departure: firstTrip ? {
      date: firstTrip.DepartureTime,
      airport: firstTrip.FromName,
      code: firstTrip.From
    } : null,
    arrival: firstTrip ? {
      date: firstTrip.ArrivalTime,
      airport: firstTrip.ToName,
      code: firstTrip.To
    } : null,
    passengers: passengers.length,
    contact: contactInfo[0] || null,
    amount: bookingData.NetAmount || bookingData.GrossAmount || 0
  };
};

export const getBookingStatusInfo = (status) => {
  const statusMap = {
    current: {
      label: 'Current',
      color: 'blue',
      description: 'Active booking'
    },
    completed: {
      label: 'Completed',
      color: 'green',
      description: 'Journey completed'
    },
    cancelled: {
      label: 'Cancelled',
      color: 'red',
      description: 'Booking cancelled'
    },
    pending: {
      label: 'Pending',
      color: 'yellow',
      description: 'Awaiting confirmation'
    }
  };

  return statusMap[status] || {
    label: 'Unknown',
    color: 'gray',
    description: 'Status unknown'
  };
};
