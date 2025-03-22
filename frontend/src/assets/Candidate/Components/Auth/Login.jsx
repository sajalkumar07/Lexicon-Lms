/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../images/spin-unscreen.gif";
import { loginUser } from "../../Services/userAuth";

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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call your existing login API
      const response = await loginUser({ email, password });
      console.log("Login successful:", response);

      // Extract user data from the response
      const userData = {
        email: email,
        name: response.name || response.username || email.split("@")[0], // Use name from response or fall back to email username
        avatar:
          response.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            email.split("@")[0]
          )}&background=random`, // Use avatar or generate one
        token: response.token || localStorage.getItem("authToken"), // Use token from response or from localStorage
      };

      // Store user data for display in the navbar
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect to the home page
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center text-white">
      <div className="absolute top-0 left-0 p-4 text-gray-400 flex justify-between w-full">
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
              Login
            </motion.h1>
            <h1 className="text-2xl md:text-5xl font-bold">
              <span className="text-orange-400">Empower</span> Your Learning
              Journey{" "}
            </h1>
            <h1 className="text-2xl md:text-5xl font-bold">
              Unlock Endless Possibilities!
            </h1>
            <div className="mt-8 md:mt-32 text-xs md:text-sm flex font-semibold">
              {" "}
              <p className="text-white">
                <h6>if you don't have an account</h6>
                <Link to="/signup" className="text-[#2414ff] cursor-pointer">
                  <h6>
                    <span className="text-white">you can </span>signup here{" "}
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
          <div className="w-full sm:w-[90%] md:w-[80%] justify-center flex flex-col items-center">
            <div className="flex items-center justify-center font-semibold text-xl md:text-2xl text-black">
              <h1>
                Welcome Back!{" "}
                <span className="text-glow">Let's Get You In!</span>
              </h1>
            </div>

            <form
              className="mt-6 md:mt-10 flex flex-col gap-4 md:gap-5 justify-center w-[95%] sm:w-[90%] md:w-[80%]"
              onSubmit={handleLogin}
            >
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}

              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="mb-2 text-sm font-medium text-black"
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <img src={Loader} alt="Loading" className="h-8 w-8" />
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Login;
