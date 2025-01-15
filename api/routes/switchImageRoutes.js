const express = require('express');
const multer = require('multer');
const fs = require('fs');
const SwitchImage = require('../models/SwitchImage');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Add Images for a Switch
router.post('/:id', upload.array('images', 10), async (req, res) => {
  const { id } = req.params;
  const images = req.files.map(file => {
    const ext = file.originalname.split('.').pop();
    const newPath = `${file.path}.${ext}`;
    fs.renameSync(file.path, newPath);
    return { switch_id: id, image_url: newPath };
  });

  const createdImages = await SwitchImage.insertMany(images);
  res.json(createdImages);
});

// Get Images for a Switch
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const images = await SwitchImage.find({ switch_id: id });
  res.json(images);
});

module.exports = router;
