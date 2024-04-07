var mongoose = require("mongoose");
require("dotenv").config();

const SALT = 10;
var Schema = mongoose.Schema;
var LocationSchema = new Schema({
  location_name: {
    type: String,
    required: [true, "name field is required!"],
    maxlength: 100,
  },
  address: {
    type: String,
    maxlength: 1000,
  },
  phone: {
    type: String,
    maxlength: 15,
  },
  devices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'devices'
  }],
  created_at: {
    type: Date,
    default: Date.now()
  }
});

const Location = mongoose.model("locations", LocationSchema);
module.exports = { Location };