// app/routes/globalQuestionRoutes.js
const express = require("express");
const { getRecentQuestions } = require("../controllers/questionController");
const router = express.Router();

// Route for recent questions without course parameter
router.get("/recent", getRecentQuestions);

module.exports = router;
