const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Switch = require('../models/Switch');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get All Switches
router.get('/', async (req, res) => {
  const switches = await Switch.find().sort({ createdAt: -1 });
  res.json(switches);
});

// Get Switch by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const switchDoc = await Switch.findById(id);
  res.json(switchDoc);
});

// Create Switch with Additional Files
router.post('/', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'threeDModel', maxCount: 1 },
    { name: 'forceGraph', maxCount: 1 },
  ]), async (req, res) => {
    try {
      const {
        name,
        type,
        profile,
        mount,
        pins,
        lubricated,
        manufacturer,
        lifetime,
        description,
        actuation_force,
        bottom_out_force,
        pre_travel,
        total_travel,
      } = req.body;
  
      // Handle file uploads
      const thumbnailPath = req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;
      const threeDModelPath = req.files['threeDModel'] ? req.files['threeDModel'][0].path : null;
      const forceGraphPath = req.files['forceGraph'] ? req.files['forceGraph'][0].path : null;
  
      const switchDoc = await Switch.create({
        name,
        type,
        profile,
        mount,
        pins,
        lubricated,
        manufacturer,
        lifetime,
        description,
        actuation_force,
        bottom_out_force,
        pre_travel,
        total_travel,
        thumbnail: thumbnailPath,
      });
  
      res.json({ switch: switchDoc, files: { thumbnailPath, threeDModelPath, forceGraphPath } });
    } catch (e) {
      console.error('Error creating switch with files:', e);
      res.status(400).json(e);
    }
  });

// Update Switch (modified to handle file uploads)
router.put('/:id', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'threeDModel', maxCount: 1 },
    { name: 'forceGraph', maxCount: 1 },
  ]), async (req, res) => {
    const { id } = req.params;
    // Start with the body data for update
    let updateData = { ...req.body };

    // Process file uploads if present
    if (req.files) {
      if (req.files['thumbnail']) {
        const file = req.files['thumbnail'][0];
        const ext = file.originalname.split('.').pop();
        const newPath = `${file.path}.${ext}`;
        fs.renameSync(file.path, newPath);
        updateData.thumbnail = newPath;
      }
      if (req.files['threeDModel']) {
        const file = req.files['threeDModel'][0];
        const ext = file.originalname.split('.').pop();
        const newPath = `${file.path}.${ext}`;
        fs.renameSync(file.path, newPath);
        updateData.threeDModel = newPath;
      }
      if (req.files['forceGraph']) {
        const file = req.files['forceGraph'][0];
        const ext = file.originalname.split('.').pop();
        const newPath = `${file.path}.${ext}`;
        fs.renameSync(file.path, newPath);
        updateData.forceGraph = newPath;
      }
    }

    try {
      const updatedSwitch = await Switch.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updatedSwitch);
    } catch (err) {
      console.error('Error updating switch:', err);
      res.status(500).json({ error: 'Failed to update switch' });
    }
});

// Delete Switch
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Switch.findByIdAndDelete(id);
  res.json({ message: 'Switch deleted' });
});

module.exports = router;
