import React from "react";
import {CubeCname} from "./CubeCname";

export class CubeTable extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>{this.props.color}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.cards.map((row) => <CubeCname row={row} key={row.id}/>)}
        </tbody>
      </table>
    );
  }
} //end CardTable
