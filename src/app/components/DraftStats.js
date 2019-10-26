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
    this.sortByElement = this.sortByElement.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.highlight = this.highlight.bind(this);
    this.unhighlight = this.unhighlight.bind(this);

    //cube card information
    this.cardsWithStats; //hold information we need about each card
  }

  //async calls to API
  componentDidMount() {
    //get draft information coupled with card information
    axios.get("/api/draft/" + this.cube_id).then(
      response => {
        //save cube card information
        this.cardsWithStats = response.data;
        this.sortByElement("priority", true);
      },
      error => {
        console.log(error);
      }
    );
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
          return a.count - b.count;
        else
          return b.count - a.count;
      });
    }
    else if(element === "name"){
      this.cardsWithStats.sort(function(a,b){
        if(dir === true)
          return ('' + a.cname).localeCompare(b.cname);
        else
          return ('' + b.cname).localeCompare(a.cname);
      });
    }
    else if(element === "color"){
      this.cardsWithStats.sort(function(a,b){
        if(dir === true)
          return ('' + a.cc_color).localeCompare(b.cc_color);
        else
          return ('' + b.cc_color).localeCompare(a.cc_color);
      });
    }
    else if(element === "type"){
      this.cardsWithStats.sort(function(a,b){
        if(dir === true)
          return ('' + a.main_type).localeCompare(b.main_type);
        else
          return ('' + b.main_type).localeCompare(a.main_type);
      });
    }
    else if(element === "manacost"){
      this.cardsWithStats.sort(function(a,b){
        if(dir === true)
          return a.cmc - b.cmc;
        else
          return b.cmc - a.cmc;
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
                    <th onClick={this.handleClick} onMouseEnter={this.highlight} onMouseLeave={this.unhighlight} name="type">Type</th>
                    <th onClick={this.handleClick} onMouseEnter={this.highlight} onMouseLeave={this.unhighlight} name="manacost">Manacost</th>
                    <th onClick={this.handleClick} onMouseEnter={this.highlight} onMouseLeave={this.unhighlight} name="priority">Priority</th>
                    <th onClick={this.handleClick} onMouseEnter={this.highlight} onMouseLeave={this.unhighlight} name="count"># Drafted</th>
                  </tr>
                </thead>
                <tbody>
                  {this.cardsWithStats.map(function(stat, i){
                    return (
                      <tr key={i} className={"tr_" + stat.cc_color}>
                        <td>{stat.cname}</td>
                        <td>{stat.cc_color}</td>
                        <td>{stat.main_type}</td>
                        <td>{stat.cmc}</td>
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
