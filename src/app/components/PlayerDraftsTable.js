import React from "react";
import {render} from "react-dom";
import axios from "axios";

export class PlayerDraftsTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      drafts: false
    };
    this.drafts;
  }

  componentDidMount() {
    axios.get("/api/draft/player").then(
      response => {
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
    if(this.state.drafts === true){
      return (
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col col-md-8 col-md-offset-2">
              <h3 style={{textAlign: "center"}}>Draft Information</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Cube Name</th>
                    <th>Date</th>
                    <th>Picks</th>
                  </tr>
                </thead>
                <tbody>
                  {this.drafts.map(draft =>
                    <tr key={draft.draft_id}>
                      <td><a href={"/cube/view/" + draft.cube_id}>{draft.cube_name}</a></td>
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
        </div>
      );
    }
  }
} //end CardTable

try{
    render(<PlayerDraftsTable/>, window.document.getElementById("player_drafts_table"));
} catch(err) {}
