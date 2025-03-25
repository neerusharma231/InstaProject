const express = require("express");
const upload = require("../middleware/upload");
const { uploadFile, getAllUploads, likePost } = require("../controllers/uploadController");

const router = express.Router();

// ✅ Upload File Route
router.post("/upload/:userId", upload.single("file"), uploadFile);


// ✅ Get All Uploads Route
router.get("/uploads", getAllUploads);

// ✅ Like Route
router.put("/like/:id", likePost);

module.exports = router;
