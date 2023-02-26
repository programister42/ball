import { Game } from "./game.js";

const gameField = document.querySelector("#game-field");

const game = new Game(gameField);
game.start();
