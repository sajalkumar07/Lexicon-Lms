/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import LoginPng from "../../images/programmer.png";
import Loader from "../../images/spin-unscreen.gif"; // The loading GIF import
import { loginUser } from "../../Services/login";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Replace this with your actual login function
      const response = await loginUser({ email, password });
      console.log("Login successful:", response);

      // Redirect to the home page ("/") after a successful login
      navigate("/");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center  text-white">
      <div className="absolute top-0 left-0 p-4 text-white flex justify-between w-full ">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-orange-400">L</span>EXICON
        </h1>
      </div>
      <motion.main className="flex flex-col md:flex-row  w-[100%] h-screen p-0 md:p-0 justify-between">
        <div className="text-black flex justify-center items-center  w-full md:w-[50%] mx-auto p-6 flex-col bg-red-200">
          <div className="flex flex-col text-left space-y-4">
            <motion.h1
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className=" text-5xl font-bold "
            >
              Login
            </motion.h1>
            <h1 className=" text-5xl font-bold">
              <span className="text-orange-400">Empower</span> Minds Shape
              Futures{" "}
            </h1>
            <h1 className=" text-5xl font-bold ">Your classroom, Your rules</h1>
            <div className="mt-32 text-sm flex font-semibold">
              {" "}
              <p className=" text-black">
                <h6>if you don't have an account</h6>
                <Link
                  to="/signup-instructor"
                  className="text-[#2414ff] cursor-pointer"
                >
                  <h6>
                    <span className="text-black">you can </span>signup here{" "}
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
          className="w-full md:w-[50%] h-full flex items-center justify-center p-0 md:p-0 "
        >
          <div className="w-full md:w-[80%] justify-center flex flex-col items-center">
            <div className="flex items-center justify-center font-semibold text-2xl text-black">
              <h1>
                Welcome Back!{" "}
                <span className="text-glow">Let's Get You In!</span>
              </h1>
            </div>

            <form
              className="mt-10 flex flex-col gap-5  justify-center w-[80%] "
              onSubmit={handleLogin}
            >
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="mb-2 text-sm font-medium text-black "
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-[50px] p-5 rounded-xl outline-none bg-slate-100 text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="mb-2 text-sm font-medium text-black"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-[50px] p-5 rounded-xl outline-none bg-slate-100 text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="bg-orange-500 text-white rounded-xl h-[50px] flex justify-center items-center mt-4"
              >
                Login
              </button>
            </form>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Login;
