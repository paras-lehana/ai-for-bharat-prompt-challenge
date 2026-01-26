const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const User = require('./User');
const Listing = require('./Listing');

const Negotiation = sequelize.define('Negotiation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
  status: {
    type: DataTypes.ENUM('active', 'accepted', 'rejected', 'expired'),
    defaultValue: 'active'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'negotiations',
  indexes: [
    { fields: ['listing_id'] },
    { fields: ['buyer_id'] },
    { fields: ['vendor_id'] },
    { fields: ['status'] },
    { fields: ['expires_at'] }
  ]
});

Negotiation.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });
Negotiation.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
Negotiation.belongsTo(User, { foreignKey: 'vendorId', as: 'vendor' });

module.exports = Negotiation;
