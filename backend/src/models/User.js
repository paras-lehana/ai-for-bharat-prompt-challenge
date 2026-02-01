/**
 * FILE: backend/src/models/User.js
 * 
 * PURPOSE: User database model
 * 
 * SCHEMA:
 *  - id (UUID, primary key)
 *  - phoneNumber (unique, required)
 *  - role (vendor/buyer)
 *  - languagePreference
 *  - name, location details
 *  - timestamps
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  phoneNumber: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
    validate: {
      is: /^\+91[6-9]\d{9}$/
    }
  },
  role: {
    type: DataTypes.ENUM('vendor', 'buyer'),
    allowNull: false
  },
  languagePreference: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'hi',
    validate: {
      isIn: [['en', 'hi', 'mr', 'ta', 'te', 'kn', 'gu', 'pa', 'bn']]
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  locationLat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  locationLng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
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
  enamDataSync: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Opt-in for eNAM data synchronization'
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['phone_number'] },
    { fields: ['role'] }
  ]
});

module.exports = User;
