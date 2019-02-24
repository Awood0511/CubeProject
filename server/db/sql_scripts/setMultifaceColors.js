//PURPOSE
//Finds colors for multiface cards and updates the color to the main card table
//only updates transform cards to the main card table, split cards will be correct

var mysql = require('mysql'),
    dbconfig = require('../../config/dbconfig.js');

var allColorsDone = 0;

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

//get all cards from the cube that are being updated
connection.query("select mf_id,manacost from multiface where manacost is not null", function(err, rows, fields){
  if(err){
    console.log(err);
    return;
  }
  determineColors(rows);
}); //end query

//set all of the colors in card equal to the color of the primary faces in multiface
var updatePrimaryFacesInCard = function(){
  var query = "select id,color,manacost from multiface where primary_face = 1 and layout = \"transform\"";
  connection.query(query, function(err, rows, fields){
    if(err){
      console.log(err);
      return;
    }

    //for each result, update id in card to have color
    rows.forEach(function(mf){
      var query2 = "update card set color =\"" + mf.color + "\", manacost = \"" + mf.manacost + "\" where id = " + mf.id;
      connection.query(query2, function(err, result){
        if(err){
          console.log(err);
          return;
        }

        console.log("Updated " + mf.id);
      }); //end query
    });
  }); //end query

}

//insert cardColor into the db for each id in cardArr
var insertColors = function(cardArr, cardColor){
  var list = "" + cardArr[0];
  //build the IN string to only change cards with IDs in cardArr
  for(var i = 1; i < cardArr.length; i+=1){
    list += ", " + cardArr[i];
  }
  var query = "Update multiface set color = \"" + cardColor + "\" where mf_id in (" + list + ")";
  connection.query(query, function(err, result){
    if(err){
      console.log("Nothing found of color: " + cardColor);
      allColorsDone+=1;
      if(allColorsDone === 32){
        updatePrimaryFacesInCard();
      }
      return;
    }
    console.log("Updated all " + cardColor);

    allColorsDone+=1;
    if(allColorsDone === 32){
      updatePrimaryFacesInCard();
    }
  }); //end query
}

var determineColors = function(allCards) {
  var white = [],
      blue = [],
      black = [],
      red = [],
      green = [],
      azorius = [],
      dimir = [],
      rakdos = [],
      gruul = [],
      selesnya = [],
      orzhov = [],
      izzet = [],
      golgari = [],
      boros = [],
      simic = [],
      bant = [],
      esper = [],
      grixis = [],
      jund = [],
      naya = [],
      abzan = [],
      jeskai = [],
      sultai = [],
      mardu = [],
      temur = [],
      nonwhite = [],
      nonblue = [],
      nonblack = [],
      nonred = [],
      nongreen = [],
      rainbow = [],
      colorless = [];

      allCards.forEach(function(card){
        var w = card.manacost.includes("{W}"),
            u = card.manacost.includes("{U}"),
            b = card.manacost.includes("{B}"),
            r = card.manacost.includes("{R}"),
            g = card.manacost.includes("{G}");

        if(w&&u&&b&&r&&g){
          rainbow.push(card.mf_id);
        }
        else if(w&&u&&b&&r){
          nongreen.push(card.mf_id);
        }
        else if(w&&u&&b&&g){
          nonred.push(card.mf_id);
        }
        else if(w&&u&&r&&g){
          nonblack.push(card.mf_id);
        }
        else if(w&&b&&r&&g){
          nonblue.push(card.mf_id);
        }
        else if(u&&b&&r&&g){
          nonwhite.push(card.mf_id);
        }
        else if(r&&g&&b){
          jund.push(card.mf_id);
        }
        else if(w&&g&&u){
          bant.push(card.mf_id);
        }
        else if(b&&r&&u){
          grixis.push(card.mf_id);
        }
        else if(g&&w&&r){
          naya.push(card.mf_id);
        }
        else if(u&&w&&b){
          esper.push(card.mf_id);
        }
        else if(u&&r&&w){
          jeskai.push(card.mf_id);
        }
        else if(r&&b&&w){
          mardu.push(card.mf_id);
        }
        else if(b&&g&&u){
          sultai.push(card.mf_id);
        }
        else if(g&&u&&r){
          temur.push(card.mf_id);
        }
        else if(w&&b&&g){
          abzan.push(card.mf_id);
        }
        else if(w&&u){
          azorius.push(card.mf_id);
        }
        else if(u&&b){
          dimir.push(card.mf_id);
        }
        else if(b&&r){
          rakdos.push(card.mf_id);
        }
        else if(g&&r){
          gruul.push(card.mf_id);
        }
        else if(w&&g){
          selesnya.push(card.mf_id);
        }
        else if(w&&b){
          orzhov.push(card.mf_id);
        }
        else if(u&&r){
          izzet.push(card.mf_id);
        }
        else if(b&&g){
          golgari.push(card.mf_id);
        }
        else if(w&&r){
          boros.push(card.mf_id);
        }
        else if(u&&g){
          simic.push(card.mf_id);
        }
        else if(w){
          white.push(card.mf_id);
        }
        else if(u){
          blue.push(card.mf_id);
        }
        else if(b){
          black.push(card.mf_id);
        }
        else if(r){
          red.push(card.mf_id);
        }
        else if(g){
          green.push(card.mf_id);
        }
        else{
          colorless.push(card.mf_id);
        }
      }); //end allcards.forEach()

      //insert each array of card colors into the db
      insertColors(white, "White");
      insertColors(blue, "Blue");
      insertColors(black, "Black");
      insertColors(red, "Red");
      insertColors(green, "Green");
      insertColors(azorius, "Azorius");
      insertColors(dimir, "Dimir");
      insertColors(rakdos, "Rakdos");
      insertColors(gruul, "Gruul");
      insertColors(selesnya, "Selesnya");
      insertColors(orzhov, "Orzhov");
      insertColors(izzet, "Izzet");
      insertColors(golgari, "Golgari");
      insertColors(boros, "Boros");
      insertColors(simic, "Simic");
      insertColors(jund, "Jund");
      insertColors(bant, "Bant");
      insertColors(grixis, "Grixis");
      insertColors(naya, "Naya");
      insertColors(esper, "Esper");
      insertColors(jeskai, "Jeskai");
      insertColors(mardu, "Mardu");
      insertColors(sultai, "Sultai");
      insertColors(temur, "Temur");
      insertColors(abzan, "Abzan");
      insertColors(nonwhite, "Non-W");
      insertColors(nonblue, "Non-U");
      insertColors(nonblack, "Non-B");
      insertColors(nonred, "Non-R");
      insertColors(nongreen, "Non-G");
      insertColors(rainbow, "Rainbow");
      insertColors(colorless, "Colorless");
} //end determineColors
