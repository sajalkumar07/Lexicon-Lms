/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout"; // Adjust path as needed
import { CirclePlus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../../CommonComponent/Loader";
import { BookOpen } from "lucide-react";
import { fetchAllInstructorCourses } from "../../Services/CourseManagement"; // Adjust import path as needed
import CreateCoursePopup from "../../DashboardComponents/createCoursePopup";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch courses on component mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllInstructorCourses();
        setCourses(data.courses || []);
        setFilteredCourses(data.courses || []);
      } catch (err) {
        setError(err.message || "Failed to load courses");
        console.error("Error loading courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Render a course card
  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="h-40 bg-gray-200 relative">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <BookOpen size={40} className="text-gray-400" />
            <div className="absolute top-0 right-0 bg-blue-500 rounded-bl text-white font-semibold text-xs px-2 py-1">
              {course.difficulty}
            </div>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        {/* Course title */}
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {course.title}
        </h3>

        {/* Course category */}
        <p className="text-sm text-gray-600 mb-2">{course.category}</p>

        {/* Course description - now from API */}
        <p className="text-sm text-gray-500 mb-4">
          {course.description || "No description available."}
        </p>

        {/* Price and enroll section with consistent alignment */}
        <div className="mt-auto flex justify-between items-center">
          <div className="font-bold text-lg">₹{course.price}</div>
          <div className=" flex justify-end space-x-4 ">
            {" "}
            <button className="bg-blue-950 hover:bg-blue-900 text-white px-4 py-2 font-semibold rounded-md text-sm">
              Publish
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 font-semibold rounded-md text-sm">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8">
          <h1 className="text-2xl font-bold">Your Courses</h1>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8">
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-xl flex justify-between items-center">
                <input
                  placeholder="Search your courses"
                  className="w-64 border border-gray-600 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                  aria-label="Search courses"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <div className="p-2 cursor-pointer right-1 absolute transform-y-1/2 text-gray-600">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
              </div>
            </div>

            <button
              className="flex justify-center items-center gap-2 text-white rounded-md bg-gray-900 p-2 hover:shadow-xl hover:bg-gray-800 duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              <CirclePlus size={18} />
              Create Course
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-6">
            <p>Error: {error}</p>
            <button
              className="mt-2 text-red-600 hover:text-red-800 underline"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-gray-50 border-2 mt-10 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchTerm ? "No courses found" : "No courses yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Create your first course to get started"}
            </p>
            {!searchTerm && (
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md hover:shadow-xl duration-300 text-white bg-gray-900 hover:bg-gray-800"
                onClick={() => setIsModalOpen(true)}
              >
                <CirclePlus size={16} className="mr-2" />
                Create your first course
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
      <CreateCoursePopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default InstructorCourses;
