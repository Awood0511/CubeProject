var server = require("../config/express.js"),
    mysql = require('mysql');

//get all the previous drafts for a cube
exports.getDraftStats = function(req, res){
  var cube_id = req.cube_id;
  var query = "Select draft_picks.* from draft_picks inner join draft where draft.draft_id = draft_picks.draft_id and draft.cube_id = " + cube_id;
  server.connection.query(query, function(error, rows, fields) {
    if(error){
      console.log(error);
      res.send(404).end();
      return;
    }
    res.json(rows);
  });
}

//create a draft to start saving a players picks
exports.createDraft = function(req, res){
  var player;
  //check if a player is logged in drafting
  if(!req.user){
    player = "Anonymous";
  }
  else{
    player = req.user.username;
  }

  var draft = {
    cube_id: req.cube_id,
    player: player,
    draft_time: req.body.draft_time
  }

  server.connection.query("Insert into draft SET ?", draft, function(error, result){
    if(error){
      console.log(error);
      res.status(400).end();
      return;
    }
    res.json(result);
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

//get a list of all the cards and their pick order from a draft
exports.getCardsFromDraft = function(req, res){
  var draft_id = req.draft_id;
  var query = "Select card.*, dp.pack, dp.pick from card inner join draft_picks as dp where dp.id = card.id and dp.draft_id = " + draft_id;
  server.connection.query(query, function(error, rows, fields){
    if(error){
      console.log(error);
      res.status(400).end();
      return;
    }
    res.json(rows);
  });
}

//get a list of all drafts
exports.getAllDrafts = function(req, res){
  var query = "select mtgcube.cube_name, mtgcube.cube_id, draft.* from mtgcube inner join draft where draft.cube_id = mtgcube.cube_id";
  server.connection.query(query, function(error, rows, fields){
    if(error){
      console.log(error);
      res.status(400).end();
      return;
    }
    res.json(rows);
  });
}

//get a list of all drafts for a player
exports.getPlayerDrafts = function(req, res){
  //check if a user is logged in
  if(!req.user){
    //send empty array if no player is logged in
    //no player means no player drafts
    res.json([]);
  }

  var query = "select mtgcube.cube_name, mtgcube.cube_id, draft.* from mtgcube inner join draft where draft.cube_id = mtgcube.cube_id and draft.player = \"" + req.user.username + "\"";
  server.connection.query(query, function(error, rows, fields){
    if(error){
      console.log(error);
      res.status(400).end();
      return;
    }
    res.json(rows);
  });
}

//get a draft id out of the params
exports.draftByID = function(req, res, next, draft_id){
  req.draft_id = draft_id;
  next();
}
