const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

var methodOverride = require('method-override');

const app = express();
const port = process.env.port || 5000;

//Load Routes.
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Load Passport.
require('./config/passport')(passport);

//Map gobal promise - to get rid of warning
mongoose.Promise = global.Promise;

//Loading MongoDB
require('./db/mongoose');

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

//static Folders
app.use(express.static(path.join(__dirname, 'public')));

//method-override middlware
app.use(methodOverride('_method'));

//express-session middleware
app.use(
  session({
    secret: 'chinna',
    resave: true,
    saveUninitialized: true
  })
);

//passport middleware which should come after express session
app.use(passport.initialize());
app.use(passport.session());

//connect-flash middleware
app.use(flash());

//Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

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

//Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
