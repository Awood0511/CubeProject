import React from "react";
import axios from "axios";

export class EditRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setValue: this.props.card.id
    }
    this.onSetChange = this.onSetChange.bind(this);
    this.updateCube = this.updateCube.bind(this);
  }

  onSetChange(e) {
    if(this.state.setValue != e.target.value){
      var currentId = this.state.setValue;
      this.setState({
        setValue: e.target.value
      });
      console.log(e.target.setValue);
      this.updateCube("id", currentId, e.target.value);
    }
  }

  updateCube(changeType, idToChange, changeVal) {
    axios.post('/api/cube/edit/' + this.props.cube_id, {
      changeType: changeType,
      idToChange: idToChange,
      changeVal: changeVal
    }).then(
      response => {
        console.log("Set Changed");
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    return(
      <tr>
        <td>{this.props.card.cname}</td>
        <td>
          <select value={this.state.setValue} onChange={this.onSetChange}>
            {this.props.sets.map(function(set){
              return(
                <option value={set.id} key={set.set_code}>
                  {set.set_code.toUpperCase()}
                </option>
              );
            }, this)}
          </select>
        </td>
      </tr>
    );
  }
}
