const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Vendors = require('../model/vendor');
const authenticate = require('../authenticate')
const vendorRouter = express.Router();


vendorRouter.use(bodyParser.json());

// GET all VENDORS DEV
vendorRouter.route('/')
    .get((req, res, next) => {
        Vendors.find({})
            .then((vendor) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(vendor);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


// SIGNUP a new VENDOR
vendorRouter.post('/signup', (req, res, next) => {
    var password = req.body.password;
    // console.log(req.body);
    delete req.body.password;

    Vendors.register(new Vendors(req.body),
        password, (err, vendor) => {
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


// LOGIN a new VENDOR
vendorRouter.post('/login', passport.authenticate('vendorLocal'), (req, res) => {
    // console.log(req.user);
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, userType: "vendor", status: 'You are successfully logged in!' });
});

// GET info about SELF
vendorRouter.route('/me')
    .get(authenticate.verifyVendor, (req, res, next) => {
        console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        Vendors.findById(req.user._id)
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            }, (err) => next(err))
            .catch((err) => { 
                console.log(err);
                next(err) })
    })

    // UPDATE SELF
    .put(authenticate.verifyVendor, (req, res, next) => {
        Vendors.find({ "email": req.body.email })
            .then(vendor => {
                console.log(vendor);
                if (vendor.length != 0 && vendor[0].email != req.user.email) {
                    err = new Error('Vendor with same email already exist! Cannot update vendor');
                    err.status = 403;
                    return next(err);
                } else {
                    Vendors.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
                        .then((user) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user);
                        }, (err) => next(err))
                        .catch((err) => next(err))
                }
            })
    });

module.exports = vendorRouter;