var path = require('path'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    server = require('./express.js'),
    dbconfig = require('./dbconfig.js'),
    dbfunctions = require('../db/dbfunctions.js'),
    functionRouter = require('../routes/routes.js');;

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
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.resolve('./dist')));

  //use router for calls to the api
  app.use('/api/', functionRouter);

  //default to homepage
  app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/home.html'));
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
