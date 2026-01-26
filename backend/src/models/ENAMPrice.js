const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const ENAMPrice = sequelize.define('ENAMPrice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cropType: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  mandiName: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  mandiLocation: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  modalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  minPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  maxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fetchedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'enam_prices',
  indexes: [
    { fields: ['crop_type'] },
    { fields: ['mandi_location'] },
    { fields: ['expires_at'] }
  ]
});

module.exports = ENAMPrice;
