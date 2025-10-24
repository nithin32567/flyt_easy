import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, CreditCard, MapPin , Airplane, Plane ,CheckCircle, XCircle, Clock, Info} from 'lucide-react';

interface BookingSummaryCardProps {
  booking: any;
  isActive?: boolean;
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({ booking, isActive = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-amber-600 bg-amber-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current': return <CheckCircle className="h-4 w-4 text-green-500" />;    
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const bookingData = booking.bookingData;
  const firstTrip = bookingData?.Trips?.[0]?.Journey?.[0];
  const flight = firstTrip?.Segments?.[0]?.Flight;
  const primaryPassenger = bookingData?.Pax?.[0];

  return (
    <motion.div
      className={`transition-all duration-300 ${
        isActive ? ' border-blue-200 p-4' : ''
      }`}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center justify-between">
        {/* Route and Basic Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-[var(--PrimaryColor)]" />
              <span className="text-lg font-semibold text-[var(--PrimaryColor)]">
                {flight?.DepartureCode || bookingData?.From} → {flight?.ArrivalCode || bookingData?.To}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-2 font-medium ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)} {booking.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-[var(--PrimaryColor)]" />
              <span className="text-[var(--PrimaryColor)]">
                {primaryPassenger ? `${primaryPassenger.Title} ${primaryPassenger.FName} ${primaryPassenger.LName}` : 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-[var(--PrimaryColor)]" />
              <span className="text-[var(--PrimaryColor)]">
                {formatDate(booking.bookingDate)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-[var(--PrimaryColor)]" />
              <span className="text-[var(--PrimaryColor)]">
                ₹{booking.totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="hidden md:flex flex-col items-end text-right text-sm text-[var(--PrimaryColor)] ml-4">
          {flight && (
            <>
              <div className="font-medium">{flight.Airline?.split('|')[0] || 'Flight'}</div>
              <div>{flight.FlightNo || 'N/A'}</div>
              {flight.Duration && (
                <div className="text-xs text-[var(--PrimaryColor)]">{flight.Duration}</div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingSummaryCard;
