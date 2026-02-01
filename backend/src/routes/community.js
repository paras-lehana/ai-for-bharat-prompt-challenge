const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const CommunityComment = require('../models/CommunityComment');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Get all posts with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = category ? { category } : {};

    const posts = await CommunityPost.findAll({
      where,
      order: [
        ['isPinned', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Manually fetch authors
    const postsWithAuthors = await Promise.all(posts.map(async (post) => {
      const author = await User.findByPk(post.authorId, {
        attributes: ['id', 'name', 'role']
     });
      return {
        ...post.toJSON(),
        author
      };
    }));

    const total = await CommunityPost.count({ where });

    res.json({
      posts: postsWithAuthors,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post with comments
router.get('/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    await post.increment('viewCount');

    // Fetch post author
    const author = await User.findByPk(post.authorId, {
      attributes: ['id', 'name', 'role']
    });

    //Get comments
    const commentsData = await CommunityComment.findAll({
      where: { postId: req.params.id },
      order: [['createdAt', 'ASC']]
    });

    // Fetch comment authors
    const comments = await Promise.all(commentsData.map(async (comment) => {
      const commentAuthor = await User.findByPk(comment.authorId, {
        attributes: ['id', 'name', 'role']
      });
      return {
        ...comment.toJSON(),
        author: commentAuthor
      };
    }));

    res.json({ 
      post: {
        ...post.toJSON(),
        author
      }, 
      comments 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { category, title, content, images } = req.body;

    const post = await CommunityPost.create({
      authorId: req.user.id,
      category,
      title,
      content,
      images: images ? JSON.stringify(images) : null
    });

    const author = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'role']
    });

    res.status(201).json({
      ...post.toJSON(),
      author
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await CommunityComment.create({
      postId: req.params.id,
      authorId: req.user.id,
      content
    });

    const author = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'role']
    });

    res.status(201).json({
      ...comment.toJSON(),
      author
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await CommunityPost.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.increment('likes');
    res.json({ likes: post.likes + 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
