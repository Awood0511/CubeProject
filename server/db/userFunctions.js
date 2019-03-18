var server = require("../config/express.js"),
    mysql = require('mysql');

//gets the currently logged in user from their information stored in the request header
exports.getUser = function(req, res) {
  if(req.user){
    res.send(req.user.username);
  }
  else{
    res.send("Anonymous");
  }
}

//create an account if email and username are unique
exports.createAccount = function(req, res){
  res.end();
}
