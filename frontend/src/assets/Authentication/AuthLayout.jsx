/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const pageVariants = {
  initial: {
    opacity: 0,
    filter: "blur(8px)",
  },
  in: {
    opacity: 1,
    filter: "blur(0px)",
  },
  out: {
    opacity: 0,
    filter: "blur(8px)",
  },
};

const pageTransition = {
  type: "tween",
  duration: 0.5,
};

const AuthLayout = ({
  children,
  title,
  primaryHeading,
  secondaryHeading,
  authType,
  redirectText,
  redirectLink,
  redirectLinkText,
  bgColor = "bg-gray-800",
}) => {
  return (
    <div className="flex justify-center items-center text-white">
      <div className="absolute top-0 left-0 p-4 text-white flex justify-between w-full">
        <h1 className="text-3xl font-bold text-white hidden sm:block">
          <span className="text-orange-400">L</span>EXICON
        </h1>
      </div>
      <motion.main className="flex flex-col md:flex-row w-[100%] h-screen p-0 md:p-0 justify-between">
        <div
          className={`text-white flex justify-center items-center w-full md:w-[50%] mx-auto p-4 md:p-6 flex-col ${bgColor}`}
        >
          <div className="flex flex-col text-left space-y-2 md:space-y-4">
            <motion.h1
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="text-3xl md:text-5xl font-bold"
            >
              {title}
            </motion.h1>
            <h1 className="text-2xl md:text-5xl font-bold">
              <span className="text-orange-400">Empower</span> {primaryHeading}{" "}
            </h1>
            <h1 className="text-2xl md:text-5xl font-bold">
              {secondaryHeading}
            </h1>
            <div className="mt-8 md:mt-32 text-xs md:text-sm flex font-semibold">
              {" "}
              <p className="text-white">
                <h6>{redirectText}</h6>
                <Link
                  to={redirectLink}
                  className="text-[#2414ff] cursor-pointer"
                >
                  <h6>
                    <span className="text-white">you can </span>
                    {redirectLinkText}{" "}
                  </h6>
                </Link>
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full md:w-[50%] h-full flex items-center justify-center p-4 md:p-0"
        >
          {children}
        </motion.div>
      </motion.main>
    </div>
  );
};

export default AuthLayout;
