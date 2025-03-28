const jwt = require("jsonwebtoken");
const Instructor = require("../models/InstructorSchema");

// Helper function to generate JWT
const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Store token in HTTP-only cookie (more secure)
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure only in production
    sameSite: "strict", // CSRF protection
    maxAge: 3600000, // 1 hour
  });
};

// Register a new instructor
exports.registerInstructor = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    if (!firstName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const instructorExists = await Instructor.findOne({ email });
    if (instructorExists) {
      return res.status(400).json({ message: "Instructor already exists" });
    }

    const instructorId = `INSTRUCTOR-${Date.now()}`; // Generate a unique ID
    const instructor = await Instructor.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      instructorId,
    });

    generateToken(res, instructor._id);

    res.status(201).json({
      msg: "Instructor successfully created",
      instructor: {
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        email: instructor.email,
        instructorId: instructor.instructorId,
      },
    });
  } catch (error) {
    // Handle specific validation errors
    if (error.message === "Passwords do not match") {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Instructor login
exports.loginInstructor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const instructor = await Instructor.findOne({ email });
    if (instructor && (await instructor.matchPassword(password))) {
      // Generate token
      const token = jwt.sign({ id: instructor._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Set cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, // 1 hour
      });

      // Return token and instructor info in response
      return res.status(200).json({
        message: "Login successful",
        token,
        instructor: {
          id: instructor._id,
          email: instructor.email,
          firstName: instructor.firstName,
          lastName: instructor.lastName,
          fullName: `${instructor.firstName} ${instructor.lastName}`,
          instructorId: instructor.instructorId,
        },
      });
    }
    res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Instructor logout
exports.logoutInstructor = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
  });
  res.status(200).json({ message: "Instructor logged out successfully" });
};

// Reset password (send a reset link)
exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  const instructor = await Instructor.findOne({ email });

  if (instructor) {
    // Logic to send email with reset link (using nodemailer or similar)
    return res.status(200).json({ message: "Password reset link sent" });
  }
  res.status(404).json({ message: "User not found" });
};

// Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const instructor = await Instructor.findById(req.instructor.id);

  if (instructor && (await instructor.matchPassword(oldPassword))) {
    instructor.password = newPassword;
    await instructor.save();
    return res.status(200).json({ message: "Password updated successfully" });
  }
  res.status(400).json({ message: "Incorrect old password" });
};
