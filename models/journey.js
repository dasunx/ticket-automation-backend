const mongoose = require('mongoose');

const JourneySchema = new mongoose.Schema({
  startPlace: { type: String, required: true },
  endPlace: { type: String },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  cost: { type: Number, default: 0.0 },
  passengerId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  busId:{type:mongoose.Types.ObjectId,ref:'Bus'},
  status:{type:Boolean,default:true}
});

module.exports = mongoose.model('Journey', JourneySchema);
