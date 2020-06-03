// <!--Michael Rokitko 334060893-->
// <!--Yevgeny Alterman 317747814-->
// <!--Edan Azran 309743201-->

import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import {Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { SwatchesPicker} from 'react-color'


const CUBE_LINES = [
    [0, 1],
    [1, 3],
    [3, 2],
    [2, 0],
    [2, 6],
    [3, 7],
    [0, 4],
    [1, 5],
    [6, 7],
    [6, 4],
    [7, 5],
    [4, 5]
];



const CUBE_VERTICES = [
    [-1, -1, -1],
    [1, -1, -1],
    [-1, 1, -1],
    [1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [-1, 1, 1],
    [1, 1, 1]
];

class Cube {
    constructor(x, y, z,ctx,width,height) {
        // this.x = (Math.random() - 0.5) * width;
        // this.y = (Math.random() - 0.5) * width;
        // this.z = (Math.random() - 0.5) * width;

        // console.log(this.x,this.y,this.z)
        this.x = 100 ;
        this.y = 100 ;
        this.z = -15 ;



        // this.radius = Math.floor(Math.random() * 12 +  10);
        this.radius = 60
        this.ctx = ctx
        this.width = width
        this.height = height

        // TweenMax.to(this, Math.random() * 20 + 15, {
        //     x: (Math.random() - 0.5) * (width * 0.5),
        //     y: (Math.random() - 0.5) * (width * 0.5),
        //     z: (Math.random() - 0.5) * width,
        //     repeat: -1,
        //     yoyo: true,
        //     ease: Power2.EaseOut,
        //     delay: Math.random() * -35
        // });

        console.log('created')
    }
    // Do some math to project the 3D position into the 2D canvas
    project(x, y, z) {
        const sizeProjection = (this.width * 0.8) / (this.width * 0.8 + z);
        const xProject = (x * sizeProjection) + (this.width / 2);
        const yProject = (y * sizeProjection) + (this.height / 2);
        return {
            size: sizeProjection,
            x: xProject,
            y: yProject
        }
    }

    changeRadius(rad){
        this.radius = rad
    }

    setNewValues(x,y,z){
        this.x = x
        this.z = z
        this.y = y
    }
    // Draw the dot on the canvas
    drawDot() {
        // Do not render a cube that is in front of the camera
        if (this.z < - (this.width * 0.8) + this.radius) {
            return;
        }
        for (let i = 0; i < CUBE_LINES.length; i++) {
            // console.log(CUBE_LINES[i])


            const v1 = {
                x: this.x + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][0]),
                y: this.y + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][1]),
                z: this.z + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][2])
            };
            const v2 = {
                x: this.x + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][0]),
                y: this.y + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][1]),
                z: this.z + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][2])
            };

            // // console.log(this.x)
            //
            // console.log(this.radius)
            // console.log(CUBE_VERTICES[CUBE_LINES[i][1]][0])
            //

            const v1Project = this.project(v1.x, v1.y, v1.z);
            const v2Project = this.project(v2.x, v2.y, v2.z);


            // const v1Project = this.project(this.x, this.y, this.z);
            // const v2Project = this.project(this.x, this.y, this.z);

            // console.log(v1Project,v2Project)
            this.ctx.beginPath();
            this.ctx.moveTo(v1Project.x, v1Project.y);
            this.ctx.lineTo(v2Project.x, v2Project.y);
            this.ctx.strokeStyle = 'blue';
            this.ctx.stroke();
        }
        // ctx.globalAlpha = Math.abs(this.z / (width * 0.5));
    }
}


const TRIANGLE_LINES = [
    [0, 1],
    [1, 2],
    [2, 0],
    [0, 3],
    [1, 3],
    [2, 3]
];



const TRIANGLE_VERTICES = [
    [-1,-1,-2],
    [1,-1,-1],
    [0,0,3],
    [0,1,-1],

];



