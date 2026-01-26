const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Transaction = sequelize.define('Transaction', {
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
  listingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'listings', key: 'id' }
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
  agreedPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'in_transit', 'delivered', 'disputed'),
    defaultValue: 'pending'
  },
  deliveryTerms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  confirmedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'transactions',
  indexes: [
    { fields: ['buyer_id'] },
    { fields: ['vendor_id'] },
    { fields: ['status'] }
  ]
});

module.exports = Transaction;
