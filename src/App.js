import React, { Component } from 'react';
import './App.css';
import audio_file from "./audio/shot.mp3";
import mySocket from "socket.io-client";
import Landing from "./comp/Landing";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      myImg:require("./imgs/char1.png"),
      myImg2:require("./imgs/char2.png"),
      myImg3:require("./imgs/char3.png"),
      hole:require("./imgs/hole.png"),
      allusers:[],
      myId:null,
      showDisplay:false,
      stickers:[],
      score:0,
      // Chat props
      mode:0,
      username:"",
      users:[],
      allChats:[],
      myMsg:""
    }
  }

  componentDidMount(){
    // TODO: Change socket to heroku link
    this.socket = mySocket("http://localhost:10000");

    this.socket.on("userjoined", (data)=>{
      this.setState({
        allusers:data
      });
    });

    this.socket.on("yourid", (data)=>{
      this.setState({
        myId:data
      });

      this.refs.thedisplay.addEventListener("mousemove", (ev)=>{
        // This function moves your character horizontally across the screen on mousemove
        if(this.state.myId === null){
          //FAIL
          return false;
        }

        this.refs["u"+this.state.myId].style.height = 150+"px";
        this.refs["u"+this.state.myId].style.left = ev.pageX+"px";
        this.refs["u"+this.state.myId].style.bottom = -10+"px";

        this.socket.emit("mymove", {
          x:ev.pageX,
          // y:ev.pageY,
          id:this.state.myId,
          src:this.refs["u"+this.state.myId].src
        });
      });

      this.refs.thedisplay.addEventListener("click", (ev, shotsfired)=>{
        // this function creates gunshots
        shotsfired = this.state.score;
        shotsfired++;
        this.setState({
          score:shotsfired
        });
        console.log(this.state.score);
        this.socket.emit("stick", {
          // places gunshot image where the crosshair is
          x:ev.pageX-10,
          y:ev.pageY-10,
          id:this.state.myId,
          src:this.state.hole
        });
      });

    });

    this.socket.on("newsticker", (data)=>{
      this.setState({
        stickers:data
      });
    });

    this.socket.on("newmove", (data)=>{
      this.refs["u"+data.id].style.left = data.x+"px";
      this.refs["u"+data.id].style.top = data.y+"px";
      this.refs["u"+data.id].src = data.src;
    });
  }

  handleImage = (evt) => {
    // Changes characters appearance
    this.refs["u"+this.state.myId].src = evt.target.src;
  }

  handleDisplay = (roomString) =>{
    // Joins room from landing page
    this.setState({
      showDisplay:true
    });
    this.socket.emit("joinroom", roomString);
  }

  // Chat functions
  joinChat = () => {
    // displays the input and button for typing and sending messages
    this.setState({
      mode:1
    });
    this.socket.emit("username", this.state.username);

    this.socket.on("usersjoined", (data) => {
      this.setState({
        users:data
      });
    });

    this.socket.on("msgsent", (data)=>{
      this.setState({
        allChats:data
      });
    });
  }

  handleUsername = (evt) => {
    this.setState({
      username:evt.target.value
    });
  }

  handleMyMsg = (evt) => {
    this.setState({
      myMsg:evt.target.value
    });
  }

  sendChat = (ev) => {
    ev.preventDefault();
    var msg = this.state.username + ": " + this.state.myMsg;
    this.socket.emit("sendChat", msg);
    this.refs.msgInput.value = "";
  }

  render() {

    var allimgs = this.state.allusers.map((obj, i)=>{
      return (
        <img ref={"u"+obj} className="allImgs" src={this.state.myImg} height={50} key={i} />
      );
    });

    var allstickers = this.state.stickers.map((obj, i)=>{
      var mstyle = {left:obj.x, top:obj.y};
      return (
        <img style={mstyle} key={i} src={obj.src} height={20} className="allImgs" />
      );
    })

    var comp = null;

    // CHATROOM CONFIGURATION
    var config = null;

    if (this.state.mode === 0) {
      config = (
        <div id="chatroomControls">
          <input type = "text" placeholder = "Type your username"
          onChange = {this.handleUsername} className="textInputs"/>
          <button onClick={this.joinChat} className="chatroomButtons">Join Chat</button>
        </div>
      )
    } else if (this.state.mode === 1) {
      var allChats = this.state.allChats.map((obj,i)=>{
        return (
          <div key={i}>
            {obj}
          </div>
        );
      });
      config = (
        <div id="chatBox">
          <div id="chatDisplay"><div id="chatMsg">{allChats}</div></div>
          <div id="chatroomControls">
            <form onSubmit={this.sendChat}>
              <input ref="msgInput" type="text" placeholder="Type your message" onChange={this.handleMyMsg} className="textInputs"/>
              <button className="chatroomButtons">Send</button>
            </form>
          </div>
        </div>
      );
    }

    var allUsers = this.state.users.map((obj, i) => {
      return (
        <div key={i}>
          {obj}
        </div>
      );
    });

    if(this.state.showDisplay === false){
      // Landing
      comp = <Landing handleDisplay={this.handleDisplay} />;
    } else {
      //Display
      comp = (
        <div>
          <div id="chat">
            <div id="allUsers">
             <p>Users online</p>
            <div id="users">
              {allUsers}
            </div>
          </div>
          <div id="chatBody">
            {config}
          </div>
        </div>

        <div ref="thedisplay" id="display">
          {allstickers}
          {allimgs}
        </div>
        <div id="controls">
          {this.state.score}
          <img src={this.state.myImg} height={50} onClick={this.handleImage} />
          <img src={this.state.myImg2} height={50} onClick={this.handleImage} />
          <img src={this.state.myImg3} height={50} onClick={this.handleImage} />
        </div>
      </div>
    );
  }

    return (
      <div className="App">
        {comp}
      </div>
    );
  }
}

export default App;
