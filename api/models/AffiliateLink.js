const mongoose = require('mongoose');

const AffiliateLinkSchema = new mongoose.Schema({
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  switch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Switch', required: true },
  affiliate_url: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AffiliateLink', AffiliateLinkSchema);
