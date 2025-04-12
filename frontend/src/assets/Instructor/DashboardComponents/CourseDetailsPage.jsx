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
  Send,
} from "lucide-react";
import Loader from "../../Utils/Loader";
import {
  fetchCourseDetails,
  fetchCourseVideos,
  addVideoLecture,
  deleteVideoLecture,
  updateVideoLecture,
} from "../Services/CourseManagement";
import {
  fetchCourseQuestions,
  postAnswer,
  fetchQuestionAnswers,
} from "../Services/qaService";
import DashboardLayout from "../Components/InstructorDashboard/DashboardLayout";
import { Link } from "react-router-dom";
import AddVideoModal from "./AddVideoModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import toast from "react-hot-toast";

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

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [loadingAnswers, setLoadingAnswers] = useState(false);

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

  // Fetch questions for the course
  useEffect(() => {
    const loadQuestions = async () => {
      if (!courseId) return;

      try {
        setLoadingQuestions(true);
        setQuestionError(null);
        const data = await fetchCourseQuestions(courseId);
        setQuestions(data.questions || []);
      } catch (err) {
        setQuestionError(err.message || "Failed to load questions");
        console.error("Error loading questions:", err);
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [courseId]);

  // Function to handle expanding question and loading answers
  const handleExpandQuestion = async (questionId) => {
    if (expandedQuestionId === questionId) {
      setExpandedQuestionId(null); // Collapse if already expanded
      return;
    }

    setExpandedQuestionId(questionId);
    setLoadingAnswers(true);

    try {
      const answersData = await fetchQuestionAnswers(questionId);

      // Update the questions state to include the fetched answers
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q._id === questionId ? { ...q, answers: answersData.data || [] } : q
        )
      );
    } catch (err) {
      console.error("Error fetching answers:", err);
      // Optionally show error to user
    } finally {
      setLoadingAnswers(false);
    }
  };

  // Function to handle submitting an answer
  const handleAnswerSubmit = async (questionId) => {
    if (!answerText.trim()) return;

    try {
      await postAnswer(questionId, answerText);

      // Refresh answers for this question
      const answersData = await fetchQuestionAnswers(questionId);

      // Update the questions state
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q._id === questionId ? { ...q, answers: answersData.data || [] } : q
        )
      );

      setAnswerText("");
    } catch (err) {
      console.error("Error submitting answer:", err);
      toast.error(`Failed to submit answer: ${err.message}`);
    }
  };

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
      <div className="mx-auto px-4 py-6 w-full">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 rounded-md">
          {/* Course Details */}
          <div className="lg:col-span-3 shadow-md">
            <div className="p-4 rounded">
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
          <div className="lg:col-span-6">
            <div className="bg-white rounded border border-gray-100 overflow-hidden shadow-md">
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">
                  Video Lectures
                </h2>
                <button
                  className="bg-gray-900 text-white p-2 rounded text-sm transition-colors flex justify-center items-center"
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

          {/* Q&A Section */}
          <div className="lg:col-span-3 shadow-md">
            <div className="bg-white rounded-xl shadow-sm p-6 h-full">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Have Questions?
              </h3>

              {loadingQuestions ? (
                <div className="flex justify-center py-4">
                  <Loader />
                </div>
              ) : questionError ? (
                <div className="text-center py-4 text-red-500">
                  <p>{questionError}</p>
                  <button
                    onClick={() => {
                      fetchCourseQuestions(courseId)
                        .then((data) => setQuestions(data.questions || []))
                        .catch((err) => setQuestionError(err.message));
                    }}
                    className="mt-2 text-blue-500 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {questions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>No questions yet. Be the first to ask!</p>
                    </div>
                  ) : (
                    questions.map((q) => (
                      <div
                        key={q._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-900">
                            Q: {q.content}
                          </div>
                          <button
                            onClick={() => handleExpandQuestion(q._id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {expandedQuestionId === q._id ? "Hide" : "View"}
                          </button>
                        </div>

                        {/* Show answers when question is expanded */}
                        {expandedQuestionId === q._id && (
                          <div className="mt-3 pl-4 border-l-2 border-gray-200">
                            {loadingAnswers ? (
                              <div className="py-2 flex justify-center">
                                <Loader />
                              </div>
                            ) : (
                              <>
                                {/* Display existing answers */}
                                {q.answers && q.answers.length > 0 ? (
                                  <div className="space-y-2 mb-3">
                                    {q.answers.map((answer, idx) => (
                                      <div
                                        key={answer._id || idx}
                                        className="bg-gray-50 p-3 rounded-lg"
                                      >
                                        <p className="text-gray-700">
                                          <span className="font-medium">
                                            A:
                                          </span>{" "}
                                          {answer.content}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-gray-500 italic mb-3">
                                    No answers yet
                                  </div>
                                )}

                                {/* Answer input form */}
                                <div className="flex mt-2">
                                  <input
                                    type="text"
                                    value={answerText}
                                    onChange={(e) =>
                                      setAnswerText(e.target.value)
                                    }
                                    placeholder="Add an answer..."
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <button
                                    onClick={() => handleAnswerSubmit(q._id)}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                                  >
                                    <Send size={16} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
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
        title="Delete Video"
        message="Are you sure you want to delete"
        itemName={videoToDelete?.title}
        detailMessage="This video will be permanently removed from this course."
      />
    </DashboardLayout>
  );
};

export default CourseDetailsPage;
