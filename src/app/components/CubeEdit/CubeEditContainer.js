import React from "react";
import {render} from "react-dom";
import {EditTable} from "./EditTable";
import axios from "axios";

export class CubeEditContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      rendered: false
    };
    let url = window.location.href;
    this.cube_id = url.substring(url.lastIndexOf("/")+1, url.length);

    this.cubeCards; //list of all cards in the cube
    this.editCards; //list of different versions of all cards in the cube
  }

  componentDidMount() {
    axios.get("/api/cube/edit/" + this.cube_id).then(
      response => {
        this.cubeCards = response.data[0];
        this.editCards = response.data[1];

        console.log(this.editCards);

        this.setState({
          rendered: true
        });
      },
      error => {
        console.log(error);
      }
    );
  } //end componentDidMount

  render() {
    if(this.state.rendered){
      return (
        <div className="container-fluid">
          <EditTable cubeCards={this.cubeCards} editCards={this.editCards} cube_id={this.cube_id}/>
        </div>
      );
    } else {
      return (
        <></>
      );
    }
  }
}

try{
    render(<CubeEditContainer/>, window.document.getElementById("cube_edit"));
} catch(err) {}
