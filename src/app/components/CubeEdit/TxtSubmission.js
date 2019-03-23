import React from "react";
import axios from "axios";

export class TxtSubmission extends React.Component {
  constructor() {
    super();
    this.state = {
      file: null
    }
    let url = window.location.href;
    this.cube_id = url.substring(url.lastIndexOf("/")+1, url.length);
  }

  fileChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }

  handlePost(e) {
    const fd = new FormData();
    fd.append('cubetxt', this.state.file, this.state.file.name);

    axios.post('/api/cube/' + this.cube_id, fd).then(
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
      <div className="row align-items-center">
        <div className="col-sm-auto offset-sm-5">
          <button onClick={this.handlePost.bind(this)}>Upload</button>
          <input type="file" name="cubetxt" onChange={this.fileChange.bind(this)}></input>
        </div>
      </div>
    );
  }
}
