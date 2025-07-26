const User = require("../models/User.js");
const Podcast = require("../models/Podcast.js");
const jwt = require("jsonwebtoken");
const admin = require("../middleware/firebaseAdmin.js");


const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Signup Controller
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const createdUser = await User.create({ name, email, password });

  if (createdUser) {
    res.status(201).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      token: generateToken(createdUser._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Signin Controller
const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// Logout Controller
const signout = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};


const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const bookmarkPodcast = async (req, res) => {
  const podcastId = req.params.id;
  const user = await User.findById(req.user._id);

  if (!user.bookmarked.includes(podcastId)) {
    user.bookmarked.push(podcastId);
    await user.save();
    res.status(200).json({ message: "Podcast bookmarked" });
  } else {
    res.status(400).json({ message: "Already bookmarked" });
  }
};


const unbookmarkPodcast = async (req, res) => {
  const podcastId = req.params.id;
  const user = await User.findById(req.user._id);

  user.bookmarked = user.bookmarked.filter((id) => id.toString() !== podcastId);
  await user.save();

  res.status(200).json({ message: "Bookmark removed" });
};


const getBookmarkedPodcasts = async (req, res) => {
  const user = await User.findById(req.user._id).populate("bookmarked");
  res.status(200).json(user.bookmarked);
};


const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    //  Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture, uid: googleId } = decodedToken;

    //  Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        password: "googleuser", // fallback password
      });
    }

    //  Return same structure as signin
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Google Login Error:", error.message);
    res.status(500).json({ message: "Google login failed. Please try again." });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.file) {
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signup,
  signin,
  signout,
  getUserProfile,
  bookmarkPodcast,
  unbookmarkPodcast,
  getBookmarkedPodcasts,
  googleLogin,
  updateUserProfile,
};
