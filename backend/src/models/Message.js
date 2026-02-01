const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  threadId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  listingId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'listings', key: 'id' }
  },
  textContent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  audioData: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('images');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value));
    }
  },
  originalLanguage: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  translatedVersions: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('translatedVersions');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('translatedVersions', JSON.stringify(value));
    }
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'messages',
  indexes: [
    { fields: ['thread_id'] },
    { fields: ['sender_id'] },
    { fields: ['recipient_id'] },
    { fields: ['created_at'] }
  ]
});

module.exports = Message;
