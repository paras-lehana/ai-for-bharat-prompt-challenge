const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Rating = sequelize.define('Rating', {
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
  buyerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  deliveryRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  qualityRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'ratings',
  indexes: [
    { fields: ['vendor_id'] },
    { fields: ['transaction_id'] }
  ]
});

module.exports = Rating;
