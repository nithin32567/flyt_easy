import React from 'react'
import indigo from '../assets/img/indigo.jpg'
import flydubai from '../assets/img/flydubai.jpg'
import airarabia from '../assets/img/airarabia.jpg'
import spicejet from '../assets/img/spicejet.jpg'
import ethihad from '../assets/img/ethihad.jpg'
import saudi from '../assets/img/saudi-arabia-airlines.jpg'
import malaysia from '../assets/img/malaysia.jpg'
import airindia from '../assets/img/iarindia.jpg'
import thai from '../assets/img/thai.jpg'
import emirates from '../assets/img/emirates.jpg'
import singapore from '../assets/img/singapore-airlines.jpg'
import pia from '../assets/img/pia.jpg'
import gulfair from '../assets/img/gulf-air.jpg'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import LogoCard from './LogoCard'

const images = [
    { src: indigo, alt: "Indigo" },
    { src: flydubai, alt: "Flydubai" },
    { src: airarabia, alt: "Air Arabia" },
    { src: spicejet, alt: "SpiceJet" },
    { src: ethihad, alt: "Etihad" },
    { src: saudi, alt: "Saudi Arabia Airlines" },
    { src: malaysia, alt: "Malaysia Airlines" },
    { src: airindia, alt: "Air India" },
    { src: thai, alt: "Thai Airways" },
    { src: emirates, alt: "Emirates" },
    { src: singapore, alt: "Singapore Airlines" },
    { src: pia, alt: "PIA" },
    { src: gulfair, alt: "Gulf Air" }
]

const FlightLogos = () => {
    return (
        <div className="my-12">
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={false}
                // pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                loop={true}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 40,
                    },
                    1280: {
                        slidesPerView: 5,
                        spaceBetween: 40,
                    },
                }}
                className="airline-logos-swiper"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <LogoCard image={image.src} alt={image.alt} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default FlightLogos