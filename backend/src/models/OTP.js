/**
 * FILE: backend/src/models/OTP.js
 * 
 * PURPOSE: OTP storage for phone verification
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const OTP = sequelize.define('OTP', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  phoneNumber: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  otpCode: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'otps',
  indexes: [
    { fields: ['phone_number'] },
    { fields: ['expires_at'] }
  ]
});

module.exports = OTP;
