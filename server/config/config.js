var express = require('./express');
let port = 8080;

var start = function() {
  var app = express.init();
  app.listen(port, function() {
    console.log('App listening on port', port);
  });
};
start();
