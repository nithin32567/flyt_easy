import React, { useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HotelNavbar from '../../components/HotelNavbar';
import HotelCard from '../../components/HotelCard';
const hotel_token = localStorage.getItem('hotel-signature');

const Home = () => {
    const hotel_data = [
        {
          "id": "376416",
          "name": "Boma (BOA)",
          "fullName": "Boma, Democratic Republic of the Congo (BOA)",
          "code": "boa",
          "type": "airport",
          "city": null,
          "state": null,
          "country": "CD",
          "score": 0,
          "referenceId": null,
          "coordinates": {
            "lat": -5.856491,
            "long": 13.061516
          }
        },
        {
          "id": "247112",
          "name": "Mumbai (BOM-Chhatrapati Shivaji Intl.)",
          "fullName": "Mumbai, India (BOM-Chhatrapati Shivaji Intl.)",
          "code": "bom",
          "type": "airport",
          "city": null,
          "state": null,
          "country": "IN",
          "score": 0,
          "referenceId": null,
          "coordinates": {
            "lat": 19.099533,
            "long": 72.874331
          }
        },
        {
          "id": "588820",
          "name": "Bommern",
          "fullName": "Bommern, Witten, North Rhine-Westphalia, Germany",
          "code": null,
          "type": "neighborhood",
          "city": null,
          "state": null,
          "country": "DE",
          "score": 0,
          "referenceId": null,
          "coordinates": {
            "lat": 51.413364,
            "long": 7.333714
          }
        },
        {
          "id": "123456",
          "name": "Taj Palace Hotel",
          "fullName": "Taj Palace Hotel, New Delhi, India",
          "code": "taj",
          "type": "hotel",
          "city": "New Delhi",
          "state": "Delhi",
          "country": "IN",
          "score": 0,
          "referenceId": null,
          "coordinates": {
            "lat": 28.6139,
            "long": 77.2090
          }
        },
        {
          "id": "789012",
          "name": "Marriott Resort",
          "fullName": "Marriott Resort & Spa, Dubai, UAE",
          "code": "mar",
          "type": "hotel",
          "city": "Dubai",
          "state": null,
          "country": "AE",
          "score": 0,
          "referenceId": null,
          "coordinates": {
            "lat": 25.2048,
            "long": 55.2708
          }
        },
        {
          "id": "345678",
          "name": "Hilton Garden Inn",
          "fullName": "Hilton Garden Inn, Singapore",
          "code": "hgi",
          "type": "hotel",
          "city": "Singapore",
          "state": null,
          "country": "SG",
          "score": 0,
          "referenceId": null,
          "coordinates": {
            "lat": 1.3521,
            "long": 103.8198
          }
        }
      ]

    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
    const navigate = useNavigate();
    useEffect(() => {
        const getSignature = async () => {
            const response = await axios.post("http://localhost:3000/api/hotels/signature", {}, {
                withCredentials: true,
            });
            console.log(response.data, 'response in signature controller');
            localStorage.setItem('hotel-signature', response.data.data.Token);
        }
        getSignature();
    }, [])
    return (
        <div>
            <HotelNavbar />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-7xl mx-auto my-10    '>
                {hotel_data.map((hotel) => (
                    <HotelCard key={hotel.id} location={hotel} />
                ))}
            </div>
        </div>
    )
}

export default Home