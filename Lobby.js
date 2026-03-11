class Lobby {
	constructor(io, socket, existingLobbys) {
		this.io = io;
		this.host = socket.id;
		this.name = '';
		do {
			this.name = '';
			for (let i = 0; i < 5; i++) {
				this.name += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
			}
		} while (existingLobbys.some((x) => x.name === this.name));

		this.players = [];
	}
	update() {
		this.io.to(this.name).emit('update-lobby', this);
	}
}

export default Lobby;
