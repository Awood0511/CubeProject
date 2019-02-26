import React from "react";
import {EditRow} from "./EditRow";

export class EditTable extends React.Component {
  constructor(props) {
    super();
    this.getAllSets = this.getAllSets.bind(this);
  }

  //gets a list of all the sets for a given cname
  getAllSets(cname) {
    var sets = [];
    for(var i = 0; i < this.props.editCards.length; i+=1){
      if(cname === this.props.editCards[i].cname){
        var entry = {
          id: this.props.editCards[i].id,
          set_code: this.props.editCards[i].set_code
        };
        sets.push(entry);
      }
    }
    return(sets);
  }

  render() {
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Set</th>
          </tr>
        </thead>
        <tbody>
          {this.props.cubeCards.map(function(card){
            return(
              <EditRow card={{cname: card.cname, set: card.set_code, id: card.id}} sets={this.getAllSets(card.cname)} cube_id={this.props.cube_id} key={card.id}/>
            );
          }, this)}
        </tbody>
      </table>
    );
  }
}
