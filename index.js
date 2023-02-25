const gameField = document.querySelector("#game-field");
const ball = document.querySelector("#ball");

const pressedKeys = new Set();

document.addEventListener("keydown", (event) => {
	pressedKeys.add(event.key);
});

document.addEventListener("keyup", (event) => {
	pressedKeys.delete(event.key);
});

const directions = {
	up: "up",
	down: "down",
	left: "left",
	right: "right",
};

const moveKeys = {
	[directions.up]: ["w", "ArrowUp"],
	[directions.down]: ["s", "ArrowDown"],
	[directions.left]: ["a", "ArrowLeft"],
	[directions.right]: ["d", "ArrowRight"],
};

const isMooving = (direction) => {
	return moveKeys[direction].some((key) => pressedKeys.has(key));
};

const canMove = (object, distance, direction) => {
	const { top, left, bottom, right } = object.getBoundingClientRect();
	const field = gameField.getBoundingClientRect();

	switch (direction) {
		case directions.up:
			return top - distance > field.top;
		case directions.down:
			return bottom + distance < field.bottom;
		case directions.left:
			return left - distance > field.left;
		case directions.right:
			return right + distance < field.right;
	}
};

const moveObject = (object, distance, direction) => {
	switch (direction) {
		case directions.up:
			object.style.top = `${object.offsetTop - distance}px`;
			break;
		case directions.down:
			object.style.top = `${object.offsetTop + distance}px`;
			break;
		case directions.left:
			object.style.left = `${object.offsetLeft - distance}px`;
			break;
		case directions.right:
			object.style.left = `${object.offsetLeft + distance}px`;
			break;
	}
};

const moveBall = (distance) => {
	if (isMooving(directions.up) && canMove(ball, distance, directions.up)) {
		moveObject(ball, distance, directions.up);
	}

	if (
		isMooving(directions.down) &&
		canMove(ball, distance, directions.down)
	) {
		moveObject(ball, distance, directions.down);
	}

	if (
		isMooving(directions.left) &&
		canMove(ball, distance, directions.left)
	) {
		moveObject(ball, distance, directions.left);
	}

	if (
		isMooving(directions.right) &&
		canMove(ball, distance, directions.right)
	) {
		moveObject(ball, distance, directions.right);
	}
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
	renderFadingTailCell(ballSpeed);

	lastTime = currentTime;
	requestAnimationFrame(animationLoop);
};

requestAnimationFrame(animationLoop);
