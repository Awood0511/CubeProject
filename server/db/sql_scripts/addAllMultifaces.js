// PURPOSE:
// Run this script to add all the multiface card information to the Multiface
// table and connect them to their primary card in the Card table

var mysql = require('mysql'),
    request = require('request'),
    fs = require('fs'),
    dbconfig = require('../../config/dbconfig.js');

var allCards;
var len;
var currentRow = 0;
var timer;

//connect to mysql
var connection = mysql.createConnection({
  host: dbconfig.db.host,
  user: dbconfig.db.user,
  password: dbconfig.db.password,
  database: dbconfig.db.database
});
connection.connect(function(error){
  if(error){
    console.log("Could not connect to db.");
    console.log(error);
  } else {
    console.log("Connected to db: ", dbconfig.db.database);
  }
});

// save the info of the passed in card face
var saveCardFace = function(face, primary, card){
  var faceInfo = {
    id: card.id,
    manacost: face.mana_cost,
    cname: face.name,
    oracle_text: face.oracle_text,
    flavor_text: face.flavor_text,
    power: face.power,
    toughness: face.toughness,
    type_line: face.type_line,
    image: null,
    primary_face: primary,
    layout: card.layout
  };

  try{
    faceInfo.image = face.image_uris.large;
  } catch(err) {
    try{
      faceInfo.image = face.image_uris.normal;
    } catch(err) {
      try{
        faceInfo.image = face.image_uris.small;
      } catch(err) {
        try{
          faceInfo.image = face.image_uris.border_crop;
        } catch(err) {
          //no image
        }
      }
    }
  }

  //insert card into the table with above info pulled from scryfall card object
  var query = connection.query('INSERT INTO multiface SET ?', faceInfo, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    console.log("Inserted: " + faceInfo.cname);
  }); //end query
} //end saveCardFace

// get the face information for each card
var loopThroughRows = function(){
  var card = allCards[currentRow];

  //clear interval if out of cards
  currentRow++;
  if(currentRow >= len){
    clearInterval(timer);
    console.log("Done");
  }

  request(card.scryfall, {json: true}, function(error, res, body) {
    // Save the info for both faces in the Multiface table
    saveCardFace(body.card_faces[0], 1, card);
    saveCardFace(body.card_faces[1], 0, card);
  });
}

// gets a list of all the multiface cards in the db and initiates the process of looping through them
connection.query("select id,scryfall,layout from card where cname like \"%//%\"", function(err, rows, fields){
  if(err){
    console.log(err);
  }
  allCards = rows;
  len = rows.length;
  timer = setInterval(loopThroughRows, 500);
});
