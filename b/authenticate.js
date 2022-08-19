var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var Buyers = require('./model/buyer')
var Vendors = require('./model/vendor');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

passport.use('buyerLocal', new LocalStrategy({usernameField: 'email'},Buyers.authenticate()));
passport.use('vendorLocal', new LocalStrategy({usernameField: 'email'},Vendors.authenticate()));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
if(user!=null)
    done(null,user);
});

exports.getToken = function(user) {
    return jwt.sign(user, 'secret',
        {expiresIn: "12h"});
};

var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use('buyerJWT',new JwtStrategy(opts, function(jwt_payload, done) {
    Buyers.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            console.log(user);
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

exports.verifyBuyer = passport.authenticate('buyerJWT', {session: false});

passport.use('vendorJWT',new JwtStrategy(opts, function(jwt_payload, done) {
    Vendors.findOne({_id: jwt_payload._id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

exports.verifyVendor = passport.authenticate('vendorJWT', {session: false});


