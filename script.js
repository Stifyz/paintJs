import Canvas from "./Canvas.js";
import { Toolbar } from "./Toolbar.js";

let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext("2d");

let rectangleButton = document.getElementById("button-rectangle");
let lineButton = document.getElementById("button-line");
let circleButton = document.getElementById("button-circle");
let eraserButton = document.getElementById("button-eraser");

let myToolbar = new Toolbar();
let myCanvas = new Canvas(canvas, context, myToolbar, 50, 150);

rectangleButton.addEventListener("mousedown", () => myToolbar.handleRectangleOn());
lineButton.addEventListener("mousedown", () => myToolbar.handleLineOn());
circleButton.addEventListener("mousedown", () => myToolbar.handleCircleOn());
eraserButton.addEventListener("mousedown", () => myToolbar.handleEraserOn());

canvas.addEventListener("mousedown", function(e) {
	myCanvas.handleMouseDown(e, this.offsetLeft, this.offsetTop);
});
canvas.addEventListener("mousemove", function(e) {
	myCanvas.handleMouseMove(e, this.offsetLeft, this.offsetTop);
});
canvas.addEventListener("mouseup", (e) => myCanvas.handleMouseUp(e));
canvas.addEventListener("mouseout", (e) => myCanvas.canvasMouseLeave(e));

