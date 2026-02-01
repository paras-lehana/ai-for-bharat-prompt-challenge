/**
 * FILE: backend/src/services/MessagingService.js
 * 
 * PURPOSE: Real-time messaging service with translation support
 * 
 * KEY FUNCTIONS:
 *  - sendMessage() → Send message with automatic translation
 *  - getThread() → Get message thread between users
 *  - markAsRead() → Mark messages as read
 *  - getUnreadCount() → Get unread message count
 * 
 * INTEGRATION POINTS:
 *  - Called by: /api/messages routes
 *  - Depends on: Message, User models, TranslationService
 */

const { Message, User, Listing } = require('../models');
const { Op } = require('sequelize');
const TranslationService = require('./TranslationService');
const { createError } = require('../middleware/errorHandler');

class MessagingService {
  /**
   * Send a message with automatic translation
   * 
   * @param {string} senderId - Sender user ID
   * @param {string} recipientId - Recipient user ID
   * @param {string} content - Message content
   * @param {string} listingId - Related listing ID (optional)
   * @param {string} messageType - Type: text, image, voice (default: text)
   * @param {Array} attachments - File attachments (optional)
   * @returns {Promise<Object>} - Created message
   */
  async sendMessage(senderId, recipientId, content, listingId = null, messageType = 'text', attachments = []) {
    try {
      // Get sender and recipient
      const sender = await User.findByPk(senderId);
      const recipient = await User.findByPk(recipientId);

      if (!sender || !recipient) {
        throw createError('Sender or recipient not found', 404);
      }

      // Check rate limiting for new users (10 messages per hour)
      if (sender.trustScore < 3.0) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentMessages = await Message.count({
          where: {
            senderId,
            createdAt: { [Op.gte]: oneHourAgo }
          }
        });

        if (recentMessages >= 10) {
          throw createError('Message rate limit exceeded. Please try again later.', 429);
        }
      }

      // Translate message if languages differ
      let translatedContent = content;
      if (sender.languagePreference !== recipient.languagePreference && messageType === 'text') {
        translatedContent = await TranslationService.translateText(
          content,
          sender.languagePreference,
          recipient.languagePreference
        );
      }

      // Create message
      const message = await Message.create({
        senderId,
        recipientId,
        listingId,
        content,
        translatedContent,
        messageType,
        attachments: JSON.stringify(attachments),
        isRead: false
      });

      // TODO: Send push notification to recipient if online
      // TODO: Queue for offline delivery if recipient is offline

      return {
        message: await this.getMessageWithDetails(message.id),
        success: true
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error sending message:', error);
      throw createError('Failed to send message', 500);
    }
  }

  /**
   * Get message thread between two users
   * 
   * @param {string} userId1 - First user ID
   * @param {string} userId2 - Second user ID
   * @param {string} listingId - Filter by listing (optional)
   * @param {number} limit - Number of messages to return (default: 50)
   * @param {number} offset - Offset for pagination (default: 0)
   * @returns {Promise<Array>} - Array of messages
   */
  async getThread(userId1, userId2, listingId = null, limit = 50, offset = 0) {
    try {
      const where = {
        [Op.or]: [
          { senderId: userId1, recipientId: userId2 },
          { senderId: userId2, recipientId: userId1 }
        ]
      };

      if (listingId) {
        where.listingId = listingId;
      }

      const messages = await Message.findAll({
        where,
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name', 'role', 'languagePreference']
          },
          {
            model: User,
            as: 'recipient',
            attributes: ['id', 'name', 'role', 'languagePreference']
          },
          {
            model: Listing,
            as: 'listing',
            attributes: ['id', 'cropType', 'finalPrice'],
            required: false
          }
        ],
        order: [['createdAt', 'ASC']],
        limit,
        offset
      });

      return messages;
    } catch (error) {
      console.error('Error getting message thread:', error);
      throw createError('Failed to get message thread', 500);
    }
  }

  /**
   * Get message with full details
   * @private
   */
  async getMessageWithDetails(messageId) {
    return await Message.findByPk(messageId, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'role']
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'name', 'role']
        }
      ]
    });
  }

  /**
   * Mark message(s) as read
   * 
   * @param {string} messageId - Message ID or array of IDs
   * @param {string} userId - User ID (must be recipient)
   * @returns {Promise<Object>} - Update result
   */
  async markAsRead(messageId, userId) {
    try {
      const messageIds = Array.isArray(messageId) ? messageId : [messageId];

      const [updated] = await Message.update(
        { isRead: true, readAt: new Date() },
        {
          where: {
            id: { [Op.in]: messageIds },
            recipientId: userId,
            isRead: false
          }
        }
      );

      return {
        success: true,
        messagesMarked: updated
      };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw createError('Failed to mark messages as read', 500);
    }
  }

  /**
   * Get unread message count for a user
   * 
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Unread count
   */
  async getUnreadCount(userId) {
    try {
      return await Message.count({
        where: {
          recipientId: userId,
          isRead: false
        }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Get all conversations for a user
   * Returns list of users they've messaged with and last message
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of conversations
   */
  async getConversations(userId) {
    try {
      // Get all messages where user is sender or recipient
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: userId },
            { recipientId: userId }
          ]
        },
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name', 'role']
          },
          {
            model: User,
            as: 'recipient',
            attributes: ['id', 'name', 'role']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      // Group by conversation partner
      const conversationsMap = new Map();
      
      for (const message of messages) {
        const partnerId = message.senderId === userId ? message.recipientId : message.senderId;
        
        if (!conversationsMap.has(partnerId)) {
          conversationsMap.set(partnerId, {
            partnerId,
            partnerName: message.senderId === userId ? message.recipient.name : message.sender.name,
            partnerRole: message.senderId === userId ? message.recipient.role : message.sender.role,
            lastMessage: message.content,
            lastMessageAt: message.createdAt,
            unreadCount: 0
          });
        }
      }

      // Count unread messages for each conversation
      for (const [partnerId, conversation] of conversationsMap) {
        const unread = await Message.count({
          where: {
            senderId: partnerId,
            recipientId: userId,
            isRead: false
          }
        });
        conversation.unreadCount = unread;
      }

      return Array.from(conversationsMap.values());
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw createError('Failed to get conversations', 500);
    }
  }

  /**
   * Delete message (soft delete - mark as deleted)
   * 
   * @param {string} messageId - Message ID
   * @param {string} userId - User ID (must be sender)
   * @returns {Promise<Object>} - Delete result
   */
  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findByPk(messageId);

      if (!message) {
        throw createError('Message not found', 404);
      }

      if (message.senderId !== userId) {
        throw createError('Unauthorized to delete this message', 403);
      }

      // Soft delete - mark as deleted
      await message.update({ isDeleted: true });

      return {
        success: true,
        message: 'Message deleted successfully'
      };
    } catch (error) {
      if (error.statusCode) throw error;
      console.error('Error deleting message:', error);
      throw createError('Failed to delete message', 500);
    }
  }

  /**
   * Search messages by content
   * 
   * @param {string} userId - User ID
   * @param {string} searchQuery - Search query
   * @returns {Promise<Array>} - Matching messages
   */
  async searchMessages(userId, searchQuery) {
    try {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: userId },
            { recipientId: userId }
          ],
          [Op.or]: [
            { content: { [Op.like]: `%${searchQuery}%` } },
            { translatedContent: { [Op.like]: `%${searchQuery}%` } }
          ]
        },
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'name']
          },
          {
            model: User,
            as: 'recipient',
            attributes: ['id', 'name']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 50
      });

      return messages;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw createError('Failed to search messages', 500);
    }
  }
}

module.exports = new MessagingService();
