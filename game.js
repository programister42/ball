import { CurrentPlayer, Player } from "./player.js";

export class Game {
	socket = io("ws://localhost:3000");

	id = null;

	players = new Map();

	currentPlayer = null;

	constructor(gameFieldElement) {
		this.gameFieldElement = gameFieldElement;

		this.socket.on("id", (id) => {
			this.id = id;
			this.currentPlayer = new CurrentPlayer({
				id,
				gameFieldElement,
			});
		});

		this.socket.on("users coordinates", (users) => {
			users.forEach(({ id, coordinates }) => {
				if (!this.players.has(id) && id !== this.id) {
					this.players.set(id, new Player({ id, coordinates }));
				} else if (id !== this.id) {
					this.players.get(id).coordinates = coordinates;
				}
			});

			this.players.forEach((player) => {
				if (!users.find((user) => user.id === player.id)) {
					this.players.delete(player.id);
				}
			});
		});
	}

	start() {
		this.renderFrame();
	}

	renderFrame = () => {
		const frameFragment = document.createDocumentFragment();
		this.players.forEach((player) => {
			frameFragment.appendChild(player.render());
		});

		if (this.currentPlayer) {
			frameFragment.appendChild(this.currentPlayer.render());

			this.socket.emit("user coordinates", {
				id: this.id,
				coordinates: this.currentPlayer.coordinates,
			});
		}

		this.gameFieldElement.appendChild(frameFragment);
		requestAnimationFrame(this.renderFrame);
	};
}
