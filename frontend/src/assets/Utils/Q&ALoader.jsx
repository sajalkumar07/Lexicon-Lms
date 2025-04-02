/* eslint-disable no-unused-vars */
import React from "react";

const QandALoader = () => {
  return (
    <div>
      <div className="py-2 flex justify-center items-center">
        <svg
          className="animate-spin h-5 w-5 text-gray-500 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 108 8h-4l3 3 3-3h-4a8 8 0 01-8 8z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default QandALoader;
