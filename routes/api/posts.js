const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require('passport');

// Post model
const Post = require("../../models/post");

// Validation
const validatePostInput = require("../../validation/post");

// router.get('/test', (req, res) => res.json({ msg: "Posts work" }));

// @route   GET api/posts
// @desc    get posts
// @access  Public
router.get('/', (req, res) => {
    Post.find().sort({ date: -1 }).then(posts => res.json(posts))
        .catch(err => res.status(404).json({ error: "No any post found" }));
});

// @route   GET api/posts/:id
// @desc    get post by id
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ error: "No post found with that ID" }));
});



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