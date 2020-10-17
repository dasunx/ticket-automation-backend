const mongoose = require('mongoose');
const User = require('./user');

const options = { discriminatorKey: 'kind' };

const Local = User.discriminator(
  'Local',
  new mongoose.Schema(
    {
      nic: {
        type: String,
        required: true,
      },
      balance: {
        type: Number,
        default: 0.0,
      },
      ongoing: {
        type: Boolean,
        default: false,
      },
      journey: {
        type: mongoose.Types.ObjectId,
        ref: 'Journey',
      },
      paymentHistory: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Payment',
        },
      ],
      journeyHistory: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Journey',
        },
      ],
      fineBalance: {
        type: Number,
        default: 0.0,
      },
      fineHistory: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Fine',
        },
      ],
    },
    options
  )
);

module.exports = Local;
