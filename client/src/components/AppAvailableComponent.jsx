import React from "react";
import googleplay from "../assets/img/googleplay.png";
import appstore from "../assets/img/appstore.png";
import qrcode from "../assets/img/qr-code.jpg";

const AppAvailableComponent = () => {
  return (
    <div className="grid md:grid-cols-3 grid-cols-1   p-8 items-center rounded-md border-2 border-orange-500 ">
      {/* Left Content */}
      <div className="flex flex-col  gap-4 w-full">
        <div className="w-full">
          <h3 className="text-2xl font-bold ">
            Plan, Book & Travel On-the-Go Get the App Now!
          </h3>
        </div>

        <div className="flex items-center justify-between border rounded-md  w-full my-6">
          <input
            className="py-2 w-[90%]"
            type="text"
            placeholder="Enter Your Mobile Number "
          />
          <button className="bg-orange-400 text-white px-4 h-full py-2  rounded-md">
            SEND
          </button>
        </div>
      </div>

      <div className="hidden md:block "></div>
      {/* Right Content */}
      <div className="grid grid-cols-2 gap-4 items-center">
        {/* Store Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <a href="#">
            <img src={googleplay} alt="Google Play" />
          </a>
          <a href="#">
            <img src={appstore} alt="App Store" />
          </a>
        </div>

        {/* QR Code */}
        <div>
          <img src={qrcode} alt="QR Code" />
        </div>
      </div>
    </div>
  );
};

export default AppAvailableComponent;