class Triangle {
    constructor(x, y, z,ctx,width,height) {
        // this.x = (Math.random() - 0.5) * width;
        // this.y = (Math.random() - 0.5) * width;
        // this.z = (Math.random() - 0.5) * width;

        // console.log(this.x,this.y,this.z)
        this.x = -200 ;
        this.y = 200 ;
        this.z = -10 ;



        // this.radius = Math.floor(Math.random() * 12 +  10);
        this.radius = 60
        this.ctx = ctx
        this.width = width
        this.height = height

        // TweenMax.to(this, Math.random() * 20 + 15, {
        //     x: (Math.random() - 0.5) * (width * 0.5),
        //     y: (Math.random() - 0.5) * (width * 0.5),
        //     z: (Math.random() - 0.5) * width,
        //     repeat: -1,
        //     yoyo: true,
        //     ease: Power2.EaseOut,
        //     delay: Math.random() * -35
        // });

        // console.log('created')
    }

    setNewValues(x,y,z){
        this.x = x
        this.z = z
        this.y = y
    }


    changeRadius(rad){
        this.radius = rad
    }

    // Do some math to project the 3D position into the 2D canvas
    project(x, y, z) {
        const sizeProjection = (this.width * 0.8) / (this.width * 0.8 + z);
        const xProject = (x * sizeProjection) + (this.width / 2);
        const yProject = (y * sizeProjection) + (this.height / 2);
        return {
            size: sizeProjection,
            x: xProject,
            y: yProject
        }
    }
    // Draw the dot on the canvas
    drawDot() {
        // Do not render a cube that is in front of the camera
        if (this.z < - (this.width * 0.8) + this.radius) {
            return;
        }



        for (let i = 0; i < TRIANGLE_LINES.length; i++) {


                const v1 = {
                    x: this.x + (this.radius * TRIANGLE_VERTICES[TRIANGLE_LINES[i][0]][0]),
                    y: this.y + (this.radius * TRIANGLE_VERTICES[TRIANGLE_LINES[i][0]][1]),
                    z: this.z + (this.radius * TRIANGLE_VERTICES[TRIANGLE_LINES[i][0]][2])
                };



                const v2 = {
                    x: this.x + (this.radius * TRIANGLE_VERTICES[TRIANGLE_LINES[i][1]][0]),
                    y: this.y + (this.radius * TRIANGLE_VERTICES[TRIANGLE_LINES[i][1]][1]),
                    z: this.z + (this.radius * TRIANGLE_VERTICES[TRIANGLE_LINES[i][1]][2])
                };


            // console.log(this.x)


            const v1Project = this.project(v1.x, v1.y, v1.z);
            const v2Project = this.project(v2.x, v2.y, v2.z);


            // const v1Project = this.project(this.x, this.y, this.z);
            // const v2Project = this.project(this.x, this.y, this.z);

            // console.log(v1Project,v2Project)
            this.ctx.beginPath();
            this.ctx.moveTo(v1Project.x, v1Project.y);
            this.ctx.lineTo(v2Project.x, v2Project.y);
            this.ctx.strokeStyle = 'red';
            // canvas.stroke();
            // this.ctx.fillStyle ='blue';
            this.ctx.stroke();
        }
        // ctx.globalAlpha = Math.abs(this.z / (width * 0.5));
    }
}




class MyApp extends React.Component{
    constructor(props) {
        super(props);

        //state is the variable holder for the class. Each method can access and mutate the state
        this.state = {
            counter: 0,
            file:'',
            offset:{
                x:0,
                y:0
            },
            canvasCoord:{
                x:0,
                y:0
            },
            lines:[],
            objects:[],
            circles:[],
            curves:[],
            rectangles:[],
            canvas:null,
            mode:'not chosen',
            color:'#008000',
            action:'no action',
            instruction:'Choose mode to get instructions',
            errorText:'',
            fileName:'',
            cavasSize:{y:700,x:1400},
            colorPick:false,
            // rect:{x: 100, y: 100, x1: 300, y1: 100,x2: 300, y2: 300,x3: 100, y3: 300}
            DOTS_AMOUNT : 1000, // Amount of dots on the screen
            DOT_RADIUS : 2, // Radius of the dots
            PROJECTION_CENTER_X :0, // X center of the canvas HTML
            PROJECTION_CENTER_Y : 0, // Y center of the canvas HTML
            FIELD_OF_VIEW : 0,
            dots:[],
            dotsTri:[]
        };
    }


