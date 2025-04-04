const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Ensure a user can only rate a course once
ratingSchema.index({ course: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
