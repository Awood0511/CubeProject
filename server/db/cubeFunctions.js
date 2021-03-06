var server = require("../config/express.js"),
    mysql = require('mysql'),
    fs = require('fs');

/*------------------------------------------------------------------------------------------*/

//get card and cube_card information for all cards in a cube
exports.getCubeCards = function(req, res, next) {
  var query_str = "select c.*, cc.color as cc_color, cc.main_type, cc.copies from Card as c INNER JOIN Cube_card as cc ON c.id = cc.id AND cc.cube_id =" + req.cube_id;
  server.connection.query(query_str, function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(400);
      return;
    }
    req.cube_cards = rows;
    next();
  }); //end query
} //end getCubeCards

//get multiface information for mf cards in the cube
exports.getCubeMFCards = function(req, res) {
  var query_str = "select mf.* from Card as c INNER JOIN Cube_card as cc ON c.id = cc.id AND cc.cube_id =" + req.cube_id + " INNER JOIN multiface as mf on mf.id = c.id";
  server.connection.query(query_str, function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(400);
      return;
    }
    res.json([req.cube_cards, rows]);
  }); //end query
} //end getCubeMFCards

//gets cards that share a cname with cards in a cube to facilitate swapping sets
exports.getEditCards = function(req, res) {
  var query = "select * from card where cname in (select card.cname from card as c,cube_card as cc where cc.cube_id = " + req.cube_id + " and c.id = cc.id) order by cname";
  server.connection.query(query, function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(400).end();
      return;
    }

    //allocate a hash table to store sets and ids indexed by the card name
    var hashTable = new Array(27);
    for(var i = 0; i < 27; i+=1){
      // initialize each entry to an empty array
      hashTable[i] = [];
    }
    //add all of the edit cards to the hash table
    for(var i = 0; i < rows.length; i+=1){
      addToEditHashTable(rows[i], hashTable);
    }

    //return information
    res.json([req.cube_cards, hashTable]);
  });
} //end getCubeCards

//add a card name to the hash table
var addToEditHashTable = function(editCard, hashTable){
  var index = getEditTableIndex(editCard.cname);
  var existed = false;

  //check if the cname is already in the table
  for(var i = 0; i < hashTable[index].length; i+=1){
    //if matches, add the set_code and id
    if(editCard.cname === hashTable[index][i].cname){
      existed = true;
      var newSetIdPair = {
        id: editCard.id,
        set_code: editCard.set_code
      };
      hashTable[index][i].setIdPair.push(newSetIdPair);
      break;
    }
  }

  //if cname not in table create a new entry for it
  if(!existed){
    var newEntry = {
      cname: editCard.cname,
      setIdPair: [{
        id: editCard.id,
        set_code: editCard.set_code
      }]
    };

    hashTable[index].push(newEntry);
  }
}

//get the bucket index from the card name
var getEditTableIndex = function(cname){
  //determine index for the key 0-26 -> a-z else index 27
  var index = (cname.toUpperCase().charCodeAt(0)) - 65;

  if(index < 0 || index > 25)
    index = 26;

  return index;
}

/*------------------------------------------------------------------------------------------*/

//appends cube id to req.cube_id for any api function with :cube_id parameter
exports.cubeByID = function(req, res, next, cube_id){
  req.cube_id = cube_id;
  next();
} //end cubeByID

//checks if the cube_id belongs to the currently logged in user to prevent
//edits/access by people who do not own it
exports.checkCubeOwner = function(req, res, next){
  var username;
  if(!req.user){
      username = "Anonymous";
  }
  else{
    username = req.user.username;
  }

  server.connection.query("Select * from mtgcube where cube_id = " + req.cube_id, function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(400).end();
      return;
    }
    //deny access if cube owner != current user's username
    if(!rows[0]){
      res.status(400).send("Access Denied");
    }
    else if(rows[0].player !== username){
      res.status(400).send("Access Denied");
    }
    else{
      next();
    }
  });
}

/*------------------------------------------------------------------------------------------*/

//gets a list of all the mtgcubes in the db
exports.getCubes = function(req, res) {
  var query_str = "select * from mtgcube";
  server.connection.query(query_str, function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(400);
    } else {
      res.json(rows);
    }
  }); //end query
} //end getCubes

