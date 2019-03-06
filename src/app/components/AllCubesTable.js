import React from "react";
import {render} from "react-dom";
import axios from "axios";

export class AllCubesTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      rendered: false
    };
    this.cubes;
  }

  componentDidMount() {
    axios.get("/api/cube/").then(
      response => {
        console.log(response.data);
        this.cubes = response.data;
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
          <div className="row justify-content-md-center">
            <div className="col col-md-8 col-md-offset-2">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Card List</th>
                    <th>Visual Spoiler</th>
                    <th>Edit</th>
                    <th>Draft</th>
                  </tr>
                </thead>
                <tbody>
                  {this.cubes.map(cube =>
                    <tr key={cube.cube_id}>
                      <td>{cube.cube_name}</td>
                      <td>{cube.player}</td>
                      <td><a href={"/cube/view/" + cube.cube_id}>View</a></td>
                      <td><a href={"/cube/visual/" + cube.cube_id}>Visual</a></td>
                      <td><a href={"/cube/edit/" + cube.cube_id}>Edit</a></td>
                      <td><a href={"/draft/solo/" + cube.cube_id}>Draft</a></td>
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
          Loading...
        </div>
      );
    }
  }
} //end CardTable

try{
    render(<AllCubesTable/>, window.document.getElementById("all_cubes_table"));
} catch(err) {}
