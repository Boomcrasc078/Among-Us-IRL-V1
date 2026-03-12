const socket = io();

socket.on('disconnect', (reason) => onDisconnection(reason));

let localPlayer = { socketId: socket.id, name: null};

let localJoinedLobby = { name: null, players: [] };

joinLobbyMenu(true);

function joinLobbyMenu(enabled) {
	const joinLobbyMenuElement = document.getElementById('joinLobbyMenu');
	if (enabled) {
		joinLobbyMenuElement.style.display = 'block';
		setInterval(updateJoinButtonEnabled, 100);
	} else {
		joinLobbyMenuElement.style.display = 'none';
		clearInterval(updateJoinButtonEnabled);
	}
}

function updateJoinButtonEnabled() {
	const nameInput = document.getElementById('nameInput');
	const roomCodeInput = document.getElementById('lobbyCodeInput');
	const confirmationCheckbox1 = document.getElementById('confirmationCheckbox1');
	const confirmationCheckbox2 = document.getElementById('confirmationCheckbox2');
	const joinBtn = document.getElementById('joinBtn');

	if (
		nameInput.value.trim() !== ''
		&& roomCodeInput.value.trim() !== ''
		&& confirmationCheckbox1.checked
		&& confirmationCheckbox2.checked
	) {
		joinBtn.disabled = false;
	} else {
		joinBtn.disabled = true;
	}
}

function joinLobby() {
	joinLobbyMenu(false);

	loadingScreen(true, 'Ansluter till spelet...');

	getLobbyCode();

	getPlayerName();

	socket.timeout(5000).emit('join-lobby', localJoinedLobby.name, localPlayer, (error, response) => {
		loadingScreen(false);
		if (error) {
			console.log(`Error joining lobby: ${error}`);
			error(true, error);
		} else if (response.status) {
			console.log(`Joined lobby successfully: ${response.lobbyName}`);
			lobby(true);
			getLobbyUpdatesFromServer();
		} else {
			console.log(`Failed to join lobby: ${response.message}`);
			error(true, response.message);
		}
	});
}

function getLobbyCode() {
	const lobbyCodeInput = document.getElementById('lobbyCodeInput').value;
	localJoinedLobby.name = lobbyCodeInput;
}

function getPlayerName() {
	const playerNameInput = document.getElementById('nameInput').value;
	localPlayer.name = playerNameInput;
}

function lobby(enabled) {
	const lobbyElement = document.getElementById('lobby');
	if (enabled) {
		lobbyElement.style.display = 'block';
	} else {
		lobbyElement.style.display = 'none';
	}
}

function getLobbyUpdatesFromServer() {
	socket.on('update-lobby', (lobby) => {
		localJoinedLobby = lobby;
	});
}
