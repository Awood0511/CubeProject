//PURPOSE
//Creates a Cube and adds all the cards found in a text file to that cube
//Must contain extra parenthesis around name and owner
//Can not identify flip cards unless in // seperated format

var mysql = require('mysql'),
    fs = require('fs'),
    dbconfig = require('../../config/dbconfig.js');

var cube_info = {
  player: "MTGO",
  cube_name: "MTGO Vintage Cube 2018/2019"
};

var insertID;

var file_path = "./dependencies/mtgo_vintage_cube_winter_201819.txt";

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

//create the cube
connection.query('INSERT INTO Mtgcube SET ?', cube_info, function(err, result){
  if(err){
    console.log(err);
    return;
  }
  console.log("Created Cube " + cube_info.cube_name);
  insertID = result.insertId;
  loopThroughTxt();
}); //end query

//add a card to the cube given its id
var addCard = function(card){
  var cube_card_info = {
    cube_id: insertID,
    id: card.id,
    copies: 1
  };

  connection.query('INSERT INTO cube_card SET ?', cube_card_info, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    console.log("Added card: " + card.cname);
  }); //end query
} //end addCard

//find an id associated with the card name
var findCard = function(card){
  try{
    //if an id is found pass it to addCard
    var query = "Select id,cname From Multiface where cname = \"" + card + "\"" + "Union SELECT id,cname FROM card where cname = \"" + card + "\"";
    connection.query(query, function(err, rows, fields){
      if(err){
        console.log(err);
        return;
      }

      if(!rows[0]){
        console.log("Could not find: " + card);
      } else {
        addCard(rows[0]);
      }
    }); //end query
  } catch(err) {
    console.log("An error occured at card: " + card);
  } //end try/catch
} //end addCardToCube

var loopThroughTxt = function(){
  console.log("Begin reading txt file.");
  var allCards = fs.readFileSync(file_path).toString().split("\n");
  allCards.forEach(function(card){
    //remove carriage return from end of card name
    var trimmedName = card.substring(0, card.length-1);
    findCard(trimmedName);
  }); //end forEach
} //end loopThroughTxt
