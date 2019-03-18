import React from "react";
import axios from "axios";
import {render} from "react-dom";

export class DraftStats extends React.Component {
  constructor() {
    super();
    this.state = {
      rendered: false,
      sort_method: "priority",
      asc: true
    };

    //get cube_id
    let url = window.location.href;
    this.cube_id = url.substring(url.lastIndexOf("/")+1, url.length);

    //bind functions
    this.getDraftPriority = this.getDraftPriority.bind(this);
    this.sortByElement = this.sortByElement.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.highlight = this.highlight.bind(this);
    this.unhighlight = this.unhighlight.bind(this);

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
        non_normalized: 7.5,
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
        entry.priority = total/count + (7.5-(total/count))/count;
        entry.non_normalized = total/count;
        entry.count = count;
      }
      this.cardsWithStats.push(entry);
    }
    this.sortByElement("priority", true);
  }

  //sort by a certain element and direction pairing
  sortByElement(element, dir) {
    if(element === "priority"){
      this.cardsWithStats.sort(function(a,b){
        if(dir === true)
          return a.priority - b.priority;
        else
          return b.priority - a.priority;
      });
    }
    else if(element === "count"){
      this.cardsWithStats.sort(function(a,b){
        if(dir === true)
          return a.count - b.count;
        else
          return b.count - a.count;
      });
    }
    else if(element === "name"){
      this.cardsWithStats.sort(function(a,b){
        if(dir === true)
          return ('' + a.card.cname).localeCompare(b.card.cname);
        else
          return ('' + b.card.cname).localeCompare(a.card.cname);
      });
    }
    else if(element === "nn"){
      this.cardsWithStats.sort(function(a,b){
        if(dir === true)
          return a.non_normalized - b.non_normalized;
        else
          return b.non_normalized - a.non_normalized;
      });
    }
    else if(element === "color"){
      this.cardsWithStats.sort(function(a,b){
        if(dir === true)
          return ('' + a.card.cc_color).localeCompare(b.card.cc_color);
        else
          return ('' + b.card.cc_color).localeCompare(a.card.cc_color);
      });
    }

    this.setState({
      rendered: true,
      sort_method: element,
      asc: dir
    });
  }

  //determine what to sort and in what direction
  handleClick(e) {
    var element = e.target.getAttribute('name');
    if(element === this.state.sort_method){
      this.sortByElement(element, !this.state.asc);
    }
    else{
      this.sortByElement(element, true);
    }
  }

  highlight(e) {
    e.target.style.color = "red";
  }

  unhighlight(e) {
    e.target.style.color = "black";
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
          <div className="row justify-content-md-center">
            <div className="col col-md-10 col-md-offset-1">
              <table className="table table-hover">
                <thead>
                  <tr className="header_row">
                    <th onClick={this.handleClick} onMouseEnter={this.highlight} onMouseLeave={this.unhighlight} name="name">Name</th>
                    <th onClick={this.handleClick} onMouseEnter={this.highlight} onMouseLeave={this.unhighlight} name="color">Color</th>
                    <th onClick={this.handleClick} onMouseEnter={this.highlight} onMouseLeave={this.unhighlight} name="priority">Priority</th>
                    <th onClick={this.handleClick} onMouseEnter={this.highlight} onMouseLeave={this.unhighlight} name="nn">Non-Normalized</th>
                    <th onClick={this.handleClick} onMouseEnter={this.highlight} onMouseLeave={this.unhighlight} name="count"># Drafted</th>
                  </tr>
                </thead>
                <tbody>
                  {this.cardsWithStats.map(function(stat, i){
                    return (
                      <tr key={i} className={"tr_" + stat.card.cc_color}>
                        <td>{stat.card.cname}</td>
                        <td>{stat.card.cc_color}</td>
                        <td>{stat.priority}</td>
                        <td>{stat.non_normalized}</td>
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
