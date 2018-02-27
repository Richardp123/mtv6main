import React, { Component } from 'react';
import "./Sticker.css";
import mySocket from "socket.io-client";

class Sticker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      myImg:require("../img/1.png"),
      myImg2:require("../img/2.png"),
      allusers:[],
      myId:null,
      showDisplay:false
    }
    this.enterStickerPage = this.enterStickerPage.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handleDisplay = this.handleDisplay.bind(this);
  }

  componentDidMount(){
        //console.log(this.refs.thedisplay.id);
        // this.socket = mySocket("https://advdyn2.herokuapp.com/");
        this.socket = mySocket("http://localhost:3000");
        this.socket.on("createimage", (data)=>{
            this.setState({
                allusers:data
            })
        });

        this.socket.on("yourid", (data)=>{
            this.setState({
                myId:data
            });

            this.socket.on("usermove", (data)=>{
                console.log("user has moved");
                this.refs["u"+data.id].style.top = data.y+"px";
                this.refs["u"+data.id].style.left = data.x+"px";
                this.refs["u"+data.id].src = data.img;
            });

            this.refs.thedisplay.addEventListener("mousemove", (ev)=>{
                // console.log("moving", ev.pageX, ev.pageY);
                // this.refs.myImg.style.left = ev.pageX+"px";
                // this.refs.myImg.style.top = ev.pageY+"px";
                if(this.state.myId === null){
                    return false;
                }

                this.refs["u"+this.state.myId].style.left = ev.pageX+"px";
                this.refs["u"+this.state.myId].style.top = ev.pageY+"px";

                this.socket.emit("mymove", {
                    x:ev.pageX,
                    y:ev.pageY,
                    id:this.state.myId,
                    img:this.refs["u"+this.state.myId].src
                });
            });
        });

        // this.socket.on("usermove", (data)=>{
        //     console.log("user has moved");
        //     this.refs["u"+data.id].style.top = data.y+"px";
        //     this.refs["u"+data.id].style.left = data.x+"px";
        //     this.refs["u"+data.id].src = data.img;
        // });
    }

    handleImage(evt){
        this.refs["u"+this.state.myId].src = evt.target.src;
    }

    handleDisplay(roomString){
      this.setState({
        showDisplay: true
      });
      this.socket.emit("joinroom", roomString);
    }

  enterStickerPage(){
    this.props.enterStickerPage(true);
  }

  render() {

    var auImgs = this.state.allusers.map((obj,i)=>{
            return (
                <img ref={"u"+obj} key={i} height={50}
                className="allImgs" src={this.state.myImg} />
            )
        });

    return (
      <div>
        <div ref="thedisplay" id="display">
          {auImgs}
        </div>
        <div id="controls">
          {this.state.myId}
          <img src={this.state.myImg} height={50} onClick={this.handleImage} />
          <img src={this.state.myImg2} height={50} onClick={this.handleImage} />
        </div>
      </div>
    );
  }
}

export default Sticker;
