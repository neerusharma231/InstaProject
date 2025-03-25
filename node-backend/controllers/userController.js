const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// ✅ **User Registration**
const registerUser = async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);
    const { email, password, fullName, userName, dateOfBirth } = req.body;

    if (!email || !password || !fullName || !userName || !dateOfBirth) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Validate JWT Secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT Secret is missing in environment variables" });
    }

    // ✅ Validate & Convert Date
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    if (!isValidDate.test(dateOfBirth)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // ✅ Hash Password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({ message: "Error hashing password", error: error.message });
    }

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      userName,
      dateOfBirth: birthDate,
    });

    await newUser.save();

    // ✅ Generate JWT Token
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id, 
        fullName: newUser.fullName,
        userName: newUser.userName,
        email: newUser.email,
        dateOfBirth: newUser.dateOfBirth,
      },
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const loginUser = async (req, res) => {
  try {
    console.log("Login Request Body:", req.body);

    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: "Email/Username and password are required" });
    }

    // Find user by email OR username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { userName: emailOrUsername }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email/username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email/username or password" });
    }

    // JWT secret must be set in .env
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT Secret is missing in environment variables" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email, fullName: user.fullName, userName: user.userName },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get User Details by ID
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ✅ Find user in DB
    const user = await User.findById(userId).select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, userName, bio, gender, password } = req.body;

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Debugging: Log file details
    console.log("File Upload Debug:", req.file);

    // ✅ Set the correct profile picture path
    let profilePicture = req.file ? `/uploads/profile_pictures/${req.file.filename}` : user.profilePicture;

    // ✅ Update user fields if provided
    if (fullName) user.fullName = fullName;
    if (userName) user.userName = userName;
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = profilePicture;
    if (password) user.password = await bcrypt.hash(password, 10); 

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        bio: user.bio,
        gender: user.gender,
        profilePicture: user.profilePicture, // ✅ Return correct path
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ **Export Functions**
module.exports = { registerUser, loginUser, getUserDetails, updateUserProfile   };
