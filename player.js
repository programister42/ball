const animationDuration = 1000;

const directions = {
	up: ["w", "ArrowUp"],
	down: ["s", "ArrowDown"],
	left: ["a", "ArrowLeft"],
	right: ["d", "ArrowRight"],
	upLeft: ["w", "ArrowUp", "a", "ArrowLeft"],
	upRight: ["w", "ArrowUp", "d", "ArrowRight"],
	downLeft: ["s", "ArrowDown", "a", "ArrowLeft"],
	downRight: ["s", "ArrowDown", "d", "ArrowRight"],
};

export class Player {
	id = null;

	coordinates = { x: 0, y: 0 };

	diameter = 50;

	color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

	constructor({ id, diameter = 50 }) {
		this.id = id;
		this.diameter = diameter;
	}

	updateCoordinates({ x, y }) {
		this.coordinates = { x, y };
	}

	render() {
		const playerElement = document.createElement("div");
		playerElement.classList.add("player");
		playerElement.style.width = `${this.diameter}px`;
		playerElement.style.height = `${this.diameter}px`;
		playerElement.style.backgroundColor = this.color;
		playerElement.style.transform = `translate(-50%, -50%) translate(${this.coordinates.x}px, ${this.coordinates.y}px)`;
		playerElement.style.setProperty(
			"--animation-duration",
			`${animationDuration}ms`
		);
		setTimeout(() => {
			playerElement.remove();
		}, animationDuration);
		return playerElement;
	}
}

export class CurrentPlayer extends Player {
	coordinates = { x: 0, y: 0 };

	gameFieldElement = null;

	isMooving = false;

	pressedKeys = new Set();

	degrees = null;

	speed = 1;

	color = "midnightblue";

	constructor({
		id,
		gameFieldElement,
		diameter = 50,
		color = "midnightblue",
	}) {
		super({ id, diameter });
		this.color = color;
		this.gameFieldElement = gameFieldElement;

		document.addEventListener("keydown", this.handleKeyDown);
		document.addEventListener("keyup", this.handleKeyUp);
		setInterval(() => {
			if (!this.isMooving) return;
			this.move();
		}, 1000 / 120);
	}

	handleKeyDown = ({ key }) => {
		this.isMooving = true;
		this.pressedKeys.add(key);
		this.setDegreesFromPressedKeys();
	};

	handleKeyUp = ({ key }) => {
		this.pressedKeys.delete(key);
		if (this.pressedKeys.size === 0) {
			this.isMooving = false;
			this.degrees = null;
		} else {
			this.setDegreesFromPressedKeys();
		}
	};

	setDegreesFromPressedKeys() {
		if (this.pressedKeys.size >= 2) {
			const lastTwoKeys = [...this.pressedKeys].slice(-2);
			if (lastTwoKeys.every((key) => directions.upLeft.includes(key)))
				this.degrees = 135;
			if (lastTwoKeys.every((key) => directions.upRight.includes(key)))
				this.degrees = 45;
			if (lastTwoKeys.every((key) => directions.downLeft.includes(key)))
				this.degrees = 225;
			if (lastTwoKeys.every((key) => directions.downRight.includes(key)))
				this.degrees = 315;
		} else if (this.pressedKeys.size === 1) {
			const key = [...this.pressedKeys][0];
			if (directions.up.includes(key)) this.degrees = 90;
			if (directions.down.includes(key)) this.degrees = 270;
			if (directions.left.includes(key)) this.degrees = 180;
			if (directions.right.includes(key)) this.degrees = 0;
		}
	}

	canMoveTo(x, y) {
		const { top, left, width, height } =
			this.gameFieldElement.getBoundingClientRect();
		const gap = this.diameter / 2;
		return (
			x >= -width / 2 + gap &&
			x <= width / 2 - gap &&
			y >= -height / 2 + gap &&
			y <= height / 2 - gap
		);
	}

	move() {
		if (this.degrees === null) return;
		const radians = (this.degrees * Math.PI) / 180;
		const x = Math.round(Math.cos(radians) * this.speed);
		const y = Math.round(Math.sin(radians) * this.speed);
		const nextX = this.coordinates.x + x;
		const nextY = this.coordinates.y - y;
		if (this.canMoveTo(nextX, nextY)) {
			this.coordinates.x = nextX;
			this.coordinates.y = nextY;
		}
	}
}
