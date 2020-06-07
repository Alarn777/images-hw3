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

class App extends React.Component{
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
        };
    }


    //React function that runs on load of the page
    componentDidMount() {
        this.setState({canvas:this.refs.canvas.getContext('2d')})

        let canvas = ReactDOM.findDOMNode(this.refs['canvas'])
            .getBoundingClientRect();
        this.state.canvasCoord.x =  Math.floor(canvas.x)
        this.state.canvasCoord.y =  Math.floor(canvas.y)

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
        canvas.fillStyle =color;
        canvas.fill()
    }

    //simple circle with center and radius
    circle = (x, y,r, canvas) => {
        canvas.lineWidth = 1;
        canvas.beginPath();
        canvas.arc(x, y, r, 0, 2 * Math.PI, true);
        canvas.strokeStyle = this.state.color;
        canvas.stroke();
    }

    //Bezier curve
    curve1 = (x, y,x1,y1,x2,y2,x3,y3,canvas) => {
        canvas.beginPath();
        canvas.moveTo(x, y);
        canvas.bezierCurveTo( x1,y1,x2 ,y2 ,x3, y3)
        canvas.strokeStyle = this.state.color;
        canvas.stroke();

    }

    //the canvas is not located in pure 0,0 of the page, thus the starting point of the canvas is added to each value
    normalize = (val,isX) => {
        if(isX)
            return val +  this.state.canvasCoord.x
        else
            return val + this.state.canvasCoord.y
    }


    showFile1 = async (e) => {
        // console.log(e.target.value)
        // e.preventDefault()
        // this.clearCanvas()
        // this.setState({errorText:''})
        // const reader = new FileReader()
        // reader.onload = async (e) => {
        //     const text = (e.target.result)
        //     console.log(text)
        //
        // }
        this.readTextFile(e.target.value, function(text){
            var data = JSON.parse(text);
            console.log(data);
        });

    }

    readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

