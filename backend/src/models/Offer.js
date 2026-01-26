const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Offer = sequelize.define('Offer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  negotiationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'negotiations', key: 'id' }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  reasoning: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  offerType: {
    type: DataTypes.ENUM('buyer_offer', 'vendor_counter', 'ai_suggestion'),
    allowNull: false
  }
}, {
  tableName: 'offers',
  indexes: [
    { fields: ['negotiation_id'] },
    { fields: ['created_at'] }
  ]
});

module.exports = Offer;
