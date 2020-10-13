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
      balance:{
          type: Number,
          default:0.00
      },
      ongoing:{
          type:Boolean,
          default:false,
      },
      journey:{
          type:mongoose.Types.ObjectId,ref:'Journey'
      }
    },
    options
  )
);

module.exports = Foreigner;
