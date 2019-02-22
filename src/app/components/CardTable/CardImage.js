import React from "react";

export class CardImage extends React.Component {
  render() {
    let imgsrc = "/../images/card_images/" + this.props.id + ".jpg";
    return (
      <div>
        <img className="img-fluid" src={imgsrc}></img>
      </div>
    );
  }
}
