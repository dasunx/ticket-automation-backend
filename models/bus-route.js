const mongoose = require('mongoose');

const BusRouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  route: [{ name: { type: String }, price: { type: Number } }],
});

module.exports = mongoose.model('Route', BusRouteSchema);
