import React from "react";
import {render} from "react-dom";
import axios from "axios";
import {CardTable} from "./CardTable/CardTable";

export class DraftView extends React.Component {
  constructor() {
    super();
    this.state = {
      rendered: false
    };
    let url = window.location.href;
    this.draft_id = url.substring(url.lastIndexOf("/")+1, url.length);
    this.pack1 = [];
    this.pack2 = [];
    this.pack3 = [];
  }

  componentDidMount() {
    axios.get("/api/draft/pick/" + this.draft_id).then(
      response => {
        let cards = response.data;
        var pick = 1;
        var pack = 1;

        //loop through all packs
        while(pack < 4){
          var found = false;
          //look for the card that matched the current pack/pick
          for(var i = 0; i < cards.length; i+=1){
            //once found push it to the pack and increment pick
            if(cards[i].pack == pack && cards[i].pick == pick){
              pick++;
              found = true;
              var entry = cards.splice(i,1);
              //determine which pack to push the spliced pick into
              if(pack == 1){
                this.pack1.push(entry[0]);
              }
              else if (pack == 2) {
                this.pack2.push(entry[0]);
              }
              else{
                this.pack3.push(entry[0]);
              }
            }
          }
          //if not found increment to next pick
          if(!found){
            pick++;
          }
          //check whether to increment pack
          if(pick > 15){
            pick = 1;
            pack++;
          }
        }
        this.setState({
          rendered: true
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    if(this.state.rendered){
      return (
        <div className="container-fluid">
          <h3 style={{textAlign: "center"}}>Pack 1</h3>
          <CardTable cards={this.pack1}/>
          <h3 style={{textAlign: "center"}}>Pack 2</h3>
          <CardTable cards={this.pack2}/>
          <h3 style={{textAlign: "center"}}>Pack 3</h3>
          <CardTable cards={this.pack3}/>
        </div>
      );
    } else {
      return (
        <div>
          Loading...
        </div>
      );
    }
  }
}

try{
    render(<DraftView/>, window.document.getElementById("draft_view"));
} catch(err) {}
