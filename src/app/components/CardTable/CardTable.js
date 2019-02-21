import React from "react";
import {CardRow} from "./CardRow";
import {render} from "react-dom";
import axios from "axios";

export class CardTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      rendered: false
    };
    const urlParams = new URLSearchParams(window.location.search);
    this.cube_id = urlParams.get('cube_id');
    this.cardRows = [];
  }

  componentDidMount() {
    axios.get("/api/cube/" + this.cube_id).then(
      response => {
        let cards = response.data;
        for(let i = 0; i < cards.length; i=i+5){
          let row = {
            id1: 0,
            id2: 0,
            id3: 0,
            id4: 0,
            id5: 0
          }

          if(i + 0 < cards.length){
            row.id1 = cards[(i)+0].id;
          }
          if(i + 1 < cards.length){
            row.id2 = cards[(i)+1].id;
          }
          if(i + 2 < cards.length){
            row.id3 = cards[(i)+2].id;
          }
          if(i + 3 < cards.length){
            row.id4 = cards[(i)+3].id;
          }
          if(i + 4 < cards.length){
            row.id5 = cards[(i)+4].id;
          }
          this.cardRows.push(row);
        }
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
              <table>
                <tbody>
                  {this.cardRows.map(row => <CardRow row={row}/>)}
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
    render(<CardTable/>, window.document.getElementById("card_table"));
} catch(err) {}
