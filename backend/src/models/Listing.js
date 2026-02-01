/**
 * FILE: backend/src/models/Listing.js
 * 
 * PURPOSE: Product listing model
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const User = require('./User');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  cropType: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  qualityTier: {
    type: DataTypes.ENUM('premium', 'standard', 'basic'),
    allowNull: false
  },
  qualityMultiplier: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false
  },
  demandAdjuster: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false
  },
  finalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  locationLat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  locationLng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  locationAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  locationDistrict: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  locationState: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'unavailable'),
    defaultValue: 'active'
  }
}, {
  tableName: 'listings',
  indexes: [
    { fields: ['vendor_id'] },
    { fields: ['crop_type'] },
    { fields: ['status'] },
    { fields: ['location_lat', 'location_lng'] }
  ]
});

// Associations
Listing.belongsTo(User, { foreignKey: 'vendorId', as: 'vendor' });
User.hasMany(Listing, { foreignKey: 'vendorId', as: 'listings' });

module.exports = Listing;
