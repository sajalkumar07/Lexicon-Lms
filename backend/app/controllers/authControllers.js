const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, secondName, email, password, confirmPassword } = req.body;

  try {
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      secondName,
      email,
      password,
      confirmPassword,
    });
    generateToken(res, user._id);

    res.status(201).json({
      msg: "User successfully created",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    if (error.message === "Passwords do not match") {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// User login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Set cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, // 1 hour
      });

      // Return token and user info in response
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }
    res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// User logout
exports.logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
  });
  res.status(200).json({ message: "User logged out successfully" });
};

// Reset password (send a reset link)
exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    // Logic to send email with reset link (using nodemailer or similar)
    return res.status(200).json({ message: "Password reset link sent" });
  }
  res.status(404).json({ message: "User not found" });
};

// Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (user && (await user.matchPassword(oldPassword))) {
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  }
  res.status(400).json({ message: "Incorrect old password" });
};
