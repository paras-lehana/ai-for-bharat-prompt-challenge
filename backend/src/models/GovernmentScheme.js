/**
 * FILE: backend/src/models/GovernmentScheme.js
 * 
 * PURPOSE: Government agricultural schemes model
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const GovernmentScheme = sequelize.define('GovernmentScheme', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false // e.g., Insurance, Credit, Subsidies, etc.
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  eligibility: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  applicationProcess: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  officialUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    defaultValue: 'Central'
  },
  status: {
    type: DataTypes.ENUM('active', 'closed'),
    defaultValue: 'active'
  }
}, {
  tableName: 'government_schemes'
});

module.exports = GovernmentScheme;
