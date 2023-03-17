import {Game} from './game.js'

const root = document.getElementById('root')

const game = new Game({
	hostElement: root,
	size: 51,
})
game.start()
