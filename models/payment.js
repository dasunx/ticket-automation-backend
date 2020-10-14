const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, default: 0.0 },
  type: { type: String },
  payhereId: { type: String },
  passengerId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);
