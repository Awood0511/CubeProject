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
    this.draftStats; //holds all info about each card
    this.cardsWithStats = []; //hold information we need about each card
  }

  //async calls to API
  componentDidMount() {
    //get draft information coupled with card information
    axios.get("/api/draft/" + this.cube_id).then(
      response => {
        //save cube card information
        this.draftStats = response.data;
        this.getDraftPriority();
      },
      error => {
        console.log(error);
      }
    );
  }

  //calculate normalized priority from non_normalized and number of times drafted
  getDraftPriority() {
    for(let i = 0; i < this.draftStats.length; i++){
      var nn = this.draftStats[i].non_normalized;
      var count = this.draftStats[i].count;
      var entry;

      if(count > 1){
        entry = {
          card: this.draftStats[i],
          priority: nn + (7.5 - nn)/count
        }
      }
      else{
        entry = {
          card: this.draftStats[i],
          priority: 7.5
        }
      }

      this.cardsWithStats.push(entry);
    }

    this.sortByElement("priority", true);
  }

  //sort by a certain element and with a directional selection
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
          return a.card.count - b.card.count;
        else
          return b.card.count - a.card.count;
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
          return a.card.non_normalized - b.card.non_normalized;
        else
          return b.card.non_normalized - a.card.non_normalized;
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
                        <td>{stat.card.non_normalized}</td>
                        <td>{stat.card.count}</td>
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
