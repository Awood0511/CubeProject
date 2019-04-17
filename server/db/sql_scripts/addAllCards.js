// PURPOSE:
// Run this script to add all the cards from the array of set codes into the db

var mysql = require('mysql'),
    request = require('request'),
    dbconfig = require('../../config/dbconfig.js');

//missing: unsets / mtgo online only sets / promo sets
var allSets = [
  //core sets
  'LEA','LEB','2ED','3ED','4ED','5ED','6ED','7ED','8ED','9ED','10E','M10','M11',
  'M12','M13','M14','M15','ORI','M19',
  //expansion sets
  'ARN','ATQ','LEG','DRK','FEM','HML','ICE','ALL','MIR','VIS','WTH','TMP','STH',
  'EXO','USG','ULG','UDS','MMQ','NEM','PCY','INV','PLS','APC','ODY','TOR','JUD',
  'ONS','LGN','SCG','MRD','DST','5DN','CHK','BOK','SOK','RAV','GPT','DIS','CSP',
  'TSP','TSB','PLC','FUT','LRW','MOR','SHM','EVE','ALA','CON','ARB','ZEN','WWK',
  'ROE','SOM','MBS','NPH','ISD','DKA','AVR','RTR','GTC','DGM','THS','BNG','JOU',
  'KTK','FRF','DTK','BFZ','OGW','SOI','EMN','KLD','AER','AKH','HOU','XLN','RIX',
  'DOM','GRN','RNA',
  //Intro Sets
  'POR','P02','PTK','S99','S00','GS1',
  //compilation sets
  'CHR','ATH','BRB','BTD','DKM','DPA','MD1',
  //duel decks
  'EVG','DD2','DDC','DDD','DDE','DDF','DDG','DDH','DDI','DDJ','DDK','DDL','DDM',
  'DDN','DDO','DDP','DDQ','DDR','DDS','DDT','DDU',
  //ftv/spellbook
  'DRB','V09','V10','V11','V12','V13','V14','V15','V16','V17','SS1',
  //premium deck series
  'H09','PD2','PD3',
  //masters sets
  'MMA','MM2','EMA','MM3','IMA','A25','UMA',
  //masterpieces
  'EXP','MPS','MP2','MED',
  //multiplayer sets
  'HOP','PC2','PCA','ARC','E01','CMD','CM1','C13','C14','C15','C16','CMA','C17',
  'CM2','C18','CNS','CN2','E02','BBD',
  //non-legal sets TODO: un-sets
  'CED',
  //fnm cards
  'F01','F02','F03','F04','F05','F06','F07','F08','F09','F10','F11','F12','F13','F14','F15','F16','F17','F18'
  //promo cards TODO
];

var currentSet = 0;

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

//inserts a card into the card table given a json object of a card from scryfall
//cardInfo must match the database table structure in mySQL
var insertCards = function(cards){
  var cardsInfo = [];

  cards.forEach(function(card){
    var cardInfo = [
      card.cmc,
      card.mana_cost,
      null,
      card.name,
      card.oracle_text,
      card.flavor_text,
      card.power,
      card.toughness,
      card.type_line,
      null,
      card.prices.usd,
      card.rarity,
      card.set,
      card.set_name,
      card.layout,
      card.artist,
      card.uri,
      card.rulings_uri
    ];

    try{
      cardInfo[9] = card.image_uris.large;
    } catch(err) {
      console.log("No large for this card, trying another.");
      try{
        cardInfo[9] = card.image_uris.normal;
      } catch(err) {
        console.log("No normal for this card, trying another.");
        try{
          cardInfo[9] = card.image_uris.small;
        } catch(err) {
          console.log("No small for this card, trying another.");
          try{
            cardInfo[9] = card.image_uris.border_crop;
          } catch(err) {
            console.log("Out of options.");
          }
        }
      }
    }

    //dont add basics to card table
    if(card.name != "Plains" && card.name != "Island" && card.name != "Swamp" && card.name != "Mountain" && card.name != "Forest"){
      cardsInfo.push(cardInfo);
    }
  });

  //insert card into the table with above info pulled from scryfall card object
  var query = connection.query('INSERT INTO Card (cmc,manacost,color,cname,oracle_text,flavor_text,power,toughness,type_line,image,price,rarity,set_code,set_name,layout,artist,scryfall,rulings) VALUES ?', [cardsInfo], function(err, result){
    if(err){
      console.log(err);
      return;
    }
  }); //end query
}; //end insertCard

//gets all card information from a single mtg set and sends each to insertCard()
var getSet = function(set){
  //url of the first page for the set
  var dest = 'https://api.scryfall.com/cards/search?q=set%3A' + set;

  //query scryfall api for the current set
  var getSetPage = function(url){
    console.log("requesting: " + set);
    request(url, { json: true }, (err, res, body) => {
      if (err) {
        //log the error
        return console.log(err);
      } else {
        //loop through the data array and add the cards to the card table
        var json_arr = body.data;
        insertCards(json_arr);
        //call getSetPage on the next page of the set
        if(body.has_more){
          getSetPage(body.next_page);
        }
      }
    }); //request end
  } //getSetPage end
  getSetPage(dest); //call the function on the first page of the set
} //getSet end

//Calls getSet on all sets specified in the allSets array
var getAllSets = function(){
  //call getSet on the current set
  getSet(allSets[currentSet]);
  currentSet++;

  //end timeout if out of sets
  if(currentSet >= allSets.length){
    clearInterval(timer);
    console.log("Interval cleared");
  }
}

//set an interval to call getAllSets
var timer = setInterval(getAllSets, 5000);
