import {Player} from './player.js'

const tick = 1000 / 60;

export class Game {
	socket = io('wss://ball-server.onrender.com')
	// socket = io('ws://localhost:3000')
	gameField = document.createElement('canvas')
	size = 0
	step = 0
	ctx = null
	player = null
	onlinePlayers = []

	/**
	 * @param {HTMLElement} hostElement
	 * @param {number} size
	 */
	constructor({
		hostElement,
		size = 7,
	}) {
		this.gameField.height = this.gameField.width = Math.min(window.innerWidth, window.innerHeight) - 100
		hostElement.appendChild(this.gameField)

		this.size = size
		this.step = this.gameField.width / this.size

		this.ctx = this.gameField.getContext('2d')

		this.player = new Player(this.size)

		this.socket.on('onlinePlayersUpdate', this.onOnlinePlayersUpdate.bind(this))
		setInterval(this.sendPlayerCoordinates.bind(this), tick)
	}

	onOnlinePlayersUpdate(players) {
		this.onlinePlayers = players.filter(player => player.id !== this.socket.id)
	}

	sendPlayerCoordinates() {
		if (!this.player || !this.socket.id) return

		this.socket.emit('updatePlayer', {
			id: this.socket.id,
			lastUpdate: Date.now(),
			segments: this.player.segments,
			color: this.player.color,
		})
	}

	drawGrid() {
		this.ctx.strokeStyle = 'black'
		this.ctx.lineWidth = 0.1

		for (let i = 1; i < this.size; i++) {
			this.ctx.beginPath()
			this.ctx.moveTo(0, i * this.step)
			this.ctx.lineTo(this.gameField.width, i * this.step)
			this.ctx.stroke()

			this.ctx.beginPath()
			this.ctx.moveTo(i * this.step, 0)
			this.ctx.lineTo(i * this.step, this.gameField.height)
			this.ctx.stroke()
		}
	}

	renderPlayer(player) {
		player.segments.forEach(segment => {
			this.ctx.fillStyle = player.color
			this.ctx.fillRect(segment.x * this.step, segment.y * this.step, this.step, this.step)
		})
	}

	startRendering() {
		this.ctx.clearRect(0, 0, this.gameField.width, this.gameField.height)
		this.drawGrid()
		this.onlinePlayers.forEach(this.renderPlayer.bind(this))
		this.renderPlayer(this.player)

		requestAnimationFrame(this.startRendering.bind(this))
	}

	start() {
		this.startRendering()
	}
}
