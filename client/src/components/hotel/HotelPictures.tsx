import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HotelPicturesProps {
  images: Array<{
    url: string;
    alt?: string;
  }>;
}

const HotelPictures: React.FC<HotelPicturesProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getHotelImages = () => {
    if (images && images.length > 0) {
      return images;
    }
    return [{ url: '/api/placeholder/400/300', alt: 'Hotel Image' }];
  };

  const nextImage = () => {
    const imageList = getHotelImages();
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    const imageList = getHotelImages();
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const imageList = getHotelImages();

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Hotel Images</h2>
      <div className="relative">
        <div className="relative h-96 rounded-lg overflow-hidden">
          <img
            src={imageList[currentImageIndex]?.url}
            alt={imageList[currentImageIndex]?.alt || 'Hotel Image'}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation arrows */}
          {imageList.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
        
        {/* Image thumbnails */}
        {imageList.length > 1 && (
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {imageList.map((image: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt || `Hotel Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelPictures;

