/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Computer from "./Images/3d-portrait-peoplee-removebg-preview.png";
import Computer2 from "./Images/3d-rendering.png";
import {
  ArrowRight,
  ArrowLeft,
  Sprout,
  Lightbulb,
  GraduationCap,
  ChevronDown,
  Quote,
  Check,
  BookOpenCheck,
  CreditCard,
  UsersRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedKnowledgeGlobe from "./AnimatedGlobe";
import DataVisualizationSection from "./DataVisualization";
import Instructor from "./Images/view-3d-businessman.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleInstructorClick = () => {
    const authToken = localStorage.getItem("authToken");
    const instructorData = localStorage.getItem("instructorData");
    if (authToken && instructorData) {
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Senior Software Engineer",
      company: "TechInnovate",
      text: "Lexicon completely transformed my career trajectory. The personalized learning paths and real-world project approach are game-changers.",
      achievement: "Promoted to Senior Engineer within 6 months",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      background: "bg-purple-100",
      textColor: "text-purple-900",
    },
    {
      name: "Mike Rodriguez",
      role: "Web Development Freelancer",
      company: "Global Solutions",
      text: "The depth of content and expert-led courses gave me the confidence to launch my own freelance career. Lexicon is more than just a learning platform - it's a career accelerator.",
      achievement: "Increased income by 120% after course completion",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      background: "bg-blue-100",
      textColor: "text-blue-900",
    },
    {
      name: "Emily Chen",
      role: "Data Science Specialist",
      company: "AI Frontiers",
      text: "What sets Lexicon apart is their cutting-edge curriculum that stays ahead of industry trends. I've gained skills that are immediately applicable in real-world scenarios.",
      achievement: "Landed dream job at a top AI research firm",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      background: "bg-green-100",
      textColor: "text-green-900",
    },
  ];

  const accordionItems = [
    {
      title: "How do Lexicon courses work?",
      content:
        "Our courses are fully online, self-paced, and designed by industry experts. You'll get access to video lectures, coding exercises, and real-world projects.",
    },
    {
      title: "What technology stacks do you cover?",
      content:
        "We offer comprehensive courses in web development, data science, machine learning, cloud computing, and more. From Python to React, we've got you covered.",
    },
    {
      title: "Can I get a certificate after completing a course?",
      content:
        "Yes! Upon successful completion of a course, you'll receive a verified certificate that you can share with potential employers.",
    },
    {
      title: "Are there any prerequisites for the courses?",
      content:
        "Most of our courses are designed for beginners, but we also offer advanced tracks. Each course description clearly outlines the recommended background.",
    },
  ];

  const instructorFeatures = [
    {
      title: "Share Your Expertise",
      content:
        "Turn your knowledge into impact by creating courses that reach thousands of eager learners worldwide. Our platform makes it easy to structure and publish your content.",
      icon: <BookOpenCheck className="w-6 h-6 text-purple-500" />,
    },
    {
      title: "Earn Additional Income",
      content:
        "Generate a sustainable revenue stream through our competitive instructor compensation model. Top instructors on Lexicon earn significant monthly income from their courses.",
      icon: <CreditCard className="w-6 h-6 text-purple-500" />,
    },
    {
      title: "Join Our Community",
      content:
        "Become part of a growing network of industry experts and educators. Collaborate, learn, and grow alongside other passionate instructors.",
      icon: <UsersRound className="w-6 h-6 text-purple-500" />,
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Seamless Learning Experience",
      description:
        "Access courses effortlessly with an intuitive platform designed for easy navigation.",
      features: [
        "User-friendly interface",
        "Learn at your own pace",
        "Engaging video content",
      ],
    },
    {
      number: 2,
      title: "Stay Motivated & Interactive",
      description:
        "Engage with interactive lessons, live sessions, and gamified challenges to keep learning fun.",
      features: ["Live Q&A sessions", "Discussion forums", "Quizzes & rewards"],
    },
    {
      number: 3,
      title: "Track Your Progress & Improve",
      description:
        "Stay on top of your learning journey with detailed insights and progress tracking.",
      features: [
        "Personalized dashboards",
        "Real-time performance tracking",
        "AI-powered study recommendations",
      ],
    },
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}

        <header className="min-h-screen flex items-center   bg-gradient-to-br from-gray-900 to-black  justify-center relative px-4">
          <div className="fixed inset-0 z-0 overflow-hidden">
            <AnimatedKnowledgeGlobe className="" interactive={true} />
          </div>
          <motion.div className="text-center text-white px-4 z-20 relative max-w-4xl mx-auto">
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
            >
              <h1 className="cursor-pointer text-white font-semibold  text-sm sm:text-base">
                Start Learning
              </h1>
              <span className="text-white bg-orange-600 rounded-full p-1 mr-1">
                <ArrowRight size={18} />
              </span>
            </motion.button>
          </motion.div>
        </header>

        {/* Feature Block */}
        <section
          className="relative bg-gradient-to-br bg-gray-900 to-black space-y-1 overflow-hidden"
          style={{
            backgroundImage: `
      linear-gradient(to right, rgba(147, 97, 210, 0.1) 0.1px, transparent 1px),
      linear-gradient(to bottom, rgba(147, 97, 210, 0.1) 0.1px, transparent 1px)
    `,
            backgroundSize: "25px 25px",
          }}
        >
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
              <div className="relative w-48 sm:w-64 md:w-80 order-1 md:order-2 md:block">
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
              <div className="relative w-48 sm:w-64 md:w-80 md:block">
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

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="relative md:bottom-20 bottom-0 left-0 w-full h-10 md:h-40 transform translate-y-1/2 z-99"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L30,69.3C60,75,120,85,180,101.3C240,117,300,139,360,165.3C420,192,480,224,540,213.3C600,203,660,149,720,112C780,75,840,53,900,37.3C960,21,1020,11,1080,16C1140,21,1200,43,1260,58.7C1320,75,1380,85,1410,90.7L1440,96L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
            />
          </svg>
        </section>

        {/* counter */}

        <DataVisualizationSection />

        {/* Features and Testimonials Container */}
        <div
          className="relative bg-blue-100 p-16 "
          style={{
            backgroundImage: `
      linear-gradient(to right, rgba(147, 97, 210, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(147, 97, 210, 0.1) 1px, transparent 1px)
    `,
            backgroundSize: "25px 25px",
          }}
        >
          {/* Features */}
          <section className="flex justify-center items-center ">
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
                  <p className="text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className=" text-black p-16 ">
            <div className="max-w-7xl mx-auto ">
              <div className="text-center  mb-16">
                <h2 className="text-2xl md:text-4xl font-bold mb-4 text-black">
                  How <span className="text-orange-500">Lexicon</span> Works
                </h2>
                <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                  Our simple yet powerful platform makes learning management
                  effortless and effective.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="relative bg-white rounded-lg p-8 shadow-2xl"
                  >
                    <div className="absolute -top-8 -left-6">
                      <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                        {step.number}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-6 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-800 mb-6">{step.description}</p>

                    <ul className="space-y-3">
                      {step.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start space-x-2"
                        >
                          <span className="text-blue-500 mt-1">
                            <Check size={18} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                        <ArrowRight size={30} className="text-blue-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Testimonials */}
        <section className=" relative bg-white p-16">
          <div className="max-w-6xl mx-auto p-2">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
              What Our <span className="text-orange-500">Learners</span> Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg border-gray-100 border transition-all duration-300 hover:rotate-3 hover:shadow-orange-500 hover:shadow-2xl hover:border-orange-500"
                >
                  <Quote className="text-orange-500 mb-4" size={36} />
                  <p className="text-gray-600 mb-4 italic">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {testimonial.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Become Instructor Section - FIXED */}
        <section
          className="relative bg-gray-900 text-white md:p-0 p-8  "
          style={{
            backgroundImage: `
    linear-gradient(to right, rgba(147, 97, 210, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(147, 97, 210, 0.1) 1px, transparent 1px)
  `,
            backgroundSize: "25px 25px",
          }}
        >
          <div className="max-w-7xl mx-auto py-8 flex flex-col md:flex-row gap-8">
            {/* Left Column - Features */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-8">Become Instructor</h2>

              <div className="space-y-6">
                {instructorFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="p-3 rounded-lg mr-4 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300">{feature.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  className="cursor-pointer bg-white bg-opacity-10 p-3 mt-5 mx-auto md:mr-auto md:ml-0 w-auto h-18 text-center space-x-4 rounded-full backdrop-blur-md shadow-lg hover:bg-opacity-15 duration-300 text-white flex justify-between items-center"
                  onClick={handleInstructorClick}
                >
                  Become a Mentor
                  <span className="text-white rounded-full bg-orange-600 p-2 ml-4">
                    <ArrowRight size={18} />
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="relative rounded-lg overflow-hidden  h-full flex items-center justify-center">
                <img
                  src={Instructor}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative bg-white p-16">
          <div className="max-w-4xl mx-auto p-2">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 text-gray-800">
              Frequently Asked{" "}
              <span className="text-purple-500">Questions</span>
            </h2>
            <div className="space-y-4">
              {accordionItems.map((item, index) => (
                <div key={index} className=" bg-gray-100  pb-2">
                  <motion.button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex justify-between items-center text-left p-4 "
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="font-semibold text-gray-800">
                      {item.title}
                    </span>
                    <motion.div
                      animate={{
                        rotate: activeAccordion === index ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {activeAccordion === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          transition: {
                            duration: 0.3,
                            ease: "easeInOut",
                          },
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          transition: {
                            duration: 0.3,
                            ease: "easeInOut",
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-3 text-gray-600">
                          {item.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="relative bg-gray-900 text-white py-12"
          style={{
            backgroundImage: `
      linear-gradient(to right, rgba(147, 97, 210, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(147, 97, 210, 0.1) 1px, transparent 1px)
    `,
            backgroundSize: "25px 25px",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-orange-500">
                LEXICON
              </h3>
              <p className="text-gray-400">
                Empowering learners through innovative online education.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-orange-500">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="hover:text-orange-500">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/instructors" className="hover:text-orange-500">
                    Instructors
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-orange-500">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="hover:text-orange-500">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-orange-500">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-orange-500">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-orange-500">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-orange-500">
                  Twitter
                </a>
                <a href="#" className="hover:text-orange-500">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-orange-500">
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 border-t border-gray-800 pt-6 text-gray-500">
            © 2025 Lexicon. All Rights Reserved.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
