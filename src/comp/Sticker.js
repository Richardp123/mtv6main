import React, { Component } from 'react';
import mySocket from "socket.io-client";

class Sticker extends Component {

  constructor(props) {
    super(props);

    this.state = {

    }
    this.enterStickerPage = this.enterStickerPage.bind(this);
  }



  enterStickerPage(){
    this.props.enterStickerPage(true);
  }

  render() {


    return (
      <div>
        <p>WELCOME TO THE STICKER PAGE</p>

      </div>
    );
  }
}

export default Sticker;
