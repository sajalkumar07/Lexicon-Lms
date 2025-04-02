const Question = require("../models/Question");
const Course = require("../models/CourseSchema");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

exports.createQuestion = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { courseId } = req.params;

  // Validate course exists
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  const question = await Question.create({
    courseId,
    userId: req.user.id,
    content,
  });

  res.status(201).json({
    success: true,
    data: question,
  });
});

exports.getQuestionsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Validate course exists
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  const questions = await Question.find({ courseId })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions,
  });
});

exports.getQuestionById = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  const question = await Question.findById(questionId)
    .populate("userId", "name avatar")
    .populate("courseId", "title instructor");

  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  res.status(200).json({
    success: true,
    data: question,
  });
});
