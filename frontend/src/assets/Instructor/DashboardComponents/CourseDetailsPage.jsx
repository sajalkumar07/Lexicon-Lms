/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BookOpen,
  Video,
  Plus,
  X,
  Upload,
  Clock,
  FileText,
  AlertTriangle,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import Loader from "../../Utils/Loader";

// Mock API functions - Replace with actual implementations
const fetchCourseDetails = async (courseId) => {
  // Implementation to fetch course details
  const response = await fetch(
    `http://localhost:8080/api/courses/course/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch course details");
  }

  return await response.json();
};

const fetchCourseVideos = async (courseId) => {
  // Implementation to fetch course videos
  const response = await fetch(
    `http://localhost:8080/api/courses/course/${courseId}/videos`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch course videos");
  }

  return await response.json();
};

const addVideoLecture = async (courseId, videoData) => {
  // Implementation to add a new video lecture
  const response = await fetch(
    `http://localhost:8080/api/courses/course/${courseId}/videos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(videoData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add video lecture");
  }

  return await response.json();
};

const deleteVideoLecture = async (courseId, videoId) => {
  // Implementation to delete a video lecture
  const response = await fetch(
    `http://localhost:8080/api/courses/course/${courseId}/videos/${videoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete video lecture");
  }

  return await response.json();
};

// Format seconds to hours:minutes:seconds
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [
    hours > 0 ? hours : null,
    minutes.toString().padStart(2, "0"),
    remainingSeconds.toString().padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":");
};

