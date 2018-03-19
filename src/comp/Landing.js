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
              <div id="mvtInfo">MOTOR VEHICKLE FEFT IS THE SICKSTH ITTERATION OF THE POPULAR CAR STEALING GAME MOTER VHIKKEL THEPHTD. ITS GOT AKSHIN PACKED CAR STEELING AND DRIVING. PLAY WITH YOURE FEIRNDS OR ALONE. YOU WILL HAVE LOTS OF FUNS.
                <br />
                <button onClick={this.props.handleDisplay.bind(this, "room1")} className="mvtBut">Room 1</button>
                <button onClick={this.props.handleDisplay.bind(this, "room2")} className="mvtBut">Room 2</button>
                <button onClick={this.props.handleDisplay.bind(this, "room3")} className="mvtBut">Room 3</button>

              </div>
              </div>
              <div id="mvtLogo">
            </div>
          </div>
        )
    }
}

export default Landing;
