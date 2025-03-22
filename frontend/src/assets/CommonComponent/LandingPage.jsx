// eslint-disable-next-line no-unused-vars
import React from "react";
import Navbar from "./Navbar";
import Robot from "./Images/guy.jpg";
import Computer from "./Images/3d.png";
import Computer2 from "./Images/codeani.gif";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleInstructorClick = () => {
    // Check if token exists in localStorage
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      // User is logged in, navigate to instructor dashboard
      navigate("/instructor-dashboard");
    } else {
      // User is not logged in, navigate to login page
      navigate("/login-instructor");
    }
  };

  return (
    <div>
      <Navbar></Navbar>

      <div>
        <main
          className="min-h-screen bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${Robot})` }}
        >
          <div className="absolute bg-black opacity-70 inset-0"></div>

          <div className="flex justify-center items-center min-h-screen z-10 relative flex-col space-y-4 px-4">
            {/* "Become Instructor" Button */}
            <motion.div
              className="cursor-pointer bg-white bg-opacity-10 p-3 w-60 h-18 flex justify-center items-center text-center space-x-2 rounded-full backdrop-blur-md shadow-lg hover:bg-opacity-15 duration-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={handleInstructorClick}
            >
              <h1 className="cursor-pointer text-white font-semibold tracking-normal flex items-center">
                Become Instructor
              </h1>
              <span className="flex justify-center items-center text-white">
                <ArrowRight />
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-2xl md:text-4xl font-bold text-white text-center"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Shape Your Future with{" "}
              <span className="text-orange-500">LEXICON</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-lg md:text-xl font-semibold text-center text-gray-400 px-2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            >
              Unlock your potential with our free online coding and training
              platform designed <br className="hidden md:block" />
              to empower you on your tech journey.
            </motion.p>

            {/* Explore Button */}
            <motion.div
              className="cursor-pointer bg-orange-700 p-3 w-28 h-18 flex justify-center items-center rounded-md hover:bg-orange-600 "
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
              <h1 className="cursor-pointer text-white font-semibold tracking-normal">
                Unleash
              </h1>
            </motion.div>
          </div>
        </main>

        <section className="space-y-16 md:space-y-28 bg-black text-white py-12">
          <div className="flex justify-center items-center">
            <div className="flex flex-col md:flex-row justify-between items-center p-3 w-[90%] md:w-[80%] space-y-8 md:space-y-0">
              <div className="space-y-5 order-2 md:order-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Get Ready to Code and{" "}
                  <span className="text-purple-500">Conquer</span> with US
                </h1>
                <p className="text-base md:text-lg text-gray-400">
                  Level up your skills (and your coffee intake){" "}
                  <br className="hidden md:block" />
                  with our online coding playground, built to help you{" "}
                  <br className="hidden md:block" />
                  crush your tech goals. 🖥️💥
                </p>
                <Link to="/signup">
                  <button className="cursor-pointer bg-white bg-opacity-10 p-3 mt-5 mx-auto md:mr-auto md:ml-0 w-auto h-18 flex justify-center items-center text-center space-x-2 rounded-full backdrop-blur-md shadow-lg hover:bg-opacity-15 duration-300">
                    Start Your Learning Adventure!
                    <span className="flex justify-center items-center ml-2">
                      <ArrowRight />
                    </span>
                  </button>
                </Link>
              </div>
              <div className="relative w-64 md:w-80 order-1 md:order-2 hidden md:block">
                <img
                  src={Computer}
                  alt="Computer"
                  className="relative z-10 rounded-3xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="flex flex-col md:flex-row justify-between items-center p-3 w-[90%] md:w-[80%] space-y-8 md:space-y-0">
              <div className="relative w-64 md:w-80 hidden md:block">
                <img src={Computer2} alt="Computer" className="rounded-lg" />
              </div>

              <div className="space-y-5 text-center md:text-right">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Brace for epic{" "}
                  <span className="text-yellow-500">Adventures</span> and coding
                  chaos!
                </h1>
                <p className="text-base md:text-lg text-gray-400">
                  Boost your skills (and caffeine levels){" "}
                  <br className="hidden md:block" />
                  with our coding playground, designed to help you{" "}
                  <br className="hidden md:block" />
                  conquer tech challenges like a pro. 🖥️⚡
                </p>
                <Link to="">
                  <button className="cursor-pointer bg-white bg-opacity-10 p-3 mt-5 w-auto h-18 flex justify-center items-center text-center space-x-2 rounded-full backdrop-blur-md shadow-lg hover:bg-opacity-15 mx-auto md:ml-auto md:mr-0 duration-300">
                    <span className="flex justify-center items-center mr-2">
                      <ArrowLeft />
                    </span>
                    Dive Into Learning Now!
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
