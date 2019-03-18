var server = require("../config/express.js"),
    mysql = require('mysql'),
    bcrypt = require('bcryptjs');

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
  var user = {
    username: req.body.username,
    email: req.body.email,
    pass: ""
  }

  //hash the password
  bcrypt.genSalt(11, function(err, salt) {
    if(err){
      console.log(err);
      res.status(400).send("HashError");
      return;
    }
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      if(err){
        console.log(err);
        res.status(400).send("HashError");
        return;
      }
      user.pass = hash;
      //attempt to create an account
      var query = "Insert into player SET ?";
      server.connection.query(query, user, function(error, result){
        if(error){
          console.log(error.sqlMessage);
          if(error.sqlMessage.includes("email")){
            res.status(400).send("DupEmail");
          }
          else if(error.sqlMessage.includes("PRIMARY")){
            res.status(400).send("DupUser");
          }
          else{
            res.status(400).send("SQLError");
          }
          return;
        }
        res.send("Account Created");
      });
    });
  });
}
