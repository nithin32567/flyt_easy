import React, { useEffect, useState } from "react";
import logo from "../assets/img/flyteasy-logo.png";

const HeaderSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  function takeScrollPosition() {
    const scrollPosition = window.scrollY;
    // // console.log(scrollPosition);
    setScrollPosition(scrollPosition);
  }

  useEffect(() => {
    window.addEventListener("scroll", takeScrollPosition);
    return () => {
      window.removeEventListener("scroll", takeScrollPosition);
    };
  }, []);

  return (
    <div className="bg-white w-full  md:rounded-xl md:py-6 py-1 px-4 md:px-12 flex justify-between items-center">
      <div className="flex  justify-between items-center max-w-xs">
        <a href="/home">
          <img className="md:w-[60%] w-[100px]" src={logo} alt="Flyteasy" />
        </a>
      </div>
      <div className="flex justify-between items-center max-w-xs gap-4">
        <button className="hover:bg-[#16437c] w-full hover:text-white border-2
         border-[#16437c] text-[#16437c] md:px-4 px-2  py-1 rounded-xs uppercase  text-xs md:text-base">
          Register
        </button>
        <button
          className="
        md:px-4 px-2  py-1 
        uppercase w-full bg-[#f48f22] text-white border-none rounded-xs hover:bg-[#16437c]"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;

{
  /* <div className="header-topsection">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <p>Book flights &amp; hotels in seconds</p>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <ul className="socialmedia-icons">
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
                </div>
            </div> */
}
