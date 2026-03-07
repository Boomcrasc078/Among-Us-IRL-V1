const socket = io();
let localLobby = {
	name: null,
	players: []
}

tryHostLobby();

function tryHostLobby() {
	socket.timeout(5000).emit("host-lobby", (err, response) => {
		if (err) {
			console.log(`Error hosting lobby: ${err}`);
		} else {
		}
	});
}

function hostLobby() {
	localLobby.name = response.lobbyName;
	document.getElementById("lobbyCode").innerHTML = hostedLobby;
	console.log(`Lobby hosted successfully: ${hostedLobby}`);
	socket.on("update-lobby", (data) => updateLobby(data));
}

function updateLobby(data) {
	localLobby.players = data.players;
}
