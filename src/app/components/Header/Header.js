import React from "react";
import axios from "axios";
import {render} from "react-dom";
import {UserControl} from "./UserControl";

export class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null
    };
  }

  componentDidMount() {
    axios.get("/api/user").then(
      response => {
        //save cube card information
        this.setState({
          username: response.data
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  render() {
    if(this.state.username !== null){
      return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark justify-content-between">
            <div className="navbar-header">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="/">Home</a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" href="/cube">Cubes</a>
                </li>
              </ul>
            </div>
            <UserControl username={this.state.username}/>
        </nav>
      );
    }
    else{
      return (
        <></>
      );
    }
  }
}

try{
    render(<Header/>, window.document.getElementById("header"));
} catch(err) {}
