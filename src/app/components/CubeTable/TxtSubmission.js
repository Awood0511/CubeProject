import React from "react";
import axios from "axios";

export class TxtSubmission extends React.Component {
  constructor(props) {
    super();
    this.state = {
      file: null
    }
  }

  fileChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }

  handlePost(e) {
    const fd = new FormData();
    fd.append('cubetxt', this.state.file, this.state.file.name);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    axios.post('/api/cube/' + this.props.cube_id, fd).then(
      response => {
        console.log("response received");
      },
      error => {
        console.log(error);
      }
    );
  }

  render () {
    return (
      <div className="row">
        <div className="col">
          Upload a text file:
          <input type="file" name="cubetxt" onChange={this.fileChange.bind(this)}></input>
          <button onClick={this.handlePost.bind(this)}>Upload</button>
        </div>
      </div>
    );
  }
}
