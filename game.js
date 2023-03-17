import {Player} from './player.js'
import {getRandomColor} from './getRandomColor.js'

const tick = 1000 / 60;
const defaultSize = 51;

export class Game {
	socket = io('wss://ball-server.onrender.com')
	// socket = io('ws://localhost:3000')
	gameField = document.createElement('canvas')
	size = defaultSize
	step = 0
	ctx = null
	player = null
	onlinePlayers = []
	apple = null

	/**
	 * @param {HTMLElement} hostElement
	 * @param {number} size
	 */
	constructor({
		hostElement,
		size = defaultSize,
	}) {
		this.gameField.height = this.gameField.width = Math.min(window.innerWidth, window.innerHeight) - 100
		hostElement.appendChild(this.gameField)

		this.size = size
		this.step = this.gameField.width / this.size

		this.ctx = this.gameField.getContext('2d')

		this.player = new Player(this.size)

		this.socket.on('serverUpdate', this.onServerUpdate.bind(this))
		this.socket.on('appleEaten', this.onAppleEaten.bind(this))
		setInterval(this.updatePlayerOnServer.bind(this), tick)
	}

	onServerUpdate({players, apple}) {
		this.onlinePlayers = players.filter(player => player.id !== this.socket.id)
		this.apple = apple
	}

	onAppleEaten(id) {
		if (id !== this.socket.id) return
		this.player.grow()
	}

	updatePlayerOnServer() {
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

	renderApple() {
		if (!this.apple) return

		this.ctx.fillStyle = getRandomColor()
		this.ctx.fillRect(this.apple.x * this.step, this.apple.y * this.step, this.step, this.step)
	}

	startRendering() {
		this.ctx.clearRect(0, 0, this.gameField.width, this.gameField.height)
		this.drawGrid()
		this.onlinePlayers.forEach(this.renderPlayer.bind(this))
		this.renderPlayer(this.player)
		this.renderApple()

		requestAnimationFrame(this.startRendering.bind(this))
	}

	start() {
		this.startRendering()
	}
}
