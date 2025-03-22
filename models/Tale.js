
const mongoose = require('mongoose');

const TaleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  childAge: {
    type: String,
    required: true,
    enum: ['3-4', '5-8', '9-12']
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  setting: {
    type: String,
    trim: true
  },
  characters: {
    type: String,
    trim: true
  },
  mood: {
    type: String,
    enum: ['happy', 'adventurous', 'educational', 'calming'],
    default: 'happy'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for likes count
TaleSchema.virtual('likes').get(function() {
  return this.likedBy.length;
});

// Include virtuals when converting to JSON
TaleSchema.set('toJSON', { virtuals: true });
TaleSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Tale', TaleSchema);
