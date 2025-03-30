/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import {
  BookOpen,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Plus,
  Search,
  Grid2x2,
  List,
} from "lucide-react";
import Loader from "../../../Utils/Loader";
import {
  fetchAllInstructorCourses,
  deleteCourse,
} from "../../Services/CourseManagement";
import CreateCoursePopup from "../../DashboardComponents/createCoursePopup";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  courseName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-md p-6 max-w-md w-full mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Delete Course</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete{" "}
            <span className="font-medium">{courseName}</span>?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. All data associated with this course
            will be permanently removed.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-500 rounded-md text-sm font-medium hover:bg-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
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
  const [viewType, setViewType] = useState("grid");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

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

  const toggleViewType = () => {
    setViewType(viewType === "grid" ? "list" : "grid");
  };

  const navigateToCourseDetails = (courseId) => {
    window.open(`/instructor/courses/${courseId}`, "_blank");
  };

  const toggleMenu = (e, courseId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === courseId ? null : courseId);
  };

  const openDeleteModal = (e, course) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setCourseToDelete(course);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCourse(courseToDelete._id);

      setCourses(courses.filter((course) => course._id !== courseToDelete._id));
      setFilteredCourses(
        filteredCourses.filter((course) => course._id !== courseToDelete._id)
      );

      setDeleteModalOpen(false);
      setCourseToDelete(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete course");
      console.error("Error deleting course:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditCourse = (e, courseId) => {
    e.stopPropagation();
    setOpenMenuId(null);
    console.log("Edit course:", courseId);
  };

  const CourseCard = ({ course }) => (
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow cursor-pointer flex flex-col h-full"
      onClick={() => navigateToCourseDetails(course._id)}
    >
      <div className="aspect-video p-4 h-64  relative">
        {course.courseThumbnail ? (
          <img
            src={course.courseThumbnail}
            alt={course.title}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <BookOpen size={24} className="text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          {course.difficulty}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-md font-medium text-gray-900 truncate">
              {course.title}
            </h3>
            <p className="text-xs text-gray-500 truncate">{course.category}</p>
          </div>

          <div className="relative">
            <button
              className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
              onClick={(e) => toggleMenu(e, course._id)}
            >
              <MoreVertical size={16} />
            </button>

            {openMenuId === course._id && (
              <div className="absolute right-0 mt-1 w-32 bg-white shadow-md rounded-md z-10 border border-gray-100 text-sm">
                <button
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={(e) => handleEditCourse(e, course._id)}
                >
                  <Pencil size={14} className="mr-2" />
                  Edit
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 flex items-center"
                  onClick={(e) => openDeleteModal(e, course)}
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
          {course.description || "No description available."}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">
            ₹{course.price}
          </span>
          <button
            className="text-xs px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Publish course:", course._id);
            }}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );

  const CourseListItem = ({ course }) => (
    <div
      className="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer mb-3"
      onClick={() => navigateToCourseDetails(course._id)}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-40 bg-gray-100 relative flex-shrink-0">
          {course.courseThumbnail ? (
            <img
              src={course.courseThumbnail}
              alt={course.title}
              className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <BookOpen size={24} className="text-gray-400" />
            </div>
          )}
          <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
            {course.difficulty}
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-md font-medium text-gray-900 truncate">
                {course.title}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {course.category}
              </p>
            </div>

            <div className="relative">
              <button
                className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
                onClick={(e) => toggleMenu(e, course._id)}
              >
                <MoreVertical size={16} />
              </button>

              {openMenuId === course._id && (
                <div className="absolute right-0 mt-1 w-32 bg-white shadow-md rounded-md z-10 border border-gray-100 text-sm">
                  <button
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center"
                    onClick={(e) => handleEditCourse(e, course._id)}
                  >
                    <Pencil size={14} className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 flex items-center"
                    onClick={(e) => openDeleteModal(e, course)}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {course.description || "No description available."}
          </p>

          <div className="mt-auto flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              ₹{course.price}
            </span>
            <button
              className="text-xs px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Publish course:", course._id);
              }}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-1 ">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              Your Courses
            </h1>
            <p className="text-gray-500">
              View, edit, and manage all your courses in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex rounded-md overflow-hidden text-white">
              <button
                className={`p-2 ${
                  viewType === "grid" ? "bg-gray-900" : "text-black "
                }`}
                onClick={() => setViewType("grid")}
              >
                <Grid2x2 size={16} />
              </button>
              <button
                className={`p-2 ${
                  viewType === "list" ? "bg-gray-900" : "text-black"
                }`}
                onClick={() => setViewType("list")}
              >
                <List size={16} />
              </button>
            </div>

            <button
              className="flex justify-center items-center p-2 bg-gray-900  text-white rounded-md text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={16} className="mr-2" />
              Create Course
            </button>
          </div>
        </div>

        {deleteError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm">
            <p>{deleteError}</p>
            <button
              className="text-red-600 hover:text-red-800 underline text-xs mt-1"
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
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
            <button
              className="text-red-600 hover:text-red-800 underline text-sm mt-2"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <BookOpen size={32} className="text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-1">
              {searchTerm ? "No courses found" : "No courses yet"}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm
                ? "Try adjusting your search"
                : "Create your first course to get started"}
            </p>
            {!searchTerm && (
              <button
                className="text-sm px-3 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={16} className="inline mr-1" />
                Create your first course
              </button>
            )}
          </div>
        ) : viewType === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div>
            {filteredCourses.map((course) => (
              <CourseListItem key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>

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
          loadCourses();
        }}
      />
    </DashboardLayout>
  );
};

export default InstructorCourses;
