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

exports.createDraft = function(){
  var draft = {
    cube_id: req.cube_id,
    player: req.body.player,
    draft_time: req.body.draft_time
  }

  server.connection.query("Insert into draft SET ?", draft, function(error, result){
    if(error){
      console.log(error);
      res.status(400).end();
      return;
    }
    res.send(result.insertId);
  });
}

//save a pick from a draft of a cube
exports.saveDraft = function(req, res){
  var pick = {
    draft_id: req.draft_id,
    id: req.body.id,
    pack: req.body.pack,
    pick: req.body.pick
  };

  var query = "Insert into draft_picks SET ?";
  server.connection.query(query, pick, function(error, result){
    if(error){
      console.log(error);
      res.status(400).end();
      return;
    }
    res.send("Saved a pick");
  });
}

exports.draftByID = function(req, res, next, draft_id){
  req.draft_id = draft_id;
  next();
}
