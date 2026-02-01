const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const PriceAlert = sequelize.define('PriceAlert', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    cropType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type of crop to monitor (e.g., wheat, rice, maize)'
    },
    targetPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Price threshold for alert'
    },
    alertType: {
      type: DataTypes.ENUM('below', 'above'),
      allowNull: false,
      comment: 'Alert when price drops below or rises above target'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether alert is currently active'
    },
    lastTriggered: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last time this alert was triggered'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Optional location filter for regional prices'
    },
    notificationMethod: {
      type: DataTypes.ENUM('sms', 'push', 'both', 'in-app'),
      defaultValue: 'in-app',
      comment: 'How to deliver the notification'
    }
  }, {
    tableName: 'price_alerts',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id', 'crop_type']
      },
      {
        fields: ['is_active']
      }
    ]
  });

module.exports = PriceAlert;
