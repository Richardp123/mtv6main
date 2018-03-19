import React, { Component } from 'react';
import './App.css';
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
            stickers:[]
        }

        this.handleImage = this.handleImage.bind(this);
        this.handleDisplay = this.handleDisplay.bind(this);
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

                this.refs["u"+this.state.myId].style.left = ev.pageX+"px";
                this.refs["u"+this.state.myId].style.bottom = 100+"px";

                this.socket.emit("mymove", {
                    x:ev.pageX,
                    y:ev.pageY,
                    id:this.state.myId,
                    src:this.refs["u"+this.state.myId].src
                })
            });

            this.refs.thedisplay.addEventListener("click", (ev)=>{
                this.socket.emit("stick", {
                    x:ev.pageX-25,
                    y:ev.pageY-25,
                    // src:this.refs["u"+this.state.myId].src
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
            //console.log(data);
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

    render() {

        var allimgs = this.state.allusers.map((obj, i)=>{
            return (
                <img ref={"u"+obj} className="allImgs" src={this.state.myImg} height={50} key={i} />
            )
        });

        var allstickers = this.state.stickers.map((obj, i)=>{
            var mstyle = {left:obj.x, top:obj.y};
            return (
                <img style={mstyle} key={i} src={obj.src} height={50} className="allImgs" />
            )
        })

        var comp = null;

        if(this.state.showDisplay === false){
            // Landing
            comp = <Landing handleDisplay={this.handleDisplay} />;
        } else {
            //Display
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
                        <img src={this.state.myImg3} height={50} onClick={this.handleImage} />
                    </div>
                </div>
            )
        }

        return (
            <div className="App">
                {comp}
            </div>
        );
    }
}

export default App;
