/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { createCourse } from "../Services/CourseManagement";
import { X, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

const CreateCoursePopup = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    difficulty: "Beginner",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset the form when opening
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createCourse(formData);
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
        });
        setSuccess(false);
      }, 2000);
    } catch (err) {
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
  const canSubmit = formData.description.trim() !== "";

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
            <div>
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
              <p className="text-sm text-gray-600">
                <span className="font-medium">Difficulty:</span>{" "}
                {formData.difficulty}
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Modal renders when isOpen is true
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gray-900 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-1">Create New Course</h2>
          <div className="flex items-center space-x-1 mt-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`h-2 w-2 rounded-full ${
                    currentStep >= step ? "bg-white" : "bg-white bg-opacity-30"
                  }`}
                />
                {step < 3 && (
                  <div
                    className={`h-0.5 w-8 ${
                      currentStep > step ? "bg-white" : "bg-white bg-opacity-30"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
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
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div> // Empty div for spacing
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  currentStep === 1 ? !canProceedStep1 : !canProceedStep2
                }
                className="flex items-center px-5 py-2 bg-gray-900 text-white rounded-lg  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="ml-1 w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="flex items-center px-5 py-2 bg-gray-900 text-white rounded-lg  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Course"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePopup;
