/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BookOpen,
  Video,
  Clock,
  Play,
  Star,
  MessageSquare,
  CreditCard,
  Check,
  Send,
} from "lucide-react";
import Loader from "../../../Utils/Loader";
import {
  fetchCourseDetails,
  fetchCourseVideos,
} from "../../Services/getCourses";
import {
  postQuestion,
  fetchCourseQuestions,
  postAnswer,
  fetchQuestionAnswers,
} from "../../Services/qanda";
import Navbar from "../../../Utils/Navbar";

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
  const [openMenuId, setOpenMenuId] = useState(null);

  // Student features
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(false);
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

  // Payment handlers
  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
      }, 2000);
    }, 1500);
  };

  // Question handlers
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    try {
      const response = await postQuestion(courseId, questionText);
      // After successful post, refresh questions
      const updatedQuestions = await fetchCourseQuestions(courseId);
      setQuestions(updatedQuestions.questions || []);
      setQuestionText("");
    } catch (err) {
      console.error("Error submitting question:", err);
      // Show error to user
      alert(`Failed to submit question: ${err.message}`);
    }
  };

  // Rating handlers
  const handleRatingSubmit = () => {
    // Here you could implement a real API call to submit the rating
    setSubmittedRating(true);
    setTimeout(() => {
      setSubmittedRating(false);
    }, 2000);
  };

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
      alert(`Failed to submit answer: ${err.message}`);
    }
  };

  const renderQASection = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">
          Have Questions?
        </h3>
        <form onSubmit={handleQuestionSubmit} className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <MessageSquare size={18} />
            </button>
          </div>
        </form>

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
                                    <span className="font-medium">A:</span>{" "}
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
                              onChange={(e) => setAnswerText(e.target.value)}
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
    );
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
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50 py-14 px-2">
      <Navbar />

      {/* Course Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {course.title}
                <span className="ml-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {course.difficulty}
                </span>
              </h1>
              <p className="text-gray-600 mt-1">{course.category}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-gray-900">
                ₹{course.price}
              </span>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Info and Features */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Thumbnail */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden ">
              {course.courseThumbnail ? (
                <img
                  src={course.courseThumbnail}
                  alt={course.title}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                  <BookOpen size={48} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                About This Course
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {course.description || "No description available."}
              </p>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Curriculum</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {videos.length} video lectures
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {videos.length === 0 ? (
                  <div className="p-6 text-center">
                    <Video size={32} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No videos available yet</p>
                  </div>
                ) : (
                  videos.map((video, index) => (
                    <div
                      key={video._id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <span className="text-blue-800 font-medium">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-md font-medium text-gray-900">
                            {video.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {video.description}
                          </p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1" />
                            <span>{formatDuration(video.duration)}</span>
                          </div>
                        </div>
                        <Link
                          to={`/courses/${courseId}/player`}
                          className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <Play size={14} className="mr-1" />
                          Play
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Student Features */}
          <div className="space-y-6">
            {/* Payment Summary (hardcoded) */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Course Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">₹{course.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">-₹200</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{course.price - 200}</span>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enroll Now
                </button>
              </div>
            </div>

            {/* Q&A Section with API Integration */}
            {renderQASection()}

            {/* Rating Section (hardcoded) */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Rate This Course
              </h3>
              {submittedRating ? (
                <div className="text-center py-4 text-green-600">
                  <Check size={32} className="mx-auto mb-2" />
                  <p>Thank you for your rating!</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="text-2xl mx-1 focus:outline-none"
                      >
                        {star <= (hoverRating || rating) ? (
                          <Star className="text-yellow-400 fill-current" />
                        ) : (
                          <Star className="text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleRatingSubmit}
                    disabled={rating === 0}
                    className={`w-full px-4 py-2 rounded-lg ${
                      rating === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Submit Rating
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {paymentSuccess ? (
              <div className="text-center py-6">
                <Check size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-6">
                  You now have full access to the course.
                </p>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start Learning
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">
                  Complete Your Enrollment
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium">{course.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₹{course.price - 200}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
                      <input
                        type="radio"
                        name="payment"
                        className="form-radio text-blue-600"
                        defaultChecked
                      />
                      <CreditCard size={20} className="text-gray-700" />
                      <span>Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
                      <input
                        type="radio"
                        name="payment"
                        className="form-radio text-blue-600"
                      />
                      <span>UPI</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
                      <input
                        type="radio"
                        name="payment"
                        className="form-radio text-blue-600"
                      />
                      <span>Net Banking</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Pay ₹{course.price - 200}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
