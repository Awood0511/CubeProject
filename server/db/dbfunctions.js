var server = require("../config/express.js"),
    mysql = require('mysql'),
    fs = require('fs');

/*------------------------------------------------------------------------------------------*/

//get card and cube_card information
exports.getCubeCards = function(req, res, next) {
  query_str = "select c.*, cc.color as cc_color, cc.main_type, cc.copies from Card as c INNER JOIN Cube_card as cc ON c.id = cc.id AND cc.cube_id =" + req.cube_id;
  server.connection.query(query_str, function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(400);
    } else {
      req.cube_cards = rows;
      next();
    }
  }); //end query
} //end getCubeCards

//get multiface information for mf cards in the cube
exports.getCubeMFCards = function(req, res) {
  query_str = "select mf.* from Card as c INNER JOIN Cube_card as cc ON c.id = cc.id AND cc.cube_id =" + req.cube_id + " INNER JOIN multiface as mf on mf.id = c.id";
  server.connection.query(query_str, function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(400);
    } else {
      res.json([req.cube_cards, rows]);
    }
  }); //end query
} //end getCubeMFCards

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
  var cubeId;
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
    cubeId = result.insertId;
    console.log("Calling loopThroughTxt");
    loopThroughTxt();
  }); //end query

  //add all cards to the cube when passed matching name results
  var addCards = function(rows){
    //build insert array from unique card names found in the previous select statement
    var cube_cards = [];
    //loop through each result and add it to the array if
    //it is the first instance of that card name in the list
    for(var i = 0; i < rows.length; i+=1){
      var first = true;
      var k = i-1;
      //check whether it is the first instance of that card name in the list
      while(first && k >= 0){
        if(rows[i].cname === rows[k].cname){
          first = false;
        }
        k -= 1;
      }
      if(first){
        var main_type = null;
        // determine primary typeline for the card
        if(rows[i].type_line.includes("Creature")){
          main_type = "Creature";
        }
        else if(rows[i].type_line.includes("Artifact")){
          main_type = "Artifact";
        }
        else if(rows[i].type_line.includes("Enchantment")){
          main_type = "Enchantment";
        }
        else if(rows[i].type_line.includes("Planeswalker")){
          main_type = "Planeswalker";
        }
        else if(rows[i].type_line.includes("Land")){
          main_type = "Land";
        }
        else if(rows[i].type_line.includes("Instant")){
          main_type = "Instant";
        }
        else if(rows[i].type_line.includes("Sorcery")){
          main_type = "Sorcery";
        }

        var cube_card = [rows[i].id, cubeId, rows[i].color, main_type, 1];
        cube_cards.push(cube_card);
      }
    }

    server.connection.query('INSERT INTO cube_card VALUES ?', [cube_cards], function(err, result){
      if(err){
        console.log(err);
        res.status(400).end();
      }
      console.log("Added # of cards: " + result.affectedRows);
      fs.unlinkSync('./uploads/' + req.file.filename); //delete the uploaded txt file
      res.status(200).end();
    }); //end query
  } //end addCards

  //find all ids associated with the card names in the txt
  var findCards = function(list){
    try{
      //if any ids are found pass them to addCards
      var query = "Select id,cname,color,type_line From multiface where cname IN (" + list + ") Union SELECT id,cname,color,type_line FROM card where cname IN (" + list + ")";
      server.connection.query(query, function(err, rows, fields){
        if(!rows[0]){
          console.log("Could not find any of the cards.");
          res.status(200).end();
        } else {
          addCards(rows);
        }
      }); //end query
    } catch(err) {
      console.log("An error occured at findCards in addTxtToCube");
      res.status(400).end();
    } //end try/catch
  } //end findCards

  var loopThroughTxt = function(){
    var allCards = fs.readFileSync('./uploads/' + req.file.filename).toString().split("\n");
    var searchList = "\"" + allCards[0].substring(0, allCards[0].length-1) + "\""; //first string in list of names
    for(var i = 1; i < allCards.length; i+=1){
      //build IN list of all the card names in the txt file
      //remove carriage return from end of card name
      var trimmedName = allCards[i].substring(0, allCards[i].length-1);
      searchList += ", \"" + trimmedName + "\"";
    }
    findCards(searchList);
  } //end loopThroughTxt

} //end addTxtToCube
/*------------------------------------------------------------------------------------------*/
