const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

let vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    contactNumber: {
      type: Number,
    },
    shopName: {
      type: String,
      required: true,
      unique: true,
    },
    openingTime: {
      type: String,
      required: true,
    },
    closingTime: {
      type: String,
      required: true,
    },
    totalOrderInProcess: {
      type: Number,
      default: 0
    }
  },
  { collation: { locale: "en" } }
);

vendorSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

var Vendors = mongoose.model('Vendors', vendorSchema);
module.exports = Vendors;