import React from "react";
import {render} from "react-dom";
import {CubeTable} from "./CubeTable";
import axios from "axios";

export class CubeTableContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      rendered: false
    };
    let url = window.location.href;
    this.cube_id = url.substring(url.lastIndexOf("/")+1, url.length);

    this.cubeCards; //list of all cards in the cube
    this.whiteCards = [];
    this.blueCards = [];
    this.blackCards = [];
    this.redCards = [];
    this.greenCards = [];
    this.colorlessCards = [];
    this.otherCards = [];
  }

  componentDidMount() {
    axios.get("/api/cube/" + this.cube_id).then(
      response => {
        this.cubeCards = response.data;
        //add cards to sublists by color identity
        for(let i = 0; i < this.cubeCards.length; i+=1){
          let card = this.cubeCards[i];
          var entry = {
            id: card.id,
            cname: card.cname
          };
          if(card.color === "White"){
            this.whiteCards.push(entry);
          }
          else if(card.color === "Blue"){
            this.blueCards.push(entry);
          }
          else if(card.color === "Black"){
            this.blackCards.push(entry);
          }
          else if(card.color === "Red"){
            this.redCards.push(entry);
          }
          else if(card.color === "Green"){
            this.greenCards.push(entry);
          }
          else if(card.color === "Colorless"){
            this.colorlessCards.push(entry);
          }
          else{
            this.otherCards.push(entry);
          }
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
          <div className="row justify-content-sm-center">
            <div className="col-sm-auto">
              <CubeTable cards={this.whiteCards} color={"White"}/>
            </div>
            <div className="col-sm-auto">
              <CubeTable cards={this.blueCards} color={"Blue"}/>
            </div>
            <div className="col-sm-auto">
              <CubeTable cards={this.blackCards} color={"Black"}/>
            </div>
            <div className="col-sm-auto">
              <CubeTable cards={this.redCards} color={"Red"}/>
            </div>
            <div className="col-sm-auto">
              <CubeTable cards={this.greenCards} color={"Green"}/>
            </div>
            <div className="col-sm-auto">
              <CubeTable cards={this.otherCards} color={"Multicolor"}/>
            </div>
            <div className="col-sm-auto">
              <CubeTable cards={this.colorlessCards} color={"Colorless"}/>
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
    render(<CubeTableContainer/>, window.document.getElementById("cube_table"));
} catch(err) {}
