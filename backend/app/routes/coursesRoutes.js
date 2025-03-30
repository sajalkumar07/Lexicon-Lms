const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const courseController = require("../controllers/coursesControllers");

// POST /courses - Create a new course (Instructors only)
router.post("/createCourse", protect, courseController.createCourse);

// GET /courses - Get all courses
router.get("/fetchCourses", courseController.getCourses);

// GET /courses/instructor - Get all courses for the authenticated instructor
router.get("/instructorCourses", courseController.getInstructorCourses);

// GET /courses/:id - Get a specific course by ID
router.get("/course/:id", courseController.getCourseById);

// POST /courses/:id/videos - Add a video to a course
router.post("/course/:id/videos", protect, courseController.addCourseVideo);

// GET /courses/:id/videos - Get all videos for a specific course
router.get("/course/:id/videos", courseController.getCourseVideos);

// PUT /courses/:id - Update course information (Instructors only)
router.put("/updateCourse/:id", protect, courseController.updateCourse);

// DELETE /courses/:id - Delete a course (Instructors or Admin only)
router.delete("/deleteCourse/:id", protect, courseController.deleteCourse);

router.delete(
  "/deleteCourse/:courseId/videos/:videoId",
  protect,
  courseController.deleteCourseVideo
);

router.put(
  "/updateCourse/:courseId/videos/:videoId",
  protect,
  courseController.updateCourseVideo
);

// GET /courses/test-auth - Test authentication
router.get("/test-auth", protect, courseController.testAuth);

module.exports = router;
