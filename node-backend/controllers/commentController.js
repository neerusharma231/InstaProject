const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body); // Debugging Log

        const { userId, commentText } = req.body;

        if (!userId || !commentText) {
            return res.status(400).json({ message: "User ID and comment are required" });
        }

        const newComment = new Comment({
            userId,
            commentText
        });

        await newComment.save();
        res.status(201).json({ message: "Comment added successfully", comment: newComment });

    } catch (error) {
        console.error("❌ Error Adding Comment:", error); // Log Full Error
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate("userId", "name profilePicture"); 
        res.status(200).json(comments);
    } catch (error) {
        console.error("❌ Error Fetching Comments:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
