var mongoose = require("mongoose");
require("dotenv").config();

const SALT = 10;
var Schema = mongoose.Schema;
var DeviceSchema = new Schema({
  serial_no: {
    type: String,
    required: [true, "name field is required!"],
    maxlength: 100,
    unique:true
  },
  type: {
    type: String,
    required: [true, "type field is required!"],
    maxlength: 1000,
  },
  image: {
    type: String,
    required: [true, "image field is required!"],
    maxlength: 100,
  },
  status:{
    type: String,
    maxlength: 15,
  },

});

const Device = mongoose.model("devices", DeviceSchema);
module.exports = { Device };