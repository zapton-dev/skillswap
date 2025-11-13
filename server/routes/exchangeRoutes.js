const express = require('express');
const router = express.Router();
const Exchange = require('../models/Exchange');
const User = require('../models/User');
const auth = require('../middleware/auth');


router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } })
      .select('-password')
      .limit(20);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/request', auth, async (req, res) => {
  try {
    const { toUserId, fromUserSkill, toUserSkill } = req.body;

    const exchange = new Exchange({
      fromUser: req.userId,
      toUser: toUserId,
      fromUserSkill,
      toUserSkill,
      status: 'pending'
    });

    await exchange.save();

    res.status(201).json({ message: 'Request sent successfully', exchange });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/requests', auth, async (req, res) => {
  try {
    const sentRequests = await Exchange.find({ fromUser: req.userId })
      .populate('toUser', 'name email')
      .sort('-createdAt');

    const receivedRequests = await Exchange.find({ toUser: req.userId })
      .populate('fromUser', 'name email')
      .sort('-createdAt');

    res.json({ sent: sentRequests, received: receivedRequests });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.patch('/request/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (exchange.toUser.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    exchange.status = status;
    await exchange.save();

    res.json({ message: 'Request updated', exchange });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
