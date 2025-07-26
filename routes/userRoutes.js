const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  signup,
  signin,
  signout,
  getUserProfile,
  getBookmarkedPodcasts,
  googleLogin,
  updateUserProfile,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");


const storage = multer.diskStorage({
  destination: "uploads/avatars/",
  filename: (req, file, cb) => {
    cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });


router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("avatar"), updateUserProfile);

router.get("/bookmarks", protect, getBookmarkedPodcasts);
router.post("/google-login", googleLogin);

module.exports = router;
