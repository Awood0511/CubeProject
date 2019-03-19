var path = require('path'),
    express = require('express'),
    session = require("express-session"),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    server = require('./express.js'),
    passport = require('passport'),
    passConfig = require('./passport.js'),
    dbconfig = require('./dbconfig.js'),
    functionRouter = require('../routes/routes.js');

module.exports.init = function() {
  //initialize app
  var app = express();

  //connect to mysql
  exports.connection = mysql.createConnection({
    host: dbconfig.db.host,
    user: dbconfig.db.user,
    password: dbconfig.db.password,
    database: dbconfig.db.database
  });

  server.connection.connect(function(error){
    if(error){
      console.log("Could not connect to db.");
      console.log(error);
    } else {
      console.log("Connected to db: ", dbconfig.db.database);
    }
  });

  //activate middleware
  app.use(express.static(path.resolve('./dist')));
  app.use(session({ secret: dbconfig.secret }));
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  //use router for calls to the api
  app.use('/api/', functionRouter);

  //default to homepage
  app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/home.html'));
  });
  //signup form
  app.get('/signup', function(req,res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/signup.html'));
  });

  //get a list of all cubes
  app.get('/cube/all', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/all_cubes.html'));
  });
  //get a list of all cubes for the user
  app.get('/cube/player', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/player_cubes.html'));
  });
  //get a full cube view
  app.get('/cube/view/:cube_id', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/cube_view.html'));
  });
  //get a cube to edit
  app.get('/cube/edit/:cube_id', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/cube_edit.html'));
  });
  //get a cube visual spoiler
  app.get('/cube/visual/:cube_id', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/cube_visual_spoiler.html'));
  });

  //get a list of all drafts done by the logged in player
  app.get('/draft/player', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/player_drafts.html'));
  });
  //draft a cube by yourself with AI to fill in other players
  app.get('/draft/solo/:cube_id', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/solo_draft.html'));
  });
  //view previously drafted cubes
  app.get('/draft/view/:draft_id', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/draft_view.html'));
  });
  //view stats for cube that AI use to draft with
  app.get('/draft/stats/:cube_id', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/draft_stats.html'));
  });

  //send site image (temporarily George Costanza)
  app.get('/favicon.ico', function(req,res){
    res.sendFile(path.join(__dirname + '../../../dist/images/god.jpg'));
  });
  // redirect anything that isnt an pathname specified above to home
  app.get('*', function(req, res){
      res.redirect('/');
  });

  return app;
};
