import React from "react";
import {render} from "react-dom";
import axios from "axios";

export class CubePrices extends React.Component {
  constructor() {
    super();
    this.state = {
      cards: false
    };
    this.cards;
    this.calculateTotalPrice = this.calculateTotalPrice.bind(this);

    //get cube_id
    let url = window.location.href;
    this.cube_id = url.substring(url.lastIndexOf("/")+1, url.length);
  }

  componentDidMount() {
    axios.get("/api/cube/" + this.cube_id).then(
      response => {
        this.cards = response.data[0];
        this.setState({
          cards: true
        });
      },
      error => {
        console.log(error);
      }
    );
  } //end componentDidMount

  calculateTotalPrice() {
    var total = 0;
    for(var i = 0; i < this.cards.length; i+=1){
      if(this.cards[i].price){
        total += this.cards[i].price;
      }
    }
    return total;
  }

  render() {
    if(this.state.cards === true){
      return (
        <div className="container-fluid">
          <div className="row justify-content-md-center">
            <div className="col col-md-8 col-md-offset-2">
              <h3 style={{textAlign: "center"}}>Cube Prices</h3>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Set</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total</td>
                    <td>Price</td>
                    <td>{this.calculateTotalPrice()}</td>
                  </tr>
                  {this.cards.map(card =>
                    <tr key={card.id}>
                      <td>{card.cname}</td>
                      <td>{card.set_name}</td>
                      <td>{(card.price) ? card.price : "?"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
        </div>
      );
    }
  }
} //end CardTable

try{
    render(<CubePrices/>, window.document.getElementById("cube_prices"));
} catch(err) {}
