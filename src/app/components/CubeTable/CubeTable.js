import React from "react";

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
    this.windowX = 0;
    this.windowY = 0;
  }

  //updates mouse position. Also updates image position, but only if hovering
  handleMouseMove(e) {
    this.x = e.clientX;
    this.y = e.clientY;
    this.windowX = window.innerWidth;
    this.windowY = window.innerHeight;

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

      //decide where to render the image X pos
      if((this.windowX - this.x) > (this.state.transform ? 519 : 267)){
        //render to the right
        div.style.left = (this.x + 15) + "px";
      }
      else{
        //render to the left
        div.style.left = (this.x - 15 - (this.state.transform ? 519 : 267)) + "px";
      }

      //decide where to render the image Y pos
      if((this.windowY - this.y) > 367){
        //render below
        div.style.top = (this.y + 15) + "px";
      }
      else{
        //render above
        div.style.top = (this.y - 15 - 367) + "px";
      }
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

    //count copies for each card of a certain type;
    var countCards = function(cards) {
      var total = 0;
      for(var i = 0; i < cards.length; i+=1){
        total += cards[i].copies;
      }
      return total;
    }

    var cCnt = countCards(this.props.cards.creatures);
    var aCnt = countCards(this.props.cards.artifacts);
    var eCnt = countCards(this.props.cards.enchantments);
    var pCnt = countCards(this.props.cards.planeswalkers);
    var lCnt = countCards(this.props.cards.lands);
    var iCnt = countCards(this.props.cards.instants);
    var sCnt = countCards(this.props.cards.sorceries);
    var colorCnt = cCnt + aCnt + eCnt + pCnt + lCnt + iCnt + sCnt;

    return (
      <table className={"table_" + this.props.color} onMouseMove={this.handleMouseMove.bind(this)}>
        <thead>
          <tr>
            <th className={"special_td_" + this.props.color}>{this.props.color + " (" + colorCnt + ")"}</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{display: (cCnt > 0) ? '' : 'none'}}>
            <td className={"special_td_" + this.props.color}>Creatures {"(" + cCnt + ")"}</td>
          </tr>
          {this.props.cards.creatures.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td className="cname_td">{(row.copies == 1) ? row.cname : row.cname + " (" + row.copies + ")"}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (aCnt > 0) ? '' : 'none'}}>
            <td className={"special_td_" + this.props.color}>Artifacts {"(" + aCnt + ")"}</td>
          </tr>
          {this.props.cards.artifacts.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td className="cname_td">{(row.copies == 1) ? row.cname : row.cname + " (" + row.copies + ")"}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (eCnt > 0) ? '' : 'none'}}>
            <td className={"special_td_" + this.props.color}>Enchantments {"(" + eCnt + ")"}</td>
          </tr>
          {this.props.cards.enchantments.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td className="cname_td">{(row.copies == 1) ? row.cname : row.cname + " (" + row.copies + ")"}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (pCnt > 0) ? '' : 'none'}}>
            <td className={"special_td_" + this.props.color}>Planeswalkers {"(" + pCnt + ")"}</td>
          </tr>
          {this.props.cards.planeswalkers.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td className="cname_td">{(row.copies == 1) ? row.cname : row.cname + " (" + row.copies + ")"}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (lCnt > 0) ? '' : 'none'}}>
            <td className={"special_td_" + this.props.color}>Lands {"(" + lCnt + ")"}</td>
          </tr>
          {this.props.cards.lands.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td className="cname_td">{(row.copies == 1) ? row.cname : row.cname + " (" + row.copies + ")"}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (iCnt > 0) ? '' : 'none'}}>
            <td className={"special_td_" + this.props.color}>Instants {"(" + iCnt + ")"}</td>
          </tr>
          {this.props.cards.instants.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td className="cname_td">{(row.copies == 1) ? row.cname : row.cname + " (" + row.copies + ")"}</td>
              </tr>
            );
          }, this)}
          <tr style={{display: (sCnt > 0) ? '' : 'none'}}>
            <td className={"special_td_" + this.props.color}>Sorceries {"(" + sCnt + ")"}</td>
          </tr>
          {this.props.cards.sorceries.map(function(row) {
            return (
              <tr key={row.id} onMouseEnter={function(){ showImg(row) }} onMouseLeave={function(){ hideImg(row) }} id={row.id + "_row"}>
                <td className="cname_td">{(row.copies == 1) ? row.cname : row.cname + " (" + row.copies + ")"}</td>
              </tr>
            );
          }, this)}
        </tbody>
      </table>
    );
  }
} //end CardTable
