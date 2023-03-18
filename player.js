import {getRandomColor} from './getRandomColor.js'
import {
	directions,
	defaultSegmentsNumber
} from './constants.js'

export class Player {
	fieldSize = 0
	color = getRandomColor()
	speed = 100
	segments = []
	lastTouchCoordinates = null

	#direction = null

	constructor(fieldSize) {
		this.fieldSize = fieldSize
		this.reset()

		setInterval(this.move.bind(this), this.speed)

		document.addEventListener('keydown', this.onKeyDown.bind(this))
		document.addEventListener('touchstart', this.onTouchStart.bind(this))
		document.addEventListener('touchmove', this.onTouchMove.bind(this))
		document.addEventListener('touchend', this.onTouchEnd.bind(this))
	}

	get direction() { return this.#direction }

	set direction(value) {
		if (
			this.direction === value ||
			this.direction === directions.UP && value === directions.DOWN ||
			this.direction === directions.DOWN && value === directions.UP ||
			this.direction === directions.LEFT && value === directions.RIGHT ||
			this.direction === directions.RIGHT && value === directions.LEFT
		) return

		this.#direction = value
		this.move()
	}

	getCorrectCoordinates(x, y) {
		if (x < 0) x = this.fieldSize - 1
		else if (x >= this.fieldSize) x = 0

		if (y < 0) y = this.fieldSize - 1
		else if (y >= this.fieldSize) y = 0

		return {x, y}
	}

	move() {
		if (!this.direction) return

		let {x, y} = this.segments[0]
		switch (this.direction) {
			case directions.UP:
				y--
				break
			case directions.DOWN:
				y++
				break
			case directions.LEFT:
				x--
				break
			case directions.RIGHT:
				x++
				break
		}

		this.segments.unshift(this.getCorrectCoordinates(x, y))
		this.segments.pop()
	}

	grow() {
		const lastSegment = this.segments.at(-1)
		this.segments.push(lastSegment)
	}

	reset() {
		this.direction = null
		this.segments = []

		const fieldCenter = Math.floor(this.fieldSize / 2)
		for (let i = 0; i < defaultSegmentsNumber; i++) {
			this.segments.push({
				x: fieldCenter - i,
				y: fieldCenter,
			})
		}
	}

	onKeyDown(event) {
		switch (event.key) {
			case 'ArrowUp':
			case 'w':
				this.direction = directions.UP
				break
			case 'ArrowDown':
			case 's':
				this.direction = directions.DOWN
				break
			case 'ArrowLeft':
			case 'a':
				this.direction = directions.LEFT
				break
			case 'ArrowRight':
			case 'd':
				this.direction = directions.RIGHT
				break
		}
	}

	onTouchStart(event) {
		const { clientX, clientY } = event.touches[0]
		this.lastTouchCoordinates = { x: clientX, y: clientY }
	}

	onTouchMove(event) {
		if (!this.lastTouchCoordinates) return

		const { clientX, clientY } = event.touches[0]
		const { x: lastX, y: lastY } = this.lastTouchCoordinates

		const xDiff = clientX - lastX
		const yDiff = clientY - lastY

		// reduce sensitivity
		if (Math.abs(xDiff) < 10 && Math.abs(yDiff) < 10) return

		if (Math.abs(xDiff) > Math.abs(yDiff)) {
			if (xDiff > 0) {
				this.direction = directions.RIGHT
			} else {
				this.direction = directions.LEFT
			}
		} else {
			if (yDiff > 0) {
				this.direction = directions.DOWN
			} else {
				this.direction = directions.UP
			}
		}

		this.lastTouchCoordinates = { x: clientX, y: clientY }
	}

	onTouchEnd() {
		this.lastTouchCoordinates = null
	}
}
