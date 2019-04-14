// Buttons
import { RECTANGLE, LINE, CIRCLE, ERASER, TOOLBAR_SIZE } from "./Toolbar.js";
// Buttons states
import { NORMAL, SELECTED, CLICKED } from "./Toolbar.js"
// Status
import { STOPPED } from "./Toolbar.js";

// DrawStatus enum
export const PIXEL = 0;
export const DRAGGING = 1;
export const DRAW_CIRCLE = 2;

export default class Canvas {
	constructor(canvas, context, toolbar, marginX = 0, marginY = 0) {
		this._canvas = canvas;
		this._context = context;
		this.toolbar = toolbar;
		this._marginX = marginX;
		this._marginY = marginY;

		this._clickX = new Array();
		this._clickY = new Array();
		this._clickR = new Array();
		this._clickStatus = new Array();
		this._clickColor = new Array();
		this._isPressed = false;
		this._drawFnc = new Array();

		this._drawFnc[RECTANGLE] = (p1, p2) => this._drawRectangle(p1, p2);
		this._drawFnc[LINE] = (p1, p2) => this._drawLine(p1, p2);
		this._drawFnc[CIRCLE] = (p1, p2) => this._drawCircle(p1, p2);
		this._drawFnc[ERASER] = () => {};

		this._resize();
	}

	_addPixel(x, y, status = PIXEL, r = -1)  {
		this._clickX.push(x);
		this._clickY.push(y);
		this._clickStatus.push(status);
		this._clickR.push(r);
		this._clickColor.push(this.toolbar.getColor());
	}

	_popPixel() {
		this._clickX.pop();
		this._clickY.pop();
		this._clickR.pop();
		this._clickStatus.pop();
		this._clickColor.pop();
	}

	_clear() {
		this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height); // Clears the _canvas
	}

	_draw(idx) {
		this._context.beginPath();
		this._context.strokeStyle = this._clickColor[idx];
		if (this._clickR[idx] === -1) {
			if (this._clickStatus[idx] === DRAGGING && idx) {
				this._context.moveTo(this._clickX[idx-1], this._clickY[idx-1]);
			} else {
				this._context.moveTo(this._clickX[idx] - 1, this._clickY[idx]);
			}
			this._context.lineTo(this._clickX[idx], this._clickY[idx]);
			this._context.closePath();
		} else
			this._context.arc(this._clickX[idx], this._clickY[idx], this._clickR[idx], 0 * Math.PI, 2 * Math.PI);
		this._context.stroke();
	}

	_redraw() {
		let self = this;
		this._clear();

		this._context.lineJoin = "round";
		this._context.lineWidth = 5;

		let cbArray = new Array();
		for (let i = 0; i < this._clickStatus.length; ++i) {
			this._draw(i);
		}
		for (let i = 0; i < cbArray.length; ++i) {
			cbArray[i]();
		}
	}

	_resize() {
		this._canvas.height = window.innerHeight - this._marginY;
		this._canvas.width = window.innerWidth - this._marginX;
		this._redraw();
	}

	_drawRectangle(posX, posY) {
		const prevX = this._clickX[this._clickX.length - 1];
		const prevY = this._clickY[this._clickY.length - 1];

		this._addPixel(prevX, posY, DRAGGING);
		this._addPixel(posX, posY, DRAGGING);
		this._addPixel(posX, prevY, DRAGGING);
		this._addPixel(prevX, prevY, DRAGGING);
		this._redraw();
	}

	_drawLine(posX, posY) {
		this._addPixel(posX, posY, DRAGGING);
		this._redraw();
	}

	_drawCircle(posX, posY) {
		const lastNode = this._clickR.length - 1;
		this._clickR[lastNode] = Math.sqrt(Math.pow(posX - this._clickX[lastNode], 2) + Math.pow(posY - this._clickY[lastNode],2 ));
		this._redraw();
	}

	handleMouseDown(event, offsetLeft, offsetTop) {
		const posX = event.pageX - offsetLeft;
		const posY = event.pageY - offsetTop;
		let status = PIXEL;

		if (this.toolbar.getStatus() === STOPPED) {
			this._popPixel();
			this.toolbar.resetStatus();
		}
		for (let i = 0; i < TOOLBAR_SIZE; ++i) {
			if (this.toolbar.getButtonState(i) === CLICKED) {
				this._drawFnc[i](posX, posY);
				this.toolbar.changeStateAfterDraw(i);
				return;
			} else if (this.toolbar.getButtonState(i) === SELECTED) {
				this.toolbar.changeStateAfterClick(i);
				if (i === CIRCLE)
					status = DRAW_CIRCLE;
				if (i === ERASER)
					this._isPressed = true;
				this._addPixel(posX, posY, status);
				this._redraw();
				return;
			}
		}
		this._isPressed = true;
		this._addPixel(posX, posY, status);
		this._redraw();
	}

	handleMouseMove(event, offsetLeft, offsetTop) {
		const posX = event.pageX - offsetLeft;
		const posY = event.pageY - offsetTop;

		if (this._isPressed && !this.toolbar.getButtonState().some((elem, idx) => (elem !== NORMAL && idx !== ERASER) )) {
			this._addPixel(posX, posY, DRAGGING);
			this._redraw();
		}
	}

	handleMouseUp(){
		this._isPressed = false;
	}

	canvasMouseLeave() {
		this._isPressed = false;
	}
}
