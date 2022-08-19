const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('mongoose-type-email');
var passportLocalMongoose = require('passport-local-mongoose');

let buyerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    },
    batch: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number
    },
    age: {
      type: Number,
      min: 1,
      required: true,
      validate: [
        { validator: Number.isInteger, msg: "Age should be an integer" }
      ]
    },
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'foodItem'
    }],
    walletMoney: {
      type: Number,
      min: 0,
      default: 0
    }
  },{
    timestamps: true
});


buyerSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
module.exports = mongoose.model("Buyer", buyerSchema);