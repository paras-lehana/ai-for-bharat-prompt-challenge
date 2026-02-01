const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const SavedSearch = sequelize.define('SavedSearch', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    searchCriteria: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Stores crop, location, priceRange, quality, etc.'
    },
    notifyOnMatch: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastNotified: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'saved_searches',
    timestamps: true,
    underscored: true
  });

module.exports = SavedSearch;
