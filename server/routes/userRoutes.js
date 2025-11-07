const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add skill
router.post('/skills', auth, async (req, res) => {
  try {
    const { type, title, description, category } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newSkill = {
      title,
      description,
      category
    };

    if (type === 'offered') {
      user.skillsOffered.push(newSkill);
    } else if (type === 'wanted') {
      user.skillsWanted.push(newSkill);
    } else {
      return res.status(400).json({ error: 'Invalid skill type' });
    }

    await user.save();

    res.status(201).json({ message: 'Skill added successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete skill
router.delete('/skills/:skillId', auth, async (req, res) => {
  try {
    const { skillId } = req.params;
    const { type } = req.query;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (type === 'offered') {
      user.skillsOffered = user.skillsOffered.filter(
        skill => skill._id.toString() !== skillId
      );
    } else if (type === 'wanted') {
      user.skillsWanted = user.skillsWanted.filter(
        skill => skill._id.toString() !== skillId
      );
    } else {
      return res.status(400).json({ error: 'Invalid skill type' });
    }

    await user.save();

    res.json({ message: 'Skill deleted successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;