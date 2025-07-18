import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import topdestinations from '../assets/img/topdestinations.jpg'
import bali from '../assets/img/bali.jpg'



const CarousalCites = ({ Card }) => {
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,
            slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    return (
        <>
            <style>
                {/* make square shaped dots     */}
                {`
                    .custo-list-style {
                        display: flex;
                        width: 100%;
                        height: 100px !important;
                        
                    }.custo-list-style li{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: -50% !important;
                 
                    }

                                         .custo-list-style li button {
                         width: 20px !important;
                         height: 20px !important;
                         margin-top: 80px !important;
                         border-radius: 0 !important;
                         background-color: #ccc  !important;
                     }
                     
                     .custo-list-style li.react-multi-carousel-dot--active button {
                         background-color: #000 !important;
                     }
                    
                   
                `}
            </style>
            <Carousel className='gap-4 h-full py-8 mb-12 '
                swipeable={false}
                draggable={false}
                showDots={true}
                responsive={responsive}
                gap={10}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                // autoPlay={this.props.deviceType !== "mobile" ? true : false}
                autoPlaySpeed={500}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                // deviceType={this.props.deviceType}
                dotListClass="custo-list-style"
                autoPlay={true}
                itemClass=""
                arrows={false}
            >
                <div>
                    <Card image={topdestinations} />
                </div>
                <div>
                    <Card image={bali} />
                </div>
                <div>
                    <Card image={bali} />
                </div>
                <div>
                    <Card image={bali} />
                </div>
                <div>
                    <Card image={topdestinations} />
                </div>
            </Carousel>
        </>
    )
}

export default CarousalCites




