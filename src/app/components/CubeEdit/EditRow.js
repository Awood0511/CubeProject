import React from "react";
import axios from "axios";

export class EditRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setValue: this.props.card.id,
      color: this.props.card.cc_color,
      type: this.props.card.main_type,
      copies: this.props.card.copies
    }
    this.onSetChange = this.onSetChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onCopiesChange = this.onCopiesChange.bind(this);
    this.updateCube = this.updateCube.bind(this);
  }

  onSetChange(e) {
    if(this.state.setValue != e.target.value){
      var currentId = this.state.setValue;
      this.setState({
        setValue: e.target.value
      });
      this.updateCube("id", currentId, e.target.value);
    }
  }

  onColorChange(e) {
    if(this.state.color != e.target.value){
      this.setState({
        color: e.target.value
      });
      this.updateCube("color", this.state.setValue, e.target.value);
    }
  }

  onTypeChange(e) {
    if(this.state.type != e.target.value){
      this.setState({
        type: e.target.value
      });
      this.updateCube("main_type", this.state.setValue, e.target.value);
    }
  }

  onCopiesChange(e) {
    var num = this.state.copies;
    console.log(e.target);
    if(e.target.name == "add_btn"){
      num += 1;
    } else {
      num -= 1;
    }

    if(num <= 0){
      this.setState({
        copies: num
      });
      this.updateCube("delete", this.state.setValue, num);
    }
    else if(this.state.copies != num){
      this.setState({
        copies: num
      });
      this.updateCube("copies", this.state.setValue, num);
    }
  }

  updateCube(changeType, idToChange, changeVal) {
    axios.post('/api/cube/edit/' + this.props.cube_id, {
      changeType: changeType,
      idToChange: idToChange,
      changeVal: changeVal
    }).then(
      response => {
        console.log("Changes made successfully.");
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    //oprtion variable to simplify looping through all 32 types
    var colors = ["White", "Blue", "Black", "Red", "Green", "Colorless", "Azorius", "Dimir", "Rakdos", "Gruul", "Selesnya",
                  "Orzhov", "Izzet", "Golgari", "Boros", "Simic", "Jund", "Bant", "Grixis", "Naya", "Esper",
                  "Jeskai", "Mardu", "Sultai", "Temur", "Abzan", "Non-W", "Non-U", "Non-B", "Non-R", "Non-G", "Rainbow"];

    var types = ["Creature", "Artifact", "Enchantment", "Planeswalker", "Land", "Instant", "Sorcery"];

    return(
      <tr style={{backgroundColor : this.props.bgColor, display: (this.state.copies > 0) ? '' : 'none'}}>
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
        <td>
          <select value={this.state.color} onChange={this.onColorChange}>
            {colors.map(function(color){
              return(
                <option value={color} key={color}>
                  {color}
                </option>
              );
            }, this)}
          </select>
        </td>
        <td>
          <select value={this.state.type} onChange={this.onTypeChange}>
            {types.map(function(type){
              return(
                <option value={type} key={type}>
                  {type}
                </option>
              );
            }, this)}
          </select>
        </td>
        <button name="add_btn" className="btn btn-small" style={{backgroundColor: "green"}} onClick={this.onCopiesChange}>+</button>
        <td>{this.state.copies}</td>
        <button name="sub_btn" className="btn btn-small" style={{backgroundColor: "red"}} onClick={this.onCopiesChange}>-</button>
      </tr>
    );
  }
}
