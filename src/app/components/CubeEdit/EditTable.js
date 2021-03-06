import React from "react";
import {EditRow} from "./EditRow";
import {HeaderRow} from "./HeaderRow";
import {TxtSubmission} from "./TxtSubmission";

export class EditTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
        rendered: false
    };

    this.getAllSets = this.getAllSets.bind(this);
    this.getAllColors = this.getAllColors.bind(this);

    this.wCards = [];
    this.uCards = [];
    this.bCards = [];
    this.rCards = [];
    this.gCards = [];
    this.mcCards = [];
    this.cCards = [];
  }

  //call function to sort colors into groups
  componentDidMount() {
    this.getAllColors();
  }

  //breaks cards into groups by color
  getAllColors(){
    for(var i = 0; i < this.props.cubeCards.length; i+=1){
      let card = this.props.cubeCards[i];

      if(card.cc_color == "White"){
        this.wCards.push(card);
      }
      else if(card.cc_color == "Blue"){
        this.uCards.push(card);
      }
      else if(card.cc_color == "Black"){
        this.bCards.push(card);
      }
      else if(card.cc_color == "Red"){
        this.rCards.push(card);
      }
      else if(card.cc_color == "Green"){
        this.gCards.push(card);
      }
      else if(card.cc_color == "Colorless"){
        this.cCards.push(card);
      }
      else{
        this.mcCards.push(card);
      }
    }

    this.setState({
      rendered: true
    });
  }

  getAllSets(cname) {
    // get bucket index from cname
    var index = (cname.toUpperCase().charCodeAt(0)) - 65;
    if(index < 0 || index > 25)
      index = 26;

    //return the array of sets and ids
    for(var i = 0; i < this.props.editCards[index].length; i+=1){
      //if names match return the setIdPair
      if(this.props.editCards[index][i].cname === cname){
        return (this.props.editCards[index][i].setIdPair);
      }
    }
  }

  render() {
    //sets colspan of header rows
    var numCols = 5;

    if(this.state.rendered){
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <TxtSubmission/>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Set</th>
                    <th>Color</th>
                    <th>Type</th>
                    <th>Number</th>
                  </tr>
                </thead>
                <tbody>
                  <HeaderRow cols={numCols} txtColor={"#000000"} bgColor={"#fcffef"} color={"White"}/>
                  {this.wCards.map(function(card){
                    return(
                      <EditRow card={card} sets={this.getAllSets(card.cname)} cube_id={this.props.cube_id} bgColor={"#fcffef"} key={card.id}/>
                    );
                  }, this)}
                  <HeaderRow cols={numCols} txtColor={"#0400ff"} bgColor={"#5b9aff"} color={"Blue"}/>
                  {this.uCards.map(function(card){
                    return(
                      <EditRow card={card} sets={this.getAllSets(card.cname)} cube_id={this.props.cube_id} bgColor={"#5b9aff"} key={card.id}/>
                    );
                  }, this)}
                  <HeaderRow cols={numCols} txtColor={"#000000"} bgColor={"#686868"} color={"Black"}/>
                  {this.bCards.map(function(card){
                    return(
                      <EditRow card={card} sets={this.getAllSets(card.cname)} cube_id={this.props.cube_id} bgColor={"#686868"} key={card.id}/>
                    );
                  }, this)}
                  <HeaderRow cols={numCols} txtColor={"#ff0000"} bgColor={"#ed3d3d"} color={"Red"}/>
                  {this.rCards.map(function(card){
                    return(
                      <EditRow card={card} sets={this.getAllSets(card.cname)} cube_id={this.props.cube_id} bgColor={"#ed3d3d"} key={card.id}/>
                    );
                  }, this)}
                  <HeaderRow cols={numCols} txtColor={"#008e10"} bgColor={"#3bb53b"} color={"Green"}/>
                  {this.gCards.map(function(card){
                    return(
                      <EditRow card={card} sets={this.getAllSets(card.cname)} cube_id={this.props.cube_id} bgColor={"#3bb53b"} key={card.id}/>
                    );
                  }, this)}
                  <HeaderRow cols={numCols} txtColor={"#000000"} bgColor={"#eddd53"} color={"Multicolor"}/>
                  {this.mcCards.map(function(card){
                    return(
                      <EditRow card={card} sets={this.getAllSets(card.cname)} cube_id={this.props.cube_id} bgColor={"#eddd53"} key={card.id}/>
                    );
                  }, this)}
                  <HeaderRow cols={numCols} txtColor={"#000000"} bgColor={"#E0E1E0"} color={"Colorless"}/>
                  {this.cCards.map(function(card){
                    return(
                      <EditRow card={card} sets={this.getAllSets(card.cname)} cube_id={this.props.cube_id} bgColor={"#E0E1E0"} key={card.id}/>
                    );
                  }, this)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    else{
      return(
        <></>
      );
    }
  }
}
