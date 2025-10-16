import React from 'react';
import { Clock, Users, Bed } from 'lucide-react';

interface HotelRoomsProps {
  rooms: {
    status: string;
    message?: string;
    stayPeriod?: {
      start: string;
      end: string;
    };
    recommendations?: Array<{
      groupId: string;
      total: number;
      roomGroup: Array<{
        room?: {
          name: string;
          description?: string;
        };
        occupancies?: Array<{
          numOfAdults: number;
          numOfChildren: number;
        }>;
        roomCount: number;
        providerName: string;
        refundable: boolean;
        onlineCancellable: boolean;
        specialRequestSupported: boolean;
        room?: {
          smokingAllowed: boolean;
        };
        baseRate: number;
        taxes?: Array<{
          amount: number;
        }>;
        commission?: {
          amount: number;
        };
        totalRate: number;
        cancellationPolicies?: Array<{
          text: string;
        }>;
      }>;
    }>;
  };
  onNavigateBack: () => void;
  onRetry: () => void;
}

const HotelRooms: React.FC<HotelRoomsProps> = ({ rooms, onNavigateBack, onRetry }) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!rooms) {
    return null;
  }

  if (rooms.status === 'failure') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Available Rooms</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏨</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Rooms Available</h3>
          <p className="text-gray-600 mb-4">
            {rooms.message || 'No rooms found for this hotel at the moment.'}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Possible reasons:</strong>
            </p>
            <ul className="text-blue-700 text-sm mt-2 list-disc list-inside">
              <li>Hotel may be fully booked for your selected dates</li>
              <li>No rooms available for your search criteria</li>
              <li>Hotel may have limited availability</li>
            </ul>
          </div>
          <div className="mt-4">
            <button
              onClick={onNavigateBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mr-2"
            >
              Try Different Hotel
            </button>
            <button
              onClick={onRetry}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Check Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (rooms.status === 'success' && rooms.recommendations?.length > 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Available Rooms</h2>
        <div className="space-y-6">
          {/* Stay Period Info */}
          {rooms.stayPeriod && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Stay Period</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-blue-700">
                    <strong>Check-in:</strong> {rooms.stayPeriod.start}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-blue-700">
                    <strong>Check-out:</strong> {rooms.stayPeriod.end}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Room Recommendations */}
          {rooms.recommendations.map((rec: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Room Group {rec.groupId}
                  </h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(rec.total)}
                    </p>
                    <p className="text-sm text-gray-500">Total Rate</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {rec.roomGroup?.map((room: any, roomIndex: number) => (
                  <div key={roomIndex} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Room Details */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          {room.room?.name}
                        </h4>
                        <p className="text-gray-600 mb-3">
                          {room.room?.description || 'No description available'}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span>
                              Adults: {room.occupancies?.[0]?.numOfAdults || 0} | 
                              Children: {room.occupancies?.[0]?.numOfChildren || 0}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Bed className="w-4 h-4 mr-2" />
                            <span>Room Count: {room.roomCount}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">Provider:</span>
                            <span className="font-medium">{room.providerName}</span>
                          </div>
                        </div>

                        {/* Room Features */}
                        <div className="flex flex-wrap gap-2">
                          {room.refundable && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Refundable
                            </span>
                          )}
                          {room.onlineCancellable && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Online Cancellable
                            </span>
                          )}
                          {room.specialRequestSupported && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                              Special Requests
                            </span>
                          )}
                          {!room.room?.smokingAllowed && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                              Non-Smoking
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing Details */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-3">Pricing Breakdown</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Base Rate:</span>
                            <span>{formatPrice(room.baseRate)}</span>
                          </div>
                          {room.taxes && room.taxes.length > 0 && (
                            <div className="flex justify-between">
                              <span>Taxes:</span>
                              <span>{formatPrice(room.taxes.reduce((sum: number, tax: any) => sum + tax.amount, 0))}</span>
                            </div>
                          )}
                          {room.commission && (
                            <div className="flex justify-between text-green-600">
                              <span>Commission:</span>
                              <span>{formatPrice(room.commission.amount)}</span>
                            </div>
                          )}
                          <hr className="my-2" />
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total Rate:</span>
                            <span className="text-green-600">{formatPrice(room.totalRate)}</span>
                          </div>
                        </div>

                        {/* Cancellation Policy */}
                        {room.cancellationPolicies && room.cancellationPolicies.length > 0 && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <h6 className="font-semibold text-yellow-800 text-sm mb-1">
                              Cancellation Policy:
                            </h6>
                            <div 
                              className="text-yellow-700 text-xs"
                              dangerouslySetInnerHTML={{ 
                                __html: room.cancellationPolicies[0]?.text || 'No policy available' 
                              }}
                            />
                          </div>
                        )}

                        {/* Book Now Button */}
                        <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                          Book Now - {formatPrice(room.totalRate)}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Available Rooms</h2>
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🏨</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Rooms Available</h3>
        <p className="text-gray-600">No room options found for this hotel.</p>
      </div>
    </div>
  );
};

export default HotelRooms;
