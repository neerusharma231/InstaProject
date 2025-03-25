require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/connectDB");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const commentRoutes = require("./routes/commentRoutes");
const app = express();

// ✅ Ensure 'uploads' directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ CORS Configuration
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"]; // Added Vite port
app.use(cors({
  origin: function (origin, callback) {
    console.log("Origin requesting access:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
connectDB();

// ✅ Register Routes
app.use("/api/users", userRoutes);
app.use("/api/uploads", uploadRoutes);
// ✅ Serve Uploaded Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/comments", commentRoutes);
// ✅ Handle Undefined Routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global Error Handler - Improved Debugging
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// ✅ Improved Route Logging
console.log("✅ Registered Routes:");
app._router.stack.forEach((layer) => {
    if (layer.route) {
        console.log(`➡️ ${Object.keys(layer.route.methods).join(", ").toUpperCase()} ${layer.route.path}`);
    } else if (layer.name === "router") {
        layer.handle.stack.forEach((subLayer) => {
            if (subLayer.route) {
                console.log(`➡️ ${Object.keys(subLayer.route.methods).join(", ").toUpperCase()} ${subLayer.route.path}`);
            }
        });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  process.exit(0);
});
