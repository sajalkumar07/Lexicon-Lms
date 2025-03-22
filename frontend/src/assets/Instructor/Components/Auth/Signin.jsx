/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import LoginPng from "../../images/signup2.png";
import { registerUser } from "../../Services/instructorAuth";

const pageVariants = {
  initial: {
    opacity: 0,
    filter: "blur(8px)", // Apply blur initially
  },
  in: {
    opacity: 1,
    filter: "blur(0px)", // Remove blur when fully visible
  },
  out: {
    opacity: 0,
    filter: "blur(8px)", // Apply blur again when exiting
  },
};
const pageTransition = {
  type: "tween",
  duration: 0.5,
};

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await registerUser({ name, email, password });
      console.log("signup successful", response);

      navigate("/login-instructor");
    } catch (err) {
      setError("Signup failed. Invalid credentials.");
    } finally {
      setError(false);
    }
  };

  return (
    <div className="flex justify-center items-center text-white">
      <div className="absolute top-0 left-0 p-4 text-white flex justify-between w-full">
        <h1 className="text-3xl font-bold text-white hidden sm:block">
          <span className="text-orange-400">L</span>EXICON
        </h1>
      </div>
      <motion.main className="flex flex-col md:flex-row w-[100%] h-screen p-0 md:p-0 justify-between">
        <div className="text-white flex justify-center items-center w-full md:w-[50%] mx-auto p-4 md:p-6 flex-col bg-gray-800">
          <div className="flex flex-col text-left space-y-2 md:space-y-4">
            <motion.h1
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="text-3xl md:text-5xl font-bold"
            >
              Sign Up
            </motion.h1>
            <h1 className="text-2xl md:text-5xl font-bold">
              <span className="text-orange-400">Empower</span> Minds Shape
              Futures{" "}
            </h1>
            <h1 className="text-2xl md:text-5xl font-bold">
              Your classroom, Your rules
            </h1>
            <div className="mt-16 md:mt-32 text-xs md:text-sm flex font-semibold">
              {" "}
              <p className="text-white">
                <h6>if you do not have an account</h6>
                <Link
                  to="/login-instructor"
                  className="text-[#2414ff] cursor-pointer"
                >
                  <h6>
                    <span className="text-white">you can </span>login here{" "}
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
          <div className="w-full md:w-[80%] justify-center flex flex-col items-center">
            <div className="flex items-center justify-center font-semibold text-xl md:text-2xl text-black">
              <h1>
                Be More Than a Spectator.{" "}
                <span className="text-glow"> Join Us Today !</span>
              </h1>
            </div>

            <form
              className="mt-6 md:mt-10 flex flex-col gap-4 md:gap-5 justify-center w-[90%] md:w-[80%]"
              onSubmit={handleSignup}
            >
              <div className="flex justify-center flex-col">
                <label
                  htmlFor="Name"
                  className="mb-2 text-sm font-medium text-black"
                >
                  Name
                </label>
                <input
                  type="Name"
                  placeholder="John Doe"
                  className="h-[45px] md:h-[50px] p-4 md:p-5 rounded-xl outline-none bg-slate-100 text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-center flex-col">
                <label
                  htmlFor="Email"
                  className="mb-2 text-sm font-medium text-black"
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="h-[45px] md:h-[50px] p-4 md:p-5 rounded-xl outline-none bg-slate-100 text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-center flex-col">
                <label
                  htmlFor="Password"
                  className="mb-2 text-sm font-medium text-black"
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-[45px] md:h-[50px] p-4 md:p-5 rounded-xl outline-none bg-slate-100 text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center mt-2">{error}</p>
              )}
              <button
                type="submit"
                className="bg-orange-500 text-white rounded-xl h-[45px] md:h-[50px] flex justify-center items-center mt-4"
              >
                Signup
              </button>
            </form>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Signup;
