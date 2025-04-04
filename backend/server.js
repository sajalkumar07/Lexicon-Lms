const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./app/routes/auth");
const instructorAuth = require("./app/routes/instructorAuth");
const courseRoutes = require("./app/routes/coursesRoutes");
const corsOptions = require("./app/config/config");
const imageRoutes = require("./app/routes/imageRoutes");
const videoRoutes = require("./app/routes/videoRoutes");
const questionRoutes = require("./app/routes/questionRoutes");
const answerRoutes = require("./app/routes/answerRoutes");
const globalQuestionRoutes = require("./app/routes/globalQuestionRoutes");
const ratingCount = require("./app/routes/ratingRoutes");
const getInstructorRatings = require("./app/routes/ratingRoutes");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URI_AUTH)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructor-auth", instructorAuth);
app.use("/api", imageRoutes);
app.use("/api", videoRoutes);
app.use("/api/courses/:courseId/questions", questionRoutes);
app.use("/api/questions/:questionId/answers", answerRoutes);
app.use("/api/questions", globalQuestionRoutes);
app.use("/api/courses/:courseId/ratings", ratingCount);
app.use("/api/instructors", getInstructorRatings);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
