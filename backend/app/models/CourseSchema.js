const mongoose = require("mongoose");

// Define the course module schema
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advance"],
      required: true,
    },
    instructor: {
      type: String,
    },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
