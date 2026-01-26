const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { Message } = require('../models');
const { v4: uuidv4 } = require('uuid');

router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { recipientId, textContent, listingId, images } = req.body;

  const threadId = [req.user.id, recipientId].sort().join('-');

  const message = await Message.create({
    senderId: req.user.id,
    recipientId,
    threadId,
    listingId,
    textContent,
    images,
    originalLanguage: req.user.languagePreference
  });

  res.status(201).json(message);
}));

router.get('/thread/:userId/:recipientId', authenticateToken, asyncHandler(async (req, res) => {
  const threadId = [req.params.userId, req.params.recipientId].sort().join('-');

  const messages = await Message.findAll({
    where: { threadId },
    order: [['createdAt', 'ASC']]
  });

  res.json({ messages });
}));

router.put('/:id/read', authenticateToken, asyncHandler(async (req, res) => {
  const message = await Message.findByPk(req.params.id);
  await message.update({ readAt: new Date() });

  res.json({ message: 'Message marked as read' });
}));

module.exports = router;
