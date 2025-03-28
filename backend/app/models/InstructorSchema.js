const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const instructorScheme = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  instructorId: { type: String, required: true },
  confirmPassword: { type: String, required: true },
});

// Pre-save middleware to handle password confirmation and hashing
instructorScheme.pre("save", async function (next) {
  // Only run password validation when password is modified
  if (!this.isModified("password")) return next();

  // Check if password matches confirmPassword
  if (this.password !== this.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Remove confirmPassword after validation
  this.confirmPassword = undefined;
});

instructorScheme.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Instructor", instructorScheme);
