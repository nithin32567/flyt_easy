import React from 'react'

const MiniHeader = () => {
    return (
        <div className="flex justify-between items-center text-white max-w-[95%] mx-auto my-1">
            <div className="col-lg-6 col-md-6">
                <p>Book flights &amp; hotels in seconds</p>
            </div>
            <div className="flex ">
                <ul className="flex gap-4 items-center">
                    <li>
                        <a href="#" className="fb" target="_blank">
                            <i className="fab fa-facebook-f" />
                        </a>
                    </li>
                    <li>
                        <a href="#" className="li" target="_blank">
                            <i className="fab fa-linkedin-in" />
                        </a>
                    </li>
                    <li>
                        <a href="#" className="tw" target="_blank">
                            <i className="fa-brands fa-x-twitter" />
                        </a>
                    </li>
                    <li>
                        <a href="#" className="in" target="_blank">
                            <i className="fab fa-instagram" />
                        </a>
                    </li>
                    <li>
                        <a href="#" className="em" target="_blank">
                            <i className="fa-regular fa-envelope" />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default MiniHeader