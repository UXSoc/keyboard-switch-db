const Pricing = require('../models/Pricing');
const router = require('express').Router();

// Add Pricing for a Switch
router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const pricingData = req.body;

  try {
    const pricing = await Pricing.insertMany(
      pricingData.map(row => ({ switch_id: id, ...row }))
    );
    res.json(pricing);
  } catch (e) {
    console.error('Error adding pricing:', e);
    res.status(400).json(e);
  }
});

// Get Pricing for a Switch
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pricing = await Pricing.find({ switch_id: id });
    res.json(pricing);
  } catch (e) {
    console.error('Error fetching pricing:', e);
    res.status(400).json(e);
  }
});

module.exports = router; 