const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require('passport');

// Post model
const Post = require("../../models/post");

// Validation
const validatePostInput = require("../../validation/post");

// router.get('/test', (req, res) => res.json({ msg: "Posts work" }));

// @route   POST api/posts
// @desc    create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check Validation
    if (!isValid) {
        // If any errors
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.name,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

module.exports = router;