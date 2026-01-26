const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Evidence = sequelize.define('Evidence', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  disputeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'disputes', key: 'id' }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  evidenceType: {
    type: DataTypes.ENUM('text', 'image', 'message_log'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'evidence',
  indexes: [
    { fields: ['dispute_id'] }
  ]
});

module.exports = Evidence;
