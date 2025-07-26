const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
app.use("/uploads", express.static("uploads"));

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "PodVibe API is running...", status: "OK" });
});

// Test API routes
app.get("/api/test", (req, res) => {
  res.json({ message: "API test successful" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
