const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require('passport');

// Load input validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");

// Load models
const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: "profile work" }));

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Skills - split into array
    if (typeof req.body.skills != 'undefined') {
        profileFields.skills = req.body.skills.split(",");
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                // Update
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).then(profile => res.json(profile));
            } else {
                // Create

                // Check if handle exist
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if (profile) {
                            errors.handle = "That handle already exists";
                            res.status(400).json(errors);
                        }
                        // Save profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    });
            }
        })
});


// @route   POST api/profile/experience
// @desc    Add Experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                    title: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    company: req.body.company,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                }
                // Add to exp array
            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile));
        });
});

module.exports = router;