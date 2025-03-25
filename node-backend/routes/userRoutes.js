const express = require("express");
const { registerUser, loginUser, getUserDetails, updateUserProfile } = require("../controllers/userController");
const upload = require("../middleware/profileUpload"); // ✅ Import the upload middleware

const router = express.Router();

router.post("/register", registerUser);  
router.post("/login", loginUser);
router.get("/profile/:userId", getUserDetails);

// ✅ Use upload middleware before updateUserProfile
router.put("/profile/:userId", upload.single("profilePicture"), updateUserProfile);  

module.exports = router;
