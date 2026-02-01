const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { Op } = require('sequelize');
const { Message, User } = require('../models');
const { v4: uuidv4 } = require('uuid');

router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { recipientId, textContent, listingId, images, audioData } = req.body;

  const threadId = [req.user.id, recipientId].sort().join('-');

  const message = await Message.create({
    senderId: req.user.id,
    recipientId,
    threadId,
    listingId,
    textContent,
    audioData,
    images,
    originalLanguage: req.user.languagePreference
  });

  res.status(201).json(message);
}));

router.get('/conversations', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  // Get all messages involving user
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { senderId: userId },
        { recipientId: userId }
      ]
    },
    order: [['createdAt', 'DESC']]
  });
  
  // Group by threadId to find latest message
  const threadMap = new Map();
  messages.forEach(msg => {
    if (!threadMap.has(msg.threadId)) {
      threadMap.set(msg.threadId, msg);
    }
  });
  
  const result = [];
  for (const [threadId, lastMsg] of threadMap) {
    const otherUserId = lastMsg.senderId === userId ? lastMsg.recipientId : lastMsg.senderId;
    const otherUser = await User.findByPk(otherUserId, { attributes: ['id', 'name'] });
    
    // Count unread messages
    const unreadCount = await Message.count({
      where: {
        threadId,
        recipientId: userId,
        readAt: null
      }
    });

    result.push({
      userId: otherUserId,
      userName: otherUser ? otherUser.name : 'Unknown User',
      lastMessage: lastMsg.textContent || (lastMsg.audioData ? '🎤 Voice Message' : (lastMsg.images ? '📷 Image' : 'Message')),
      lastMessageAt: lastMsg.createdAt,
      unreadCount
    });
  }
  
  res.json(result);
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
