const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Media = require("../models/MediaSchema");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });

    // Save URL in Database
    const media = new Media({ url: result.secure_url, type: "image" });
    await media.save();

    fs.unlinkSync(req.file.path); // Delete temp file

    res.json({
      imageUrl: result.secure_url,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload Video
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No video uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });

    // Save URL in Database
    const media = new Media({ url: result.secure_url, type: "video" });
    await media.save();

    fs.unlinkSync(req.file.path); // Delete temp file

    res.json({
      videoUrl: result.secure_url,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Images
exports.getAllImages = async (req, res) => {
  try {
    const images = await Media.find({ type: "image" }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Media.find({ type: "video" }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
