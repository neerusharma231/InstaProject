const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    bio: { type: String, default: "" },  // 🆕 Add Bio Field
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" }, // 🆕 Add Gender Field
    profilePicture: { type: String, default: "" }, // 🆕 Add Profile Picture
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
