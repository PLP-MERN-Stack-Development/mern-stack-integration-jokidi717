const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// GET all posts
router.get('/', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// GET single post
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
});

// CREATE post (protected)
router.post('/', auth, async (req, res) => {
  const newPost = new Post({ ...req.body, author: req.user.id });
  await newPost.save();
  res.json(newPost);
});

// UPDATE post (protected)
router.put('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.author.toString() !== req.user.id)
    return res.status(403).json({ error: 'Unauthorized' });

  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

// DELETE post (protected)
router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.author.toString() !== req.user.id)
    return res.status(403).json({ error: 'Unauthorized' });

  await post.deleteOne();
  res.json({ message: 'Post deleted' });
});

module.exports = router;
