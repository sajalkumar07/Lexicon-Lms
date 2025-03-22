const express = require("express");
const { uploadImage, uploadVideo } = require("../controllers/uploadController");
const { imageUpload, videoUpload } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// POST /api/upload/image - Upload an image
router.post("/image", imageUpload.single("file"), uploadImage);

// POST /api/upload/video - Upload a video
router.post("/video", videoUpload.single("file"), uploadVideo);

module.exports = router;
