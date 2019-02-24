import React from "react";

export class CubeTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hovering: false,
      transform: false,
      hoverID: 0
    }

    //variables to hold the mouses location whenever it moves over a table
    this.x = 0;
    this.y = 0;
  }

  //updates mouse position. Also updates image position, but only if hovering
  handleMouseMove(e) {
    this.x = e.pageX;
    this.y = e.pageY;

    if(this.state.hovering){
      //get relevant dom element data
      var div = document.getElementById("imageDiv");
      var image1 = document.getElementById("cardImage1");
      var image2 = document.getElementById("cardImage2");
      var row = document.getElementById(this.state.hoverID + "_row");
      //get the positioning and length of where we want to place the image
      var rect_row = row.getBoundingClientRect();
      //pop in the image and highlight the row
      image1.src = '/../images/card_images/' + this.state.hoverID + '.jpg';
      if(this.state.transform){
        image2.src = '/../images/card_images/' + this.state.hoverID + '_2.jpg';
      }
      div.style.left = (this.x + 2) + "px";
      div.style.top = rect_row.bottom + "px";
    }
  }

  render() {

    //sets the state variables according to what is being hovered
    var showImgUnbound = function(row) {
      //get relevant dom element data
      var image1 = document.getElementById("cardImage1");
      var image2 = document.getElementById("cardImage2");
      var isTransform = row.layout == "transform";
      image1.style.display = '';
      if(isTransform){
        image2.style.display = '';
      }
      this.setState({
        hovering: true,
        transform: isTransform,
        hoverID: row.id
      });
    }
    //resets the state and image sources to unhovered state
    var hideImgUnbound = function(row) {
      var image1 = document.getElementById("cardImage1");
      var image2 = document.getElementById("cardImage2");
      image1.style.display = 'none';
      image2.style.display = 'none';
      image1.src = '';
      image2.src = '';
      this.setState({
        hovering: false,
        transform: false,
        hoverID: 0
      });
    }
    //bind to allow access to state
    var showImg = showImgUnbound.bind(this);
    var hideImg = hideImgUnbound.bind(this);

    return (
      <table style={{backgroundColor: this.props.bgcolor}} onMouseMove={this.handleMouseMove.bind(this)}>
        <thead>
          <tr>
            <th style={{color: this.props.txtcolor}}>{this.props.color}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.cards.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td style={{fontSize: "12pt"}} id={row.id + "_data"}>{row.cname}</td>
              </tr>
            );
          }, this)}
        </tbody>
      </table>
    );
  }
} //end CardTable
