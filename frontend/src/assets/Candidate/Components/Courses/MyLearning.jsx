/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Navbar from "../../../Utils/Navbar";
import { BookOpen } from "lucide-react";
import Loader from "../../../Utils/Loader";
import { getUserPurchases } from "../../Services/paymentService";

const PurchasedCourses = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        setLoading(true);
        // Get user data and token from localStorage
        const userData = JSON.parse(localStorage.getItem("userData"));
        const token = localStorage.getItem("authToken");

        if (!userData?.userId || !token) {
          throw new Error("User not authenticated");
        }

        const data = await getUserPurchases(userData.userId, token);
        setPurchasedCourses(data.courses || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching purchased courses:", err);
        setError(
          err.message || "An error occurred while fetching your courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, []);

  const navigateToCourseDetails = (courseId) => {
    window.open(`/candidate/courses/${courseId}`, "_blank");
  };

  // Helper function to format date (create this in Utils/helpers.js if it doesn't exist)
  const formatPurchaseDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow">
        <section className="bg-gray-900">
          {/* Hero section */}
          <div className="flex justify-center items-center px-4 py-16 md:py-14 lg:h-[16rem] flex-col space-y-6 md:space-y-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              My Learning Library
            </h1>
            <p className="text-white text-center max-w-2xl">
              Access all your purchased courses and continue your learning
              journey
            </p>
          </div>

          {/* Main content area */}
          <main className="min-h-screen bg-gray-100 space-y-5 p-4 md:p-6">
            <div className="flex justify-between items-center px-4 mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">
                Your Purchased <span className="text-orange-400">Courses</span>
              </h2>
              <div className="text-gray-600 text-sm">
                {purchasedCourses.length}{" "}
                {purchasedCourses.length === 1 ? "Course" : "Courses"}
              </div>
            </div>

            {/* Purchased courses grid with loader */}
            {loading ? (
              <Loader>Loading Your Courses... 🚀</Loader>
            ) : purchasedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2 md:p-6">
                {purchasedCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-lg cursor-pointer overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() => navigateToCourseDetails(course._id)}
                  >
                    {/* Course image section with difficulty badge */}
                    <div className="relative w-full h-48">
                      {course.courseThumbnail ? (
                        <img
                          src={course.courseThumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <BookOpen size={24} className="text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-0 right-0 bg-orange-500 rounded-bl text-white font-semibold text-xs px-2 py-1">
                        {course.difficulty || "Beginner"}
                      </div>
                    </div>

                    {/* Course content section */}
                    <div className="p-4 flex-grow flex flex-col">
                      {/* Course title */}
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {course.title}
                      </h3>

                      {/* Course category */}
                      <p className="text-sm text-gray-600 mb-2">
                        {course.category}
                      </p>

                      {/* Course description */}
                      <p className="text-sm text-gray-500 mb-3">
                        {course.description || "No description available."}
                      </p>

                      {/* Purchase details */}
                      <div className="mt-auto space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Purchased on:</span>
                          <span className="font-medium">
                            {formatPurchaseDate(course.purchaseDate)}
                          </span>
                        </div>

                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Amount paid:</span>
                          <span className="font-medium">
                            ₹{course.purchaseAmount}
                          </span>
                        </div>

                        <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-semibold rounded-md text-sm mt-2">
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <BookOpen size={64} className="text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  No Courses Purchased Yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Explore our course catalog and start your learning journey
                  today!
                </p>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 font-semibold rounded-md"
                  onClick={() => (window.location.href = "/get-courses")}
                >
                  Browse Courses
                </button>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="text-center p-4 text-red-500">
                <p>Error while fetching your courses</p>
                <button
                  className="mt-2 bg-orange-400 text-white px-4 py-2 rounded"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            )}
          </main>
        </section>
      </div>
    </div>
  );
};

export default PurchasedCourses;
