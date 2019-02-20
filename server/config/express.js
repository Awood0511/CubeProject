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
  app.use(express.static(path.resolve('./dist')));
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  //use router for calls to the api
  app.use('/api/', functionRouter);

  //default to homepage
  app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '../../../dist/htmls/home.html'));
  });

  app.get('/favicon.ico', function(req,res){
    res.sendFile(path.join(__dirname + '../../../dist/images/god.jpg'));
  });


  // redirect anything that isnt an pathname specified above
  app.get('*', function(req, res){
      res.redirect('/');
  });

  return app;
};
