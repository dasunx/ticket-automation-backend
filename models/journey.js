const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  startPlace: { type: String, required: true },
  endPlace: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  passengerId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Product', ProductSchema);
