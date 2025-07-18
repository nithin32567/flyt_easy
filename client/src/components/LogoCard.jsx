import React from 'react'

const LogoCard = ({ image, alt }) => {
    return (
        <div className="border rounded-xl overflow-hidden w-[200px] h-[120px] flex items-center justify-center bg-white">
            <div className="partners-logo w-full h-full">
                <img 
                    className='w-full h-full object-contain p-4' 
                    src={image} 
                    alt={alt || "airline logo"} 
                />
            </div>
        </div>
    )
}

export default LogoCard
