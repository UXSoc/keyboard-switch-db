const express = require('express');
const Switch = require('../models/Switch');
const multer = require('multer');
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
  


// Update Switch
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedSwitch = await Switch.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updatedSwitch);
});

// Delete Switch
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Switch.findByIdAndDelete(id);
  res.json({ message: 'Switch deleted' });
});

module.exports = router;
