
const express = require('express');
const router = express.Router();
const Tale = require('../models/Tale');
const auth = require('../middleware/auth');
const claudeService = require('../services/claudeService');

// Get all public tales
router.get('/public', async (req, res) => {
  try {
    const tales = await Tale.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate('author', 'name')
      .exec();
    
    // If user is authenticated, check which tales they've liked
    let userId = null;
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      }
    } catch (err) {
      // Ignore token errors, just don't mark any tales as liked
    }

    const talesWithLikeStatus = tales.map(tale => {
      const taleObj = tale.toObject();
      taleObj.isLiked = userId ? tale.likedBy.includes(userId) : false;
      return taleObj;
    });

    res.json(talesWithLikeStatus);
  } catch (error) {
    console.error('Error fetching public tales:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's tales
router.get('/user', auth, async (req, res) => {
  try {
    const tales = await Tale.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .exec();
    
    res.json(tales);
  } catch (error) {
    console.error('Error fetching user tales:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate a tale using Claude AI
router.post('/generate', auth, async (req, res) => {
  try {
    const { childAge, topic, setting, characters, mood, isPublic } = req.body;
    
    // Generate tale using Claude service
    const generatedTale = await claudeService.generateTale({
      childAge,
      topic,
      setting,
      characters,
      mood
    });
    
    if (!generatedTale) {
      return res.status(500).json({ message: 'Failed to generate tale' });
    }
    
    res.json({
      title: generatedTale.title,
      content: generatedTale.content,
      childAge,
      topic,
      setting: setting || '',
      characters: characters || '',
      mood,
      author: req.user.id
    });
  } catch (error) {
    console.error('Error generating tale:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new tale
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, childAge, topic, setting, characters, mood, isPublic } = req.body;
    
    const tale = new Tale({
      title,
      content,
      childAge,
      topic,
      setting: setting || '',
      characters: characters || '',
      mood,
      isPublic: isPublic || false,
      author: req.user.id
    });
    
    await tale.save();
    
    res.status(201).json(tale);
  } catch (error) {
    console.error('Error creating tale:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a tale
router.patch('/:id', auth, async (req, res) => {
  try {
    const { isPublic } = req.body;
    
    const tale = await Tale.findById(req.params.id);
    
    if (!tale) {
      return res.status(404).json({ message: 'Tale not found' });
    }
    
    // Check ownership
    if (tale.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this tale' });
    }
    
    // Update only allowed fields
    if (isPublic !== undefined) {
      tale.isPublic = isPublic;
    }
    
    await tale.save();
    
    res.json(tale);
  } catch (error) {
    console.error('Error updating tale:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a tale
router.delete('/:id', auth, async (req, res) => {
  try {
    const tale = await Tale.findById(req.params.id);
    
    if (!tale) {
      return res.status(404).json({ message: 'Tale not found' });
    }
    
    // Check ownership
    if (tale.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this tale' });
    }
    
    await tale.remove();
    
    res.json({ message: 'Tale deleted' });
  } catch (error) {
    console.error('Error deleting tale:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/unlike a tale
router.post('/:id/like', auth, async (req, res) => {
  try {
    const tale = await Tale.findById(req.params.id);
    
    if (!tale) {
      return res.status(404).json({ message: 'Tale not found' });
    }
    
    // Check if tale is already liked by user
    const isLiked = tale.likedBy.includes(req.user.id);
    
    if (isLiked) {
      // Unlike
      tale.likedBy = tale.likedBy.filter(id => id.toString() !== req.user.id);
    } else {
      // Like
      tale.likedBy.push(req.user.id);
    }
    
    await tale.save();
    
    res.json({ 
      likes: tale.likedBy.length,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error('Error liking tale:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
