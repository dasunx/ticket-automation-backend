const mongoose = require("mongoose");
const User =require("./user");

const options = {discriminatorKey: 'kind'};

const Manager = User.discriminator('Manger',
  new mongoose.Schema({url: String}, options));

module.exports=Manager;