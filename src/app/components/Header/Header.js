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

  getUser(){
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

  componentDidMount() {
    this.getUser();
  }

  render() {
    if(this.state.username === "Anonymous"){
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
            <UserControl username={this.state.username} getUser={this.getUser.bind(this)}/>
        </nav>
      );
    }
    else if(this.state.username === null){
      return (
        <></>
      );
    }
    else{
      return(
        <nav className="navbar navbar-expand-md navbar-dark bg-dark justify-content-between">
            <div className="navbar-header">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="/">Home</a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" href="/cubes">Cubes</a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" href="/user/cubes">My Cubes</a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" href="/user/drafts">Drafts</a>
                </li>
              </ul>
            </div>
            <UserControl username={this.state.username}/>
        </nav>
      );
    }
  }
}

try{
    render(<Header/>, window.document.getElementById("header"));
} catch(err) {}
