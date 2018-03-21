import React, { Component } from 'react';
import './App.css';
import mySocket from "socket.io-client";
import Signup from "./comp/Signup";
import Landing from "./comp/Landing";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      myImg:require("./imgs/char1.png"),
      myImg2:require("./imgs/char2.png"),
      myImg3:require("./imgs/char3.png"),
      hole:require("./imgs/hole.png"),
      map1:require("./imgs/map1.svg"),
      map2:require("./imgs/map2.svg"),
      map3:require("./imgs/map3.svg"),
      allusers:[],
      myId:null,
      showDisplay:0,
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
        // moves your character horizontally across the screen on mousemove
        if(this.state.myId === null){
          return false;
        }
          if(!this.refs["u"+this.state.myId]) {
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
        // creates gunshots and records score
        shotsfired = this.state.score;
        shotsfired++;
        this.setState({
          score:shotsfired
        });
          this.socket.emit("shots", {
              score:this.state.score
          });
          
          
        console.log(this.state.score);
        this.socket.emit("stick", {
          // places gunshot image where the crosshair is
          x:ev.pageX-10,
          y:ev.pageY-10,
          id:this.state.myId,
          src:this.state.hole
        });
          
          this.socket.on("gunShots", (data)=>{
              this.setState({
                 score:data.score 
              });
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
      this.refs["u"+data.id].style.bottom = -10+"px";
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
      showDisplay:1,
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

  // CHANGE MAPS
  changeMap = (ev) => {
      var mapChoice = "url(" + ev.target.src + ")";
      this.socket.emit("mapChange", mapChoice);
      
      this.socket.on("currentMap", (data)=>{
              this.refs.thedisplay.style.backgroundImage = data;
          });
  }

  render() {

    var allimgs = this.state.allusers.map((obj, i)=>{
      return (
        <img ref={"u"+obj} className="allImgs" src={this.state.myImg} height={150} key={i} />
      );
    });

    var allstickers = this.state.stickers.map((obj, i)=>{
      var mstyle = {left:obj.x, top:obj.y};
      return (
        <img style={mstyle} key={i} src={obj.src} height={20} className="allImgs" />
      );
    });

    var comp = null;

    // CHATROOM CONFIGURATION

    var allChats = this.state.allChats.map((obj,i)=>{
      return (
        <div key={i}>
          {obj}
        </div>
      );
    });
    var config = (
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

    var allUsers = this.state.users.map((obj, i) => {
      return (
        <div key={i}>
          {obj}
        </div>
      );
    });

    if(this.state.showDisplay === 0){
      // Signup
      comp = <Signup joinChat={this.joinChat} handleUsername={this.handleUsername} />
    } else if(this.state.showDisplay === 1){
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
            <div id="topBar">
          <div id="controls">
            <div id="scoreDiv"><p>Your Score is: &nbsp;</p>{this.state.score}&nbsp;&nbsp;</div>
            <div id="charDiv">
                <p>Choose a character</p>
                <img src={this.state.myImg} height={50} onClick={this.handleImage} />
                <img src={this.state.myImg2} height={50} onClick={this.handleImage} />
                <img src={this.state.myImg3} height={50} onClick={this.handleImage} />
            </div>
          </div>
            <div id="mapMenu">
                <p>CHOOSE YOUR MAP</p>
                <img src={this.state.map1} onClick={this.changeMap} className="mapThumbnails" />
                <img src={this.state.map2} onClick={this.changeMap} className="mapThumbnails" />
                <img src={this.state.map3} onClick={this.changeMap} className="mapThumbnails" />
            </div>
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