    //React function that runs on load of the page
    componentDidMount() {
        this.setState({canvas:this.refs.canvas.getContext('2d')})

        let canvas = ReactDOM.findDOMNode(this.refs['canvas'])
            .getBoundingClientRect();
        this.state.canvasCoord.x =  Math.floor(canvas.x)
        this.state.canvasCoord.y =  Math.floor(canvas.y)

        this.state.dots.length = 0;


        // console.log(canvas)
        // console.log(canvas.width)
        // console.log(canvas.height)
        // canvas.width = canvas.clientWidth;
        // canvas.height = canvas.clientHeight;
// Store the 2D context
        let ctx = this.refs.canvas.getContext('2d')


        // Create a new dot based on the amount needed
        //constructor(x, y, z,ctx,width,height) {

        for (let i = 0; i < 1; i++) {
            this.state.dots.push(new Cube(20,20,100,ctx,canvas.width,canvas.height));
        }

        for (let i = 0; i < 1; i++) {
            this.state.dotsTri.push(new Triangle(100,100,200,ctx,canvas.width,canvas.height));
        }

    }


    //basic point (for tests mainly)
    point = (x, y, canvas) => {
        canvas.beginPath();
        canvas.moveTo(x, y);
        canvas.lineTo(x+1, y+1);
        canvas.strokeStyle = '#FF0000';
        canvas.stroke();
    }

    //basic line
    line = (x, y,xEnd,yEnd, canvas) =>{
        canvas.beginPath();
        canvas.moveTo(x, y);
        canvas.lineTo(xEnd , yEnd);
        canvas.strokeStyle = this.state.color;
        canvas.stroke();
    }



    //rectangle is created from 4 lines rendered one after another and then filled with given color
    newRectangle = (x, y,x1,y1,x2,y2,x3,y3,color, canvas) =>{
        canvas.beginPath();
        canvas.moveTo(x, y);
        canvas.lineTo(x1 , y1);
        canvas.lineTo(x2 , y2);
        canvas.lineTo(x3 , y3);
        canvas.closePath();
        canvas.strokeStyle = color;
        canvas.stroke();
        // canvas.fillStyle =color;
        // canvas.fill()
    }


    //the canvas is not located in pure 0,0 of the page, thus the starting point of the canvas is added to each value
    normalize = (val,isX) => {
        if(isX)
            return val +  this.state.canvasCoord.x
        else
            return val + this.state.canvasCoord.y
    }




    //uploading and parsing the file
    showFile = async (e) => {
        e.preventDefault()
        this.clearCanvas()
        this.setState({errorText:''})
        try{
            const reader = new FileReader()
            reader.onload = async (e) => {
                const text = (e.target.result)
                // console.log(JSON.parse(text))
                let data = JSON.parse(text)

                for (let line = 0; line < data.lines.length; line++) {
                    // this.normalize()
                    let oneLine = {
                        x: data.lines[line].from.x,
                        y: data.lines[line].from.y,
                        z: data.lines[line].from.z,
                        x1: data.lines[line].to.x,
                        y1: data.lines[line].to.y,
                        z1: data.lines[line].from.z
                    }

                    // if(isNaN(x) || isNaN(x1) || isNaN(y) || isNaN(y1)){
                    //     this.setState({errorText:'Error reading rectangles, fix the input file'})
                    //     this.clearCanvas()
                    //
                    //     return
                    // }
                    this.state.lines.push(oneLine)

                }

                for (let i = 0; i < data.rectangles.length; i++) {

                    let rectangle = {
                        x: data.rectangles[i].one.x,
                        y: data.rectangles[i].one.y,
                        z: data.rectangles[i].one.z,

                        x1: data.rectangles[i].two.x,
                        y1: data.rectangles[i].two.y,
                        z1: data.rectangles[i].two.z,

                        x2: data.rectangles[i].three.x,
                        y2: data.rectangles[i].three.y,
                        z2: data.rectangles[i].three.z,


                        x3: data.rectangles[i].four.x,
                        y3: data.rectangles[i].four.y,
                        z3: data.rectangles[i].four.z,

                        color: data.rectangles[i].color
                    }

                    // if(isNaN(x) || isNaN(x1) || isNaN(x2)|| isNaN(x3)|| isNaN(y) || isNaN(y1) || isNaN(y2) || isNaN(y3)){
                    //     this.setState({errorText:'Error reading rectangles, fix the input file'})
                    //     this.clearCanvas()
                    //     return
                    // }
                    this.state.rectangles.push(rectangle)

                }


            }
        }
        catch (e) {

        }
    }

