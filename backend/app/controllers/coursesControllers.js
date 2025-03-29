const jwt = require("jsonwebtoken");
const Course = require("../models/CourseSchema");
const Instructor = require("../models/InstructorSchema");

// Create a new course (Instructors only)
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      price,
      category,
      description,
      difficulty,
      courseThumbnail,
      videos = [],
    } = req.body;

    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const instructorId = decoded.id;

    // Check if instructor exists
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Validate required fields
    if (
      !title ||
      !price ||
      !category ||
      !description ||
      !difficulty ||
      !courseThumbnail
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Calculate total duration from videos if provided
    let totalDuration = 0;
    if (videos && videos.length > 0) {
      // Validate each video has required fields
      for (const video of videos) {
        if (!video.title || !video.videoUrl || !video.videoThumbnail) {
          return res.status(400).json({
            message:
              "Each video must have a title, videoUrl, and videoThumbnail",
          });
        }
        if (video.duration) {
          totalDuration += video.duration;
        }
      }
    }

    const newCourse = new Course({
      title,
      category,
      price,
      description,
      difficulty,
      instructor: instructorId,
      courseThumbnail,
      videos,
      totalDuration,
      totalVideos: videos.length,
    });

    console.log("Creating course for instructor:", instructorId);

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res
      .status(500)
      .json({ message: "Error creating course", error: error.message });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "instructor",
      "firstName lastName email"
    );
    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

// Get instructor courses
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token directly
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const instructorId = decoded.id;

    console.log("Token decoded successfully, instructor ID:", instructorId);

    // Find instructor directly to verify they exist
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({
        message: "Instructor not found",
        providedId: instructorId,
      });
    }

    console.log("Instructor found:", instructor.firstName);

    // Find courses directly using the ID from the token
    const courses = await Course.find({ instructor: instructorId }).populate(
      "instructor"
    );
    console.log(
      `Found ${courses.length} courses for instructor ${instructor.firstName}`
    );

    res.status(200).json({
      instructorId: instructor._id,
      instructorName: `${instructor.firstName} ${instructor.lastName}`,
      instructorEmail: instructor.email,
      courseCount: courses.length,
      courses: courses,
    });
  } catch (error) {
    console.error("Error in direct instructor courses method:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(500).json({
      message: "Server error fetching instructor courses",
      errorType: error.name,
      errorMessage: error.message,
    });
  }
};

// Add a video to course
exports.addCourseVideo = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description, videoUrl, videoThumbnail, duration } = req.body;

    // Validate required fields
    if (!title || !videoUrl || !videoThumbnail) {
      return res.status(400).json({
        message: "Video title, URL, and thumbnail are required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify the instructor is the course owner
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (course.instructor.toString() !== decoded.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this course" });
    }

    // Calculate the order for the new video
    const newOrder = course.videos.length + 1;

    const newVideo = {
      title,
      description: description || "",
      videoUrl,
      videoThumbnail,
      duration: duration || 0,
      order: newOrder,
    };

    course.videos.push(newVideo);

    // Update total duration and video count
    course.totalDuration += duration || 0;
    course.totalVideos = course.videos.length;

    await course.save();

    res.status(201).json({
      message: "Video added successfully",
      courseId: course._id,
      video: newVideo,
    });
  } catch (error) {
    console.error("Error adding video to course:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Authentication error" });
    }

    res.status(500).json({
      message: "Error adding video to course",
      error: error.message,
    });
  }
};

// Update course information (Instructors only)
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, difficulty, price, category, courseThumbnail } =
      req.body;

    // Get the course to verify ownership
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify the instructor is the course owner
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (course.instructor.toString() !== decoded.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this course" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        difficulty,
        price,
        category,
        courseThumbnail,
      },
      { new: true }
    );

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Authentication error" });
    }

    res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
};

// Delete a course (Instructors or Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify the instructor is the course owner (unless admin)
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Allow the course owner or an admin to delete
    if (
      course.instructor.toString() !== decoded.id &&
      decoded.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Authentication error" });
    }

    res.status(500).json({
      message: "Error deleting course",
      error: error.message,
    });
  }
};

// Get a single course by ID with all details
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "firstName lastName email"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      message: "Error fetching course",
      error: error.message,
    });
  }
};

// Get all videos for a specific course
exports.getCourseVideos = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Return just the videos array and some basic course info
    res.status(200).json({
      courseId: course._id,
      courseTitle: course.title,
      totalVideos: course.totalVideos,
      totalDuration: course.totalDuration,
      videos: course.videos,
    });
  } catch (error) {
    console.error("Error fetching course videos:", error);
    res.status(500).json({
      message: "Error fetching course videos",
      error: error.message,
    });
  }
};

// Test auth endpoint
exports.testAuth = async (req, res) => {
  try {
    res.status(200).json({
      message: "Authentication successful",
      instructorId: req.instructor ? req.instructor._id : "undefined",
      instructorName: req.instructor ? req.instructor.name : "undefined",
      instructorEmail: req.instructor ? req.instructor.email : "undefined",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in test auth", error: error.message });
  }
};
