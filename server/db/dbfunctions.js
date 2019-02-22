var server = require("../config/express.js"),
    mysql = require('mysql'),
    fs = require('fs');

/*------------------------------------------------------------------------------------------*/

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

/*------------------------------------------------------------------------------------------*/

exports.cubeByID = function(req, res, next, cube_id){
  req.cube_id = cube_id;
  next();
} //end cubeByID

/*------------------------------------------------------------------------------------------*/

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

/*------------------------------------------------------------------------------------------*/
//add cards from a text file to the cube, return any cards that were not added properly
exports.addTxtToCube = function(req, res){
  var insertID;
  var maxInserts;
  var curr = 0;
  var cube_info = {
    player: req.body.player,
    cube_name: req.body.cubename
  };

  //create the cube
  server.connection.query('INSERT INTO mtgcube SET ?', cube_info, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    console.log("Created Cube " + cube_info.cube_name);
    insertID = result.insertId;
    loopThroughTxt();
  }); //end query

  //check if completed inserting or trying to insert all the cards
  var checkExit = function(){
    if(curr >= maxInserts){
      res.send("Done");
    }
  }

  //add a card to the cube given its id
  var addCard = function(card){
    var cube_card_info = {
      cube_id: insertID,
      id: card.id,
      copies: 1
    };

    server.connection.query('INSERT INTO cube_card SET ?', cube_card_info, function(err, result){
      if(err){
        console.log(err);
        return;
      }
      console.log("Added card: " + card.cname);
      curr += 1;
      checkExit();
    }); //end query
  } //end addCard

  //find an id associated with the card name
  var findCard = function(card){
    try{
      //if an id is found pass it to addCard
      var query = "Select id,cname From Multiface where cname = \"" + card + "\"" + "Union SELECT id,cname FROM card where cname = \"" + card + "\"";
      server.connection.query(query, function(err, rows, fields){
        if(err){
          console.log(err);
          return;
        }

        if(!rows[0]){
          console.log("Could not find: " + card);
          curr += 1;
          checkExit();
        } else {
          addCard(rows[0]);
        }
      }); //end query
    } catch(err) {
      console.log("An error occured at card: " + card);
    } //end try/catch
  } //end findCard

  var loopThroughTxt = function(){
    console.log("Begin reading txt file.");
    var allCards = fs.readFileSync('./uploads/' + req.file.filename).toString().split("\n");
    maxInserts = allCards.length;
    allCards.forEach(function(card){
      //remove carriage return from end of card name
      var trimmedName = card.substring(0, card.length-1);
      findCard(trimmedName);
    }); //end forEach
  } //end loopThroughTxt

} //end addTxtToCube
