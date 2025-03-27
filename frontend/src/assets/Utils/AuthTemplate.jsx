/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginUser as studentLoginUser } from "../Candidate/Services/userAuth";
import { loginUser as instructorLoginUser } from "../Instructor/Services/instructorAuth";
import { registerUser as studentRegisterUser } from "../Candidate/Services/userAuth";
import { registerUser as instructorRegisterUser } from "../Instructor/Services/instructorAuth";

const AuthTemplate = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const authConfig = {
    student: {
      loginFunction: studentLoginUser,
      registerFunction: studentRegisterUser,
      loginRoute: "/",
      signupRoute: "/signup",
      successHandler: (response) => {
        const userData = {
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          name: `${response.user.firstName} ${response.user.lastName}`,
          avatar:
            response.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${response.user.firstName} ${response.user.lastName}`
            )}&background=random`,
          token: response.token || localStorage.getItem("authToken"),
        };
        localStorage.setItem("user", JSON.stringify(userData));
      },
    },
    instructor: {
      loginFunction: instructorLoginUser,
      registerFunction: instructorRegisterUser,
      loginRoute: "/instructor-dashboard",
      signupRoute: "/signup-instructor",
      successHandler: (response) => {
        const instructorData = {
          email: response.instructor.email,
          firstName: response.instructor.firstName,
          lastName: response.instructor.lastName,
          name: `${response.instructor.firstName} ${response.instructor.lastName}`,
          avatar:
            response.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${response.instructor.firstName} ${response.instructor.lastName}`
            )}&background=random`,
          token: response.token || localStorage.getItem("authToken"),
          instructor: response.instructor.id,
        };
        localStorage.setItem("instructorData", JSON.stringify(instructorData));
        localStorage.setItem("lastActiveTab", activeTab);
      },
    },
  };

  React.useEffect(() => {
    const lastTab = localStorage.getItem("lastActiveTab");
    if (lastTab) {
      setActiveTab(lastTab);
      localStorage.removeItem("lastActiveTab");
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password match for signup
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate name fields for signup
    if (!isLogin && (!firstName.trim() || !lastName.trim())) {
      setError("Please enter both first and last name");
      return;
    }

    setLoading(true);

    const config = authConfig[activeTab];

    try {
      const authData = isLogin
        ? { email, password }
        : { firstName, lastName, email, password };

      const authFunction = isLogin
        ? config.loginFunction
        : config.registerFunction;

      const response = await authFunction(authData);

      config.successHandler(response);

      window.location.href = isLogin ? config.loginRoute : config.signupRoute;
    } catch (err) {
      setError(
        `${isLogin ? "Login" : "Signup"} failed. Please check your credentials.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="absolute top-4 right-4 bg-gray-900 p-2 rounded-md">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-orange-500">L</span>EXICON
        </h1>
      </div>

      <div className="w-full max-w-md">
        {/* Auth Type Tabs */}
        <div className="flex mb-4 border rounded-lg">
          <button
            onClick={() => setActiveTab("student")}
            className={`w-1/2 py-2 text-center font-semibold ${
              activeTab === "student"
                ? "bg-orange-600 text-white"
                : "bg-white text-black"
            } rounded-l-lg`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveTab("instructor")}
            className={`w-1/2 py-2 text-center font-semibold ${
              activeTab === "instructor"
                ? "bg-orange-600 text-white"
                : "bg-white text-black"
            } rounded-r-lg`}
          >
            Instructor
          </button>
        </div>

        <div className="bg-white shadow-2xl rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            {activeTab === "student"
              ? isLogin
                ? "Student Login"
                : "Student Sign Up"
              : isLogin
              ? "Instructor Login"
              : "Instructor Sign Up"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="First name"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Last name"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="you@example.com"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="relative">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 pr-10"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {loading ? "Loading..." : isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-orange-500 hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-orange-500 hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTemplate;
