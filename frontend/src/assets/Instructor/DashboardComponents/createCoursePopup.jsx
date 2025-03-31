/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef } from "react";
import {
  createCourse,
  uploadImage,
  uploadVideo,
} from "../Services/CourseManagement";
import {
  X,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Upload,
  Plus,
  Trash,
  FileVideo,
  Image,
} from "lucide-react";

const CreateCoursePopup = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    difficulty: "Beginner",
    courseThumbnail: "",
    videos: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadType, setCurrentUploadType] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreviewMap, setVideoPreviewMap] = useState({});
  const [videoThumbnailPreviewMap, setVideoThumbnailPreviewMap] = useState({});

  // Refs for file inputs
  const fileInputRefs = useRef({});

  // Reset the form when opening
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setError(null);
      setSuccess(false);
      setThumbnailPreview(null);
      setVideoPreviewMap({});
      setVideoThumbnailPreviewMap({});
      setFormData({
        title: "",
        category: "",
        price: "",
        description: "",
        difficulty: "Beginner",
        courseThumbnail: "",
        videos: [],
      });
    }
  }, [isOpen]);

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
    setFormData({
      ...formData,
      [name]: name === "price" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setCurrentUploadType("thumbnail");
    const stopProgress = simulateProgress();

    try {
      const response = await uploadImage(file);
      // Extract the URL from the response object
      const imageUrl = response.imageUrl || response;

      setFormData({
        ...formData,
        courseThumbnail: imageUrl,
      });
      setUploadProgress(100);
    } catch (err) {
      setError("Failed to upload thumbnail");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setCurrentUploadType("");
        setUploadProgress(0);
      }, 500);
      stopProgress();
    }
  };

  const handleVideoUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create video preview
    const videoId = `video-${index}`;
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoPreviewMap((prev) => ({
        ...prev,
        [videoId]: { url: reader.result, name: file.name },
      }));
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setCurrentUploadType(`video-${index}`);
    const stopProgress = simulateProgress();

    try {
      const response = await uploadVideo(file);
      // Extract the URL from the response object
      const videoUrl = response.videoUrl || response;

      const updatedVideos = [...formData.videos];
      if (updatedVideos[index]) {
        updatedVideos[index] = {
          ...updatedVideos[index],
          videoUrl: videoUrl,
        };
      }

      setFormData({
        ...formData,
        videos: updatedVideos,
      });
      setUploadProgress(100);
    } catch (err) {
      setError("Failed to upload video");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setCurrentUploadType("");
        setUploadProgress(0);
      }, 500);
      stopProgress();
    }
  };

  const handleVideoThumbnailUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create thumbnail preview
    const thumbnailId = `thumbnail-${index}`;
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoThumbnailPreviewMap((prev) => ({
        ...prev,
        [thumbnailId]: { url: reader.result, name: file.name },
      }));
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setCurrentUploadType(`thumbnail-${index}`);
    const stopProgress = simulateProgress();

    try {
      const response = await uploadImage(file);
      // Extract the URL from the response object
      const imageUrl = response.imageUrl || response;

      const updatedVideos = [...formData.videos];
      if (updatedVideos[index]) {
        updatedVideos[index] = {
          ...updatedVideos[index],
          videoThumbnail: imageUrl,
        };
      }

      setFormData({
        ...formData,
        videos: updatedVideos,
      });
      setUploadProgress(100);
    } catch (err) {
      setError("Failed to upload video thumbnail");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setCurrentUploadType("");
        setUploadProgress(0);
      }, 500);
      stopProgress();
    }
  };

  const addVideo = () => {
    setFormData({
      ...formData,
      videos: [
        ...formData.videos,
        {
          title: "",
          description: "",
          videoUrl: "",
          videoThumbnail: "",
          duration: 0,
          order: formData.videos.length + 1,
        },
      ],
    });
  };

  const removeVideo = (index) => {
    const updatedVideos = [...formData.videos];
    updatedVideos.splice(index, 1);

    // Update order numbers
    const reorderedVideos = updatedVideos.map((video, idx) => ({
      ...video,
      order: idx + 1,
    }));

    setFormData({
      ...formData,
      videos: reorderedVideos,
    });

    // Clean up previews
    const videoId = `video-${index}`;
    const thumbnailId = `thumbnail-${index}`;

    setVideoPreviewMap((prev) => {
      const newMap = { ...prev };
      delete newMap[videoId];
      return newMap;
    });

    setVideoThumbnailPreviewMap((prev) => {
      const newMap = { ...prev };
      delete newMap[thumbnailId];
      return newMap;
    });
  };

  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...formData.videos];
    updatedVideos[index] = {
      ...updatedVideos[index],
      [field]:
        field === "duration" ? (value === "" ? 0 : Number(value)) : value,
    };

    setFormData({
      ...formData,
      videos: updatedVideos,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format data to match API requirements
      const formattedData = {
        ...formData,
        price: Number(formData.price),
        videos: formData.videos.map((video, index) => ({
          ...video,
          order: index + 1,
          duration: Number(video.duration),
        })),
      };

      // Log the request body to verify format
      console.log("Submitting course data:", formattedData);

      await createCourse(formattedData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset after closing
        setFormData({
          title: "",
          category: "",
          price: "",
          description: "",
          difficulty: "Beginner",
          courseThumbnail: "",
          videos: [],
        });
        setSuccess(false);
        setThumbnailPreview(null);
        setVideoPreviewMap({});
        setVideoThumbnailPreviewMap({});
      }, 2000);
    } catch (err) {
      console.error("Error creating course:", err);
      setError(err.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Required field validation per step
  const canProceedStep1 =
    formData.title.trim() !== "" && formData.category.trim() !== "";
  const canProceedStep2 = formData.price !== "" && formData.difficulty !== "";
  const canProceedStep3 =
    formData.description.trim() !== "" && formData.courseThumbnail !== "";
  const canSubmit =
    formData.videos.length > 0 &&
    formData.videos.every(
      (video) =>
        video.title &&
        video.description &&
        video.videoUrl &&
        video.videoThumbnail &&
        video.duration
    );

  // If isOpen is false, don't render anything
  if (!isOpen) return null;

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                placeholder="e.g., Advance JavaScript Fundamentals"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                placeholder="e.g., Web Development, DSA, Machine Learning"
                required
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                placeholder="e.g., 599"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {["Beginner", "Intermediate", "Advance"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, difficulty: level })
                    }
                    className={`p-3 rounded-lg border transition-all ${
                      formData.difficulty === level
                        ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                placeholder="Describe what students will learn in this course..."
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Thumbnail
              </label>
              <div className="mt-2">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailPreview(null);
                        setFormData({ ...formData, courseThumbnail: "" });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="thumbnail"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      ref={(el) => (fileInputRefs.current["thumbnail"] = el)}
                    />
                    <label
                      htmlFor="thumbnail"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Image className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload thumbnail
                      </span>
                    </label>
                  </div>
                )}

                {currentUploadType === "thumbnail" && uploading && (
                  <ProgressBar progress={uploadProgress} type="thumbnail" />
                )}
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Course Videos
                </label>
                <button
                  type="button"
                  onClick={addVideo}
                  className="text-sm flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Plus size={16} className="mr-1" /> Add Video
                </button>
              </div>

              {formData.videos.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <button
                    type="button"
                    onClick={addVideo}
                    className="flex flex-col items-center justify-center w-full cursor-pointer"
                  >
                    <Plus className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Add your first video
                    </span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.videos.map((video, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Video {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={video.title}
                            onChange={(e) =>
                              handleVideoChange(index, "title", e.target.value)
                            }
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                            placeholder="Video title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (seconds)
                          </label>
                          <input
                            type="number"
                            value={video.duration}
                            onChange={(e) =>
                              handleVideoChange(
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                            placeholder="Duration in seconds"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={video.description}
                          onChange={(e) =>
                            handleVideoChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          rows="2"
                          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                          placeholder="Video description"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Video File
                          </label>
                          <div className="mt-1">
                            {video.videoUrl ? (
                              <div className="relative p-3 bg-gray-50 rounded-lg border border-gray-200">
                                {videoPreviewMap[`video-${index}`] && (
                                  <div className="mb-2">
                                    <video
                                      src={
                                        videoPreviewMap[`video-${index}`].url
                                      }
                                      className="w-full h-24 object-cover rounded-md"
                                      controls
                                    />
                                  </div>
                                )}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <FileVideo
                                      size={16}
                                      className="text-blue-500 mr-2"
                                    />
                                    <span className="text-sm truncate max-w-[150px]">
                                      {videoPreviewMap[`video-${index}`]
                                        ?.name || "Video uploaded"}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleVideoChange(index, "videoUrl", "");
                                      setVideoPreviewMap((prev) => {
                                        const newMap = { ...prev };
                                        delete newMap[`video-${index}`];
                                        return newMap;
                                      });
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
                                  id={`video-${index}`}
                                  accept="video/*"
                                  onChange={(e) => handleVideoUpload(e, index)}
                                  className="hidden"
                                  ref={(el) =>
                                    (fileInputRefs.current[`video-${index}`] =
                                      el)
                                  }
                                />
                                <label
                                  htmlFor={`video-${index}`}
                                  className="flex flex-col items-center justify-center cursor-pointer py-2"
                                >
                                  <FileVideo className="w-8 h-8 text-gray-400 mb-2" />
                                  <span className="text-sm text-gray-500">
                                    Click to upload video
                                  </span>
                                </label>
                              </div>
                            )}

                            {currentUploadType === `video-${index}` &&
                              uploading && (
                                <ProgressBar
                                  progress={uploadProgress}
                                  type="video"
                                />
                              )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Video Thumbnail
                          </label>
                          <div className="mt-1">
                            {video.videoThumbnail ? (
                              <div className="relative p-3 bg-gray-50 rounded-lg border border-gray-200">
                                {videoThumbnailPreviewMap[
                                  `thumbnail-${index}`
                                ] && (
                                  <div className="mb-2">
                                    <img
                                      src={
                                        videoThumbnailPreviewMap[
                                          `thumbnail-${index}`
                                        ].url
                                      }
                                      alt="Video thumbnail"
                                      className="w-full h-24 object-cover rounded-md"
                                    />
                                  </div>
                                )}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Image
                                      size={16}
                                      className="text-blue-500 mr-2"
                                    />
                                    <span className="text-sm truncate max-w-[150px]">
                                      {videoThumbnailPreviewMap[
                                        `thumbnail-${index}`
                                      ]?.name || "Thumbnail uploaded"}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleVideoChange(
                                        index,
                                        "videoThumbnail",
                                        ""
                                      );
                                      setVideoThumbnailPreviewMap((prev) => {
                                        const newMap = { ...prev };
                                        delete newMap[`thumbnail-${index}`];
                                        return newMap;
                                      });
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
                                  id={`video-thumb-${index}`}
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleVideoThumbnailUpload(e, index)
                                  }
                                  className="hidden"
                                  ref={(el) =>
                                    (fileInputRefs.current[
                                      `video-thumb-${index}`
                                    ] = el)
                                  }
                                />
                                <label
                                  htmlFor={`video-thumb-${index}`}
                                  className="flex flex-col items-center justify-center cursor-pointer py-2"
                                >
                                  <Image className="w-8 h-8 text-gray-400 mb-2" />
                                  <span className="text-sm text-gray-500">
                                    Click to upload thumbnail
                                  </span>
                                </label>
                              </div>
                            )}

                            {currentUploadType === `thumbnail-${index}` &&
                              uploading && (
                                <ProgressBar
                                  progress={uploadProgress}
                                  type="thumbnail"
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Course Summary</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Title:</span> {formData.title}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Category:</span>{" "}
                {formData.category}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Price:</span> ₹{formData.price}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Difficulty:</span>{" "}
                {formData.difficulty}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Videos:</span>{" "}
                {formData.videos.length}
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const totalSteps = 4;

  // Modal renders when isOpen is true
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 transition-opacity backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl relative overflow-hidden animate-fade-in my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-1">Create New Course</h2>
          <p className="text-blue-100 text-sm">
            Step {currentStep} of {totalSteps}
          </p>

          <div className="flex items-center space-x-1 mt-4">
            {Array.from({ length: totalSteps }).map((_, step) => (
              <React.Fragment key={step}>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentStep >= step + 1
                      ? "bg-white w-6"
                      : "bg-white bg-opacity-30 w-4"
                  }`}
                />
                {step < totalSteps - 1 && (
                  <div
                    className={`h-0.5 w-2 ${
                      currentStep > step + 1
                        ? "bg-white"
                        : "bg-white bg-opacity-30"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto"
        >
          {success && (
            <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Course created successfully!
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {/* Dynamic step content */}
          {renderStepContent()}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !canProceedStep1) ||
                  (currentStep === 2 && !canProceedStep2) ||
                  (currentStep === 3 && !canProceedStep3)
                }
                className={`p-2  rounded-lg flex items-center justify-center ${
                  (currentStep === 1 && canProceedStep1) ||
                  (currentStep === 2 && canProceedStep2) ||
                  (currentStep === 3 && canProceedStep3)
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition-colors`}
              >
                Next <ArrowRight className="ml-1 w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  canSubmit
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition-colors`}
              >
                {loading ? "Creating..." : "Create Course"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePopup;
