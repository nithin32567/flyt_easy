import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";

const MiniHeader = () => {
  return (
    <div className="flex justify-between items-center text-gray-300 max-w-[95%] mx-auto my-1 ">
      <div className="col-lg-6 col-md-6 text-sm md:text-base  w-full ">
        <p className="text-center md:text-left">Book flights &amp; hotels in seconds</p>
      </div>
      <div className=" hidden md:flex justify-center items-center">
        <ul className="flex gap-4 items-center">
          <li>
            <a href="#" className="fb" target="_blank">
              <FaFacebookF />
            </a>
          </li>
          <li>
            <a href="#" className="li" target="_blank">
              <FaLinkedinIn />
            </a>
          </li>
          <li>
            <a href="#" className="tw" target="_blank">
              <FaXTwitter />
            </a>
          </li>
          <li>
            <a href="#" className="in" target="_blank">
              <FaInstagram />
            </a>
          </li>
          <li>
            <a href="#" className="em" target="_blank">
              <FaEnvelope />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MiniHeader;
