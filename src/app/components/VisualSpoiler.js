import React from "react";
import {render} from "react-dom";
import axios from "axios";
import {CardTable} from "./CardTable/CardTable";

export class VisualSpoiler extends React.Component {
  constructor() {
    super();
    this.state = {
      rendered: false
    };
    let url = window.location.href;
    this.cube_id = url.substring(url.lastIndexOf("/")+1, url.length);
    this.cards = [];
  }

  componentDidMount() {
    axios.get("/api/cube/" + this.cube_id).then(
      response => {
        this.cards = response.data[0];
        this.setState({
          rendered: true
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    if(this.state.rendered){
      return (
        <div className="container-fluid">
          <CardTable cards={this.cards}/>
        </div>
      );
    } else {
      return (
        <div>
          Loading...
        </div>
      );
    }
  }
}

try{
    render(<VisualSpoiler/>, window.document.getElementById("visual_spoiler"));
} catch(err) {}
