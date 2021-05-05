const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

// Get the signup form
router.get('/register', async (req, res) => {
  res.render('auth/signup');
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
    });
    const newUser = await User.register(user, req.body.password);

    req.flash('success', 'User Registered Successfully');
    res.redirect('/blogs');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
});

// Get login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// login user
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  (req, res) => {
    req.flash('success', `Welcome Back ${req.user.username}`);
    res.redirect('/blogs');
  }
);

// logout user from current session
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'User Logged Out Successfully');
  res.redirect('/login');
});

module.exports = router;
