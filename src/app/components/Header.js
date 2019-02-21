import React from "react";
import {render} from "react-dom";

export class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <div className="container">
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
        </div>
      </nav>
    );
  }
}

try{
    render(<Header/>, window.document.getElementById("header"));
} catch(err) {}
