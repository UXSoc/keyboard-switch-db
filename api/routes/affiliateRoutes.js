const AffiliateLink = require('../models/AffiliateLink');
const router = require('express').Router();

// Add Affiliate Links for a Switch
router.post('/:id/affiliate-links', async (req, res) => {
  const { id } = req.params;
  const affiliateData = req.body;

  try {
    const links = await AffiliateLink.insertMany(
      affiliateData.map(link => ({ switch_id: id, ...link }))
    );
    res.json(links);
  } catch (e) {
    console.error('Error adding affiliate links:', e);
    res.status(400).json(e);
  }
});

// Get Affiliate Links for a Switch
router.get('/:id/affiliate-links', async (req, res) => {
  const { id } = req.params;

  try {
    const links = await AffiliateLink.find({ switch_id: id });
    res.json(links);
  } catch (e) {
    console.error('Error fetching affiliate links:', e);
    res.status(400).json(e);
  }
});

module.exports = router; 