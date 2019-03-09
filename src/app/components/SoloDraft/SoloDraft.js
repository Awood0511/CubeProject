import React from "react";
import axios from "axios";
import {render} from "react-dom";
import {CardTable} from "../CardTable/CardTable";
import {DraftWindow} from "./DraftWindow";

export class SoloDraft extends React.Component {
  constructor() {
    super();
    this.state = {
      rendered: false,
      pack: 1,
      pick: 1
    };
    this.draft_time;
    this.player = "Adam";//placeholder will select actual player who is logged in
    this.draft_id;

    //get cube_id
    let url = window.location.href;
    this.cube_id = url.substring(url.lastIndexOf("/")+1, url.length);

    //bind functions
    this.randomize = this.randomize.bind(this);
    this.getDraftPriority = this.getDraftPriority.bind(this);
    this.getDateTime = this.getDateTime.bind(this);
    this.ai_pick = this.ai_pick.bind(this);
    this.log_player_pick = this.log_player_pick.bind(this);
    this.player_pick = this.player_pick.bind(this);

    //cube card information
    this.cubeCards;
    this.mfCards;
    this.draftStats;
    this.packs = [[],[],[],[],[],[],[],[], [],[],[],[],[],[],[],[], [],[],[],[],[],[],[],[]];

    //picks for each "player"
    this.picks = [[],[],[],[],[],[],[],[]]; //0 is human player
  }

  //async calls to API to get cube and draft pick priority information
  componentDidMount() {
    this.getDateTime();
    //create the draft
    axios.post("/api/draft/" + this.cube_id, {
      player: this.player,
      draft_time: this.draft_time
    }).then(
      response => {
        this.draft_id = response.data.insertId;
      },
      error => {
        console.log(error);
      }
    );
    //get draft information
    axios.get("/api/draft/" + this.cube_id).then(
      response => {
        //save cube card information
        this.draftStats = response.data;
      },
      error => {
        console.log(error);
      }
    );
    //get cube information
    axios.get("/api/cube/" + this.cube_id).then(
      response => {
        //save cube card information
        this.cubeCards = response.data[0];
        this.mfCards = response.data[1];

        this.randomize();
      },
      error => {
        console.log(error);
      }
    );
  }

  //get draft time in sql format for saving draft picks to db
  getDateTime() {
    var now     = new Date();
    var year    = now.getFullYear();
    var month   = now.getMonth()+1;
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
          second = '0'+second;
    }
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;

    this.draft_time = dateTime;
  }

  //fischer-yates shuffle on the cubeCards
  randomize() {
    var m = this.cubeCards.length;
    var temp;
    var index;

    while(m){
      index = Math.floor(Math.random() * m--);
      temp = this.cubeCards[m];
      this.cubeCards[m] = this.cubeCards[index];
      this.cubeCards[index] = temp;
    }
    this.getDraftPriority();
  }

  //combines card info and draft priority into packs
  getDraftPriority() {
    for(var i = 0; i < this.cubeCards.length; i+=1){
      var entry = {
        card: this.cubeCards[i],
        priority: 7.5
      };

      //calculate the average draft priority for all cards
      var total = 0;
      var count = 0;
      for(var k = 0; k < this.draftStats.length; k++){
        if(entry.card.id == this.draftStats[k].id){
          count++;
          total += this.draftStats[k].pick;
        }
      }
      if(count > 0){
        entry.priority = total/count + (7.5-(total/count))/count;
      }
      this.packs[Math.floor(i/15)].push(entry);
    }
    this.setState({
      rendered: true
    });
  }

  //tell the ai to pick the best card in their packs
  //advances state to next pick
  ai_pick() {
    for(var i = 1; i < 8; i+=1){
      //calculate pack to choose from
      var pack_i = ((this.state.pack-1) * 8) + (this.state.pick-1) + i;
      while(pack_i >= this.state.pack*8){
        pack_i -= 8;
      }
      //loop through that pack and choose the highest priority card
      var best;
      var indexOfBest;
      var lowest = 16;
      for(var k = 0; k < this.packs[pack_i].length; k+=1){
        if(this.packs[pack_i][k].priority < lowest){
          indexOfBest = k;
          lowest = this.packs[pack_i][k].priority;
          best = this.packs[pack_i][k];
        }
      }
      //splice out highest priority card and add it to the ai's picks
      this.packs[pack_i].splice(indexOfBest,1);
      this.picks[i].push(best.card);
    }

    var newPick = this.state.pick+1;
    var newPack = this.state.pack;

    if(newPick > 15){
      newPick = 1;
      newPack += 1;
    }

    this.setState({
      pack: newPack,
      pick: newPick
    });
  }

  //removes the card that the player picked from the pack
  //calls log_player_pick to save it to the db
  //call ai_pick to generate the ai's decisions
  player_pick(pack_i, i) {
    //splice out the index
    var choice = this.packs[pack_i][i];
    this.packs[pack_i].splice(i,1);
    this.picks[0].push(choice.card);
    this.log_player_pick(choice);
    this.ai_pick();
  }

  //saves the pick into the database
  log_player_pick(draftCard){
    axios.post('/api/draft/pick/' + this.draft_id, {
      id: draftCard.card.id,
      pack: this.state.pack,
      pick: this.state.pick
    }).then(
      response => {
        //successful draft pick
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    //calculate the index of the pack the player is currently choosing from
    var pack_i = ((this.state.pack-1) * 8) + (this.state.pick-1);
    while(pack_i >= this.state.pack*8){
      pack_i -= 8;
    }

    //Remove Draft Screen when out of packs
    if(this.state.pack >= 4){
      return (
        <div className="container">
          <h3 style={{textAlign: "center"}}>Player</h3>
          <CardTable cards={this.picks[0]}/>
          <hr></hr>
          <h3 style={{textAlign: "center"}}>AI 1</h3>
          <CardTable cards={this.picks[1]}/>
          <hr></hr>
          <h3 style={{textAlign: "center"}}>AI 2</h3>
          <CardTable cards={this.picks[2]}/>
          <hr></hr>
          <h3 style={{textAlign: "center"}}>AI 3</h3>
          <CardTable cards={this.picks[3]}/>
          <hr></hr>
          <h3 style={{textAlign: "center"}}>AI 4</h3>
          <CardTable cards={this.picks[4]}/>
          <hr></hr>
          <h3 style={{textAlign: "center"}}>AI 5</h3>
          <CardTable cards={this.picks[5]}/>
          <hr></hr>
          <h3 style={{textAlign: "center"}}>AI 6</h3>
          <CardTable cards={this.picks[6]}/>
          <hr></hr>
          <h3 style={{textAlign: "center"}}>AI 7</h3>
          <CardTable cards={this.picks[7]}/>
          <hr></hr>
        </div>
      );
    }
    //display loading when waiting for packs to load
    else if(this.state.rendered == false){
      return (
        <div>
          Loading...
        </div>
      );
    }
    //if packs loaded, display the cards to pick from
    else{
      return (
        <div className="container-fluid">
          <DraftWindow pack_i={pack_i} pack={this.packs[pack_i].slice()} player_pick={this.player_pick}/>
          <hr></hr>
          <CardTable cards={this.picks[0].slice()}/>
        </div>
      );
    }
  }
}

try{
    render(<SoloDraft/>, window.document.getElementById("solo_draft"));
} catch(err) {}
