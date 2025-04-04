/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { X, FileVideo, Image } from "lucide-react";
import { uploadImage, uploadVideo } from "../Services/CourseManagement";

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

export default AddVideoModal;
