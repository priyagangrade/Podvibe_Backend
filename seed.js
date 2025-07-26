const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const Category = require("./models/category");

// Load env vars from Backend/.env
dotenv.config({ path: path.resolve(__dirname, ".env") });

const categories = [
  "Technology",
  "Comedy",
  "News & Politics",
  "Business",
  "Education",
  "Arts",
  "Health & Fitness",
  "Music",
  "Science",
  "True Crime",
  "Sports",
  "History",
];

const seedCategories = async () => {
  // db.js handles connection and logging.
  await connectDB();

  try {
    console.log("Seeding categories...");

    for (const categoryName of categories) {
      await Category.findOneAndUpdate(
        { name: categoryName },
        { name: categoryName },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log("✅ Categories seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding categories:", error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
};

seedCategories();
