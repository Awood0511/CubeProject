import React from "react";
import {render} from "react-dom";
import axios from "axios";

export class PlayerCubesTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      cubes: false
    };
    this.cubes;
  }

  componentDidMount() {
    axios.get("/api/cube/player").then(
      response => {
        this.cubes = response.data;
        this.setState({
          cubes: true
        });
      },
      error => {
        console.log(error);
      }
    );
  } //end componentDidMount

  render() {
    if(this.state.cubes === true){
      return (
        <div className="container-fluid">
          <div className="row justify-content-md-center">
            <div className="col col-md-8 col-md-offset-2">
              <h3 style={{textAlign: "center"}}>Cube Information</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Card List</th>
                    <th>Visual Spoiler</th>
                    <th>Edit</th>
                    <th>Draft</th>
                    <th>Stats</th>
                  </tr>
                </thead>
                <tbody>
                  {this.cubes.map(cube =>
                    <tr key={cube.cube_id}>
                      <td>{cube.cube_name}</td>
                      <td><a href={"/cube/view/" + cube.cube_id}>View</a></td>
                      <td><a href={"/cube/visual/" + cube.cube_id}>Visual</a></td>
                      <td><a href={"/cube/edit/" + cube.cube_id}>Edit</a></td>
                      <td><a href={"/draft/solo/" + cube.cube_id}>Draft</a></td>
                      <td><a href={"/draft/stats/" + cube.cube_id}>AI Stats</a></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
        </div>
      );
    }
  }
} //end CardTable

try{
    render(<PlayerCubesTable/>, window.document.getElementById("player_cubes_table"));
} catch(err) {}
