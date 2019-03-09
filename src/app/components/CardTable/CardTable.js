import React from "react";
import {CardRow} from "./CardRow";

export class CardTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      rendered: false,
      update: false
    };
    this.cardRows = [];
    this.setRows = this.setRows.bind(this);
  }

  //check whennew props are passed in
  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.cards !== prevState.cards){
      return { cards: nextProps.cards};
    }
    else{
      return null;
    }
  }

  //update state after props change
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.cards !== this.props.cards){
      //Perform some operation here
      this.setRows();
      this.setState({
        update: !this.state.update
      });
    }
  }

  componentDidMount() {
    this.setRows();
    this.setState({
      rendered: true
    });
  }

  setRows() {
    let cards = this.props.cards;
    let rows = [];
    for(let i = 0; i < cards.length; i=i+5){
      let row = {
        id1: 0,
        id2: 0,
        id3: 0,
        id4: 0,
        id5: 0
      }

      if(i + 0 < cards.length){
        row.id1 = cards[(i)+0].id;
      }
      if(i + 1 < cards.length){
        row.id2 = cards[(i)+1].id;
      }
      if(i + 2 < cards.length){
        row.id3 = cards[(i)+2].id;
      }
      if(i + 3 < cards.length){
        row.id4 = cards[(i)+3].id;
      }
      if(i + 4 < cards.length){
        row.id5 = cards[(i)+4].id;
      }
      rows.push(row);
    }
    this.cardRows = rows;
  }

  render() {
    if(this.state.rendered){
      return (
        <div className="row justify-content-md-center">
          <div className="col col-md-10 col-md-offset-1">
            <table>
              <tbody>
                {this.cardRows.map((row,i) => <CardRow row={row} key={i}/>)}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return (
        <></>
      );
    }
  }
} //end CardTable
