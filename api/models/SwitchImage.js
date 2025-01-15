const mongoose = require('mongoose');

const SwitchImageSchema = new mongoose.Schema({
  switch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Switch', required: true },
  image_url: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SwitchImage', SwitchImageSchema);
