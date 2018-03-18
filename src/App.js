import React, { Component } from 'react';
import './App.css';
import mySocket from "socket.io-client";
import Rooms from "./comp/Rooms";

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            myImg:require("./img/1.png"),
            myImg2:require("./img/2.png"),
            allusers:[],
            myId:null,
            showDisplay:false,
            stickers:[]
        }
        this.handleImage = this.handleImage.bind(this);
        this.handleDisplay = this.handleDisplay.bind(this);
    }

    componentDidMount(){
        //console.log(this.refs.thedisplay.id);
        this.socket = mySocket("http://localhost:10000/");

        this.socket.on("userjoined", (data)=>{
          this.setState({
            allusers:data
          });
        });

        this.socket.on("createimage", (data)=>{
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
                    return false;
                }

                this.refs["u"+this.state.myId].style.left = ev.pageX+"px";
                // this.refs["u"+this.state.myId].style.top = ev.pageY+"px";

                this.socket.emit("mymove", {
                    x:ev.pageX,
                    y:ev.pageY,
                    id:this.state.myId,
                    img:this.refs["u"+this.state.myId].src
                });
            });
            this.refs.thedisplay.addEventListener("click", (ev)=>{
              console.log("FIRED", ev.pageX, ev.pageY);
              this.socket.emit("stick",{
      					x:ev.pageX,
      					y:ev.pageY,
      					id:this.state.myId,
      					src:this.refs["u"+this.state.myId].src
              });
            });
        });

        this.socket.on("newsticker", (data)=>{
        		this.setState({
        			stickers:data
        		});
        });

        this.socket.on("newmove", (data)=>{
            // console.log(data);
            this.refs["u"+data.id].style.top = data.y+"px";
            this.refs["u"+data.id].style.left = data.x+"px";
            this.refs["u"+data.id].src = data.img;
        });
    }

    handleImage(evt){
        this.refs["u"+this.state.myId].src = evt.target.src;
    }

    handleDisplay(){
      this.setState({
        showDisplay:true
      });
      this.socket.emit("joinroom");
    }


    render() {
        var allimgs = this.state.allusers.map((obj,i)=>{
            return (
                <img ref={"u"+obj} key={i} height={50} className="allImgs" src={this.state.myImg} />
            )
        });

        var allstickers = this.state.stickers.map((obj,i)=>{
          var mstyle = {left:obj.x, top:obj.y}
          return (
            <img style={mstyle} key={i} src={obj.src} height={50} className="allImgs" />
          )
        });

        var comp = null;

        if(this.state.showDisplay === false){
          comp = (
            <div>

              <div id="mainPage">

                <div id="mvtInfo">MOTOR VEHICKLE FEFT IS THE SICKSTH ITTERATION OF THE POPULAR CAR STEALING GAME MOTER VHIKKEL THEPHTD. ITS GOT AKSHIN PACKED CAR STEELING AND DRIVING. PLAY WITH YOURE FEIRNDS OR ALONE. YOU WILL HAVE LOTS OF FUNS.
                  <br />
                  <button onClick={this.handleDisplay} id="mvtBut">ENTER</button>
                </div>

                </div>
                <div id="mvtLogo">
              </div>

            </div>
          );
        }  else {
          // Sticker
          comp = (
            <div>
              <div ref="thedisplay" id="display">
                  {allimgs}
                  {allstickers}
              </div>
              <div id="controls">
                  {this.state.myId}
                  <img src={this.state.myImg} height={50} onClick={this.handleImage} />
                  <img src={this.state.myImg2} height={50} onClick={this.handleImage} />
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
