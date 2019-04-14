// Buttons enum
export const RECTANGLE = 0;
export const LINE = 1;
export const CIRCLE = 2;
export const ERASER = 3;
export const TOOLBAR_SIZE = 4;

// Button state enum
export const NORMAL = 0;
export const SELECTED = 1;
export const CLICKED = 2;

// Status enum
export const GOOD = 0;
export const STOPPED = 1;

export class Toolbar {
	constructor() {
		this._status = GOOD;

		this._color = "#000000";

		this._buttonState = Array.apply(null, Array(TOOLBAR_SIZE)).map(function() { return NORMAL });

	}

	getColor() {
		return this._color;
	}

	getStatus() {
		return this._status;
	}

	resetStatus() {
		this._status = GOOD;
	}

	getButtonState(buttonEnum = -1) {
		if (buttonEnum === -1)
			return this._buttonState;
		return this._buttonState[buttonEnum];
	}

	changeStateAfterDraw(buttonEnum) {
		this._buttonState[buttonEnum] = (buttonEnum === LINE ? CLICKED : SELECTED);
	}

	changeStateAfterClick(buttonEnum) {
		this._buttonState[buttonEnum] = CLICKED;
	}

	_clickOn(idx) {
		for (let i = 0; i < TOOLBAR_SIZE; ++i)
			if (i !== idx) {
				if (i === ERASER && !!this._buttonState[i])
					this._color = "#000000";
				this._buttonState[i] = NORMAL;
				if (this._buttonState[i] === CLICKED && i !== ERASER)
					this._status = STOPPED;
			}
		if (this._buttonState[idx] === CLICKED && idx !== ERASER)
			this._status = STOPPED;
		this._buttonState[idx] = +!(!!this._buttonState[idx]);
	}

	handleRectangleOn() {
		this._clickOn(RECTANGLE);
	}

	handleLineOn() {
		this._clickOn(LINE);
	}

	handleCircleOn() {
		this._clickOn(CIRCLE);
	}

	handleEraserOn() {
		if (!!!this._buttonState[ERASER])
			this._color = "#ffffff";
		else
			this._color = "#000000";
		this._clickOn(ERASER);
	}
}