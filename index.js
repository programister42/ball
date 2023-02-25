const gameField = document.querySelector("#game-field");
const ball = document.querySelector("#ball");

let degrees = null;

let pressedKeys = new Set();

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

const getDegreesFromPressedKeys = () => {
	if (pressedKeys.size >= 2) {
		const lastTwoKeys = [...pressedKeys].slice(-2);
		if (lastTwoKeys.every((key) => directions.upLeft.includes(key)))
			return 135;
		if (lastTwoKeys.every((key) => directions.upRight.includes(key)))
			return 45;
		if (lastTwoKeys.every((key) => directions.downLeft.includes(key)))
			return 225;
		if (lastTwoKeys.every((key) => directions.downRight.includes(key)))
			return 315;
	} else if (pressedKeys.size === 1) {
		const key = [...pressedKeys][0];
		if (directions.up.includes(key)) return 90;
		if (directions.down.includes(key)) return 270;
		if (directions.left.includes(key)) return 180;
		if (directions.right.includes(key)) return 0;
	}
	return null;
};

document.addEventListener("keydown", (event) => {
	pressedKeys.add(event.key);
	degrees = getDegreesFromPressedKeys();
});

document.addEventListener("keyup", (event) => {
	pressedKeys.delete(event.key);
	if (pressedKeys.size === 0) degrees = null;
});

let lastTouchCoordinates = null;

document.addEventListener("touchstart", (event) => {
	const { clientX, clientY } = event.touches[0];
	lastTouchCoordinates = { x: clientX, y: clientY };
});

document.addEventListener("touchmove", (event) => {
	const { clientX, clientY } = event.touches[0];

	if (lastTouchCoordinates !== null) {
		const { x, y } = lastTouchCoordinates;
		if (Math.abs(clientX - x) < 10 && Math.abs(clientY - y) < 10) return;
		degrees = Math.atan2(y - clientY, clientX - x) * (180 / Math.PI);
	}

	lastTouchCoordinates = { x: clientX, y: clientY };
});

document.addEventListener("touchend", (event) => {
	lastTouchCoordinates = null;
	degrees = null;
});

const canMove = (object, distance, degrees) => {
	const { top, left, bottom, right } = object.getBoundingClientRect();
	const field = gameField.getBoundingClientRect();

	const radians = (degrees * Math.PI) / 180;
	const nextTop = top - distance * Math.sin(radians);
	const nextLeft = left + distance * Math.cos(radians);
	const nextBottom = bottom - distance * Math.sin(radians);
	const nextRight = right + distance * Math.cos(radians);

	return (
		nextTop >= field.top &&
		nextLeft >= field.left &&
		nextBottom <= field.bottom &&
		nextRight <= field.right
	);
};

const moveObject = (object, distance, degrees) => {
	const radians = (degrees * Math.PI) / 180;
	object.style.top = `${object.offsetTop - distance * Math.sin(radians)}px`;
	object.style.left = `${object.offsetLeft + distance * Math.cos(radians)}px`;
};

const moveBall = (distance) => {
	if (degrees === null || !canMove(ball, distance, degrees)) return;

	moveObject(ball, distance, degrees);
};

const renderFadingTailCell = (ballSpeed) => {
	const cell = document.createElement("div");
	cell.classList.add("ball", "tail-cell");

	const fadeTailTime = (1 / ballSpeed) * 200000;

	cell.style.top = ball.offsetTop + "px";
	cell.style.left = ball.offsetLeft + "px";
	cell.style.animationDuration = fadeTailTime + "ms";

	gameField.appendChild(cell);
	setTimeout(() => cell.remove(), fadeTailTime);
};

const ballSpeed = 200; // px per second
let lastTime = 0;

const animationLoop = (currentTime) => {
	if (lastTime === 0) lastTime = currentTime;
	let deltaTime = (currentTime - lastTime) / 1000; // convert to seconds
	let ballDistance = ballSpeed * deltaTime;

	moveBall(ballDistance);
	if (degrees !== null) renderFadingTailCell(ballSpeed);

	lastTime = currentTime;
	requestAnimationFrame(animationLoop);
};

requestAnimationFrame(animationLoop);