    //for the move function we need to catch the click of the mouse
    handleClickOnCanvas = (e) => {
        let x = e.clientX;     // Get the horizontal coordinate
        let y = e.clientY;     // Get the vertical coordinate
        let coor = "X coords: " + x + ", Y coords: " + y;
        console.log(x - this.state.canvasCoord.x ,y - this.state.canvasCoord.y)

        x = x - this.state.canvasCoord.x - 700
        y = y - this.state.canvasCoord.y - 350

        this.state.dots[0].setNewValues(x,y,0)
        this.state.dotsTri[0].setNewValues(x+30,y+30,0)
        this.clearCanvas()
        console.log(this.state.dots[0])
        this.forceUpdate()

        if(this.state.mode === 'move'){
            // this.moveImage(x,y)
        }

        if(this.state.mode === 'mirror'){
        }

        if(this.state.mode === 'scaling'){
        }

        if(this.state.mode === 'spin'){

        }

    }


    //cean the canvas from everything
    clearCanvas = ( ) => {
        this.refs.canvas.getContext('2d').beginPath();
        this.refs.canvas.getContext('2d').clearRect(0,0, this.normalize(1400,true), this.normalize(700,false));
    }

    scaling = (action,number) => {
        this.clearCanvas()
        let factor = 1
        if('plus' === action){
            factor = 1.1
        }
        if('minus' === action){
            factor = 0.9
        }

        console.log(this.state.dots[0].radius)

        this.state.dots[0].radius = this.state.dots[0].radius * factor

        this.state.dotsTri[0].radius = this.state.dots[0].radius * factor

        this.forceUpdate()
    }



