const express = require('express');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const router = express.Router();

// Configure multer to handle file uploads
const upload = multer({ dest: 'uploads/' });
const secret = process.env.JWT_SECRET;

// Create Post
router.post('/', upload.single('file'), async (req, res) => {
  // Check if file is attached
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  const { token } = req.cookies;
  const { title, summary, content } = req.body;
  const { originalname, path } = req.file;

  // Process file extension
  const ext = originalname.split('.').pop();
  const newPath = `${path}.${ext}`;
  fs.renameSync(path, newPath);

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    // Create post
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json(postDoc);
  });
});

// Get All Posts
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20);
  res.json(posts);
});

// Get Post by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

module.exports = router;
