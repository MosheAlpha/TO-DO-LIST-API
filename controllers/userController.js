const mongoose = require('mongoose')
const User = mongoose.model('User')
const Token = require('../models/tokenModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

exports.register = function (req, res) {
    const newUser = new User(req.body);
    console.log(req.body)
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function (err, user) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            user.hash_password = undefined;
            return res.json(user);
        }
    });
};

exports.signIn = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;
        if (!user || !user.comparePassword(req.body.password)) {
            return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
        }
        const token = jwt.sign({ email: user.email, firstName: user.firstName, secondName: user.secondName, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        const refreshToken = jwt.sign({ email: user.email, firstName: user.firstName, secondName: user.secondName, _id: user._id }, process.env.jWT_REFRESH_TOKEN_SECRET);

        const newToken = new Token({ refreshToken: refreshToken , userId: user._id});
        newToken.save(function (err, token) {
            if (err) return res.status(400).send({ message: err });
        });

        return res.status(200).json({
            message: "User Logged in Successfully",
            token,
            refreshToken,
        });
    });
};

exports.token = function (req, res) {
    const refreshToken = req.body.token;
    if (refreshToken == null) {
        return res.status(401).send("No refresh token provided!");
    }
    // if (!refreshTokens.includes(refreshToken)) {
    //     return res.status(403).send("Invalid Refresh Token");
    // }

    Token.findOne({ refreshToken: refreshToken }, (error, token) => {
        if (error) return res.status(403).send("Invalid Refresh Token");
    });

    jwt.verify(refreshToken, process.env.jWT_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send("Could not Verify Refresh Token");

        const token = jwt.sign({ email: user.email, firstName: user.firstName, secondName: user.secondName, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return res.status(200).json({
            message: "Access token updated Successfully!",
            accessToken: token,
            refreshToken: refreshToken
        });
    });
}

exports.authenticateToken = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, function (err, user) {
            if (err) {
                req.user = undefined;
                console.log(err)
                return res.status(403).send("Could not verify token");
            }
            else {
                req.user = user;
                next()
            }
        });
    } else {
        req.user = undefined;
        return res.status(401).send("Authorization failed. No access token.");
    }
}

exports.profile = function (req, res) {
    if (req.user) {
        return res.status(200).send(req.user);
    }
    else {
        return res.status(401).json({ message: 'Invalid token' });
    }
};