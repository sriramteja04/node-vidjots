const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//const passport = require('passport');

//Loading User Model
require('../models/User');
const User = mongoose.model('users');

//User Login.
router.get('/login', (req, res) => {
  res.render('users/login');
});

//User Registration
router.get('/register', (req, res) => {
  res.render('users/register');
});

//Login Form Post

//Register Form Post
router.post('/register', (req, res) => {
  let errors = [];
  if (req.body.password !== req.body.password2) {
    errors.push({ text: 'password do not match' });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: 'Password length should be more than 4' });
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash('error_msg', 'E-mail Already Existed');
        res.redirect('/users/register');
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        //Encrypting the password and then saving user to mongoDB
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser //Saving the user
              .save()
              .then(response => {
                req.flash('success_msg', 'Registered Successfully');
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
              });
          });
        });
      }
    });
  }
});

module.exports = router;
