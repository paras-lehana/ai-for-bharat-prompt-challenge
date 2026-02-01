const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const CommunityPost = sequelize.define('CommunityPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    // Categories: tips, question, success-story, news, general
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  images: {
    type: DataTypes.TEXT, // JSON array
    allowNull: true
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isResolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'community_posts',
  underscored: true,
  timestamps: true
});

// Define associations
CommunityPost.associate = (models) => {
  CommunityPost.belongsTo(models.User, {
    foreignKey: 'authorId',
    as: 'author'
  });
};

module.exports = CommunityPost;
