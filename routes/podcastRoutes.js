

const express = require("express");
const router = express.Router();

const {
  createPodcast,
  getAllPodcasts,
  getSinglePodcast,
  bookmarkPodcast,
  removeBookmark,
  getPodcastsByCategory,
} = require("../controllers/podcastController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");


router.post(
  "/",
  protect,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createPodcast
);


router.get("/", getAllPodcasts);


router.get("/category/:categoryId", getPodcastsByCategory);


router.get("/:id", getSinglePodcast);


router.post("/:id/bookmark", protect, bookmarkPodcast);


router.delete("/:id/bookmark", protect, removeBookmark);

module.exports = router;






