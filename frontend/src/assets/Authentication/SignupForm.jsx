/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Utils/Loader";
// Import eye icons (you'll need to install the package if not already installed)
// npm install react-icons
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignupForm = ({
  registerFunction,
  redirectPath,
  welcomeText = "Be More Than a Spectator.",
  highlightText = "Join Us Today !",
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await registerFunction({
        firstName,
        lastName,
        email,
        confirmPassword,
        password,
      });
      console.log("signup successful", response);

      navigate(redirectPath);
    } catch (err) {
      setError("Signup failed. Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-full sm:w-[90%] md:w-[80%] justify-center flex flex-col items-center">
      <div className="flex items-center justify-center font-semibold text-xl md:text-2xl text-black text-center">
        <h1>
          {welcomeText} <span className="text-glow">{highlightText}</span>
        </h1>
      </div>

      <form
        className="mt-6 md:mt-10 flex flex-col gap-4 md:gap-5 justify-center w-[95%] sm:w-[90%] md:w-[80%]"
        onSubmit={handleSignup}
      >
        <div className="flex justify-between items-center">
          <div className="flex justify-center flex-col">
            <label
              htmlFor="firstName"
              className="mb-2 text-s font-medium text-black"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              className="h-[50px] p-5 rounded-xl outline-none bg-slate-100 text-black"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center flex-col">
            <label
              htmlFor="lastName"
              className="mb-2 text-s font-medium text-black"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              className="h-[50px] p-5 rounded-xl outline-none bg-slate-100 text-black"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-center flex-col">
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
            className="h-[50px] p-5 rounded-xl bg-slate-100 outline-none text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-center flex-col">
          <label
            htmlFor="password"
            className="mb-2 text-sm font-medium text-black"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-[50px] w-full p-5 rounded-xl bg-slate-100 outline-none text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center flex-col">
          <label
            htmlFor="confirmPassword"
            className="mb-2 text-sm font-medium text-black"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-[50px] w-full p-5 rounded-xl bg-slate-100 outline-none text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}
        <button
          type="submit"
          className="bg-orange-500 text-white rounded-xl h-[50px] flex justify-center items-center mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <img src={Loader} alt="Loading" className="h-40 w-60" />
          ) : (
            "Signup"
          )}
        </button>
      </form>
    </div>
  );
};
export default SignupForm;
