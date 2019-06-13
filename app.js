const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.port || 5000;

//Map gobal promise - to get rid of warning
mongoose.Promise = global.Promise;

//connect to database
// mongoose
//   .connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true })
//   .then(() => console.log('MongoDB Connected'))
//   .catch(e => console.log(e));
require('./db/mongoose');

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//handlebars middlewares
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Rendering a Home Page
app.get('/', (req, res) => {
  const title = 'Welcome!!';
  res.render('index', {
    title: title
  });
});

//Rendering a About page
app.get('/about', (req, res) => {
  res.render('about');
});

//fetch data from database show it on ideas page --Idea Index Page
app.get('/ideas', async (req, res) => {
  const ideas = await Idea.find({}).sort({ data: 'desc' });

  res.render('ideas/index', { ideas: ideas });
});

//Rendering a Ideas Page
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//Process a add ideas Form
app.post('/ideas', (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please enter the details' });
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
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
      res.redirect('/ideas');
    });
  }
});

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
