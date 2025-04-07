const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentDetails: {
      type: Object,
    },
  },
  { timestamps: true }
);

// Create a compound index to efficiently check if a user has purchased a course
PurchaseSchema.index({ userId: 1, courseId: 1 });

const Purchase = mongoose.model("Purchase", PurchaseSchema);

module.exports = Purchase;
