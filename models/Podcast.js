const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: { 
    type: String,
    required: true,
  },
  audioUrl: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

const Podcast = mongoose.model('Podcast', podcastSchema);
module.exports = Podcast;







