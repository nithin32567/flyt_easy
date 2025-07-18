import React from 'react'
import banner01 from '../assets/img/banner-01.jpg'
import SearchForm from './SearchForm'

const Demobanner = () => {
    return (
        <div className='w-full min-h-[60vh] md:h-[60vh] relative bg-red-500'>
            <div className='w-full h-full absolute top-0 left-0 bg-[#16437c] opacity-90 z-10'></div>
            <img className='w-full h-full object-cover z-20' src={banner01} alt="" />

            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center z-50 opacity-100 flex flex-col gap-2 md:gap-4 px-4 md:px-0'>
                <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight'>
                    Lorem ipsum dolor sit amet consectetur.
                </h1>
                <h3 className='text-sm sm:text-base md:text-lg font-bold leading-relaxed max-w-4xl mx-auto'>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Exercitationem eos, obcaecati qui accusamus quo provident eveniet laudantium dolore culpa! Nisi voluptates, nobis qui repellendus, quae at nostrum consequatur culpa aliquam temporibus, sed neque modi.
                </h3>
                <button className='hover:bg-[#f48f22] border-2 border-[#f48f22] w-full sm:w-[250px] md:w-[300px] mx-auto hover:text-white text-[#f48f22] cursor-pointer px-4 py-2 rounded-md text-sm md:text-base transition-colors duration-300'>
                    Book Now
                </button>
            </div>
            <div className='absolute -translate-y-1/4 w-full h-full z-70 px-4 md:px-0'>
                <SearchForm />
            </div>
        </div>
    )
}

export default Demobanner