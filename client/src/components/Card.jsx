import React from 'react'
import topdestinations from '../assets/img/topdestinations.jpg'

const Card = () => {
    return (
        <div className=" rounded-lg shadow-md mr-4 bg-gray-200 p-2 w-[300px]" >
            <a href="" className="flex flex-col items-center justify-center">
                <span>
                    <i className="fa-solid fa-link" />
                    <img className='w-[300px] rounded-xl h-[200px] object-cover'
                        src={topdestinations}
                        alt="Tamil Nadu's Charming Hill Town"
                    />
                </span>
                <h5 className='text-lg font-bold text-center' >For You: MakeMyTrip ICICI Bank Credit Card!</h5>
                <h3 className='text-sm font-bold text-[#f48f22]'>Book Now</h3>
            </a>
        </div>
    )
}

export default Card