    //runs every second to redraw the changes on the screen
    render() {
        for (let i = 0; i < this.state.dots.length; i++) {
            this.state.dots[i].drawDot();
        }

        for (let i = 0; i < this.state.dots.length; i++) {
            this.state.dotsTri[i].drawDot();
        }

        return (
            <div className="App">
                <div>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="menu">
                            </IconButton>
                            <Typography variant="h6" >
                                Easy-Draw
                            </Typography>
                            <Button
                                variant="contained"
                                component="label"
                                style={styles.button}
                            > Upload File<input
                                value={this.state.fileName}
                                style={{ display: "none" }}
                                type="file"
                                onChange={(e) => {

                                    this.setState({fileName:e.target.value})
                                    this.showFile(e).then().catch()
                                    this.setState({fileName:''})
                                }}

                            /></Button>
                            <Button
                                style={styles.button}
                                variant="contained"
                                component="label"
                                onClick={() => {
                                    this.clearCanvas()
                                    window.location.reload(true);
                                }}
                            > Clean Canvas</Button>
                            <Typography style={{marginLeft:20}}>Current color: </Typography>
                            <div style={{marginLeft:5,height:20,width:20,backgroundColor:this.state.color}}/>
                            <Button
                                style={styles.button}
                                variant="contained"
                                component="label"

                                onClick={() => {
                                    this.setState({colorPick: !this.state.colorPick})
                                }}
                            > Pick Color</Button>


                            <Typography style={{marginLeft:200}}>Choose a mode:</Typography>
                            <Button  style={styles.button} disabled={this.state.mode === 'move'} onClick={() => this.setState({mode:'move',instruction:'Click on a point on canvas, the image will be centered in that point'})} size="small" variant='contained'>
                                Move
                            </Button>
                            <Button  style={styles.button} disabled={this.state.mode === 'mirror'} onClick={() =>this.setState({mode:'mirror',instruction:'Click on buttons to mirror'})} size="small" variant='contained'>
                                Mirror
                            </Button>
                            <Button  style={styles.button} disabled={this.state.mode === 'spin'} onClick={() =>this.setState({mode:'spin',instruction:'Click on Right or Left buttons to spin'})} size="small" variant='contained' >
                                Spin
                            </Button>
                            <Button  style={styles.button} disabled={this.state.mode === 'scaling'} onClick={() => this.setState({mode:'scaling',instruction:'Click on buttons to adjust size'})} size="small" variant='contained' >
                                Scaling
                            </Button>
                        </Toolbar>
                    </AppBar>
                    { this.state.colorPick ? <div style={ styles.picker.popover }>
                        <div style={ styles.picker.cover } onClick={()=> this.setState({colorPick:false}) }/>
                        <SwatchesPicker
                            color={ this.state.color }
                            onChangeComplete={(color) => {
                                this.setState({color:color.hex,colorPick: !this.state.colorPick})
                                this.clearCanvas()
                                this.renderOnCanvas()
                            }}/>
                    </div> : null }

                    <Card>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Current mode: {this.state.mode}
                                </Typography>
                                <Typography gutterBottom variant="body1" component="h2">
                                    {this.state.instruction}
                                </Typography>
                                <Typography style={{color:'red'}} gutterBottom variant="body1" component="h2">
                                    {this.state.errorText}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <canvas id="scene" ref="canvas" style={styles.board}  height={700} width={1400}  onClick={(e) =>this.handleClickOnCanvas(e)}/>

                        {this.state.mode === 'scaling'?<div>
                            <Button
                                style={{margin:10}}
                                onClick={() =>
                                    this.scaling('plus',0)}
                                size="small" variant='contained' color="primary">
                                Enlarge
                            </Button>
                            <Button style={{margin:10}} onClick={() =>
                                this.scaling('minus',0)}
                                    size="small"
                                    variant='contained'
                                    color="primary">
                                Reduce
                            </Button>
                        </div> : <div/>}

                        {this.state.mode === 'mirror'?<div>
                            <Button
                                style={{margin:10}}
                                onClick={() =>
                                    this.mirrorImageLeft()}
                                size="small" variant='contained' color="primary">
                                Left
                            </Button>
                            <Button
                                style={{margin:10}}
                                onClick={() =>
                                    this.mirrorImageRight()}
                                size="small" variant='contained' color="primary">
                                Right
                            </Button>
                            <Button style={{margin:10}} onClick={() =>
                                this.mirrorImage()}
                                    size="small"
                                    variant='contained'
                                    color="primary">
                                Bottom
                            </Button>
                            <Button style={{margin:10}} onClick={() =>
                                this.mirrorImageTop()}
                                    size="small"
                                    variant='contained'
                                    color="primary">
                                Top
                            </Button>
                        </div> : <div/>}

                        {this.state.mode === 'spin'?<div>
                            <Button
                                style={{margin:10}}
                                onClick={() =>
                                    this.spinFigure('right',0)}
                                size="small" variant='contained' color="primary">
                                Right
                            </Button>
                            <Button style={{margin:10}} onClick={() =>
                                this.spinFigure('left',0)}
                                    size="small"
                                    variant='contained'
                                    color="primary">
                                Left
                            </Button>
                        </div> : <div/>}
                        <CardActions>
                        </CardActions>
                    </Card>
                </div>
            </div>
        );
    }
}

const styles = {
    button:{
        marginLeft:10
    },
    picker:{
        popover:{
            position: 'absolute',
            zIndex: '2',
        },
        cover:{
            top: '10px',
            right: '50%',
            bottom: '0px',
            left: '50%',
        }
    },
    board:{
        margin:'0 auto',
        height:700,
        width:1400,
        // backgroundColor:"lightgray",
        webkitBoxShadow: "1px 3px 1px #9E9E9E",
        mozBoxShadow: "1px 3px 1px #9E9E9E",
        boxShadow: "1px 1px 5px 5px #9E9E9E"
    }
};

export default MyApp;
