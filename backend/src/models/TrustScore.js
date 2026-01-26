const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const TrustScore = sequelize.define('TrustScore', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: { model: 'users', key: 'id' }
  },
  overallScore: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 5 }
  },
  deliveryScore: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 5 }
  },
  qualityScore: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 5 }
  },
  responseScore: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 5 }
  },
  fairPricingScore: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 5 }
  },
  transactionCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  badges: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('badges');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('badges', JSON.stringify(value));
    }
  }
}, {
  tableName: 'trust_scores',
  indexes: [
    { fields: ['vendor_id'] },
    { fields: ['overall_score'] }
  ]
});

module.exports = TrustScore;
