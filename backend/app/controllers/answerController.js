const Answer = require("../models/Answer");
const Question = require("../models/Question");
const Course = require("../models/CourseSchema");
// const User = require("../models/User");
const asyncHandler = require("express-async-handler");

exports.createAnswer = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { questionId } = req.params;

  // Get the authenticated entity (user or instructor)
  const authEntity = req.user || req.instructor;
  if (!authEntity?.id) {
    res.status(401);
    throw new Error("Not authorized, please login first");
  }

  // Validate question exists
  const question = await Question.findById(questionId);
  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  // Get the course
  const course = await Course.findById(question.courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Check if current user is the instructor for this course
  const isInstructor =
    course.instructor?.toString() === authEntity.id.toString();

  // Create the answer
  const answer = await Answer.create({
    questionId,
    userId: authEntity.id,
    content,
    isInstructorAnswer: isInstructor,
    userType: req.user ? "user" : "instructor", // Add this field if needed
  });

  // Populate user data
  const populatedAnswer = await Answer.findById(answer._id).populate(
    "userId",
    "name avatar role"
  );

  res.status(201).json({
    success: true,
    data: populatedAnswer,
    isInstructor,
  });
});
exports.getAnswersByQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  // Validate question exists
  const question = await Question.findById(questionId);
  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  const answers = await Answer.find({ questionId })
    .populate("userId", "name avatar role")
    .sort({ isInstructorAnswer: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: answers.length,
    data: answers,
  });
});
