const express = require("express");
const {
  createQuestion,
  getQuestionsByCourse,
  getQuestionById,
} = require("../controllers/questionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });

router.route("/").post(protect, createQuestion).get(getQuestionsByCourse);

router.route("/:questionId").get(getQuestionById);

module.exports = router;
