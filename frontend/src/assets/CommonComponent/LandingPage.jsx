/* eslint-disable no-unused-vars */
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "./Navbar";
import Computer from "./Images/3d-portrait-peoplee-removebg-preview.png";
import Computer2 from "./Images/3d-rendering.png";
import {
  ArrowRight,
  ArrowLeft,
  Sprout,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedKnowledgeGlobe from "./AnimatedGlobe";

const LandingPage = () => {
  const navigate = useNavigate();

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
  });

  // Parallax transformations
  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1.5]);

  const handleInstructorClick = () => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/instructor-dashboard");
    } else {
      navigate("/login-instructor");
    }
  };

  const features = [
    {
      icon: Sprout,
      iconClass: "text-green-200 bg-green-900",
      title: "Learn on Your Terms",
      description:
        "Flexible learning that adapts to your schedule and lifestyle.",
    },
    {
      icon: Lightbulb,
      iconClass: "text-yellow-200 bg-yellow-900",
      title: "Courses You Can Trust",
      description:
        "Rigorously curated content with expert-backed quality assurance.",
    },
    {
      icon: GraduationCap,
      iconClass: "text-red-200 bg-red-900",
      title: "Shaping Education's Future",
      description:
        "Innovative approaches that transform learning for the digital age.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <header className="min-h-screen flex items-center bg-gradient-to-br from-gray-900 to-black justify-center relative px-4">
          <div className="fixed inset-0 z-0 overflow-hidden">
            <AnimatedKnowledgeGlobe className="" interactive={true} />
          </div>
          <motion.div
            style={{
              scale: titleScale,
            }}
            className="text-center text-white px-4 z-20 relative max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Shape Your Future with{" "}
              <span className="text-orange-500">LEXICON</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8">
              Unlock Your Potential Through Innovative Learning
            </p>

            <motion.button
              className="cursor-pointer bg-white bg-opacity-10 p-3 space-x-4 flex justify-between items-center rounded-full backdrop-blur-md shadow-lg hover:bg-opacity-15 duration-300 mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={handleInstructorClick}
            >
              <h1 className="cursor-pointer text-white font-semibold pl-4 text-sm sm:text-base">
                Become Instructor
              </h1>
              <span className="text-white bg-orange-600 rounded-full p-1 mr-1">
                <ArrowRight size={18} />
              </span>
            </motion.button>
          </motion.div>
        </header>

        <section className="relative bg-gradient-to-br from-gray-900 to-black  space-y-1 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <svg
              className="absolute bottom-0 left-0 w-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="rgba(255,255,255,0.1)"
                fillOpacity="1"
                d="M0,192L48,165.3C96,139,192,85,288,101.3C384,117,480,203,576,213.3C672,224,768,160,864,122.7C960,85,1056,75,1152,106.7C1248,139,1344,213,1392,250.7L1440,288L1440,320L0,320Z"
              ></path>
            </svg>
          </div>

          {/* First Feature Block */}
          <div className="flex justify-center items-center px-4">
            <div className="flex flex-col md:flex-row justify-between items-center p-3 w-full max-w-6xl space-y-8 md:space-y-0 md:space-x-8">
              <div className="space-y-5 order-2 md:order-1 text-center md:text-left w-full md:w-1/2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  Get Ready to Code and{" "}
                  <span className="text-purple-500">Conquer</span> with us
                </h1>
                <p className="text-base md:text-lg text-gray-400 max-w-prose">
                  Level up your skills (and your coffee intake) with our online
                  coding playground, built to help you crush your tech goals.
                  🖥️💥
                </p>
                <Link to="/signup" className="block">
                  <button className="cursor-pointer bg-white bg-opacity-10 p-3 mt-5 mx-auto md:mr-auto md:ml-0 w-auto h-18 text-center space-x-4 rounded-full backdrop-blur-md shadow-lg hover:bg-opacity-15 duration-300 text-white flex justify-between items-center">
                    <h1 className="cursor-pointer text-white font-semibold text-sm">
                      Start Your Learning Adventure!
                    </h1>
                    <span className="flex justify-center items-center bg-orange-600 rounded-full p-2">
                      <ArrowRight size={15} />
                    </span>
                  </button>
                </Link>
              </div>
              <div className="relative w-48 sm:w-64 md:w-80 order-1 md:order-2 hidden md:block">
                <img
                  src={Computer}
                  alt="Computer"
                  className="relative z-10 rounded-3xl w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Second Feature Block */}
          <div className="flex justify-center items-center px-4 mt-8 md:mt-0">
            <div className="flex flex-col md:flex-row justify-between items-center p-3 w-full max-w-6xl space-y-8 md:space-y-0 md:space-x-8">
              <div className="relative w-48 sm:w-64 md:w-80 hidden md:block">
                <img
                  src={Computer2}
                  alt="Computer"
                  className="rounded-lg w-full h-auto object-contain"
                />
              </div>

              <div className="space-y-5 text-center md:text-right w-full md:w-1/2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  Brace for epic{" "}
                  <span className="text-yellow-500">Adventures</span> and coding
                  chaos!
                </h1>
                <p className="text-base md:text-lg text-gray-400 max-w-prose ml-auto">
                  Boost your skills (and caffeine levels) with our coding
                  playground, designed to help you conquer tech challenges like
                  a pro. 🖥️⚡
                </p>
                <Link to="" className="block">
                  <button className="cursor-pointer text-white bg-white bg-opacity-10 p-3 mt-5 w-auto h-18 flex justify-center items-center text-center space-x-2 rounded-full backdrop-blur-md shadow-lg hover:bg-opacity-15 mx-auto md:ml-auto md:mr-0 duration-300">
                    <span className="flex justify-center items-center bg-orange-600 rounded-full p-2">
                      <ArrowLeft size={15} />
                    </span>
                    <h1 className="cursor-pointer text-white font-semibold text-sm">
                      Dive Into Learning Now!
                    </h1>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-white flex justify-center items-center py-16">
          <div className="grid md:grid-cols-3 gap-8 w-full max-w-7xl px-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex justify-center items-center flex-col text-center p-6 space-y-4"
              >
                <feature.icon
                  className={`${feature.iconClass} rounded-full p-3`}
                  size={48}
                />
                <h2 className="text-xl font-bold text-gray-800">
                  {feature.title}
                </h2>
                <p className="text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
