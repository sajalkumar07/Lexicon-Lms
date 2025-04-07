/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Instructor/images/spin-unscreen.gif";
// Import eye icons
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LoginForm = ({
  loginFunction,
  redirectPath,
  userType = "user",
  welcomeText = "Welcome Back!",
  highlightText = "Let's Get You In!",
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await loginFunction({ email, password });

      // Extract user/instructor data from the response based on userType
      const data =
        userType === "instructor" ? response.instructor : response.user;

      // Construct the user data object
      const userData = {
        userId: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        avatar:
          response.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${data.firstName} ${data.lastName}`
          )}&background=random`,
        token: response.token || localStorage.getItem("authToken"),
      };

      // Add instructor-specific field if needed
      if (userType === "instructor") {
        userData.instructor = data.id;
      }

      // Store user data in appropriate localStorage key
      localStorage.setItem(
        userType === "instructor" ? "instructorData" : "userData",
        JSON.stringify(userData)
      );

      // Redirect to appropriate page
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full sm:w-[90%] md:w-[80%] justify-center flex flex-col items-center">
      <div className="flex items-center justify-center font-semibold text-xl md:text-2xl text-black">
        <h1>
          {welcomeText} <span className="text-glow">{highlightText}</span>
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

        <div className="flex flex-col">
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
              className="h-[50px] w-full p-5 rounded-xl outline-none bg-slate-100 text-black"
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

        <button
          type="submit"
          className="bg-orange-500 text-white rounded-xl h-[50px] flex justify-center items-center mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <img src={Loader} alt="Loading" className="h-40 w-60" />
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};
export default LoginForm;
