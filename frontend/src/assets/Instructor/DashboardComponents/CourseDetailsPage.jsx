/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  BookOpen,
  Video,
  Plus,
  X,
  Clock,
  Play,
  MoreVertical,
  Pencil,
  Trash2,
  FileVideo,
  Image,
} from "lucide-react";
import Loader from "../../Utils/Loader";
import {
  fetchCourseDetails,
  fetchCourseVideos,
  addVideoLecture,
  deleteVideoLecture,
  updateVideoLecture,
  uploadImage,
  uploadVideo,
} from "../Services/CourseManagement";
import DashboardLayout from "../Components/InstructorDashboard/DashboardLayout";
import { Link } from "react-router-dom";

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
const AddVideoModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  editMode = false,
  initialData = {},
}) => {
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    videoThumbnail: "",
    duration: 0,
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadType, setCurrentUploadType] = useState("");
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRefs = useRef({});

  // Initialize with data if in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setVideoData({
        title: initialData.title || "",
        description: initialData.description || "",
        videoUrl: initialData.videoUrl || "",
        videoThumbnail: initialData.videoThumbnail || "",
        duration: initialData.duration || 0,
      });

      if (initialData.videoUrl) {
        setVideoPreview({ url: initialData.videoUrl, name: "Current video" });
      }
      if (initialData.videoThumbnail) {
        setThumbnailPreview({
          url: initialData.videoThumbnail,
          name: "Current thumbnail",
        });
      }
    }
  }, [editMode, initialData]);

  // Simulated progress for uploads
  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideoData({ ...videoData, [name]: value });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create video preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoPreview({ url: reader.result, name: file.name });
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setCurrentUploadType("video");
    const stopProgress = simulateProgress();

    try {
      const response = await uploadVideo(file);
      // Extract the URL from the response object
      const videoUrl = response.videoUrl || response;

      setVideoData({
        ...videoData,
        videoUrl: videoUrl,
      });
      setUploadProgress(100);
    } catch (err) {
      setErrors({ ...errors, videoUrl: "Failed to upload video" });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setCurrentUploadType("");
        setUploadProgress(0);
      }, 500);
      stopProgress();
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create thumbnail preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview({ url: reader.result, name: file.name });
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setCurrentUploadType("thumbnail");
    const stopProgress = simulateProgress();

    try {
      const response = await uploadImage(file);
      // Extract the URL from the response object
      const imageUrl = response.imageUrl || response;

      setVideoData({
        ...videoData,
        videoThumbnail: imageUrl,
      });
      setUploadProgress(100);
    } catch (err) {
      setErrors({ ...errors, videoThumbnail: "Failed to upload thumbnail" });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setCurrentUploadType("");
        setUploadProgress(0);
      }, 500);
      stopProgress();
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
      newErrors.videoUrl = "Video is required";
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

  // Progress bar component
  const ProgressBar = ({ progress, type }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
      <p className="text-xs text-gray-500 mt-1">
        {progress < 100
          ? `Uploading ${type}... ${progress}%`
          : `${type} uploaded successfully!`}
      </p>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full mx-4 animate-fadeIn overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {editMode ? "Edit Video Lecture" : "Add New Video Lecture"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
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
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-200"
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
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-200"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video File <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                {videoData.videoUrl ? (
                  <div className="relative p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {videoPreview && (
                      <div className="mb-2">
                        <video
                          src={videoPreview.url}
                          className="w-full h-24 object-cover rounded-md"
                          controls
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileVideo size={16} className="text-blue-500 mr-2" />
                        <span className="text-sm truncate max-w-[150px]">
                          {videoPreview?.name || "Video uploaded"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoData({ ...videoData, videoUrl: "" });
                          setVideoPreview(null);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      ref={(el) => (fileInputRefs.current["video"] = el)}
                    />
                    <label
                      htmlFor="video-upload"
                      className="flex flex-col items-center justify-center cursor-pointer py-2"
                    >
                      <FileVideo className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload video
                      </span>
                    </label>
                  </div>
                )}

                {currentUploadType === "video" && uploading && (
                  <ProgressBar progress={uploadProgress} type="video" />
                )}
                {errors.videoUrl && !uploading && (
                  <p className="mt-1 text-sm text-red-500">{errors.videoUrl}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Thumbnail
              </label>
              <div className="mt-1">
                {videoData.videoThumbnail ? (
                  <div className="relative p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {thumbnailPreview && (
                      <div className="mb-2">
                        <img
                          src={thumbnailPreview.url}
                          alt="Video thumbnail"
                          className="w-full h-24 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image size={16} className="text-blue-500 mr-2" />
                        <span className="text-sm truncate max-w-[150px]">
                          {thumbnailPreview?.name || "Thumbnail uploaded"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoData({ ...videoData, videoThumbnail: "" });
                          setThumbnailPreview(null);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                    <input
                      type="file"
                      id="thumbnail-upload"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      ref={(el) => (fileInputRefs.current["thumbnail"] = el)}
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="flex flex-col items-center justify-center cursor-pointer py-2"
                    >
                      <Image className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload thumbnail
                      </span>
                    </label>
                  </div>
                )}

                {currentUploadType === "thumbnail" && uploading && (
                  <ProgressBar progress={uploadProgress} type="thumbnail" />
                )}
                {errors.videoThumbnail && !uploading && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.videoThumbnail}
                  </p>
                )}
              </div>
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
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.duration ? "border-red-500" : "border-gray-200"
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
              className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50"
              disabled={isSubmitting || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-gray-900 rounded-md text-sm font-medium disabled:bg-gray-400"
              disabled={isSubmitting || uploading}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                  {editMode ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>{editMode ? "Update Video" : "Add Video"}</>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-md p-6 max-w-md w-full mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Delete Video</h3>
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
            <span className="font-medium">{videoTitle}</span>?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. The video will be permanently removed
            from this course.
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
  const [editMode, setEditMode] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);

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

  // Open edit modal
  const openEditModal = (e, video) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setVideoToEdit(video);
    setEditMode(true);
    setIsAddModalOpen(true);
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

  // Handle adding or updating a video lecture
  const handleVideoSubmit = async (videoData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (editMode && videoToEdit) {
        // Update existing video
        const updatedVideo = await updateVideoLecture(
          courseId,
          videoToEdit._id,
          videoData
        );

        // Update the videos list with the edited video
        setVideos(
          videos.map((video) =>
            video._id === videoToEdit._id ? updatedVideo : video
          )
        );
      } else {
        // Add new video
        const newVideo = await addVideoLecture(courseId, videoData);
        setVideos([...videos, newVideo]);
      }

      // Close the modal and reset state
      setIsAddModalOpen(false);
      setEditMode(false);
      setVideoToEdit(null);
    } catch (err) {
      setSubmitError(
        err.message || `Failed to ${editMode ? "update" : "add"} video lecture`
      );
      console.error(
        `Error ${editMode ? "updating" : "adding"} video lecture:`,
        err
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open add video modal (reset edit mode)
  const openAddVideoModal = () => {
    setEditMode(false);
    setVideoToEdit(null);
    setIsAddModalOpen(true);
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
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 max-w-lg w-full">
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
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-lg w-full">
          <h2 className="text-lg font-medium mb-2">Course Not Found</h2>
          <p>The requested course could not be found.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* Course Header */}
      <header className="bg-white border-b shadow-md">
        <div className="w-full mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-xl font-medium text-gray-900">
                {course.title}{" "}
                <span className="ml-2 bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
                  {course.difficulty}
                </span>
              </h1>
              <p className="text-gray-500 text-sm">{course.category}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-900 font-medium">₹{course.price}</span>
              <button
                className="bg-gray-900 text-white p-2 rounded text-sm  transition-colors flex justify-center items-center"
                onClick={openAddVideoModal}
              >
                <Plus size={20} className="inline mr-1" />
                Add Video
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {(submitError || deleteError) && (
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm">
            <p>Error: {submitError || deleteError}</p>
            <button
              className="text-red-600 hover:text-red-800 underline text-xs mt-1"
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
      <div className=" mx-auto px-4 py-6  w-full ">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4  rounded-md ">
          {/* Course Details */}
          <div className="lg:col-span-1 shadow-md ">
            <div className=" p-4 rounded ">
              <h2 className="text-lg font-medium mb-4 text-gray-900">
                Course details
              </h2>

              {course.courseThumbnail ? (
                <img
                  src={course.courseThumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover mb-4 rounded"
                />
              ) : (
                <div className="w-full h-40 bg-gray-50 rounded flex items-center justify-center mb-4">
                  <BookOpen size={32} className="text-gray-300" />
                </div>
              )}

              <div className="mb-4">
                <p className="text-gray-600 text-sm">
                  {course.description || "No description available."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{course.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Difficulty</p>
                  <p className="font-medium">{course.difficulty}</p>
                </div>
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium">₹{course.price}</p>
                </div>
                <div>
                  <p className="text-gray-500">Videos</p>
                  <p className="font-medium">{videos.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Lectures */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded border border-gray-100 overflow-hidden shadow-md">
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">
                  Video Lectures
                </h2>
                <button
                  className="bg-gray-900 text-white p-2 rounded text-sm  transition-colors flex justify-center items-center"
                  onClick={openAddVideoModal}
                >
                  <Plus size={20} className="inline mr-1" />
                  Add Video
                </button>
              </div>

              <div className="px-4 py-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {videos.length === 0 ? (
                  <div className="border border-dashed border-gray-200 rounded p-6 text-center">
                    <Video size={24} className="text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      No videos yet
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Add your first video lecture to get started
                    </p>
                    <button
                      className="text-sm px-3 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                      onClick={openAddVideoModal}
                    >
                      <Plus size={16} className="inline mr-1" />
                      Add your first video
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {videos.map((video, index) => (
                      <div
                        key={video._id}
                        className="border border-gray-100 rounded hover:border-gray-200 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Video Thumbnail */}
                          <div className="w-full sm:w-36 h-24 flex-shrink-0">
                            {video.videoThumbnail ? (
                              <img
                                src={video.videoThumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <Video size={24} className="text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Video Information */}

                          <div className="p-3 flex-grow flex flex-col">
                            <div className="flex justify-between items-start">
                              <Link to={`/courses/${courseId}/player`}>
                                {" "}
                                <div>
                                  <div className="flex items-center">
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full mr-2">
                                      {index + 1}
                                    </span>
                                    <h3 className="text-base font-medium text-gray-900">
                                      {video.title}
                                    </h3>
                                  </div>
                                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                    {video.description}
                                  </p>
                                </div>
                              </Link>

                              {/* Menu Button */}
                              <div className="relative ml-2">
                                <button
                                  className="p-1 hover:bg-gray-50 rounded"
                                  onClick={(e) => toggleMenu(e, video._id)}
                                >
                                  <MoreVertical
                                    size={16}
                                    className="text-gray-400"
                                  />
                                </button>

                                {/* Dropdown menu */}
                                {openMenuId === video._id && (
                                  <div className="absolute right-0 mt-1 w-32 bg-white shadow-md rounded-md z-10 border border-gray-100 text-sm">
                                    <button
                                      className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 flex items-center"
                                      onClick={(e) => openEditModal(e, video)}
                                    >
                                      <Pencil size={14} className="mr-2" />
                                      Edit
                                    </button>
                                    <button
                                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 flex items-center"
                                      onClick={(e) => openDeleteModal(e, video)}
                                    >
                                      <Trash2 size={14} className="mr-2" />
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Video Metadata */}
                            <div className="mt-auto flex items-center text-xs text-gray-500 pt-2">
                              <div className="flex items-center mr-3">
                                <Clock size={12} className="mr-1" />
                                <span>{formatDuration(video.duration)}</span>
                              </div>

                              <Link
                                to={`/courses/${courseId}/player`}
                                className="your-button-styles"
                              >
                                <div className="flex justify-center items-center ">
                                  {" "}
                                  <Play size={12} className="mr-1 " />
                                  <button>Play</button>
                                </div>
                              </Link>
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
      </div>

      {/* Add/Edit Video Modal */}
      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditMode(false);
          setVideoToEdit(null);
        }}
        onSubmit={handleVideoSubmit}
        isSubmitting={isSubmitting}
        editMode={editMode}
        initialData={videoToEdit}
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
    </DashboardLayout>
  );
};

export default CourseDetailsPage;
