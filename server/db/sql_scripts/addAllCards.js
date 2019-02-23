// PURPOSE:
// Run this script to add all the cards from the array of set codes into the db

var mysql = require('mysql'),
    request = require('request'),
    dbconfig = require('../../config/dbconfig.js');

//missing unsets and mtgo online only sets
var allSets = ['lea', 'leb', '2ed', 'arn', 'atq', '3ed', 'leg', 'drk', 'fem',
               '4ed', 'ice', 'chr', 'hml', 'all', 'mir', 'vis', '5ed', 'por',
               'wth', 'tmp', 'sth', 'exo', 'p02', 'usg', 'ath', 'ulg', '6ed',
               'uds', 'ptk', 's99', 'mmq', 'brb', 'nem', 's00', 'pcy', 'inv',
               'btd', 'pls', '7ed', 'apc', 'ody', 'dkm', 'tor', 'jud', 'ons',
               'lgn', 'scg', '8ed', 'mrd', 'dst', '5dn', 'chk', 'bok', 'sok',
               '9ed', 'rav', 'gpt', 'dis', 'csp', 'tsp', 'plc', 'fut', '10e',
               'lrw', 'evg', 'mor', 'shm', 'eve', 'drb', 'ala', 'dd2', 'con',
               'ddc', 'arb', 'm10', 'td0', 'v09', 'hop',
               'zen', 'ddd', 'h09', 'wwk', 'dde', 'roe', 'dpa', 'arc', 'm11',
               'v10', 'ddf', 'som', 'pd2', 'mbs', 'ddg', 'nph', 'cmd', 'm12',
               'v11', 'ddh', 'isd', 'pd3', 'dka', 'ddi', 'avr', 'pc2', 'm13',
               'v12', 'ddj', 'rtr', 'cm1', 'gtc', 'ddk', 'dgm', 'mma', 'm14',
               'v13', 'ddl', 'ths', 'c13', 'bng', 'ddm', 'jou', 'md1', 'cns',
               'm15', 'v14', 'ddn', 'ktk', 'c14', 'frf', 'ddo', 'dtk',
               'mm2', 'ori', 'v15', 'ddp', 'bfz', 'exp', 'c15', 'ogw', 'ddq',
               'w16', 'soi', 'ema', 'emn', 'v16', 'cn2', 'ddr', 'kld', 'mps',
               'c16', 'pca', 'aer', 'mm3', 'dds', 'w17', 'akh', 'mp2', 'hou',
               'cma', 'e01', 'c17', 'xln', 'ddt', 'ima', 'e02', 'v17', 'rix',
               'a25', 'ddu', 'dom', 'cm2', 'bbd', 'ss1', 'gs1', 'm19', 'c18',
               'med', 'grn', 'gk1', 'gnt', 'uma', 'rna', 'gk2'];

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
var insertCard = function(card){
  var cardInfo = {
    cmc: card.cmc,
    manacost: card.mana_cost,
    color: null,
    cname: card.name,
    oracle_text: card.oracle_text,
    flavor_text: card.flavor_text,
    power: card.power,
    toughness: card.toughness,
    type_line: card.type_line,
    image: null,
    price: card.prices.usd,
    rarity: card.rarity,
    set_code: card.set,
    set_name: card.set_name,
    layout: card.layout,
    artist: card.artist,
    scryfall: card.uri,
    rulings: card.rulings_uri
  };

  try{
    cardInfo.image = card.image_uris.large;
  } catch(err) {
    console.log("No large for this card, trying another.");
    try{
      cardInfo.image = card.image_uris.normal;
    } catch(err) {
      console.log("No normal for this card, trying another.");
      try{
        cardInfo.image = card.image_uris.small;
      } catch(err) {
        console.log("No small for this card, trying another.");
        try{
          cardInfo.image = card.image_uris.border_crop;
        } catch(err) {
          console.log("Out of options.");
        }
      }
    }
  }

  //insert card into the table with above info pulled from scryfall card object
  var query = connection.query('INSERT INTO Card SET ?', cardInfo, function(err, result){
    if(err){
      console.log(err);
      return;
    }
    console.log("Inserted: " + cardInfo.cname + ", " + cardInfo.set_code);
  }); //end query
}; //end insertCard

//gets all card information from a single mtg set and sends each to insertCard()
var getSet = function(set){
  //url of the first page for the set
  var dest = 'https://api.scryfall.com/cards/search?q=set%3A' + set;

  //query scryfall api for the current set
  var getSetPage = function(url){
    console.log("requesting: " + dest);
    request(url, { json: true }, (err, res, body) => {
      if (err) {
        //log the error
        return console.log(err);
      } else {
        //loop through the data array and add the cards to the card table
        var json_arr = body.data;
        json_arr.forEach(function(card) {
          insertCard(card);
        }); //forEach end
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
var timer = setInterval(getAllSets, 10000);
