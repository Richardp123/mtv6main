import React, { Component } from 'react';
import "./Signup.css";

class Signup extends Component {
  constructor(props){
    super(props);

  }

  render() {
    return (
      <div id="chatroomControls">
        <input type = "text" placeholder = "Type your username"
        onChange = {this.props.handleUsername} id="usernameInput"/>
        <button onClick={this.props.joinChat} className="chatroomButtons">ENTER</button>
      </div>
    );
  }
}

export default Signup;
