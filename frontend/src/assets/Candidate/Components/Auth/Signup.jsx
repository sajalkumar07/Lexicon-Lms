/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import LoginPng from "../../images/signup2.png";
import { registerUser } from "../../Services/SignupApi";

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

      navigate("/login");
    } catch (err) {
      setError("Signup failed. Invalid credentials.");
    } finally {
      setError(false);
    }
  };

  return (
    <div className="flex justify-center items-center text-white ">
      <div className="absolute top-0 left-0 p-4 text-gray-400 flex justify-between w-full">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-orange-400">L</span>EXICON
        </h1>
      </div>
      <main className="flex flex-col md:flex-row w-[100%] h-screen p-0 md:p-0 justify-between">
        <div className="text-black flex justify-center items-center  w-full md:w-[50%] mx-auto p-6 flex-col bg-red-200 ">
          <div className="flex flex-col text-left space-y-4">
            <motion.h1
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className=" text-5xl font-bold "
            >
              Sign Up
            </motion.h1>
            <h1 className=" text-5xl font-bold">
              <span className="text-orange-400">Empower</span> Your Learning
              Journey{" "}
            </h1>
            <h1 className=" text-5xl font-bold ">
              Unlock Endless Possibilities!
            </h1>
            <div className="mt-32 text-sm flex font-semibold">
              {" "}
              <p className=" text-black">
                <h6>if you already have an account</h6>
                <Link to="/login" className="text-[#2414ff] cursor-pointer">
                  <h6>
                    <span className="text-black">you can </span>login here{" "}
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
          className="w-full md:w-[50%] h-full flex items-center justify-center p-0 md:p-0  "
        >
          <div className="w-full md:w-[80%] justify-center flex flex-col items-center">
            <div className="flex items-center justify-center font-semibold text-2xl text-black">
              <h1>
                Be More Than a Spectator.{" "}
                <span className="text-glow"> Join Us Today !</span>
              </h1>
            </div>

            <form
              className="mt-10 flex flex-col gap-5  justify-center w-[80%] "
              onSubmit={handleSignup}
            >
              <div className="flex justify-center flex-col">
                <label
                  htmlFor="Name"
                  className="mb-2 text-s font-medium text-black"
                >
                  Name
                </label>
                <input
                  type="Name"
                  placeholder="John Doe"
                  className="h-[50px] p-5 rounded-xl outline-none  bg-slate-100 text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-center flex-col">
                <label
                  htmlFor="Email"
                  className="mb-2 text-s font-medium text-black"
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="h-[50px] p-5 rounded-xl bg-slate-100 outline-none text-black  "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-center flex-col">
                <label
                  htmlFor="Password"
                  className="mb-2 text-s font-medium text-black"
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-[50px] p-5 rounded-xl bg-slate-100 outline-none text-black"
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
                className="bg-orange-500 text-white rounded-xl h-[50px] flex justify-center items-center mt-4"
              >
                Signup
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Signup;
