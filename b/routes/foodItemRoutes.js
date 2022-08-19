const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const FoodItems = require('../model/foodItem');
const authenticate = require('../authenticate');
const Buyer = require('../model/buyer');
const Vendor = require('../model/vendor');
const foodItemRouter = express.Router();
const FoodOrders = require("../model/order");


foodItemRouter.use(bodyParser.json());

// Request 1 - View all foodItems by BUYER
foodItemRouter.route('/')
    .get(authenticate.verifyBuyer, (req, res, next) => {
        // console.log(req.user.email);
        // console.log(req.user);
        // FoodItems.find({}).populate({path: 'creator', model: Buyer}) // Add model: Buyer to avoid errors
        FoodItems.find({}).populate('creator') // Add model: Buyer to avoid errors
            .then((foodItems) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(foodItems);
            }, (err) => {
                console.log(err);
                next(err);
            })
            .catch((err) => next(err));
    })


    // Request 2 - Add a FOOD ITEM by VENDOR
    .post(authenticate.verifyVendor, (req, res, next) => {
        // console.log(req.body);
        FoodItems.create(req.body)
            .then((foodItems) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(foodItems);
            }, (err) => {
                console.log(err)
                next(err)
            })
            .catch((err) => {
                console.log(err)
                next(err)
            });
    })


// GET all FoodItems made by VENDOR
foodItemRouter.route('/myfooditems')
    .get(authenticate.verifyVendor, (req, res, next) => {
        // console.log(req.user);
        FoodItems.find({ creator: req.user._id })
            .then((foodItems) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(foodItems);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

foodItemRouter.route('/:foodid')
    .delete(authenticate.verifyVendor, (req, res, next) => {
        FoodItems.findByIdAndRemove(req.params.foodid)
            .then((result) => {
                res.statusCode = 200;
                res.json(result);
            }, (err) => {
                console.log(err)
                next(err)
            })
            .catch((err) => {
                console.log(err);
                next(err);
            })
    })

    // UPDATE SELF
    .put(authenticate.verifyVendor, (req, res, next) => {
        // console.log(req.params.foodid);
        FoodItems.findByIdAndUpdate(req.params.foodid, { $set: req.body }, { new: true })
            .then((item) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(item);
            }, (err) => next(err))
            .catch((err) => next(err))
    });

// Request 1 - View all foodItems by BUYER
foodItemRouter.route('/ratefood/:foodid')
    .post(authenticate.verifyBuyer, (req, res, next) => {
        console.log(req.body);
        FoodItems.findById(req.params.foodid)
            .then((item) => {
                let currRating = item.rating;
                let totalPeopleRated = item.totalRaters;
                let multVal = (currRating * totalPeopleRated);
                let totalSum = (Number(multVal) + Number(req.body.ratedValue));
                let newTotalRater = (totalPeopleRated + 1);
                let ansVal = totalSum / newTotalRater;
                item.totalRaters = newTotalRater;
                item.rating = Math.round(ansVal * 10) / 10;

                console.log("anser Value", item.rating);
                FoodOrders.updateMany({ itemid: req.params.foodid }, { $set: { rating: item.rating } })
                    .then((orders) => {
                        console.log(orders, "hiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
                        item.save();
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(item);
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }, (err) => {
                console.log(err);
                next(err);
            })
            .catch((err) => next(err));
    })

// Request foodItem data - by BUYER
foodItemRouter.route('/:foodid')
    .get(authenticate.verifyBuyer, (req, res, next) => {
        FoodItems.findById(foodid).populate('creator')
            .then((foodItem) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(foodItem);
            }, (err) => {
                console.log(err);
                next(err);
            })
            .catch((err) => next(err));
    })

module.exports = foodItemRouter;