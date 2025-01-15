const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema({
  switch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Switch', required: true },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  price: { type: Number, required: true },
  in_stock: { type: Boolean, default: true },
  coupon_code: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Pricing', PricingSchema);
