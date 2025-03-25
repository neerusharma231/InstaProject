const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Ensure the uploads folder exists
const uploadPath = path.join(__dirname, "../uploads");

try {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
} catch (err) {
  console.error("Error creating upload directory:", err);
}

// ✅ Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ✅ Allow both images and videos
const allowedMimeTypes = [
  "image/jpeg", "image/png", "image/jpg",   // Images
  "video/mp4", "video/quicktime"           // Videos (MP4, MOV)
];

// ✅ File filter for images & videos
const fileFilter = (req, file, cb) => {
  console.log("Received file:", file.mimetype); // Debugging

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.error(`❌ File type not allowed: ${file.mimetype}`);
    cb(new Error("Only JPEG, JPG, PNG images and MP4, MOV videos are allowed"), false);
  }
};

// ✅ Initialize multer (Increased size limit to 100MB for videos)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
});

module.exports = upload;
