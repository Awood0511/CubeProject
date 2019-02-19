var server = require("../config/express.js"); //gives us mysql connection

exports.getCards = function(req, res) {
  query_str = "select Card.id, Card.cname, Card.set_code from Card INNER JOIN Cube_card ON Card.id = Cube_card.id AND Cube_card.cube_name = \"Adam\'s Cube\"";
  server.connection.query(query_str, function(err, rows, fields){
    if(err){
      console.log(err);
    } else {
      res.json(rows);
    }
  }); //end query
}
