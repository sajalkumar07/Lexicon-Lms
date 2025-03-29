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
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advance"],
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    courseThumbnail: {
      type: String,
      required: true,
    },
    videos: [
      {
        title: { type: String, required: true },
        description: { type: String },
        videoUrl: { type: String, required: true },
        videoThumbnail: { type: String, required: true },
        duration: { type: Number },
        order: { type: Number, required: true },
      },
    ],
    totalDuration: { type: Number, default: 0 },
    totalVideos: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
