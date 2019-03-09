import React from "react";
import {CardImage} from "../CardTable/CardImage";

export class DraftWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rendered: false
    };

    this.splitIntoRows = this.splitIntoRows.bind(this);
    this.row1;
    this.row2;
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.pack !== prevState.pack){
      return { pack: nextProps.pack};
    }
    else{
      return null;
    }
  }

  componentDidMount() {
    this.splitIntoRows();
  }

  //update state after props change
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.pack !== this.props.pack){
      this.setState({
        rendered: false
      });
      this.splitIntoRows();
    }
  }

  splitIntoRows() {
    this.row1 = [];
    this.row2 = [];

    for(var i = 0; i < this.props.pack.length; i+=1){
      if(i <= 7){
        this.row1.push(this.props.pack[i]);
      }
      else {
        this.row2.push(this.props.pack[i]);
      }
    }
    this.setState({
      rendered: true
    });
  }

  render() {
    //reference props variables in local scope to be able to access without this
    var player_pick = this.props.player_pick;
    var pack_i = this.props.pack_i;

    if(this.state.rendered){
      return(
        <div className="row justify-content-md-center">
          <div className="col col-md-12">
            <table>
              <tbody>
                <tr>
                  {this.row1.map(function(pack, i){
                    return(
                      <td key={pack.card.id} onClick={function(){ player_pick(pack_i, i) }}>
                        <CardImage id={pack.card.id}/>
                      </td>
                    );
                  }, this)}
                </tr>
                <tr style={{display: (this.props.pack.length > 8) ? '' : 'none'}}>
                  {this.row2.map(function(pack, i){
                    return(
                      <td key={pack.card.id} onClick={function(){ player_pick(pack_i, i + 8) }}>
                        <CardImage id={pack.card.id}/>
                      </td>
                    );
                  }, this)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    else {
      return (
        <></>
      );
    }
  }
}
