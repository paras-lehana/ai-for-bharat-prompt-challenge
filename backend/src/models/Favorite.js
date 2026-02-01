const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Favorite = sequelize.define('Favorite', {
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
    listingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Listings',
        key: 'id'
      }
    },
    notifyOnPriceChange: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    targetPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Alert when price drops to this level'
    }
  }, {
    tableName: 'favorites',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'listing_id']
      }
    ]
  });

module.exports = Favorite;