//usage:



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

            for(let line = 0; line < data.lines.length; line++) {
                // this.normalize()
                let oneLine = {x: data.lines[line].from.x, y: data.lines[line].from.y, z:data.lines[line].from.z, x1: data.lines[line].to.x, y1: data.lines[line].to.y, z1:data.lines[line].from.z}

                // if(isNaN(x) || isNaN(x1) || isNaN(y) || isNaN(y1)){
                //     this.setState({errorText:'Error reading rectangles, fix the input file'})
                //     this.clearCanvas()
                //
                //     return
                // }
                this.state.lines.push(oneLine)

            }

            for(let i = 0; i < data.rectangles.length; i++) {

                let rectangle = {
                    x: data.rectangles[i].one.x,
                    y: data.rectangles[i].one.y,
                    z:data.rectangles[i].one.z,

                    x1: data.rectangles[i].two.x,
                    y1: data.rectangles[i].two.y,
                    z1:data.rectangles[i].two.z,

                    x2: data.rectangles[i].three.x,
                    y2: data.rectangles[i].three.y,
                    z2:data.rectangles[i].three.z,


                    x3: data.rectangles[i].four.x,
                    y3: data.rectangles[i].four.y,
                    z3:data.rectangles[i].four.z,

                    color:data.rectangles[i].color
                }

                // if(isNaN(x) || isNaN(x1) || isNaN(x2)|| isNaN(x3)|| isNaN(y) || isNaN(y1) || isNaN(y2) || isNaN(y3)){
                //     this.setState({errorText:'Error reading rectangles, fix the input file'})
                //     this.clearCanvas()
                //     return
                // }
                this.state.rectangles.push(rectangle)

            }


            let lines = e.target.result.split('\n');
            for(let line = 0; line < lines.length; line++){
                if(lines[line].startsWith('lines')) {
                    let oneLine = lines[line]
                    try {
                        let data = oneLine.split(':')[1]
                        let alllines = data.split('/')
                        for (let i = 0; i < alllines.length; i++) {
                            let x = alllines[i].split('-')[0].split(',')[0]
                            x = this.normalize(parseInt(x), true)
                            let y = alllines[i].split('-')[0].split(',')[1]
                            y = this.normalize(parseInt(y), false)
                            let x1 = alllines[i].split('-')[1].split(',')[0]
                            x1 = this.normalize(parseInt(x1), true)
                            let y1 = alllines[i].split('-')[1].split(',')[1]
                            y1 = this.normalize(parseInt(y1), false)

                            let line = {x: x, y: y, x1: x1, y1: y1}

                            if(isNaN(x) || isNaN(x1) || isNaN(y) || isNaN(y1)){
                                this.setState({errorText:'Error reading rectangles, fix the input file'})
                                this.clearCanvas()

                                return
                            }

                            this.state.lines.push(line)
                        }
                    }
                    catch (e) {
                        this.setState({errorText:'Error reading lines, fix the input file'})
                        this.state.lines = []
                    }
                }
                else if(lines[line].startsWith('circles')) {
                    let oneLine = lines[line]
                    try {


                        let data = oneLine.split(':')[1]
                        let allcircles = data.split('/')
                        for (let i = 0; i < allcircles.length; i++) {
                            let x = allcircles[i].split(',')[0]
                            x = this.normalize(parseInt(x), true)
                            let y = allcircles[i].split(',')[1]
                            y = this.normalize(parseInt(y), false)
                            let r = parseInt(allcircles[i].split(',')[2])

                            let circle = {x: x, y: y, r: r}

                            if(isNaN(x) || isNaN(r) || isNaN(y)){
                                this.setState({errorText:'Error reading rectangles, fix the input file'})
                                this.clearCanvas()

                                return
                            }

                            this.state.circles.push(circle)
                        }
                    }
                    catch (e) {
                        this.setState({errorText:'Error reading circles, fix the input file'})
                        this.state.circles = []
                    }
                }
                else if(lines[line].startsWith('curves')) {
                    let oneLine = lines[line]

                    try {
                        let data = oneLine.split(':')[1]
                        let allcircles = data.split('/')
                        for (let i = 0; i < allcircles.length; i++) {
                            let x = allcircles[i].split(',')[0]
                            x = this.normalize(parseInt(x), true)
                            let y = allcircles[i].split(',')[1]
                            y = this.normalize(parseInt(y), false)

                            let x1 = allcircles[i].split(',')[2]
                            x1 = this.normalize(parseInt(x1), true)
                            let y1 = allcircles[i].split(',')[3]
                            y1 = this.normalize(parseInt(y1), false)

                            let x2 = allcircles[i].split(',')[4]
                            x2 = this.normalize(parseInt(x2), true)
                            let y2 = allcircles[i].split(',')[5]
                            y2 = this.normalize(parseInt(y2), false)

                            let x3 = allcircles[i].split(',')[6]
                            x3 = this.normalize(parseInt(x3), true)
                            let y3 = allcircles[i].split(',')[7]
                            y3 = this.normalize(parseInt(y3), false)

                            let curve = {x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3}

                            if(isNaN(x) || isNaN(x1) || isNaN(x2)|| isNaN(x3)|| isNaN(y) || isNaN(y1) || isNaN(y2) || isNaN(y3)){
                                this.setState({errorText:'Error reading rectangles, fix the input file'})
                                this.clearCanvas()

                                return
                            }

                            this.state.curves.push(curve)
                        }
                    }catch (e) {
                        this.setState({errorText:'Error reading curves, fix the input file'})
                        this.state.curves = []
                    }
                }
                else if(lines[line].startsWith('rectangles')) {
                    let oneLine = lines[line]
                    try {
                        let data = oneLine.split(':')[1]
                        let alllines = data.split('/')
                        for (let i = 0; i < alllines.length; i++) {
                            let x = alllines[i].split(',')[0]
                            x = this.normalize(parseInt(x), true)
                            let y = alllines[i].split(',')[1]
                            y = this.normalize(parseInt(y), false)

                            let x1 = alllines[i].split(',')[2]
                            x1 = this.normalize(parseInt(x1), true)
                            let y1 = alllines[i].split(',')[3]
                            y1 = this.normalize(parseInt(y1), false)

                            let x2 = alllines[i].split(',')[4]
                            x2 = this.normalize(parseInt(x2), true)
                            let y2 = alllines[i].split(',')[5]
                            y2 = this.normalize(parseInt(y2), false)

                            let x3 = alllines[i].split(',')[6]
                            x3 = this.normalize(parseInt(x3), true)
                            let y3 = alllines[i].split(',')[7]
                            y3 = this.normalize(parseInt(y3), false)


                            let rectangle = {x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3}

                            if(isNaN(x) || isNaN(x1) || isNaN(x2)|| isNaN(x3)|| isNaN(y) || isNaN(y1) || isNaN(y2) || isNaN(y3)){
                                this.setState({errorText:'Error reading rectangles, fix the input file'})
                                this.clearCanvas()
                                return
                            }
                            this.state.rectangles.push(rectangle)
                        }
                    }
                    catch (e) {
                        this.setState({errorText:'Error reading rectangles, fix the input file'})
                        this.state.rectangles = []
                    }
                }

                }
                this.moveImage(this.normalize(700,true),this.normalize(350,false))
                // this.renderOnCanvas()
            this.forceUpdate()
        };

        reader.readAsText(e.target.files[0])
        }
        catch (e) {
            this.setState({errorText:'Error reading file'})
        }
    }


    //for the move function we need to catch the click of the mouse
    handleClickOnCanvas = (e) => {
        let x = e.clientX;     // Get the horizontal coordinate
        let y = e.clientY;     // Get the vertical coordinate
        let coor = "X coords: " + x + ", Y coords: " + y;

        if(this.state.mode === 'move'){
            this.moveImage(x,y)
        }

        if(this.state.mode === 'mirror'){
        }

        if(this.state.mode === 'scaling'){
        }

        if(this.state.mode === 'spin'){

        }

    }


    //spinning the figure by finding the center point and then performing trigonometric computation on each point in the drawing
    spinFigure = (mode,explicit_angle) => {
        let angle = 0
        if(mode === 'right'){
            angle = 5
        }
        if(mode === 'angle'){
            angle = explicit_angle
        }
        if(mode === 'left'){
            angle = -5
        }

        let newAngle = angle * Math.PI/180

        let data = this.findCenterPoint()
        this.clearCanvas()

        let centerX = data.x
        let centerY = data.y

        let x = 0,y = 0
        this.state.lines.map(one => {
            x = one.x
            y = one.y
            one.x = centerX + (x-centerX)*Math.cos(newAngle) - (y-centerY)*Math.sin(newAngle);
            one.y = centerY + (x-centerX)*Math.sin(newAngle) + (y-centerY)*Math.cos(newAngle)

            x = one.x1
            y = one.y1

            one.x1 = centerX + (x-centerX)*Math.cos(newAngle) - (y-centerY)*Math.sin(newAngle);
            one.y1 =  centerY + (x-centerX)*Math.sin(newAngle) + (y-centerY)*Math.cos(newAngle)
        })

        this.state.rectangles.map(one => {
            x = one.x
            y = one.y

            one.x = centerX + (x-centerX)*Math.cos(newAngle) - (y-centerY)*Math.sin(newAngle);
            one.y = centerY + (x-centerX)*Math.sin(newAngle) + (y-centerY)*Math.cos(newAngle)

            x = one.x1
            y = one.y1

            one.x1 = centerX + (x-centerX)*Math.cos(newAngle) - (y-centerY)*Math.sin(newAngle);
            one.y1 =  centerY + (x-centerX)*Math.sin(newAngle) + (y-centerY)*Math.cos(newAngle)

            x = one.x2
            y = one.y2

            one.x2 = centerX + (x-centerX)*Math.cos(newAngle) - (y-centerY)*Math.sin(newAngle);
            one.y2 = centerY + (x-centerX)*Math.sin(newAngle) + (y-centerY)*Math.cos(newAngle)

            x = one.x3
            y = one.y3

            one.x3 = centerX + (x-centerX)*Math.cos(newAngle) - (y-centerY)*Math.sin(newAngle);
            one.y3 = centerY + (x-centerX)*Math.sin(newAngle) + (y-centerY)*Math.cos(newAngle)

        })
        this.state.circles.map(one => {

            x = one.x
            y = one.y

            one.x = centerX + (x-centerX)*Math.cos(newAngle) - (y-centerY)*Math.sin(newAngle);
            one.y = centerY + (x-centerX)*Math.sin(newAngle) + (y-centerY)*Math.cos(newAngle)

        })
        this.state.curves.map(one => {
            x = one.x
            y = one.y
            one.x = centerX + (x-centerX)*Math.cos(newAngle) - (y-centerY)*Math.sin(newAngle);
            one.y = centerY + (x-centerX)*Math.sin(newAngle) + (y-centerY)*Math.cos(newAngle)

            x = one.x1
            y = one.y1

            one.x1 = centerX + (x-centerX)*Math.cos(newAngle) - (y-centerY)*Math.sin(newAngle);
            one.y1 =  centerY + (x-centerX)*Math.sin(newAngle) + (y-centerY)*Math.cos(newAngle)

            x = one.x2
            y = one.y2

            one.x2 = centerX + (x-centerX)*Math.cos(newAngle) - (y-centerY)*Math.sin(newAngle);
            one.y2 = centerY + (x-centerX)*Math.sin(newAngle) + (y-centerY)*Math.cos(newAngle)

            x = one.x3
            y = one.y3

            one.x3 = centerX + (x-centerX)*Math.cos(newAngle) - (y-centerY)*Math.sin(newAngle);
            one.y3 = centerY + (x-centerX)*Math.sin(newAngle) + (y-centerY)*Math.cos(newAngle)

        })

        this.renderOnCanvas()



    }


    //scaling is done by multiplying each point value by scalar. Scaling comes from 0,0 (beginning of the canvas)
    scaling = (action,number) => {
        this.clearCanvas()
        let factor = 1
        if('plus' === action){
            factor = 1.1
        }
        if('minus' === action){
            factor = 0.9
        }

        this.state.lines.map(one => {
            one.x *= factor
            one.x1 *= factor
            one.y *= factor
            one.y1 *= factor
        })

        this.state.rectangles.map(one => {
            one.x *= factor
            one.x1 *= factor
            one.x2 *= factor
            one.x3 *= factor
            one.y *= factor
            one.y1 *= factor
            one.y2 *= factor
            one.y3 *= factor
        })

        this.state.circles.map(one => {
            one.x *= factor
            one.y *= factor
            one.r *= factor
        })

        this.state.curves.map(one => {
            one.x *= factor
            one.x1 *= factor
            one.x2 *= factor
            one.x3 *= factor
            one.y *= factor
            one.y1 *= factor
            one.y2 *= factor
            one.y3 *= factor
        })

        this.renderOnCanvas()
    }


    //cean the canvas from everything
    clearCanvas = ( ) => {
        this.refs.canvas.getContext('2d').beginPath();
        this.refs.canvas.getContext('2d').clearRect(0,0, this.normalize(1400,true), this.normalize(700,false));
    }


    //finding the center point of the image and calculating offset from it to the point clicked, than moving each point in the drawing by this offset
    moveImage = (x,y) => {
        let center = this.findCenterPoint()
        let offsetX = x - this.normalize(center.x,true)
        let offsetY = y - this.normalize(center.y,false)

        x = offsetX
        y = offsetY

        this.clearCanvas()

        this.state.lines.map(one => {
            one.x += x
            one.x1 += x
            one.y += y
            one.y1 += y
        })
        this.state.rectangles.map(one => {
            one.x += x
            one.x1 += x
            one.x2 += x
            one.x3 += x
            one.y += y
            one.y1 += y
            one.y2 += y
            one.y3 += y
        })
        this.state.circles.map(one => {
            one.x += x
            one.y += y
        })
        this.state.curves.map(one => {
            one.x += x
            one.x1 += x
            one.x2 += x
            one.x3 += x
            one.y += y
            one.y1 += y
            one.y2 += y
            one.y3 += y
        })
        this.renderOnCanvas()
    }

    //finding the most left point of the image and then reflecting each coordinate to the - of itself.
    mirrorImageLeft = () => {
        this.clearCanvas()

        let flip = this.findCenterPoint()

        flip = {}
        this.state.lines.map(one => {
            if(one.x === flip.minX){} else{one.x = (flip.minX - one.x) + flip.minX}
            if(one.x1 === flip.minX){}else {one.x1 = (flip.minX - one.x1) + flip.minX}
        })
        this.state.circles.map(one => {
            if(one.x === flip.minX){} else{one.x = (flip.minX - one.x) + flip.minX}
        })
        this.state.rectangles.map(one => {
            if(one.x === flip.minX){} else{one.x = (flip.minX - one.x) + flip.minX}
            if(one.x1 === flip.minX){}else {one.x1 = (flip.minX - one.x1) + flip.minX}
            if(one.x2 === flip.minX){}else {one.x2 = (flip.minX - one.x2) + flip.minX}
            if(one.x3 === flip.minX){}else {one.x3 = (flip.minX - one.x3) + flip.minX}

        })
        this.state.curves.map(one => {
            if(one.x === flip.minX){} else{one.x = (flip.minX - one.x) + flip.minX}
            if(one.x1 === flip.minX){}else {one.x1 = (flip.minX - one.x1) + flip.minX}
            if(one.x2 === flip.minX){}else {one.x2 = (flip.minX - one.x2) + flip.minX}
            if(one.x3 === flip.minX){}else {one.x3 = (flip.minX - one.x3) + flip.minX}

        })
        this.renderOnCanvas()
    }

    //finding the most left point of the image and then reflecting each coordinate to the - of itself.
    mirrorImageRight = () => {
        this.clearCanvas()

        let flip = this.findCenterPoint()
        this.state.lines.map(one => {
            if(one.x === flip.maxX){} else{one.x = (flip.maxX - one.x) + flip.maxX}
            if(one.x1 === flip.maxX){}else {one.x1 = (flip.maxX - one.x1) + flip.maxX}
        })
        this.state.circles.map(one => {
            if(one.x === flip.maxX){} else{one.x = (flip.maxX - one.x) + flip.maxX}
        })
        this.state.rectangles.map(one => {
            if(one.x === flip.maxX){} else{one.x = (flip.maxX - one.x) + flip.maxX}
            if(one.x1 === flip.maxX){}else {one.x1 = (flip.maxX - one.x1) + flip.maxX}
            if(one.x2 === flip.maxX){}else {one.x2 = (flip.maxX - one.x2) + flip.maxX}
            if(one.x3 === flip.maxX){}else {one.x3 = (flip.maxX - one.x3) + flip.maxX}

        })
        this.state.curves.map(one => {
            if(one.x === flip.maxX){} else{one.x = (flip.maxX - one.x) + flip.maxX}
            if(one.x1 === flip.maxX){}else {one.x1 = (flip.maxX - one.x1) + flip.maxX}
            if(one.x2 === flip.maxX){}else {one.x2 = (flip.maxX - one.x2) + flip.maxX}
            if(one.x3 === flip.maxX){}else {one.x3 = (flip.maxX - one.x3) + flip.maxX}

        })
        this.renderOnCanvas()
    }

    //finding the most bottom point of the image and then reflecting each coordinate to the - of itself.
    mirrorImage = () => {
        this.clearCanvas()

        let flip = this.findCenterPoint()
        this.state.lines.map(one => {
            if(one.y === flip.maxY){} else{one.y = (flip.maxY - one.y) + flip.maxY}
            if(one.y1 === flip.maxY){}else {one.y1 = (flip.maxY - one.y1) + flip.maxY}
        })
        this.state.circles.map(one => {
            if(one.y === flip.maxY){} else{one.y = (flip.maxY - one.y) + flip.maxY}
        })
        this.state.rectangles.map(one => {
            if(one.y === flip.maxY){} else{one.y = (flip.maxY - one.y) + flip.maxY}
            if(one.y1 === flip.maxY){}else {one.y1 = (flip.maxY - one.y1) + flip.maxY}
            if(one.y2 === flip.maxY){}else {one.y2 = (flip.maxY - one.y2) + flip.maxY}
            if(one.y3 === flip.maxY){}else {one.y3 = (flip.maxY - one.y3) + flip.maxY}

        })
        this.state.curves.map(one => {

            if(one.y === flip.maxY){} else{one.y = (flip.maxY - one.y) + flip.maxY}
            if(one.y1 === flip.maxY){} else {one.y1 = (flip.maxY - one.y1) + flip.maxY}
            if(one.y2 === flip.maxY){} else {one.y2 = (flip.maxY - one.y2) + flip.maxY}
            if(one.y3 === flip.maxY){} else {one.y3 = (flip.maxY - one.y3) + flip.maxY}

        })
        this.renderOnCanvas()
    }

    mirrorImageTop = () => {
        this.clearCanvas()

        let flip = this.findCenterPoint()
        this.state.lines.map(one => {
            if(one.y === flip.minY){} else{one.y = (flip.minY - one.y) + flip.minY}
            if(one.y1 === flip.minY){}else {one.y1 = (flip.minY - one.y1) + flip.minY}
        })
        this.state.circles.map(one => {
            if(one.y === flip.minY){} else{one.y = (flip.minY - one.y) + flip.minY}
        })
        this.state.rectangles.map(one => {
            if(one.y === flip.minY){console.log('same y')} else{one.y = (flip.minY - one.y) + flip.minY}
            if(one.y1 === flip.minY){console.log('same y1')} else {one.y1 = (flip.minY - one.y1) + flip.minY}
            if(one.y2 === flip.minY){console.log('same y2')} else {one.y2 = (flip.minY - one.y2) + flip.minY}
            if(one.y3 === flip.minY){console.log('same y3')} else {one.y3 = (flip.minY - one.y3) + flip.minY}

        })
        this.state.curves.map(one => {

            if(one.y === flip.minY){} else{one.y = (flip.minY - one.y) + flip.minY}
            if(one.y1 === flip.minY){} else {one.y1 = (flip.minY - one.y1) + flip.minY}
            if(one.y2 === flip.minY){} else {one.y2 = (flip.minY - one.y2) + flip.minY}
            if(one.y3 === flip.minY){} else {one.y3 = (flip.minY - one.y3) + flip.minY}

        })
        this.renderOnCanvas()
    }


    //drawing each type of figure on the canvas
    renderOnCanvas = () => {
        this.state.lines.map(one => {
            this.line(one.x,one.y,one.x1,one.y1,this.refs.canvas.getContext('2d'))
        })

        this.state.circles.map(one => {
            this.circle(one.x,one.y,one.r,this.refs.canvas.getContext('2d'))
        })

        this.state.curves.map(one => {
            this.curve1(one.x,one.y,one.x1,one.y1,one.x2,one.y2,one.x3,one.y3,this.refs.canvas.getContext('2d'))
        })

        this.state.rectangles.map(one => {
            this.newRectangle(one.x,one.y,one.x1,one.y1,one.x2,one.y2,one.x3,one.y3,one.color,this.refs.canvas.getContext('2d'))
        })
    }


    //method that finds each max,min point and also a center point in the image
    findCenterPoint = () => {
        let maxX= 0,minX= 999999,maxY= 0,minY = 999999
        this.state.lines.map(one => {
            maxX = Math.max(one.x,one.x1,maxX)
            maxY = Math.max(one.y,one.y1,maxY)
            minX = Math.min(one.x,one.x1,minX)
            minY = Math.min(one.y,one.y1,minY)
        })
        this.state.circles.map(one => {
            maxX = Math.max(one.x,maxX)
            maxY = Math.max(one.y,maxY)
            minX = Math.min(one.x,minX)
            minY = Math.min(one.y,minY)
        })
        this.state.curves.map(one => {
            maxX = Math.max(one.x,one.x1,one.x2,one.x3,maxX)
            maxY = Math.max(one.y,one.y1,one.y2,one.y3,maxY)
            minX = Math.min(one.x,one.x1,one.x2,one.x3,minX)
            minY = Math.min(one.y,one.y1,one.y2,one.y3,minY)
        })
        this.state.rectangles.map(one => {
            maxX = Math.max(one.x,one.x1,one.x2,one.x3,maxX)
            maxY = Math.max(one.y,one.y1,one.y2,one.y3,maxY)
            minX = Math.min(one.x,one.x1,one.x2,one.x3,minX)
            minY = Math.min(one.y,one.y1,one.y2,one.y3,minY)
        })
        let centerX = (maxX + minX) /2
        let centerY = (maxY + minY) /2

        return {x:centerX,y:centerY,maxX:maxX,maxY:maxY,minX:minX,minY:minY}
    }


    //runs every second to redraw the changes on the screen
    render() {
        return (
            <div className="App">
                <div>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="menu">
                            </IconButton>
                            <Typography variant="h6" >
                                Welcome to Easy-Draw
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
                       <canvas ref="canvas" style={styles.board}  height={700} width={1400}  onClick={(e) =>this.handleClickOnCanvas(e)}/>

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

export default App;
