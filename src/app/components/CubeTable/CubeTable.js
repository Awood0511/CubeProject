import React from "react";
import $ from "jquery";

export class CubeTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hovering: false,
      transform: false,
      hoverID: 0
    }

    //variables to hold the mouses location
    this.x = 0;
    this.y = 0;
  }

  //updates mouse position. Also updates image position, but only if hovering
  handleMouseMove(e) {
    this.x = e.screenX;
    this.y = e.screenY;

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

      div.style.top = (this.y - 100) + "px";
      div.style.left = (this.x + 15) + "px";

    }
  } //end handleMouseMove

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

    var colorCnt = this.props.cards.creatures.length + this.props.cards.artifacts.length + this.props.cards.enchantments.length +
    this.props.cards.planeswalkers.length + this.props.cards.lands.length + this.props.cards.instants.length + this.props.cards.sorceries.length;

    return (
      <table style={{backgroundColor: this.props.bgcolor}} onMouseMove={this.handleMouseMove.bind(this)}>
        <thead>
          <tr>
            <th style={{color: this.props.txtcolor}}>{this.props.color + " (" + colorCnt + ")"}</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{display: (this.props.cards.creatures.length > 0) ? '' : 'none'}}>
            <td className="special_td" style={{color: this.props.txtcolor}}>Creatures {"(" + this.props.cards.creatures.length + ")"}</td>
          </tr>
          {this.props.cards.creatures.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td id={row.id + "_data"}>{row.cname}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (this.props.cards.artifacts.length > 0) ? '' : 'none'}}>
            <td className="special_td" style={{color: this.props.txtcolor}}>Artifacts {"(" + this.props.cards.artifacts.length + ")"}</td>
          </tr>
          {this.props.cards.artifacts.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td id={row.id + "_data"}>{row.cname}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (this.props.cards.enchantments.length > 0) ? '' : 'none'}}>
            <td className="special_td" style={{color: this.props.txtcolor}}>Enchantments {"(" + this.props.cards.enchantments.length + ")"}</td>
          </tr>
          {this.props.cards.enchantments.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td id={row.id + "_data"}>{row.cname}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (this.props.cards.planeswalkers.length > 0) ? '' : 'none'}}>
            <td className="special_td" style={{color: this.props.txtcolor}}>Planeswalkers {"(" + this.props.cards.planeswalkers.length + ")"}</td>
          </tr>
          {this.props.cards.planeswalkers.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td id={row.id + "_data"}>{row.cname}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (this.props.cards.lands.length > 0) ? '' : 'none'}}>
            <td className="special_td" style={{color: this.props.txtcolor}}>Lands {"(" + this.props.cards.lands.length + ")"}</td>
          </tr>
          {this.props.cards.lands.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td id={row.id + "_data"}>{row.cname}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (this.props.cards.instants.length > 0) ? '' : 'none'}}>
            <td className="special_td" style={{color: this.props.txtcolor}}>Instants {"(" + this.props.cards.instants.length + ")"}</td>
          </tr>
          {this.props.cards.instants.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td id={row.id + "_data"}>{row.cname}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (this.props.cards.sorceries.length > 0) ? '' : 'none'}}>
            <td className="special_td" style={{color: this.props.txtcolor}}>Sorceries {"(" + this.props.cards.sorceries.length + ")"}</td>
          </tr>
          {this.props.cards.sorceries.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td id={row.id + "_data"}>{row.cname}</td>
              </tr>
            );
          }, this)}
        </tbody>
      </table>
    );
  }
} //end CardTable
