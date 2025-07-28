import React from "react";

const Footer = () => {
  return (
    <div className="footer-bottom bg-[#061849] text-gray-200">
      <div className="container max-w-7xl mx-auto py-[5%]">
        <div className="flex flex-col md:flex-row gap-2 justify-between items-center">
          <div className="col-lg-6 col-md-6 ">
            <ul className="socialmedia-icons flex gap-2 justify-center items-center">
              <li className="rounded-full bg-blue-600 w-10 h-10 flex justify-center items-center">
                <a href="#" className="fb" target="_blank">
                  <i className="fab fa-facebook-f" />
                </a>
              </li>
              <li className="rounded-full bg-indigo-700 w-10 h-10 flex justify-center items-center">
                <a href="#" className="li" target="_blank">
                  <i className="fab fa-linkedin-in" />
                </a>
              </li>
              <li className="rounded-full bg-black w-10 h-10 flex justify-center items-center">
                <a href="#" className="tw" target="_blank">
                  <i className="fa-brands fa-x-twitter" />
                </a>
              </li>
              <li className="rounded-full bg-red-400 w-10 h-10 flex justify-center items-center">
                <a href="#" className="in" target="_blank">
                  <i className="fab fa-instagram" />
                </a>
              </li>
              <li className="rounded-full bg-red-700 w-10 h-10 flex justify-center items-center">
                <a href="#" className="em" target="_blank">
                  <i className="fa-regular fa-envelope" />
                </a>
              </li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6">
            <p>2025 © Flyteasy. All Right Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
