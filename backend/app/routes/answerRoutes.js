const express = require("express");
const {
  createAnswer,
  getAnswersByQuestion,
} = require("../controllers/answerController");
const { protect: userProtect } = require("../middlewares/authMiddleware");
const {
  protect: instructorProtect,
} = require("../middlewares/instructorMiddleware");

const router = express.Router({ mergeParams: true });

router.route("/").post(userProtect, createAnswer).get(getAnswersByQuestion);
router
  .route("/instructor")
  .post(instructorProtect, createAnswer)
  .get(getAnswersByQuestion);

module.exports = router;
