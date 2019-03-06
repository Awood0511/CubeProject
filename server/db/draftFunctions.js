var server = require("../config/express.js"),
    mysql = require('mysql');

//get all the previous drafts for a cube
exports.getDraftStats = function(req, res){
  var cube_id = req.cube_id;
  var query = "Select * from draft_picks where cube_id = " + cube_id;
  server.connection.query(query, function(error, rows, fields) {
    if(error){
      console.log(error);
      res.send(404).end();
      return;
    }
    res.json(rows);
  });
}

//save a pick from a draft of a cube
exports.saveDraft = function(req, res){
  console.log("Draft request received");
  var entry = {
    id: req.body.id,
    cube_id: req.cube_id,
    player: "Adam",
    pack: req.body.pack,
    pick: req.body.pick,
    draft_time: req.body.draft_time
  };

  var query = "Insert into draft_picks SET ?";
  server.connection.query(query, entry, function(error, result){
    if(error){
      console.log(error);
      res.status(404).end();
      return;
    }
    res.send("Done");
  });
}
