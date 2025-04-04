const jwt = require("jsonwebtoken");
const Rating = require("../models/RatingSchema");
const Course = require("../models/CourseSchema");

// Create or update a course rating
exports.rateCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { rating, feedback } = req.body;

    // Get token from header for user identification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Validate rating value
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user has already rated this course
    const existingRating = await Rating.findOne({
      course: courseId,
      user: userId,
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.feedback = feedback || existingRating.feedback;
      await existingRating.save();
    } else {
      // Create new rating
      const newRating = new Rating({
        course: courseId,
        user: userId,
        rating: rating,
        feedback: feedback || "",
      });
      await newRating.save();
    }

    // Calculate new average rating for the course
    const allRatings = await Rating.find({ course: courseId });
    const totalRatingValue = allRatings.reduce(
      (sum, item) => sum + item.rating,
      0
    );
    const averageRating = (totalRatingValue / allRatings.length).toFixed(1);

    // Update course with new rating
    course.rating = averageRating;
    course.totalRatings = allRatings.length;

    await course.save();

    res.status(200).json({
      message: existingRating
        ? "Rating updated successfully"
        : "Course rated successfully",
      courseId: course._id,
      newRating: averageRating,
      totalRatings: allRatings.length,
    });
  } catch (error) {
    console.error("Error rating course:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Authentication error" });
    }

    res.status(500).json({
      message: "Error rating course",
      error: error.message,
    });
  }
};

// Get course ratings
exports.getCourseRatings = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Get all ratings for the course
    const ratings = await Rating.find({ course: courseId })
      .populate("user", "firstName lastName profilePicture")
      .sort({ createdAt: -1 });

    const ratingSummary = {
      courseId: courseId,
      courseTitle: course.title,
      averageRating: course.rating,
      totalRatings: ratings.length,
      ratingsDistribution: {
        5: ratings.filter((r) => r.rating === 5).length,
        4: ratings.filter((r) => r.rating === 4).length,
        3: ratings.filter((r) => r.rating === 3).length,
        2: ratings.filter((r) => r.rating === 2).length,
        1: ratings.filter((r) => r.rating === 1).length,
      },
      ratings: ratings,
    };

    res.status(200).json(ratingSummary);
  } catch (error) {
    console.error("Error getting course ratings:", error);
    res.status(500).json({
      message: "Error getting course ratings",
      error: error.message,
    });
  }
};

// Get user's rating for a specific course
exports.getUserCourseRating = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Get token from header for user identification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the rating
    const rating = await Rating.findOne({
      course: courseId,
      user: userId,
    });

    if (!rating) {
      return res.status(404).json({
        message: "No rating found",
        hasRated: false,
      });
    }

    res.status(200).json({
      hasRated: true,
      rating: rating.rating,
      feedback: rating.feedback,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    });
  } catch (error) {
    console.error("Error getting user's course rating:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Authentication error" });
    }

    res.status(500).json({
      message: "Error getting user's course rating",
      error: error.message,
    });
  }
};

// Delete a rating
exports.deleteRating = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Get token from header for user identification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const userRole = decoded.role;

    // Find the rating
    const rating = await Rating.findOne({
      course: courseId,
      user: userId,
    });

    if (!rating) {
      return res.status(404).json({ message: "No rating found" });
    }

    // Only the rating owner or admin can delete
    if (rating.user.toString() !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this rating" });
    }

    await Rating.findByIdAndDelete(rating._id);

    // Recalculate course rating
    const course = await Course.findById(courseId);
    const allRatings = await Rating.find({ course: courseId });

    if (allRatings.length > 0) {
      const totalRatingValue = allRatings.reduce(
        (sum, item) => sum + item.rating,
        0
      );
      const averageRating = (totalRatingValue / allRatings.length).toFixed(1);
      course.rating = averageRating;
    } else {
      course.rating = 0;
    }

    course.totalRatings = allRatings.length;
    await course.save();

    res.status(200).json({
      message: "Rating deleted successfully",
      courseId: courseId,
      newRating: course.rating,
      totalRatings: allRatings.length,
    });
  } catch (error) {
    console.error("Error deleting rating:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Authentication error" });
    }

    res.status(500).json({
      message: "Error deleting rating",
      error: error.message,
    });
  }
};

// Get ratings for a specific user
exports.getUserRatings = async (req, res) => {
  try {
    // Get token from header for user identification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find all ratings by this user
    const ratings = await Rating.find({ user: userId })
      .populate("course", "title courseThumbnail")
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalRatings: ratings.length,
      ratings: ratings,
    });
  } catch (error) {
    console.error("Error getting user ratings:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Authentication error" });
    }

    res.status(500).json({
      message: "Error getting user ratings",
      error: error.message,
    });
  }
};

exports.getInstructorRatings = async (req, res) => {
  try {
    const instructorId = req.params.instructorId;

    // Find all courses by this instructor
    const courses = await Course.find({ instructor: instructorId }).select(
      "_id title"
    );
    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this instructor" });
    }

    const courseIds = courses.map((course) => course._id);

    // Get all ratings for these courses
    const ratings = await Rating.find({ course: { $in: courseIds } })
      .populate("user", "firstName lastName profilePicture")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    // Calculate average rating for instructor
    const totalRatings = ratings.length;
    const totalScore = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRatings
      ? (totalScore / totalRatings).toFixed(1)
      : 0;

    res.status(200).json({
      instructorId,
      totalRatings,
      averageRating,
      ratings,
    });
  } catch (error) {
    console.error("Error getting instructor ratings:", error);
    res
      .status(500)
      .json({
        message: "Error fetching instructor ratings",
        error: error.message,
      });
  }
};
