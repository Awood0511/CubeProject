import React from "react";

export class DraftTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pickNum: this.props.pickNum
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <h3>{this.props.name}'s Cards</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Set</th>
              </tr>
            </thead>
            <tbody>
              {this.props.picks.map(function(draftCard) {
                return (
                  <tr key={draftCard.card.id} id={draftCard.card.id + "_row"}>
                    <td>{draftCard.card.cname}</td>
                    <td>{draftCard.card.set_code}</td>
                  </tr>
                );
              }, this)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
