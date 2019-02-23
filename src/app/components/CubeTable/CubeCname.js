import React from "react";

export class CubeCname extends React.Component {
  render() {
    return(
      <tr>
        <td style={{fontSize: "10pt"}}>{this.props.row.cname}</td>
      </tr>
    );
  }
}
