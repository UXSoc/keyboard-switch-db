const mongoose = require('mongoose');

const SwitchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  profile: { type: String },
  mount: { type: String },
  pins: { type: Number },
  lubricated: { type: Boolean, default: false },
  manufacturer: { type: String },
  lifetime: { type: String },
  thumbnail: { type: String },
  description: { type: String },
  actuation_force: { type: Number },
  bottom_out_force: { type: Number },
  pre_travel: { type: Number },
  total_travel: { type: Number },
  top_housing: { type: String },
  bottom_housing: { type: String },
  stem_type: { type: String },
  stem_material: { type: String },
  spring_material: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Switch', SwitchSchema);
