const mongoose = require('mongoose');

const Switch3DModelSchema = new mongoose.Schema({
  switch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Switch', required: true },
  switch_model_url: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Switch3DModel', Switch3DModelSchema);
