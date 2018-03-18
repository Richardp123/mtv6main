import React, { Component } from 'react';
import mySocket from "socket.io-client";

class Rooms extends Component {
    constructor(props){
        super(props);
        this.state = {

        }

    }

    componentDidMount(){
    }

    render() {

        return (
            <div>
              <button onClick={this.props.handleDisplay}>Room 1</button>
              <button onClick={this.props.handleDisplay}>Room 2</button>
            </div>
        );
    }
}

export default Rooms;
