const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User Model
const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      //Matching the user
      User.findOne({ email: email }).then(user => {
        if (!user) {
          return done(null, false, { message: 'No User Found' });
        }
        //Matching Password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user); //If matches returning the user
          } else {
            return done(null, false, { message: 'Password Incorrect' });
          }
        });
      });
    })
  );

  //open passport js documentation and search for serialize
  // It will going to pull out us why we need documentation
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
