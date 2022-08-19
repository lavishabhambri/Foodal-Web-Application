const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Buyers = require('../model/buyer');
const authenticate = require('../authenticate');
const buyerRouter = express.Router();

buyerRouter.use(bodyParser.json());

// GET all BUYERS DEV
buyerRouter.route('/')
    .get((req, res, next) => {
        Buyers.find({})
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            },
                (err) => next(err))
            .catch((err) => next(err));
    })

// SIGNUP a new buyer
buyerRouter.post('/signup', (req, res, next) => {
    var password = req.body.password;
    // console.log(req.body);
    delete req.body.password;

    Buyers.register(new Buyers(req.body),
        password, (err, buyer) => {
            if (err) {
                console.log(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            }
            else {
                // passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, status: 'Registration Successful!' });
                // });
            }
        });
});


// LOGIN as BUYER
buyerRouter.post('/login', passport.authenticate('buyerLocal'), (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    Buyers.find()
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, userType: "buyer", status: 'You are successfully logged in!' });
});

// GET info about SELF
buyerRouter.route('/me')
    .get(authenticate.verifyBuyer, (req, res, next) => {
        Buyers.findById(req.user._id)
            .then((users) => {
                console.log(users);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    // UPDATE SELF
    .put(authenticate.verifyBuyer, (req, res, next) => {
        Buyers.find({ "email": req.body.email })
            .then(buyer => {
                if (buyer.length != 0 && buyer[0].email != req.user.email) {
                    err = new Error('Buyer with same email already exist! Cannot update buyer');
                    err.status = 403;
                    return next(err);
                } else {
                    Buyers.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
                        .then((user) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user);
                        }, (err) => next(err))
                        .catch((err) => next(err))
                }
            })
    });


// GET Buyers Favorites
buyerRouter.route('/favorites')
    .get(authenticate.verifyBuyer, (req, res, next) => {
        Buyers.findById(req.user._id).populate('favorites')
            .then((userWithFav) => {
                // console.log(userWithFav.favorites)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ userData: userWithFav.favorites });
            }, (err) => next(err))
            .catch((err) => next(err))
    })


    // Add favorite only unique values
    .patch(authenticate.verifyBuyer, (req, res, next) => {
        console.log(req.body);
        Buyers.findByIdAndUpdate(req.user._id, { $addToSet: { favorites: req.body.foodId } })
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => {
                console.log(err);
                next(err)
            })
            .catch((err) => {
                console.log(err);
                next(err);
            })
    })

    // delete favorite
    .delete(authenticate.verifyBuyer, (req, res, next) => {
        Buyers.findByIdAndUpdate(req.user._id, { $pull: { favorites: req.body.foodId } })
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => {
                console.log(err);
                next(err)
            })
            .catch((err) => {
                console.log(err);
                next(err);
            })
    })



// important do frontend for this 5 marks
//add money to wallet
buyerRouter.route('/addmoney')
    .post(authenticate.verifyBuyer, (req, res, next) => {
        Buyers.findById(req.user._id)
            .then((user) => {
                user.walletMoney = Number(user.walletMoney) + Number(req.body.walletMoney);
                user.save();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => {
                console.log(err);
                next(err)
            })
            .catch((err) => {
                console.log(err);
                next(err);
            })
    })


module.exports = buyerRouter;