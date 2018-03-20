import React, { Component } from 'react';
import "./Landing.css";

class Landing extends Component {
  constructor(props){
    super(props);

  }

  render() {
    return (
      <div>
        <div id="mainPage">
          <div id="mvtInfo"><b>MOTOR VEHICLE THEFT VI</b> IS THE SIXTH ITERATION OF THE POPULAR CAR STEALING GAME MOTOR VEHICLE THEFT. ITS GOT ACTION PACKED CAR STEALING AND DRIVING. PLAY WITH YOUR FRIENDS OR ALONE. YOU WILL HAVE LOTS OF FUN.
            <br />
            <button onClick={this.props.handleDisplay.bind(this, "room1")} className="mvtBut">Room 1</button>
            <button onClick={this.props.handleDisplay.bind(this, "room2")} className="mvtBut">Room 2</button>
            <button onClick={this.props.handleDisplay.bind(this, "room3")} className="mvtBut">Room 3</button>
          </div>
          </div>
          <div id="mvtLogo">
        </div>
      </div>
    );
  }
}

export default Landing;
