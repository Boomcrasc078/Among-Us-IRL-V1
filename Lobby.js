class Lobby {
	constructor(socket) {
		this.host = socket;
		this.name = "";
		for (let i = 0; i < 5; i++) {
			this.name += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
		}
		this.name;
		this.players = [];
	}
}

export default Lobby;
