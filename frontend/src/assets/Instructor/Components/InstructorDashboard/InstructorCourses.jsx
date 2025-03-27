/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout"; // Adjust path as needed
import {
  CirclePlus,
  MoreVertical,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../../Utils/Loader";
import { BookOpen } from "lucide-react";
import {
  fetchAllInstructorCourses,
  deleteCourse,
} from "../../Services/CourseManagement"; // Updated import
import CreateCoursePopup from "../../DashboardComponents/createCoursePopup";

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  courseName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Delete Course
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{courseName}</span>?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. All data associated with this course
            will be permanently removed.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors flex items-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Deleting...
              </>
            ) : (
              <>Delete Course</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Fetch courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

  // Toggle dropdown menu
  const toggleMenu = (e, courseId) => {
    e.stopPropagation(); // Prevent document click from immediately closing the menu
    setOpenMenuId(openMenuId === courseId ? null : courseId);
  };

  // Open delete confirmation modal
  const openDeleteModal = (e, course) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setCourseToDelete(course);
    setDeleteModalOpen(true);
  };

  // Handle course deletion
  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCourse(courseToDelete._id);

      // After successful deletion, refresh the course list
      setCourses(courses.filter((course) => course._id !== courseToDelete._id));
      setFilteredCourses(
        filteredCourses.filter((course) => course._id !== courseToDelete._id)
      );

      // Close modal and reset state
      setDeleteModalOpen(false);
      setCourseToDelete(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete course");
      console.error("Error deleting course:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit course
  const handleEditCourse = (e, courseId) => {
    e.stopPropagation();
    setOpenMenuId(null);
    // Add your edit course logic here
    console.log("Edit course:", courseId);
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
        {/* Course title with more menu */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
          <div className="relative">
            <button
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={(e) => toggleMenu(e, course._id)}
            >
              <MoreVertical size={18} className="text-gray-600" />
            </button>

            {/* Dropdown menu */}
            {openMenuId === course._id && (
              <div className="absolute right-0 mt-1 w-36 bg-white shadow-lg rounded-md z-10 border border-gray-200">
                <ul className="py-1">
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={(e) => handleEditCourse(e, course._id)}
                    >
                      <Pencil size={16} className="mr-2" />
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      onClick={(e) => openDeleteModal(e, course)}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Course category */}
        <p className="text-sm text-gray-600 mb-2">{course.category}</p>

        {/* Course description - now from API */}
        <p className="text-sm text-gray-500 mb-4">
          {course.description || "No description available."}
        </p>

        {/* Price and publish button section */}
        <div className="mt-auto flex justify-between items-center">
          <div className="font-bold text-lg">₹{course.price}</div>
          <button className="bg-blue-950 hover:bg-blue-900 text-white px-4 py-2 font-semibold rounded-md text-sm">
            Publish
          </button>
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

        {deleteError && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-6">
            <p>Error: {deleteError}</p>
            <button
              className="mt-2 text-red-600 hover:text-red-800 underline"
              onClick={() => setDeleteError(null)}
            >
              Dismiss
            </button>
          </div>
        )}

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

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCourseToDelete(null);
        }}
        onConfirm={confirmDeleteCourse}
        courseName={courseToDelete?.title || ""}
        isDeleting={isDeleting}
      />

      <CreateCoursePopup
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadCourses(); // Refresh courses after creating a new one
        }}
      />
    </DashboardLayout>
  );
};

export default InstructorCourses;
