import {Game} from './game.js'

const root = document.getElementById('root')
const scoreElement = document.getElementById('score')

const game = new Game({
	hostElement: root,
	size: 51,
	scoreElement,
})
game.start()
