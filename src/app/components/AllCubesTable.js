import React from "react";
import {render} from "react-dom";
import axios from "axios";

export class AllCubesTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      cubes: false,
      drafts: false
    };
    this.cubes;
    this.drafts;
  }

  componentDidMount() {
    axios.get("/api/cube/").then(
      response => {
        console.log(response.data);
        this.cubes = response.data;
        this.setState({
          cubes: true
        });
      },
      error => {
        console.log(error);
      }
    );
    axios.get("/api/draft/").then(
      response => {
        console.log(response.data);
        this.drafts = response.data;
        this.setState({
          drafts: true
        });
      },
      error => {
        console.log(error);
      }
    );
  } //end componentDidMount

  render() {
    if(this.state.drafts == true && this.state.cubes == true){
      return (
        <div className="container-fluid">
          <div className="row justify-content-md-center">
            <div className="col col-md-8 col-md-offset-2">
              <h3 style={{textAlign: "center"}}>Cube Information</h3>
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
          <div className="row justify-content-md-center">
            <div className="col col-md-8 col-md-offset-2">
              <h3 style={{textAlign: "center"}}>Draft Information</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>DraftID</th>
                    <th>CubeID</th>
                    <th>Player</th>
                    <th>Time</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {this.drafts.map(draft =>
                    <tr key={draft.draft_id}>
                      <td>{draft.draft_id}</td>
                      <td>{draft.cube_id}</td>
                      <td>{draft.player}</td>
                      <td>{draft.draft_time}</td>
                      <td><a href={"/draft/view/" + draft.draft_id}>View</a></td>
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
