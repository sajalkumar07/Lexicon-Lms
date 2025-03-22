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
  const { name, email, password } = req.body;

  try {
    const instructorExists = await Instructor.findOne({ email });
    if (instructorExists) {
      return res.status(400).json({ message: "Instructor already exists" });
    }

    const instructorId = `INSTRUCTOR-${Date.now()}`; // Generate a unique ID
    const instructor = await Instructor.create({
      name,
      email,
      password,
      instructorId,
    });
    generateToken(res, instructor._id);

    res.status(201).json({
      msg: "Instructor successfully created",
      instructor: {
        name: instructor.name,
        email: instructor.email,
        instructorId: instructor.instructorId,
      },
    });
  } catch (error) {
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
          name: instructor.name,
          email: instructor.email,
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
