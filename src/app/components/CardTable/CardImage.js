import React from "react";

export class CardImage extends React.Component {
  render() {
    let imgsrc = "/../images/card_images/" + this.props.id + ".jpg";
    return (
      <div style={{display: (this.props.id > 0) ? '' : 'none'}}>
        <img className="img-fluid" src={imgsrc}></img>
      </div>
    );
  }
}
