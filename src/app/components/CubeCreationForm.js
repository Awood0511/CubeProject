import React from "react";
import {render} from "react-dom";
import axios from "axios";

export class CubeCreationForm extends React.Component {
  constructor() {
    super();
    this.state = {
      player: "",
      cube_name: ""
    }
  }

  playerChange(e) {
    this.setState({
      player: e.target.value
    });
  }

  nameChange(e) {
    this.setState({
      cube_name: e.target.value
    });
  }

  handlePost(e) {
    console.log("Making a post request");
    axios.post('/api/cube/create', {
      player: this.state.player,
      cube_name: this.state.cube_name
    }).then(
      response => {
        console.log("response received");
      },
      error => {
        console.log(error);
      }
    );
    this.setState({
      player: "",
      cube_name: ""
    });
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            Player:
            <input type="text" value={this.state.player} onChange={this.playerChange.bind(this)}></input>
            Cube Name:
            <input type="text" value={this.state.cube_name} onChange={this.nameChange.bind(this)}></input>
            <button onClick={this.handlePost.bind(this)}>Make Cube</button>
          </div>
        </div>
      </div>
    );
  }
}

try{
    render(<CubeCreationForm/>, window.document.getElementById("cube_create"));
} catch(err) {}
