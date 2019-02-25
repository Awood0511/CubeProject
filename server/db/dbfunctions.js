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

//appends cube id to req.cube_id for any api function with :cube_id parameter
exports.cubeByID = function(req, res, next, cube_id){
  req.cube_id = cube_id;
  next();
} //end cubeByID

/*------------------------------------------------------------------------------------------*/

//gets a list of all the mtgcubes in the db
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
  //var cubeId = req.cube_id;
  var copy_info = [];
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
    loopThroughTxt();
  }); //end query

  var addToCopyInfo = function(cname) {
    var matched = false;
    //check if the card name already has a copy
    //if so increment it
    for(var i = 0; i < copy_info.length; i+=1){
      if(copy_info[i].cname === cname){
        matched = true;
        copy_info[i].copies += 1;
        break;
      }
    }
    //create a copy for that card if it doesnt have one
    if(!matched){
      var entry = {cname: cname, copies: 1};
      copy_info.push(entry);
    }
  } //end addToCopyInfo

  var getCopies = function(cname) {
    for(var i = 0; i < copy_info.length; i+=1){
      if(copy_info[i].cname === cname){
        return copy_info[i].copies;
      }
    }
  } //end getCopies

  //add all cards to the cube when passed matching name results
  var addCards = function(rows){
    //build insert array from unique card names found in the previous select statement
    var cube_cards = [];
    //loop through each result and add it to the array if
    //it is the first instance of that card name in the list
    for(var i = 0; i < rows.length; i+=1){
      var first = true;
      //check whether it is the first instance of that card name in the list
      if(i !=0 && rows[i].cname === rows[i-1].cname){
        first = false;
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

        var cube_card = [rows[i].id, cubeId, rows[i].color, main_type, getCopies(rows[i].cname)];
        cube_cards.push(cube_card);
      }
    }

    server.connection.query('INSERT INTO cube_card VALUES ?', [cube_cards], function(err, result){
      if(err){
        console.log(err);
        res.status(400).end();
        return;
      }

      console.log("Added # of cards: " + result.affectedRows);
      fs.unlinkSync('./uploads/' + req.file.filename); //delete the uploaded txt file
      res.status(200).end();
    }); //end query
  } //end addCards

  //find all ids associated with the card names in the txt
  var findCards = function(list){
    //if any ids are found pass them to addCards
    var query = "Select id,cname,color,type_line From multiface where cname IN (" + list + ") Union SELECT id,cname,color,type_line FROM card where cname IN (" + list + ") order by cname asc";
    server.connection.query(query, function(err, rows, fields){
      if(err){
        console.log(err);
        res.status(400).end();
        return;
      }
      if(!rows[0]){
        console.log("Could not find any of the cards.");
        res.status(200).end();
      } else {
        addCards(rows);
      }
    }); //end query
  } //end findCards

  var loopThroughTxt = function(){
    var allCards = fs.readFileSync('./uploads/' + req.file.filename).toString().split("\n");
    var trimmedName = allCards[0].substring(0, allCards[0].length-1);
    addToCopyInfo(trimmedName);
    var searchList = "\"" + trimmedName + "\""; //first string in list of names
    for(var i = 1; i < allCards.length; i+=1){
      //build IN list of all the card names in the txt file
      //remove carriage return from end of card name
      trimmedName = allCards[i].substring(0, allCards[i].length-1);
      if(!trimmedName.includes("\"")){
        searchList += ", \"" + trimmedName + "\"";
        addToCopyInfo(trimmedName);
      }
    }
    findCards(searchList);
  } //end loopThroughTxt

} //end addTxtToCube
/*------------------------------------------------------------------------------------------*/
