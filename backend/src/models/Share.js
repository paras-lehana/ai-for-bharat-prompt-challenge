const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Share = sequelize.define('Share', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  listing_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'listing_id',
    references: {
      model: 'listings',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  method: {
    type: DataTypes.ENUM('whatsapp', 'sms', 'email', 'copy_link', 'qr_code'),
    allowNull: false
  },
  shared_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'shared_at'
  }
}, {
  tableName: 'shares',
  timestamps: true,
  underscored: true
});

module.exports = Share;
