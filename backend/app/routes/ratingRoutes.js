const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middlewares/authMiddleware");
const {
  protect: instructorProtect,
} = require("../middlewares/instructorMiddleware");
const ratingController = require("../controllers/ratingController");

// Rate or update rating for a course - requires authentication
router.post("/rate", protect, ratingController.rateCourse);

// Get all ratings for a course - public
router.get("/ratings", ratingController.getCourseRatings);

// Get the current user's rating for a course - requires authentication
router.get("/my-rating", protect, ratingController.getUserCourseRating);

// Delete a rating - requires authentication
router.delete("/rating", protect, ratingController.deleteRating);

// Get all ratings by current user - requires authentication
router.get("/user-ratings", protect, ratingController.getUserRatings);

// Get all ratings for an instructor's courses
router.get(
  "/:instructorId/ratings",
  instructorProtect,
  ratingController.getInstructorRatings
);

module.exports = router;
