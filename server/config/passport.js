var mysql = require('mysql'),
    server = require("../config/express.js"),
    passport = require('passport'),
    bcrypt = require('bcryptjs'),
    LocalStrategy = require('passport-local').Strategy;

var validatePassword = function(password, hash, callback){
  bcrypt.compare(password, hash, function(err, res) {
    if(err){
      console.log(err);
      return false;
    }
    callback(res);
  });
}

//configure the strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    //find a user that matches the username
    server.connection.query("select * from player where username = \"" + username + "\"", function(err, rows, fields){
      if(err){
        return done(err);
      }
      if(!rows){
        return done(null, false, { message: 'Incorrect username.' });
      }
      validatePassword(password, rows[0].pass, function(match) {
        if(match){
          return done(null, rows[0]);
        }
        else{
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  server.connection.query("select * from player where username = \"" + username + "\"", function(err, rows, fields){
    done(err, rows[0]);
  });
});
