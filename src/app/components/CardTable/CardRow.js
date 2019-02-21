import React from "react";
import {CardImage} from "./CardImage";

export class CardRow extends React.Component {
  render() {
    return (
      <tr>
        <td><CardImage id={this.props.row.id1}/></td>
        <td><CardImage id={this.props.row.id2}/></td>
        <td><CardImage id={this.props.row.id3}/></td>
        <td><CardImage id={this.props.row.id4}/></td>
        <td><CardImage id={this.props.row.id5}/></td>
      </tr>
    );
  }
}
