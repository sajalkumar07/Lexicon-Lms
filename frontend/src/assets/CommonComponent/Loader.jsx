/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

const Loader = ({ children }) => (
  <div className="flex flex-col justify-center items-center w-full py-16">
    <div className="relative">
      {/* Main outer ring */}
      <div className="w-20 h-20 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>

      {/* Inner pulsing circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-orange-300 rounded-full animate-pulse"></div>

      {/* Orbiting dot */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
      </div>

      {/* Decorative particles */}
      <div className="absolute top-1/2 left-1/2">
        <div className="w-1 h-1 bg-orange-200 rounded-full absolute -top-14 -left-2 animate-ping"></div>
        <div
          className="w-1.5 h-1.5 bg-orange-300 rounded-full absolute -top-10 -right-6 animate-ping"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="w-1 h-1 bg-orange-400 rounded-full absolute -bottom-12 -right-4 animate-ping"
          style={{ animationDelay: "0.7s" }}
        ></div>
        <div
          className="w-1.5 h-1.5 bg-orange-500 rounded-full absolute -bottom-8 -left-8 animate-ping"
          style={{ animationDelay: "1.1s" }}
        ></div>
      </div>
    </div>
    <p className="mt-4 text-orange-500 font-semibold">{children}</p>
  </div>
);

export default Loader;
