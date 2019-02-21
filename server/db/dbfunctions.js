var server = require("../config/express.js"); //gives us mysql connection

exports.getCubeCards = function(req, res) {
  query_str = "select Card.* from Card INNER JOIN Cube_card ON Card.id = Cube_card.id AND Cube_card.cube_id =" + req.cube_id;
  server.connection.query(query_str, function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(400);
    } else {
      res.json(rows);
    }
  }); //end query
} //end getCubeCards

exports.cubeByID = function(req, res, next, cube_id){
  req.cube_id = cube_id;
  next();
} //end cubeByID

exports.getCubes = function(req, res) {
  query_str = "select * from mtgcube";
  server.connection.query(query_str, function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(400);
    } else {
      res.json(rows);
    }
  }); //end query
} //end getCubes
