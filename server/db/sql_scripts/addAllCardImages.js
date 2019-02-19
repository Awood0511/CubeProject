// PURPOSE:
// Run this script to add all the cards images for the cards in the db

var mysql = require('mysql'),
    request = require('request'),
    fs = require('fs'),
    dbconfig = require('../../config/dbconfig.js');

var allCards;
var len;
var currentRow = 0;

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

//This iterates through the rows and saves an image for each card
var loopThroughRows = function(){
  request(allCards[currentRow].image, {encoding: 'binary'}, function(error, response, body) {
    fs.writeFile(allCards[currentRow].id + '.jpg', body, 'binary', function (err) {
      if(err){
        console.log(err);
        return;
      }
      console.log("Writing image: " + allCards[currentRow].id + '.jpg');
      currentRow++;
      if(currentRow != len){
        loopThroughRows();
      }
    });
  });
}

// gets a list of all the cards in the db and initiates the process of looping through them
connection.query("SELECT id,image FROM Card where image is not null", function(err, rows, fields){
  if(err){
    console.log(err);
  }
  allCards = rows;
  len = rows.length;
  loopThroughRows();
});
