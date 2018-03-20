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
            // Chat props
            mode: 0,
            username: "",
            users: [],
            allChats: [],
            myMsg: ""
        }
        this.handleImage = this.handleImage.bind(this);
        this.handleDisplay = this.handleDisplay.bind(this);

        // Chat functions
        this.joinChat = this.joinChat.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handleMyMsg = this.handleMyMsg.bind(this);
        this.sendChat = this.sendChat.bind(this);
    }

    componentDidMount(){

        this.socket = mySocket("http://localhost:10000");

        this.socket.on("userjoined", (data)=>{
            this.setState({
                allusers:data
            })
        });

        this.socket.on("yourid", (data)=>{
            this.setState({
                myId:data
            });

            this.refs.thedisplay.addEventListener("mousemove", (ev)=>{

                if(this.state.myId === null){
                    //FAIL
                    return false;
                }

                this.refs["u"+this.state.myId].style.height = 150+"px";
                this.refs["u"+this.state.myId].style.left = ev.pageX+"px";
                this.refs["u"+this.state.myId].style.bottom = -10+"px";

                this.socket.emit("mymove", {
                    x:ev.pageX,
                    y:ev.pageY,
                    id:this.state.myId,
                    src:this.refs["u"+this.state.myId].src
                });
            });

            this.refs.thedisplay.addEventListener("click", (ev)=>{
                this.socket.emit("stick", {
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

    handleImage(evt){
        this.refs["u"+this.state.myId].src = evt.target.src;
    }

    handleDisplay(roomString){
        this.setState({
            showDisplay:true
        });
        this.socket.emit("joinroom", roomString);
    }

    // Chat functions
    joinChat() {
      this.setState({
        mode: 1
      })
      this.socket = mySocket("http://localhost:10000");
      this.socket.emit("username", this.state.username);

      this.socket.on("usersjoined", (data) => {
        console.log(data);
        this.setState({
          users: data
        })
      });

      this.socket.on("msgsent", (data)=>{
        this.setState({
          allChats:data
        });
      });
    }

    handleUsername(evt) {
      this.setState({
        username: evt.target.value
      });
    }

    handleMyMsg(evt) {
      this.setState({
        myMsg: evt.target.value
      });
    }

    sendChat() {
      var msg = this.state.username + ": " + this.state.myMsg;
      this.socket.emit("sendChat", msg);
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
            <div>
              <input type = "text" placeholder = "Type your username"
              onChange = {this.handleUsername} className="textInputs"/>
              <br/><br/>
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
                <input type="text" placeholder="Type your message"
                onChange={this.handleMyMsg} className="textInputs"/>
                <button onClick={this.sendChat} className="chatroomButtons">Send</button>
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
                           <p> Users in the chatroom right now </p>
                        <div id="users">
                            {allUsers}
                        </div>
                        </div>
                
                        <div id="chatBody">
                            {config}
                    
                        </div>
                    </div>


                    <div ref="thedisplay" id="display">
                      <audio src={audio_file} id="audio"></audio>
                        {allstickers}
                        {allimgs}
                    </div>
                    <div id="controls">
                        {this.state.myId}
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
