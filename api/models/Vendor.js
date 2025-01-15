const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  url: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);
