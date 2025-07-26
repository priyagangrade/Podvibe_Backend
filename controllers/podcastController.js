
const Podcast = require("../models/Podcast");
const Category = require("../models/category");
const User = require("../models/User");


const createPodcast = async (req, res) => {
  console.log("--- Create Podcast Request ---");
  console.log("User:", req.user?._id);
  console.log("Body:", req.body);
  console.log("Files:", req.files);
  console.log("--------------------------");

  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ message: "Title, description, and category are required" });
    }

    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(400).json({ message: "Category does not exist" });
    }

 
    let audioUrl = "";
    if (req.files?.audio?.[0]) {
      const audioPath = req.files.audio[0].path.replace(/\\/g, "/");
      audioUrl = `${req.protocol}://${req.get("host")}/${audioPath}`;
    }


    let imageUrl = "";
    if (req.files?.image?.[0]) {
      const imagePath = req.files.image[0].path.replace(/\\/g, "/");
      imageUrl = `${req.protocol}://${req.get("host")}/${imagePath}`;
    }

    const podcast = await Podcast.create({
      title,
      description,
      category: categoryDoc._id,
      createdBy: req.user._id,
      audioUrl,
      image: imageUrl,
    });

    const populatedPodcast = await Podcast.findById(podcast._id)
      .populate("category", "name")
      .populate("createdBy", "name email");

    res.status(201).json(populatedPodcast);
  } catch (error) {
    console.error("--- Create Podcast Error ---");
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getAllPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find()
      .populate("category", "name")
      .populate("createdBy", "name email");

    res.status(200).json(podcasts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getPodcastsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const podcasts = await Podcast.find({ category: categoryId })
      .populate("category", "name")
      .populate("createdBy", "name email");
    res.status(200).json(podcasts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching podcasts", error: error.message });
  }
};


const bookmarkPodcast = async (req, res) => {
  const podcastId = req.params.id;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.bookmarked.includes(podcastId)) {
    return res.status(400).json({ message: "Already bookmarked" });
  }

  user.bookmarked.push(podcastId);
  await user.save();

  res.status(200).json({ message: "Podcast bookmarked successfully" });
};


const removeBookmark = async (req, res) => {
  const podcastId = req.params.id;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.bookmarked = user.bookmarked.filter((p) => p.toString() !== podcastId);

  await user.save();
  res.status(200).json({ message: "Bookmark removed successfully" });
};


const getSinglePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "name email");

    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    res.status(200).json(podcast);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPodcast,
  getAllPodcasts,
  getSinglePodcast,
  bookmarkPodcast,
  removeBookmark,
  getPodcastsByCategory,
};












