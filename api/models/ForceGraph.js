const mongoose = require('mongoose');

const ForceGraphSchema = new mongoose.Schema({
  switch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Switch', required: true },
  graph_data: { type: Object, required: true }, 
  source: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ForceGraph', ForceGraphSchema);
