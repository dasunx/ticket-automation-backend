const mongoose = require('mongoose');

const FineSchema = new mongoose.Schema({
  amount: { type: Number, default: 0.0 },
  paid: { type: Boolean, default: false },
  managerId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  passengerId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  time: { type: Date, default: Date.now },
  paidTime: {
    type: Date,
  },
});

module.exports = mongoose.model('Fine', FineSchema);
