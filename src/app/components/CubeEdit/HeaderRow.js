import React from "react";

export class HeaderRow extends React.Component {
  render() {
    return(
      <tr className="HeaderRow" style={{backgroundColor: this.props.bgColor}}>
        <td colSpan={this.props.cols} style={{color: this.props.txtColor}}>{this.props.color}</td>
      </tr>
    );
  }
}
