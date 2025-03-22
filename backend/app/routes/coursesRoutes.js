const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { imageUpload } = require("../middlewares/uploadMiddleware");
const courseController = require("../controllers/coursesControllers");

// POST /courses - Create a new course (Instructors only)
router.post(
  "/createCourse",
  protect,
  imageUpload.single("image"), // Upload image
  courseController.createCourse
);

// GET /courses - Get all courses
router.get("/fetchCourses", courseController.getCourses);

// GET /courses/instructor - Get all courses for the authenticated instructor
router.get("/instructorCourses", courseController.getInstructorCourses);

// PUT /courses/:id - Update course information (Instructors only)
router.put("/updateCourse/:id", protect, courseController.updateCourse);

// DELETE /courses/:id - Delete a course (Instructors or Admin only)
router.delete("/deleteCourse/:id", protect, courseController.deleteCourse);

// GET /courses/test-auth - Test authentication
router.get("/test-auth", protect, courseController.testAuth);

module.exports = router;
