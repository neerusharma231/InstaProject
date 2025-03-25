const Upload = require("../models/Upload");
// ✅ Upload File Controller
const uploadFile = async (req, res) => {
    try {
        console.log("REQ.USER:", req.user);
        console.log("REQ.PARAMS:", req.params);
        console.log("REQ.FILE:", req.file); // ✅ Debugging uploaded file

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const userId = req.user?.id || req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const { caption } = req.body;
        const filePath = `/uploads/${req.file.filename}`;
        const fileType = req.file.mimetype.startsWith("image") ? "image" : "video";

        const newUpload = new Upload({
            filename: req.file.filename,
            filePath,
            fileType,
            caption,
            userId,
            likes: [],
            likes_count: 0 
        });

        await newUpload.save();
        res.status(201).json({ message: "File uploaded successfully", upload: newUpload });

    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).json({ message: "Error uploading file", error: error.message });
    }
};

// ✅ Get All Uploaded Files
const getAllUploads = async (req, res) => {
    const { userId } = req.query; // User ID from frontend
  
    try {
      const posts = await Upload.find().sort({ createdAt: -1 });
  
      const updatedPosts = posts.map(post => {
        const isLiked = post.likes.includes(userId); // ✅ Check if the user already liked the post
        return {
          ...post.toObject(),
          isLiked: isLiked, // ✅ Send this to the frontend
        };
      });
  
      res.status(200).json(updatedPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching posts" });
    }
  };
  
  const likePost = async (req, res) => {
    const { id } = req.params; // Post ID
    const { userId } = req.body; // User ID

    // ✅ Ensure userId is provided
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const post = await Upload.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }

        const isLiked = post.likes.some((like) => like?.toString() === userId.toString());

        if (isLiked) {
            post.likes = post.likes.filter((like) => like && like.toString() !== userId.toString());
            post.likes_count = Math.max(0, post.likes_count - 1);
        } else {
            post.likes.push(userId);
            post.likes_count += 1;
        }

        post.markModified("likes");
        await post.save();

        res.status(200).json({
            message: isLiked ? "Post Unliked" : "Post Liked",
            likes_count: post.likes_count,
            likes: post.likes,
        });

    } catch (error) {
        console.error("❌ Error in likePost:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = { uploadFile, getAllUploads,likePost  };