//gets a list of all the mtgcubes associated with the current user
exports.getPlayerCubes = function(req, res) {
  var query_str = "select * from mtgcube where player = \"" + req.user.username + "\"";
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

//create a cube given a player and a cube name
exports.createCube = function(req, res) {
  console.log(req.body);
  var entry = {
    player: req.user.username,
    cube_name: req.body.cube_name
  };

  server.connection.query("Insert into mtgcube set ?", entry, function(err, result){
    if(err){
      console.log(err);
      res.status(400).end();
      return;
    }
    console.log("Created a cube: " + entry[1]);
    res.status(200).location('/');
  });
} // end createCube

/*------------------------------------------------------------------------------------------*/

exports.updateCube = function(req, res) {
  var cube_id = req.cube_id,
      changeType = req.body.changeType,
      idToChange = req.body.idToChange,
      changeVal = req.body.changeVal;

  //changing set by swapping ids
  if(changeType === "id" || changeType === "copies"){
    var query = "update cube_card set " + changeType + " = " + changeVal + " where cube_id = " + cube_id + " and id = " + idToChange;
    server.connection.query(query, function(err, result){
      if(err){
        console.log(err);
        res.status(400).end();
        return;
      }
      res.status(200).end();
    });
  }
  else if(changeType === "color" || changeType === "main_type"){
    var query = "update cube_card set " + changeType + " = \"" + changeVal + "\" where cube_id = " + cube_id + " and id = " + idToChange;
    server.connection.query(query, function(err, result){
      if(err){
        console.log(err);
        res.status(400).end();
        return;
      }
      res.status(200).end();
    });
  }
  else if(changeType === "delete"){
    var query = "delete from cube_card where cube_id = " + cube_id + " and id = " + idToChange;
    server.connection.query(query, function(err, result){
      if(err){
        console.log(err);
        res.status(400).end();
        return;
      }
      res.status(200).end();
    });
  }
} //end updateCube

/*------------------------------------------------------------------------------------------*/
//add cards from a text file to the cube, return any cards that were not added properly
exports.addTxtToCube = function(req, res){
  var cubeId = req.cube_id;
  var copy_info = [];
  var cube_info;

  //check the current cards in their cube to prevent duplicate insertion
  var query = "select cube_card.* from cube_card inner join card where card.id = cube_card.id and cube_card.cube_id = " + cubeId;
  server.connection.query(query, function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(400).end();
      return;
    }
    cube_info = rows;
    //start process of reading text upload
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
      if(copy_info[i].cname.toUpperCase() === cname.toUpperCase()){
        return copy_info[i].copies;
      }
    }
  } //end getCopies

  //updates the copies of cards found in the txt that are already in the db for this cube
  var updateCards = function(updateList) {
    console.log("Updating cube " + cubeId + " with:");
    console.log(updateList);
    //loop through each card in the list and update its copies count
    for(var i = 0; i < updateList.length; i+=1){
      var query = "update cube_card set copies = " + updateList[i].newCopies + " where id = " + updateList[i].id + " and cube_id = " + cubeId;
      server.connection.query(query, function(err, result){
        if(err){
          console.log(err);
          res.status(400).end();
          return;
        }
      }); //end query
    }

    //done
    res.status(200).end();
    fs.unlinkSync('./uploads/' + req.file.filename); //delete the uploaded txt file
  } //end updateCards

  //add all cards to the cube that had matching name results
  var addCards = function(rows){
    //build insert array from unique card names found in the previous select statement
    var cube_cards = [];
    //build update array to add new copies to existing cards in the cube
    var update_cards = [];

    //loop through each result and add it to the array if
    //it is the first instance of that card name in the list
    for(var i = 0; i < rows.length; i+=1){
      var first = true;
      var newEntry = true;
      //check whether it is the first instance of that card name in the list
      if(i !=0 && rows[i].cname === rows[i-1].cname){
        first = false;
      }

      //check whether it is already in the cube
      if(first){
        for(var k = 0; k < cube_info.length; k+=1){
          if(rows[i].id === cube_info[k].id){
            newEntry = false;
            var update_card = {id: rows[i].id, newCopies: getCopies(rows[i].cname) + cube_info[k].copies};
            update_cards.push(update_card);
            break;
          }
        }
      }

      if(first && newEntry){
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

    if(cube_cards.length > 0){
      server.connection.query('INSERT INTO cube_card VALUES ?', [cube_cards], function(err, result){
        if(err){
          console.log(err);
          res.status(400).end();
          return;
        }

        console.log("Added # of cards: " + result.affectedRows);
      }); //end query
    }
    //update the cards that need to be updated
    updateCards(update_cards);
  } //end addCards

  //find all ids associated with the card names in the txt
  var allCards;
  var cardsToAdd;
  var findCards = function(list){
    //if any ids are found pass them to addCards
    var query = "Select id,cname,color,type_line From multiface where cname IN (" + list + ") Union SELECT id,cname,color,type_line FROM card where cname IN (" + list + ") order by cname asc";
    server.connection.query(query, function(err, rows, fields){
      if(err){
        console.log(err);
        res.status(400).end();
        return;
      }

      //log which cards were not found from the txt file
      console.log("Didn't Add:");
      for(var i = 0; i < allCards.length; i+=1){
        var matched = false;
        for(var k = 0; k < rows.length; k+=1){
          if(allCards[i].toUpperCase() === rows[k].cname.toUpperCase()){
            matched = true;
            break;
          }
        }
        if(!matched){
          console.log(allCards[i]);
        }
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
    allCards = fs.readFileSync('./uploads/' + req.file.filename).toString().split("\n");
    cardsToAdd = allCards.length;
    var trimmedName = allCards[0].substring(0, allCards[0].length-1);
    addToCopyInfo(trimmedName);
    allCards[0] = trimmedName;
    var searchList = "\"" + trimmedName + "\""; //first string in list of names
    for(var i = 1; i < allCards.length; i+=1){
      //build IN list of all the card names in the txt file
      //remove carriage return from end of card name
      trimmedName = allCards[i].substring(0, allCards[i].length-1);
      if(!trimmedName.includes("\"")){
        searchList += ", \"" + trimmedName + "\"";
        addToCopyInfo(trimmedName);
        allCards[i] = trimmedName;
      }
    }
    findCards(searchList);
  } //end loopThroughTxt

} //end addTxtToCube
/*------------------------------------------------------------------------------------------*/
