import React from "react";
import {render} from "react-dom";
import {CubeTable} from "./CubeTable";
import {CubeToTxt} from "./CubeToTxt";
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
    this.mfCards;
    this.whiteCards = {
      creatures : [],
      artifacts : [],
      enchantments : [],
      planeswalkers : [],
      lands : [],
      instants : [],
      sorceries : []
    };
    this.blueCards = {
      creatures : [],
      artifacts : [],
      enchantments : [],
      planeswalkers : [],
      lands : [],
      instants : [],
      sorceries : []
    };
    this.blackCards = {
      creatures : [],
      artifacts : [],
      enchantments : [],
      planeswalkers : [],
      lands : [],
      instants : [],
      sorceries : []
    };
    this.redCards = {
      creatures : [],
      artifacts : [],
      enchantments : [],
      planeswalkers : [],
      lands : [],
      instants : [],
      sorceries : []
    };
    this.greenCards = {
      creatures : [],
      artifacts : [],
      enchantments : [],
      planeswalkers : [],
      lands : [],
      instants : [],
      sorceries : []
    };
    this.colorlessCards = {
      creatures : [],
      artifacts : [],
      enchantments : [],
      planeswalkers : [],
      lands : [],
      instants : [],
      sorceries : []
    };
    this.otherCards = {
      creatures : [],
      artifacts : [],
      enchantments : [],
      planeswalkers : [],
      lands : [],
      instants : [],
      sorceries : []
    };
  }

  //determines the type then appends to that type's array in the passed object
  determineType(obj, entry, type) {
    if(type === "Creature"){
      obj.creatures.push(entry);
    }
    else if(type === "Artifact"){
      obj.artifacts.push(entry);
    }
    else if(type === "Enchantment"){
      obj.enchantments.push(entry);
    }
    else if(type === "Planeswalker"){
      obj.planeswalkers.push(entry);
    }
    else if(type === "Land"){
      obj.lands.push(entry);
    }
    else if(type === "Instant"){
      obj.instants.push(entry);
    }
    else{
      obj.sorceries.push(entry);
    }
  }

  componentDidMount() {
    axios.get("/api/cube/" + this.cube_id).then(
      response => {
        this.cubeCards = response.data[0];
        this.mfCards = response.data[1];
        //add cards to sublists by color identity
        for(let i = 0; i < this.cubeCards.length; i+=1){
          let card = this.cubeCards[i];
          var entry = {
            id: card.id,
            cname: card.cname,
            layout: card.layout,
            copies: card.copies
          };

          //replace transform card names with only the front side
          if(card.layout === "transform"){
            var k = 0;
            while(card.id != this.mfCards[k].id || this.mfCards[k].primary_face != 1){
              k+=1;
            }
            entry.cname = this.mfCards[k].cname;
          }

          //check which color it is
          if(card.cc_color === "White"){
            this.determineType(this.whiteCards, entry, card.main_type);
          }
          else if(card.cc_color === "Blue"){
            this.determineType(this.blueCards, entry, card.main_type);
          }
          else if(card.cc_color === "Black"){
            this.determineType(this.blackCards, entry, card.main_type);
          }
          else if(card.cc_color === "Red"){
            this.determineType(this.redCards, entry, card.main_type);
          }
          else if(card.cc_color === "Green"){
            this.determineType(this.greenCards, entry, card.main_type);
          }
          else if(card.cc_color === "Colorless"){
            this.determineType(this.colorlessCards, entry, card.main_type);
          }
          else{
            this.determineType(this.otherCards, entry, card.main_type);
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
          <div className="row justify-content-center my-2">
            <CubeToTxt cards={this.cubeCards}/>
          </div>
          <div className="row">
            <div className="imgrow" id={"imageDiv"}>
              <div className="imgcol">
                <img id={"cardImage1"} src={""} style={{display:'none'}}/>
              </div>
              <div className="imgcol">
                <img id={"cardImage2"} src={""} style={{display:'none'}}/>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="table_div">
              <CubeTable cards={this.whiteCards} color={"White"}/>
            </div>
            <div className="table_div">
              <CubeTable cards={this.blueCards} color={"Blue"}/>
            </div>
            <div className="table_div">
              <CubeTable cards={this.blackCards} color={"Black"}/>
            </div>
            <div className="table_div">
              <CubeTable cards={this.redCards} color={"Red"}/>
            </div>
            <div className="table_div">
              <CubeTable cards={this.greenCards} color={"Green"}/>
            </div>
            <div className="table_div">
              <CubeTable cards={this.otherCards} color={"Multicolor"}/>
            </div>
            <div className="table_div">
              <CubeTable cards={this.colorlessCards} color={"Colorless"}/>
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
    render(<CubeTableContainer/>, window.document.getElementById("cube_table"));
} catch(err) {}
