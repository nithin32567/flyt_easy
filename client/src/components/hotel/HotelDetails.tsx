import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface HotelDetailsProps {
  hotel: {
    name?: string;
    starRating?: number;
    contact?: {
      address?: Array<{
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
      }>;
      phones?: string[];
      emails?: string[];
    };
    providerName?: string;
    chainName?: string;
    type?: string;
    category?: string;
    reviews?: Array<{
      rating: number;
      count: number;
    }>;
    descriptions?: Array<{
      type: string;
      text: string;
    }>;
    checkinInfo?: {
      beginTime?: string;
      endTime?: string;
      minAge?: number;
    };
    checkoutInfo?: {
      time?: string;
    };
  };
}

const HotelDetails: React.FC<HotelDetailsProps> = ({ hotel }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  if (!hotel) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Hotel Information</h2>
      
      {/* Hotel Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
          {hotel.contact?.address && hotel.contact.address.length > 0 && (
            <div className="mb-2">
              <strong>Address:</strong>
              <p className="text-gray-700">
                {hotel.contact.address[0].line1}
                {hotel.contact.address[0].line2 && 
                  `, ${hotel.contact.address[0].line2}`}
              </p>
              <p className="text-gray-600 text-sm">
                {hotel.contact.address[0].city}, {hotel.contact.address[0].state} - {hotel.contact.address[0].postalCode}
              </p>
            </div>
          )}
          {hotel.contact?.phones && hotel.contact.phones.length > 0 && (
            <div className="mb-2">
              <strong>Phone:</strong> {hotel.contact.phones[0]}
            </div>
          )}
          {hotel.contact?.emails && hotel.contact.emails.length > 0 && (
            <div>
              <strong>Email:</strong> {hotel.contact.emails[0]}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-3">Hotel Details</h3>
          <div className="space-y-2">
            <div><strong>Provider:</strong> {hotel.providerName}</div>
            <div><strong>Chain:</strong> {hotel.chainName}</div>
            <div><strong>Type:</strong> {hotel.type}</div>
            <div><strong>Category:</strong> {hotel.category}</div>
            {hotel.reviews && hotel.reviews.length > 0 && (
              <div>
                <strong>Reviews:</strong> {hotel.reviews[0].rating}/5 
                ({hotel.reviews[0].count} reviews)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Descriptions */}
      {hotel.descriptions && hotel.descriptions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-3">Hotel Descriptions</h3>
          {hotel.descriptions.map((desc: any, index: number) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800">{desc.type}</h4>
              <div 
                className="text-gray-700 mt-1"
                dangerouslySetInnerHTML={{ __html: desc.text }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Check-in/Check-out Info */}
      {(hotel.checkinInfo || hotel.checkoutInfo) && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Check-in & Check-out Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotel.checkinInfo && (
              <div>
                <strong>Check-in:</strong>
                <p className="text-gray-700">
                  {hotel.checkinInfo.beginTime || 'Not specified'} - 
                  {hotel.checkinInfo.endTime || 'Not specified'}
                </p>
                <p className="text-sm text-gray-600">
                  Min Age: {hotel.checkinInfo.minAge} years
                </p>
              </div>
            )}
            {hotel.checkoutInfo && (
              <div>
                <strong>Check-out:</strong>
                <p className="text-gray-700">
                  {hotel.checkoutInfo.time || 'Not specified'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;

