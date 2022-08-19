const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var foodAddonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const foodItemSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendors'
    },
    name: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
    },
    rating:{
        type: Number,
        default: 0,
    },
    totalRaters:{
        type:Number,
        default :0
    },
    foodAddons:[foodAddonSchema],
    tags:[String],
    noOfTimeOrdered : {
        type: Number,
        default: 0
    }
},{
    timestamps: true
});

var FoodItems = mongoose.model('foodItem', foodItemSchema);
module.exports = FoodItems;