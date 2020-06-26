// <!--Michael Rokitko 334060893-->
// <!--Yevgeny Alterman 317747814-->
// <!--Edan Azran 309743201-->

import React from "react";
import "./App.css";
import ReactDOM from "react-dom";
import { Button } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { Scene, PROJECTION } from "./scene";

const WIDTH = 1400,
  HEIGHT = 700,
  CUBE = {
    vertices: [
      [-1, -1, -1],
      [1, -1, -1],
      [-1, 1, -1],
      [1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [-1, 1, 1],
      [1, 1, 1],
    ],
    polygons: [
      [0, 1, 3, 2],
      [1, 5, 7, 3],
      [5, 4, 6, 7],
      [4, 0, 2, 6],
      [3, 7, 6, 2],
      [1, 5, 4, 0],
    ],
  },
  PYRAMID = {
    vertices: [
      [-2, -2, -2],
      [2, -2, -2],
      [0, 0, 2],
      [0, 2, -2],
    ],
    polygons: [
      [0, 1, 2],
      [2, 3, 1],
      [0, 3, 2],
      [0, 3, 1],
    ],
  };
class MyApp extends React.Component {
  constructor(props) {
    super(props);
    //state is the variable holder for the class. Each method can access and mutate the state
    this.state = {
      projection: PROJECTION.PERSPECTIVE,
      counter: 0,
      file: "",
      offset: {
        x: 0,
        y: 0,
      },
      canvasCoord: {
        x: 0,
        y: 0,
      },
      lines: [],
      objects: [],
      circles: [],
      curves: [],
      rectangles: [],
      canvas: null,
      mode: "spin",
      color: "#008000",
      action: "no action",
      instruction: "Choose mode to get instructions",
      errorText: "",
      fileName: "",
      cavasSize: { x: WIDTH, y: HEIGHT },
      scene: new Scene(100, 100, 200, WIDTH, HEIGHT, [
        {
          vertices: CUBE.vertices,
          polygons: CUBE.polygons,
          colors: [
            "#000000" /*front Black*/,
            "#ffee58" /*right Yellow*/,
            "#66bb6a" /*back Green*/,
            "#2196f3" /*left Blue*/,
            "#bf360c" /*bottom Red*/,
            "#9162e4" /*top Purple*/,
          ],
        },
        // {
        //   vertices: PYRAMID.vertices,
        //   polygons: PYRAMID.polygons,
        //   colors: ["#42DB5E", "#4C9FDB", "#A958DB", "#DB7486"],
        // },
      ]),
      spinMode: "x",
      spinAngle: 0,
    };
  }

  //React function that runs on load of the page
  componentDidMount() {
    this.setState({ canvas: this.refs.canvas.getContext("2d") });

    let canvas = ReactDOM.findDOMNode(
      this.refs["canvas"]
    ).getBoundingClientRect();
    this.setState({
      canvasCoord: { x: Math.floor(canvas.x), y: Math.floor(canvas.y) },
    });

    //    this.state.scene.setCtx(this.refs.canvas.getContext("2d"));
  }

  //the canvas is not located in pure 0,0 of the page, thus the starting point of the canvas is added to each value
  normalize = (val, isX) => {
    return isX
      ? val + this.state.canvasCoord.x
      : val + this.state.canvasCoord.y;
  };

  //uploading and parsing the file
  loadFile = async (e) => {
    e.preventDefault();
    this.setState({ errorText: "" });
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        let figures = JSON.parse(text);
        this.clearCanvas();
        this.setState({
          scene: new Scene(100, 100, 200, WIDTH, HEIGHT, figures),
        });
        
        this.state.scene.setCtx(this.refs.canvas.getContext("2d"))

        this.forceUpdate();
      };

      reader.readAsText(e.target.files[0]);
    } catch (e) {
      this.setState({ errorText: "Error reading file" });
    }
  };

  

  //for the move function we need to catch the click of the mouse
  handleClickOnCanvas = (e) => {
    let x = e.clientX; // Get the horizontal coordinate
    let y = e.clientY; // Get the vertical coordinate

    this.state.scene.x = x - this.state.canvasCoord.x - WIDTH / 2;
    this.state.scene.y = y - this.state.canvasCoord.y - HEIGHT / 2;

    // this.setState((prevState) => ({
    //   ...prevState,
    //   scene: { ...prevState.scene, x: x, y: y },
    // }));

    this.clearCanvas();
    this.forceUpdate();
  };

  //cean the canvas from everything
  clearCanvas = () => {
    this.refs.canvas.getContext("2d").beginPath();
    this.refs.canvas
      .getContext("2d")
      .clearRect(
        0,
        0,
        this.normalize(WIDTH, true),
        this.normalize(HEIGHT, false)
      );
  };

  scaling = (action, number) => {
    this.clearCanvas();
    let factor = 1;
    if ("plus" === action) {
      factor = 1.1;
    }

    if ("minus" === action) {
      factor = 0.9;
    }

    this.state.scene.radius = this.state.scene.radius * factor;

    this.forceUpdate();
  };

  //spinning the figure by finding the center point and then performing trigonometric computation on each point in the drawing
  spinFigure = (mode) => {
    let angle = 1;

    const direction = mode === "right" ? 1 : -1;
    angle = this.state.spinAngle !== 0 ? this.state.spinAngle : 5 * direction;

    let asix1 = 0;
    let asix2 = 1;

    switch (this.state.spinMode) {
      case "z":
        asix1 = 0;
        asix2 = 1;
        break;
      case "x":
        asix1 = 1;
        asix2 = 2;
        break;
      case "y":
        asix1 = 2;
        asix2 = 0;
        break;
      default:
        asix1 = 0;
        asix2 = 1;
        break;
    }

    let newAngle = (angle * Math.PI) / 180;

    let data = { x: 0, y: 0 };
    this.clearCanvas();

    let centerX = data.x;
    let centerY = data.y;

    let x = 0,
      y = 0;

    this.state.scene.sceneVertices.map((v) => {
      x = v[asix1];
      y = v[asix2];
      v[asix1] =
        centerX +
        (x - centerX) * Math.cos(newAngle) -
        (y - centerY) * Math.sin(newAngle);
      v[asix2] =
        centerY +
        (x - centerX) * Math.sin(newAngle) +
        (y - centerY) * Math.cos(newAngle);
      return v;
    });

    this.forceUpdate();
  };

  //runs every second to redraw the changes on the screen

  render() {
    if (this.state.scene.ctx !== null)
      this.state.scene.draw(this.state.projection);

    return (
      <div className="App">
        <div>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
              ></IconButton>
              <Typography variant="h6">Easy-Draw</Typography>
              <Button
                variant="contained"
                component="label"
                style={styles.button}
              >
                {" "}
                Upload File
                <input
                  value={this.state.fileName}
                  style={{ display: "none" }}
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    this.loadFile(e).then().catch();
                    this.setState({ fileName: "" });
                  }}
                />
              </Button>
              <Button
                style={styles.button}
                variant="contained"
                component="label"
                onClick={() => {
                  this.clearCanvas();
                  window.location.reload(true);
                }}
              >
                {" "}
                Clean Canvas
              </Button>
              <div style={{ marginLeft: "10%" }} />
              <Typography>Projection:</Typography>
              <Button
                style={
                  this.state.projection === PROJECTION.PERSPECTIVE
                    ? styles.buttonActive
                    : styles.button
                }
                variant="contained"
                component="label"
                onClick={() => {
                  this.clearCanvas();
                  this.setState({ projection: PROJECTION.PERSPECTIVE });
                }}
              >
                {" "}
                Perspective
              </Button>
              <Button
                style={
                  this.state.projection === PROJECTION.PARALLEL_ORTHOGONAL
                    ? styles.buttonActive
                    : styles.button
                }
                variant="contained"
                component="label"
                onClick={() => {
                  this.clearCanvas();
                  this.setState({ projection: PROJECTION.PARALLEL_ORTHOGONAL });
                }}
              >
                Orthogonal
              </Button>
              <Button
                style={
                  this.state.projection === PROJECTION.PARALLEL_OBLIQUE
                    ? styles.buttonActive
                    : styles.button
                }
                variant="contained"
                component="label"
                onClick={() => {
                  this.clearCanvas();
                  this.setState({ projection: PROJECTION.PARALLEL_OBLIQUE });
                }}
              >
                OBLIQUE
              </Button>
              <div style={{ marginLeft: "10%" }} />
              <Typography> Mode: </Typography>
              <Button
                style={styles.button}
                disabled={this.state.mode === "move"}
                onClick={() =>
                  this.setState({
                    mode: "move",
                    instruction:
                      "Click on a point on canvas, the image will be centered in that point",
                  })
                }
                size="small"
                variant="contained"
              >
                Move
              </Button>
              <Button
                style={styles.button}
                disabled={this.state.mode === "spin"}
                onClick={() =>
                  this.setState({
                    mode: "spin",
                    instruction: "Click on Right or Left buttons to spin",
                  })
                }
                size="small"
                variant="contained"
              >
                Spin
              </Button>
              <Button
                style={styles.button}
                disabled={this.state.mode === "scaling"}
                onClick={() =>
                  this.setState({
                    mode: "scaling",
                    instruction: "Click on buttons to adjust size",
                  })
                }
                size="small"
                variant="contained"
              >
                Scaling
              </Button>
            </Toolbar>
          </AppBar>
          <Card>
            <CardActionArea>
              <CardContent></CardContent>
            </CardActionArea>
            <canvas
              id="scene"
              ref="canvas"
              style={styles.board}
              height={HEIGHT}
              width={WIDTH}
              onClick={(e) => this.handleClickOnCanvas(e)}
            />

            {this.state.mode === "scaling" ? (
              <div>
                <Button
                  style={{ margin: 10 }}
                  onClick={() => this.scaling("plus", 0)}
                  size="small"
                  variant="contained"
                  color="primary"
                >
                  Enlarge
                </Button>
                <Button
                  style={{ margin: 10 }}
                  onClick={() => this.scaling("minus", 0)}
                  size="small"
                  variant="contained"
                  color="primary"
                >
                  Reduce
                </Button>
              </div>
            ) : (
              <div />
            )}

            {this.state.mode === "spin" ? (
              <div>
                <FormControl style={{ margin: 10 }}>
                  <InputLabel id="demo-simple-select-label">Axis</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.spinMode}
                    onChange={this.handleSelectChange}
                  >
                    <MenuItem value={"x"}>X</MenuItem>
                    <MenuItem value={"y"}>Y</MenuItem>
                    <MenuItem value={"z"}>Z</MenuItem>
                  </Select>
                </FormControl>
                <FormControl style={{ margin: 10 }}>
                  <Typography>Rotate</Typography>
                  <Button
                    style={{ margin: 5 }}
                    onClick={() => this.spinFigure("left")}
                    size="small"
                    variant="contained"
                    color="primary"
                  >
                    {this.state.spinMode === "x" ? "up" : "right"}
                  </Button>

                  <Button
                    style={{ margin: 5 }}
                    onClick={() => this.spinFigure("right")}
                    size="small"
                    variant="contained"
                    color="primary"
                  >
                    {this.state.spinMode === "x" ? "down" : "left"}
                  </Button>

                  <TextField
                    style={{ margin: 10 }}
                    id="standard-number"
                    label="Custom angle"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.spinAngle}
                    onChange={(e) => {
                      console.log(e.target.value);
                      this.setState({ spinAngle: e.target.value });
                    }}
                  />
                </FormControl>
              </div>
            ) : (
              <div />
            )}
            <CardActions></CardActions>
          </Card>
        </div>
      </div>
    );
  }

  handleSelectChange = (event) => {
    this.setState({ spinMode: event.target.value });
  };
}

const styles = {
  button: {
    marginLeft: 10,
  },
  buttonActive: {
    marginLeft: 10,
    backgroundColor: "#ffb700",
  },
  picker: {
    popover: {
      position: "absolute",
      zIndex: "2",
    },
    cover: {
      top: "10px",
      right: "50%",
      bottom: "0px",
      left: "50%",
    },
  },
  board: {
    margin: "0 auto",
    height: HEIGHT,
    width: WIDTH,
    webkitBoxShadow: "1px 3px 1px #9E9E9E",
    mozBoxShadow: "1px 3px 1px #9E9E9E",
    boxShadow: "1px 1px 5px 5px #9E9E9E",
  },
};

export default MyApp;
