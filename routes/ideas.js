const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load Helpers
const { ensureAuthenticated } = require('../helpers/auth');

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//fetch data from database show it on ideas page --Idea Index Page
router.get('/', ensureAuthenticated, async (req, res) => {
  const ideas = await Idea.find({ user: res.user }).sort({ data: 'desc' });

  res.render('ideas/index', { ideas: ideas });
});

//Edit Idea
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findById(req.params.id).then(idea => {
    // Making sure only authorized users are accessing the ideas
    if (idea.user !== req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    }

    res.render('ideas/edit', {
      idea: idea
    });
  });
});

//Rendering a ADD Ideas Page
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

//Process a add ideas Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please enter the details' });
  }
  if (errors.length > 0) {
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    console.log(req.body.user);
    let newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newUser).save().then(idea => {
      req.flash('success_msg', 'Video Idea added');
      res.redirect('/ideas');
    });
  }
});

//Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findById(req.params.id).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then(idea => {
      req.flash('success_msg', 'Video Idea updated');
      res.redirect('/ideas');
    });
  });
});

//delete an idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.findByIdAndDelete(req.params.id).then(() => {
    req.flash('success_msg', 'Video Idea Removed');
    res.redirect('/ideas');
  });
});

module.exports = router;
