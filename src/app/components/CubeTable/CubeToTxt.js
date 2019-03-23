import React from "react";

export class CubeToTxt extends React.Component {

  //make the user download the text file of card names
  download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  createText(){
    var text = "";
    var name = "cube.txt";

    //loop through cards and create a string of card names
    for(var i = 0; i < this.props.cards.length; i+=1){
      text += this.props.cards[i].cname + "\n";
    }
    text = text.replace(/\n/g, "\r\n");

    //bind to this and call the download function
    this.download.bind(this);
    this.download(name, text);
  }

  render() {
    return(
      <div>
        <button onClick={this.createText.bind(this)}>Download Text</button>
      </div>
    );
  }
}
