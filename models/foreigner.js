const mongoose = require('mongoose');
const User = require('./user');

const options = { discriminatorKey: 'kind' };

const Foreigner = User.discriminator(
  'Foreigner',
  new mongoose.Schema(
    {
      passportId: {
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
    },
    options
  )
);

module.exports = Foreigner;
