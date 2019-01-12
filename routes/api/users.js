const express = require("express");
const router = express.Router();
const gravator = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require('passport');

// Load input Validation
const validateRegisterInput = require("../../validation/register");
// Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: "users work" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Validation
    console.log("errors:", errors);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            } else {
                const avatar = gravator.url(req.body.email, {
                    s: '200', //size
                    r: 'pg', //rating
                    d: 'mm' //Default
                })
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log("User register err:", err));
                    });
                });
            }
        });
});


// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post("/login", (req, res) => {
    if (!req.body.password) {
        return res.status(400).json({ password: 'User password is required' });
    }
    if (!req.body.email) {
        return res.status(400).json({ email: 'User email is required' });
    }
    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    User.findOne({ email })
        .then(user => {
            // check user
            if (!user) {
                return res.status(404).json({ email: "User email is not found" });
            }

            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User matched

                        // Creating jwt payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            avatar: user.avatar,
                        };
                        // Sign Token
                        jwt.sign(payload, keys.secretKey, { expiresIn: 3600 }, (err, token) => {
                            return res.json({ success: true, token: "Bearer " + token })
                        });
                    } else {
                        return res.status(400).json({ password: 'Password incorrect' })
                    }
                });
        });
});


// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate("jwt", { session: false }), (req, res) => {
    return res.json({ msg: "success", user: req.user });
});
module.exports = router;