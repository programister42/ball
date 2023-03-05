const directions = {
	UP: 'UP',
	DOWN: 'DOWN',
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
}

export class Player {
	fieldSize = 0
	color = `#${Math.floor(Math.random() * 16777215).toString(16)}`

	segmentsNumber = 5
	segments = []

	constructor(fieldSize) {
		this.fieldSize = fieldSize
		const fieldCenter = Math.floor(fieldSize / 2)
		for (let i = 0; i < this.segmentsNumber; i++) {
			this.segments.push({
				x: fieldCenter - i,
				y: fieldCenter,
			})
		}

		document.addEventListener('keydown', this.onKeyDown.bind(this))
	}

	getCorrectCoordinates(x, y) {
		if (x < 0) {
			x = this.fieldSize - 1
		} else if (x >= this.fieldSize) {
			x = 0
		}

		if (y < 0) {
			y = this.fieldSize - 1
		} else if (y >= this.fieldSize) {
			y = 0
		}

		return {x, y}
	}

	move(direction) {
		let {x, y} = this.segments[0]

		switch (direction) {
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

	onKeyDown(event) {
		switch (event.key) {
			case 'ArrowUp':
			case 'w':
				this.move(directions.UP)
				break
			case 'ArrowDown':
			case 's':
				this.move(directions.DOWN)
				break
			case 'ArrowLeft':
			case 'a':
				this.move(directions.LEFT)
				break
			case 'ArrowRight':
			case 'd':
				this.move(directions.RIGHT)
				break
		}
	}

}
