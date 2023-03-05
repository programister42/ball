import {Game} from './game.js'

const root = document.getElementById('root')

const game = new Game({
	hostElement: root,
	size: 25,
})
game.start()
