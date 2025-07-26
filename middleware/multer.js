


const multer = require("multer");
const path = require("path");

// Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only audio and image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
