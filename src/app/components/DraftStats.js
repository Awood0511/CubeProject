import React from "react";
import axios from "axios";
import {render} from "react-dom";

export class DraftStats extends React.Component {
  constructor() {
    super();
    this.state = {
      rendered: false
    };

    //get cube_id
    let url = window.location.href;
    this.cube_id = url.substring(url.lastIndexOf("/")+1, url.length);

    //bind functions
    this.getDraftPriority = this.getDraftPriority.bind(this);

    //cube card information
    this.cubeCards;
    this.mfCards;
    this.draftStats;
    this.cardsWithStats = [];
  }

  //async calls to API to get cube and draft pick priority information
  componentDidMount() {
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

        this.getDraftPriority();
      },
      error => {
        console.log(error);
      }
    );
  }

  //combines card info and draft priority into packs
  getDraftPriority() {
    for(var i = 0; i < this.cubeCards.length; i+=1){
      var entry = {
        card: this.cubeCards[i],
        priority: 7.5,
        count: 0
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
        entry.priority = total/count;
        entry.count = count;
        this.cardsWithStats.push(entry);
      }
    }
    this.setState({
      rendered: true
    });
  }

  render() {
    //display loading when waiting for packs to load
    if(this.state.rendered == false){
      return (
        <div>
          Loading...
        </div>
      );
    }
    //display the cards and their priority
    else{
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Color</th>
                    <th>Priority</th>
                    <th># Drafted</th>
                  </tr>
                </thead>
                <tbody>
                  {this.cardsWithStats.map(function(stat, i){
                    return (
                      <tr key={i}>
                        <td>{stat.card.cname}</td>
                        <td>{stat.card.cc_color}</td>
                        <td>{stat.priority}</td>
                        <td>{stat.count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
  }
}

try{
    render(<DraftStats/>, window.document.getElementById("draft_stats"));
} catch(err) {}
