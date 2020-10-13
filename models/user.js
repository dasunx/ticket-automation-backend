const mongoose = require('mongoose');
const crypto = require('crypto');

const options = { discriminatorKey: 'kind' };
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: 'Local' /* Manager, Foreigner, Local */,
    },
  },
  { timestamps: true },
  options
);

// don't use arrow function for the schema methods,because in arrows we can't use the 'this' keyword
userSchema
  .virtual('password')
  .set(function (password) {
    // set
    // tmp variable called tmpPassword
    this.tmpPassword = password;
    // generate salt
    this.salt = this.makeSalt();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    // get
    return this.tmpPassword;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
  makeSalt: function () {
    return `${Math.round(new Date().valueOf() * Math.random())}+R8`;
  },
};

module.exports = mongoose.model('User', userSchema);
