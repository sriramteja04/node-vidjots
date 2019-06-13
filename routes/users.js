const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//User Login.
router.get('/users/login', (req, res) => {
  res.send('Login');
});

//User Registration
router.get('/users/register', (req, res) => {
  res.send('Register');
});

module.exports = router;
