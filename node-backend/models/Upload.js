const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  caption: { type: String, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes_count: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store user who liked
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Upload", UploadSchema);