// Add Video Modal Component
const AddVideoModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    videoThumbnail: "",
    duration: 0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideoData({ ...videoData, [name]: value });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!videoData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!videoData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!videoData.videoUrl.trim()) {
      newErrors.videoUrl = "Video URL is required";
    }

    if (!videoData.duration || videoData.duration <= 0) {
      newErrors.duration = "Valid duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(videoData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Video size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Add New Video Lecture
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={videoData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter video title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={videoData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter video description"
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="videoUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Video URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="videoUrl"
                name="videoUrl"
                value={videoData.videoUrl}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.videoUrl ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter video URL"
              />
              {errors.videoUrl && (
                <p className="mt-1 text-sm text-red-500">{errors.videoUrl}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="videoThumbnail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Video Thumbnail URL
              </label>
              <input
                type="text"
                id="videoThumbnail"
                name="videoThumbnail"
                value={videoData.videoThumbnail}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter thumbnail URL (optional)"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration (in seconds) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={videoData.duration}
                onChange={handleChange}
                min="1"
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.duration ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter duration in seconds"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-gray-900  rounded-md font-medium transition-colors flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>Add Video</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  videoTitle,
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
              Delete Video
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
            <span className="font-semibold">{videoTitle}</span>?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. The video will be permanently removed
            from this course.
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
              <>Delete Video</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch course details and videos on component mount
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        const [courseData, videosData] = await Promise.all([
          fetchCourseDetails(courseId),
          fetchCourseVideos(courseId),
        ]);

        setCourse(courseData);
        setVideos(videosData.videos || []);
      } catch (err) {
        setError(err.message || "Failed to load course data");
        console.error("Error loading course data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

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

  // Toggle dropdown menu
  const toggleMenu = (e, videoId) => {
    e.stopPropagation(); // Prevent document click from immediately closing the menu
    setOpenMenuId(openMenuId === videoId ? null : videoId);
  };

  // Open delete confirmation modal
  const openDeleteModal = (e, video) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setVideoToDelete(video);
    setDeleteModalOpen(true);
  };

  // Handle video deletion
  const confirmDeleteVideo = async () => {
    if (!videoToDelete) return;

    try {
      setIsDeleting(true);
      await deleteVideoLecture(courseId, videoToDelete._id);

      // After successful deletion, refresh the videos list
      setVideos(videos.filter((video) => video._id !== videoToDelete._id));

      // Close modal and reset state
      setDeleteModalOpen(false);
      setVideoToDelete(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete video");
      console.error("Error deleting video:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle adding a new video lecture
  const handleAddVideo = async (videoData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const newVideo = await addVideoLecture(courseId, videoData);

      // Add the new video to the videos list
      setVideos([...videos, newVideo]);

      // Close the add modal
      setIsAddModalOpen(false);
    } catch (err) {
      setSubmitError(err.message || "Failed to add video lecture");
      console.error("Error adding video lecture:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 max-w-lg w-full">
          <h2 className="text-lg font-medium mb-2">Error Loading Course</h2>
          <p>{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 max-w-lg w-full">
          <h2 className="text-lg font-medium mb-2">Course Not Found</h2>
          <p>The requested course could not be found.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => window.close()}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {course.difficulty}
                </span>
              </div>
              <p className="text-gray-500">{course.category}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-gray-100 rounded-md">
                <span className="text-lg font-bold">₹{course.price}</span>
              </div>
              <button
                className="bg-gray-900 text-white px-4 py-2 rounded-md shadow-sm font-medium flex items-center"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={18} className="mr-1" />
                Add Video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {(submitError || deleteError) && (
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <p>Error: {submitError || deleteError}</p>
            <button
              className="mt-2 text-red-600 hover:text-red-800 underline"
              onClick={() => {
                setSubmitError(null);
                setDeleteError(null);
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Course Details */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Course Details</h2>

              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  <BookOpen size={48} className="text-gray-400" />
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">Description</h3>
                <p className="text-gray-600">
                  {course.description || "No description available."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Category</h3>
                  <p className="text-gray-600">{course.category}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Difficulty</h3>
                  <p className="text-gray-600">{course.difficulty}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Price</h3>
                  <p className="text-gray-600">₹{course.price}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Videos</h3>
                  <p className="text-gray-600">{videos.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Lectures */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Video Lectures</h2>
                <button
                  className="bg-gray-900  text-white px-3 py-1 rounded-md shadow-sm text-sm font-medium flex items-center"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={16} className="mr-1" />
                  Add Video
                </button>
              </div>

              {videos.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video size={28} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No videos yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add your first video lecture to get started
                  </p>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md hover:shadow-xl duration-300 text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    Add your first video
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((video, index) => (
                    <div
                      key={video._id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Video Thumbnail */}
                        <div className="w-full sm:w-48 h-32 bg-gray-200 flex-shrink-0">
                          {video.videoThumbnail ? (
                            <img
                              src={video.videoThumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <Video size={32} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Video Information */}
                        <div className="p-4 flex-grow flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded mr-2">
                                  {index + 1}
                                </span>
                                <h3 className="text-lg font-medium">
                                  {video.title}
                                </h3>
                              </div>
                              <p className="text-gray-600 text-sm mt-1 mb-2">
                                {video.description}
                              </p>
                            </div>

                            {/* Menu Button */}
                            <div className="relative">
                              <button
                                className="p-1 hover:bg-gray-100 rounded-full"
                                onClick={(e) => toggleMenu(e, video._id)}
                              >
                                <MoreVertical
                                  size={18}
                                  className="text-gray-600"
                                />
                              </button>

                              {/* Dropdown menu */}
                              {openMenuId === video._id && (
                                <div className="absolute right-0 mt-1 w-36 bg-white shadow-lg rounded-md z-10 border border-gray-200">
                                  <ul className="py-1">
                                    <li>
                                      <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle edit functionality
                                          console.log("Edit video:", video._id);
                                        }}
                                      >
                                        <Pencil size={16} className="mr-2" />
                                        Edit
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                        onClick={(e) =>
                                          openDeleteModal(e, video)
                                        }
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

                          {/* Video Metadata */}
                          <div className="mt-auto flex items-center text-sm text-gray-500 pt-2">
                            <div className="flex items-center mr-4">
                              <Clock size={14} className="mr-1" />
                              <span>{formatDuration(video.duration)}</span>
                            </div>

                            <a
                              href={video.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <FileText size={14} className="mr-1" />
                              View Video
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Video Modal */}
      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddVideo}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setVideoToDelete(null);
        }}
        onConfirm={confirmDeleteVideo}
        videoTitle={videoToDelete?.title || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CourseDetailsPage;
