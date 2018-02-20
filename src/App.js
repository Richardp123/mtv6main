import React, { Component } from 'react';
import './App.css';
import Chatroom from "./comp/Chatroom";
import Landing from "./comp/Landing";
import Sticker from "./comp/Sticker";

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      landingDisplay:true,
      chatroomDisplay:false,
      stickerDisplay:false
    }
    this.enterChatroom = this.enterChatroom.bind(this);
    this.enterStickerPage = this.enterStickerPage.bind(this);
  }

  enterChatroom(show){
    this.setState({
      landingDisplay:false,
      chatroomDisplay:true,
      stickerDisplay:false
    })
  }
  enterStickerPage(show){
    this.setState({
      landingDisplay:false,
      chatroomDisplay:false,
      stickerDisplay:true
    })
  }

  render() {

    var mycomp = null;

    if(this.state.landingDisplay === true){
      mycomp = <Landing enterChatroom={this.enterChatroom}/>;
    } else if(this.state.chatroomDisplay === true){
      mycomp = <Chatroom enterStickerPage={this.enterStickerPage}/>;
    } else if(this.state.stickerDisplay === true){
      mycomp = <Sticker />
    }

    return (
      <div className="App">

        {mycomp}

      </div>
    );
  }
}

export default App;
