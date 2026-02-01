const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const CommunityComment = sequelize.define('CommunityComment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'community_posts',
      key: 'id'
    }
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isAcceptedAnswer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'community_comments',
  underscored: true,
  timestamps: true
});

// Define associations
CommunityComment.associate = (models) => {
  CommunityComment.belongsTo(models.User, {
    foreignKey: 'authorId',
    as: 'author'
  });
  CommunityComment.belongsTo(models.CommunityPost, {
    foreignKey: 'postId',
    as: 'post'
  });
};

module.exports = CommunityComment;
