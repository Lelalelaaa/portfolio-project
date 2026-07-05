// messages.js
// This file handles the contact form messages.
// When someone fills out the "Get In Touch" form, the message gets saved here.
//
// Routes:
//   GET  /api/messages  = get all messages (shown in Admin page)
//   POST /api/messages  = save a new message (sent from the contact form)

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages — newest first (used in the Admin dashboard)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Save a new contact message from the homepage form
// Expected data: { name, email, subject, message }
router.post('/', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const message = await newMessage.save();
    res.status(201).json({ msg: 'Message sent successfully', message });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: 'Failed to send message', details: err.message });
  }
});

module.exports = router;
