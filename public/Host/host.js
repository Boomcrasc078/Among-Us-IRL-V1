const lobbyElement = document.getElementById('lobby');

const socket = io();

socket.on('disconnect', (reason) => onDisconnection(reason));

let localHostedLobby = { name: null, players: [] };

tryHostLobby();
function tryHostLobby() {
	loadingScreen(true, 'Skapar spel...');
	socket.timeout(5000).emit('host-lobby', (err, response) => {
		loadingScreen(false);
		if (err) {
			console.log(`Error hosting lobby: ${err}`);
			error(true, err);
		} else {
			hostLobby(response);
		}
	});
}
function hostLobby(response) {
	localHostedLobby.name = response.lobbyName;
	document.getElementById('lobbyCode').innerHTML = localHostedLobby.name;
	console.log(`Lobby hosted successfully: ${localHostedLobby.name}`);
	lobbyElement.style.display = 'block';
	updateLobby();
}
function updateLobby() {
	socket.on('update-players', (players) => {
		localHostedLobby.players = players;
		updateTable();
	});
}
function updateTable() {
	const tableElement = document.getElementById('playersTableBody');
	let table = '';
	let i = 1;
	for (const player of localHostedLobby.players) {
		table += `<tr>
			<td class="bg-transparent" scope="col">${i}</td>
			<td class="bg-transparent" scope="col">${player.name}</td>
			</tr>`;
		i++;
	}
	tableElement.innerHTML = table;
}
