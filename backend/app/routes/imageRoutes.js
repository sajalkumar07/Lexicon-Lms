const express = require("express");
const upload = require("../middlewares/multerMiddleware");
const { uploadImage, getAllImages } = require("../controllers/mediaController");

const router = express.Router();

router.post("/upload-image", upload.single("file"), uploadImage);
router.get("/images", getAllImages);

module.exports = router;
