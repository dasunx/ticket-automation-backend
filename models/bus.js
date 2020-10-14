const mongoose = require("mongoose");
const crypto = require("crypto");

const busSchema = new mongoose.Schema(
  {
    regNo: {
      type: String,
      trim: true,
      required: true,
      max: 32,
      unique: true,
      index: true,
    },
    route: {
      type: mongoose.Types.ObjectId, ref:'Route'
    },
    
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    
  },
  { timestamps: true }
);

// don't use arrow function for the schema fields. just use the normal function
busSchema
  .virtual("password")
  .set(function (password) {// set 
    // create a tmp variable called _password
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {// get
    return this._password;
  });

  busSchema.methods={
    authenticate:function(plainText){
        return this.encryptPassword(plainText)===this.hashed_password;
    },

      encryptPassword:function(password){
          if(!password) return '';
          try{
              return crypto.createHmac('sha1',this.salt).update(password).digest('hex');
          }catch(err){
              return '';
          }
      },
      makeSalt:function(){
          return `${Math.round(new Date().valueOf()*Math.random())}RX8`;
      }
  }

module.exports = mongoose.model("Bus", busSchema);
