const jwt = require("jsonwebtoken");
const Course = require("../models/CourseSchema");
const Instructor = require("../models/InstructorSchema");

// Create a new course (Instructors only)
exports.createCourse = async (req, res) => {
  try {
    const { title, price, category, description, difficulty } = req.body;

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

    const newCourse = new Course({
      title,
      category,
      price,
      description,
      difficulty,
      instructor: instructorId, // Use the instructor ID from JWT
    });

    console.log("Creating course for instructor:", instructorId);
    console.log(title, price, category, description, difficulty, instructorId);

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
    // Temporarily remove the populate until Instructor model is properly set up
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

// Updated getInstructorCourses function for coursesControllers.js

// Add this to your coursesControllers.js
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
      instructorId: instructor.instructorId,
      instructorName: instructor.name,
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

// Update course information (Instructors only)
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, difficulty } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {
      title,
      description,
      difficulty,
    });
    if (!updatedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
};

// Delete a course (Instructors or Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse)
      return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};

// Add this to your coursesControllers.js file

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
