const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();
const port = process.env.port || 5000;

//Map gobal promise - to get rid of warning
mongoose.Promise = global.Promise;

//connect to database
mongoose
  .connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(e => console.log(e));

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

app.get('/', (req, res) => {
  const title = 'Welcome!!';
  res.render('index', {
    title: title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
