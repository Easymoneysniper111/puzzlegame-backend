const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const authMiddleware = require('../middleware/authMiddleware');

// Save score
router.post('/score', authMiddleware, async (req, res) => {
  const { puzzleId, score } = req.body;
  if (!puzzleId || score == null)
    return res.status(400).json({ message: 'Puzzle ID and score required' });

  try {
    const newScore = new Score({
      user: req.user.id,
      puzzleId,
      score
    });

    await newScore.save();
    res.status(201).json({ message: 'Score saved' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get scores by user
router.get('/scores/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId)
      return res.status(403).json({ message: 'Forbidden' });

    const scores = await Score.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(scores);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
