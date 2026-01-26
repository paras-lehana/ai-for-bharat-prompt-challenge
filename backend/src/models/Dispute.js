const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Dispute = sequelize.define('Dispute', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transactionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'transactions', key: 'id' }
  },
  initiatorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  respondentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  status: {
    type: DataTypes.ENUM('pending', 'analyzing', 'resolved', 'escalated'),
    defaultValue: 'pending'
  },
  reason: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  resolutionType: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  resolutionReasoning: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'disputes',
  indexes: [
    { fields: ['transaction_id'] },
    { fields: ['status'] }
  ]
});

module.exports = Dispute;
