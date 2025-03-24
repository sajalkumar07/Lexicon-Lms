const express = require("express");
const upload = require("../middlewares/multerMiddleware");
const { uploadVideo, getAllVideos } = require("../controllers/mediaController");

const router = express.Router();

router.post("/upload-video", upload.single("file"), uploadVideo);
router.get("/videos", getAllVideos);

module.exports = router;
