const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const authenticate = require('../authenticate');
const FoodOrders = require('../model/order');
const Buyers = require('../model/buyer');
const Vendors = require('../model/vendor');
const orderRouter = express.Router();
const FoodItems = require('../model/foodItem');
orderRouter.use(bodyParser.json());
const dotenv = require('dotenv');
dotenv.config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_API);



// GET all Food Orders
orderRouter.route('/')
    .get((req, res, next) => {
        FoodOrders.find()
            .then((orders) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(orders);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


// GET an Food Order by Buyer
orderRouter.route('/myorder/:orderid')
    .get(authenticate.verifyBuyer, (req, res, next) => {
        FoodOrders.find({ _id: req.params.orderid, buyer: req.user._id })
            .then((order) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

// GET all Buyer'S Food Orders
orderRouter.route('/myallorders/')
    .get(authenticate.verifyBuyer, (req, res, next) => {
        FoodOrders.find({ buyer: req.user._id }).populate('vendor')
            .then((orders) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                // console.log(orders);
                res.json(orders);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

// GET all Vendor's Food Orders
orderRouter.route('/vendorallorders/')
    .get(authenticate.verifyVendor, (req, res, next) => {
        FoodOrders.find({ vendor: req.user._id }).populate('buyer')
            .then((orders) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(orders);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

// Order by Buyer
orderRouter.route('/create')
    .post(authenticate.verifyBuyer, (req, res, next) => {
        console.log(req.body);
        Buyers.findById(req.user._id)
            .then((buyer) => {
                Vendors.findById(req.body.vendor)
                    .then((vendor) => {
                        if (req.body.orderTime < vendor.openingTime || req.body.orderTime > vendor.closingTime) {
                            err = new Error('Shop is closed, order rejected');
                            err.status = 403;
                            return next(err);
                        }

                        if (req.body.totalPrice > buyer.walletMoney) {
                            err = new Error('Wallet money exhausted, add money to your wallet');
                            err.status = 403;
                            return next(err);
                        }

                        else {
                            buyer.walletMoney = buyer.walletMoney - req.body.totalPrice;
                        }

                        req.body.buyer = req.user._id;
                        req.body.status = 'PLACED';
                        FoodOrders.create(req.body)
                            .then((order) => {
                                FoodItems.findById(req.body.itemid)
                                    .then(item => {
                                        item.noOfTimeOrdered = item.noOfTimeOrdered + 1;
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        buyer.save();
                                        vendor.save();
                                        item.save();
                                        res.json(order);

                                    }, (err) => next(err))
                                    .catch((err) => next(err))
                            }, (err) => next(err))
                            .catch((err) => next(err))
                    }, (err) => next(err))
                    .catch((err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// important we have to send mail to Buyer on rejection and acceptance of the order by Vendor
// Reject an order by Vendor
orderRouter.route('/reject/:orderid')
    .post(authenticate.verifyVendor, (req, res, next) => {
        FoodOrders.findById(req.params.orderid)
            .then((order) => {
                // console.log(order);
                Buyers.findById(order.buyer)
                    .then((buyer) => {
                        Vendors.findById(req.user._id)
                            .then((vendor) => {
                                const msg = {
                                    to: `${buyer.email}`, 
                                    from: 'bhambrilavisha@gmail.com', // Change to your verified sender
                                    subject: 'Food App mailing service',
                                    text: vendor.name + ' rejected your order.',
                                    html: vendor.name + ' rejected your order.',
                                }
                                sgMail
                                    .send(msg)
                                    .then(() => {
                                        console.log(msg)
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                    })
                                vendor.totalOrderInProcess = vendor.totalOrderInProcess - 1;
                                buyer.walletMoney = buyer.walletMoney + order.totalPrice;
                                order.status = "REJECTED";
                                vendor.save();
                                buyer.save();
                                order.save();

                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(order);
                            }, (err) => next(err))
                            .catch((err) => next(err))
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    })
orderRouter.route('/israted/:orderid')
    .post(authenticate.verifyBuyer, (req, res, next) => {
        FoodOrders.findById(req.params.orderid)
            .then((order) => {
                // console.log(order);
                order.isRated = true;
                order.save();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

// Update a STATUS of Food Order by Vendor
orderRouter.route('/updatestatus/:orderid')
    .post(authenticate.verifyVendor, (req, res, next) => {
        FoodOrders.findById(req.params.orderid)
            .then((order) => {
                // console.log(order);
                Buyers.findById(order.buyer)
                    .then((buyer) => {
                        Vendors.findById(req.user._id)
                            .then((vendor) => {
                                //send mail to the buyer when order is accepted
                                if (order.status === 'PLACED') {
                                    if (vendor.totalOrderInProcess >= 10) {
                                        buyer.walletMoney = buyer.walletMoney + order.totalPrice;
                                        err = new Error('Maximum orders limit reached, cannot accept more orders!');
                                        err.status = 403;
                                        return next(err);
                                    }

                                    order.status = 'ACCEPTED';
                                    vendor.totalOrderInProcess = vendor.totalOrderInProcess + 1;
                                    
                                    const msg = {
                                        to: `${buyer.email}`,
                                        from: 'bhambrilavisha@gmail.com', // Change to your verified sender
                                        subject: 'Food App mailing service',
                                        text: vendor.name + ' accepted your order.',
                                        html: vendor.name + ' accepted your order.',
                                    }
                                    sgMail
                                        .send(msg)
                                        .then(() => {
                                            console.log('Email sent')
                                            console.log(msg)
                                        })
                                        .catch((error) => {
                                            console.error(error)
                                        })
                                } else if (order.status === 'ACCEPTED') {
                                    order.status = 'COOKING';
                                } else if (order.status === 'COOKING') {
                                    order.status = 'READY FOR PICKUP';
                                    vendor.totalOrderInProcess = vendor.totalOrderInProcess - 1;
                                }
                                vendor.save();
                                order.save();
                                buyer.save();
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(order);
                            }, (err) => next(err))
                            .catch((err) => next(err))
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// Update a STATUS of Food Order for Pick up to completed by Buyer
orderRouter.route('/pickup/:orderid')
    .post(authenticate.verifyBuyer, (req, res, next) => {
        FoodOrders.findById(req.params.orderid)
            .then((order) => {
                // console.log(order);
                if (order.status === 'READY FOR PICKUP') {
                    order.status = 'COMPLETED';
                }
                order.save();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

orderRouter.route('/updaterating/:itemid')
    .post(authenticate.verifyBuyer, (req, res, next) => {
        FoodOrders.collection.updateMany({ itemid: req.params.itemid }, { $set: { rating: req.body.rating } })
            .then((orders) => {
                // console.log(orders);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(orders);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


// GET Statics details for the vendor orders

orderRouter.route('/statistics')
    .get(authenticate.verifyVendor, (req, res, next) => {
        FoodOrders.find({ vendor: req.user._id }).populate('buyer')
            .then((orders) => {

                // finding the counts for -> orderPlaced, orderPending, orderCompleted 
                let totalOrderPlaced = orders.length;
                let totalOrderPending = 0;
                let totalOrderCompleted = 0;
                orders.map(order => {
                    if (order.status === 'COMPLETED') {
                        totalOrderCompleted = totalOrderCompleted + 1;
                    }
                    if (order.status === 'ACCEPTED' || order.status === 'READY FOR PICKUP' || order.status === 'COOKING') {
                        totalOrderPending = totalOrderPending + 1;
                    }
                })
                
                if (totalOrderPending > 10)
                    totalOrderPending = 10;

                // define an empty query document
                const query = { creator: req.user._id };
                // sort in descending (-1) order by length
                const sort = { length: -1 };

                // let topItemsArr;
                FoodItems.find(query).sort({ noOfTimeOrdered: -1 }).limit(5).exec(function (err, result) {
                    if (err) throw err;
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ orderPlaced: totalOrderPlaced, orderPending: totalOrderPending, orderCompleted: totalOrderCompleted, topItems: result });
                });
            }, (err) => next(err))
            .catch((err) => next(err));
    })

// For statistics, graphs part
    orderRouter.route('/graphs')
    .get(authenticate.verifyVendor, (req, res, next) => {
        FoodOrders.find({ vendor: req.user._id }).populate('buyer')
            .then((orders) => {

                
                let ug1 = 0;
                let ug2 = 0;
                let ug3 = 0;
                let ug4 = 0;
                let ug5 = 0;

                let myAgeMap = new Map();

                orders.map(order => {
                    if (order.status === 'COMPLETED') {
                        if (order.buyer.batch === 'UG1') {
                            ug1 = ug1 + 1;
                        } 
                        else if (order.buyer.batch === 'UG2') {
                            ug2 = ug2 + 1;
                        }
                        else if (order.buyer.batch === 'UG3') {
                            ug3 = ug3 + 1;
                        }
                        else if (order.buyer.batch === 'UG4') {
                            ug4 = ug4 + 1;
                        }
                        else if (order.buyer.batch === 'UG5') {
                            ug5 = ug5 + 1;
                        }

                        let age = order.buyer.age;
                        if(myAgeMap.get(age) === undefined) {
                            myAgeMap.set(age, 1);
                        } else {
                            myAgeMap.set(age, myAgeMap.get(age) + 1);
                        }
                    }
                })
                
                // Sorting on basis of ages (keys)
                var mapAsc = new Map([...myAgeMap.entries()].sort());
                var agex = [];
                var agey = [];
                for (const [key, value] of mapAsc) {
                    console.log(key + ' = ' + value)
                    agex.push(key);
                    agey.push(value);
                }
                

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ UG1: ug1, UG2: ug2, UG3: ug3, UG4: ug4, UG5: ug5, AgeX: agex, AgeY: agey});
            
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = orderRouter;