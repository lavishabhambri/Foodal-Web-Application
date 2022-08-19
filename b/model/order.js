
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

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    itemid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItems'
    },
    quantity: {
        type: Number, 
        default: 1,
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendors'
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer'
    },
    shopName: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    rating:{
        type: Number,
        default: 0,
    },
    orderTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    isRated: {
        type: Boolean,
        default: false
    },
    foodAddons:[foodAddonSchema]
},{
    timestamps: true
});

var FoodOrders = mongoose.model('order', orderSchema);
module.exports = FoodOrders;