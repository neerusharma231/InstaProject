const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    mongoose.connect(process.env.MONGO_URI);


    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    
    // Instead of exiting immediately, retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
