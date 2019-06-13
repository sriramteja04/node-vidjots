const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//fetch data from database show it on ideas page --Idea Index Page
router.get('/', async (req, res) => {
  const ideas = await Idea.find({}).sort({ data: 'desc' });

  res.render('ideas/index', { ideas: ideas });
});

//Edit Idea
router.get('/edit/:id', (req, res) => {
  Idea.findById(req.params.id).then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  });
});

//Rendering a ADD Ideas Page
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

//Process a add ideas Form
router.post('/', (req, res) => {
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
    let newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser).save().then(idea => {
      req.flash('success_msg', 'Video Idea added');
      res.redirect('/ideas');
    });
  }
});

//Edit Form Process
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  Idea.findByIdAndDelete(req.params.id).then(() => {
    req.flash('success_msg', 'Video Idea Removed');
    res.redirect('/ideas');
  });
});

module.exports = router;
