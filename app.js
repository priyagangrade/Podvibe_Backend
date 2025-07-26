const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");


dotenv.config();

const app = express();


connectDB();


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith("http://localhost:")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/podcasts", require("./routes/podcastRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));


app.get("/", (req, res) => {
  res.json({ message: "🎧 PodVibe API is live!" });
});


app.use("*", (req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});


app.use((err, req, res, next) => {
  let msg = "Something went wrong!";
  if (err.name === "ValidationError") msg = "Validation Error";
  if (err.name === "CastError") msg = "Invalid ID format";

  res.status(err.status || 500).json({ success: false, message: msg });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
