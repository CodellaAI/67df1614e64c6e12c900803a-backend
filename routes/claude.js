
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const claudeService = require('../services/claudeService');

// Test Claude API connection
router.get('/test', auth, async (req, res) => {
  try {
    const response = await claudeService.testConnection();
    res.json({ message: 'Claude API connection successful', response });
  } catch (error) {
    console.error('Claude API test error:', error);
    res.status(500).json({ message: 'Claude API connection failed' });
  }
});

module.exports = router;
