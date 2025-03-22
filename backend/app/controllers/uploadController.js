export function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Construct URL with hostname and path
    const fileUrl = `/uploads/images/${req.file.filename}`;

    res.status(200).json({
      message: "Image uploaded successfully",
      fileUrl: fileUrl,
      fileDetails: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
}

// Upload video
export function uploadVideo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video uploaded" });
    }

    // Construct URL with hostname and path
    const fileUrl = `/uploads/videos/${req.file.filename}`;

    res.status(200).json({
      message: "Video uploaded successfully",
      fileUrl: fileUrl,
      fileDetails: {
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res
      .status(500)
      .json({ message: "Error uploading video", error: error.message });
  }
}
