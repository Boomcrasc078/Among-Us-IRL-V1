import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import Lobby from './Lobby.js';

const app = express();
const server = createServer(app);
const io = new Server(server, { connectionStateRecovery: {} });
const port = 3000;
const updateInterval = 200;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(join(__dirname, 'public/index.html'));
});

let lobbys = [];

io.on('connection', (socket) => onConnection(socket));

function update() {}

setInterval(update, 15);

server.listen(port, () => {
	console.log(`server running at http://localhost:${port}`);
});

function onConnection(socket) {
	if (socket.recovered) {
		console.log(`Socket ${socket.id} has been reconnected`);
	} else {
		console.log(`Socket ${socket.id} has been connected`);
	}

	socket.on('disconnect', (reason) => onDisconnection(socket, reason));

	socket.on('host-lobby', (callback) => onHostLobby(socket, callback));

	socket.on('join-lobby', (lobbyName, player, callback) =>
		onJoinLobby(socket, lobbyName, player, callback)
	);
}

function onDisconnection(socket, reason) {
	closeLobbysHostedBy(socket);
	console.log(`Socket ${socket.id} has been disconnected: ${reason}`);
}

function onHostLobby(socket, callback) {
	let createdLobby = new Lobby(socket, lobbys);
	lobbys.push(createdLobby);
	socket.join(createdLobby.name);
	const callbackData = { status: true, lobbyName: createdLobby.name };
	getLobbyUpdates(socket, createdLobby);
	callback(callbackData);
	// console.log(`Socket ${socket.id} has hosted a new lobby`);
}

function onJoinLobby(socket, lobbyName, player, callback) {
	const lobby = lobbys.find((lobby) => lobby.name === lobbyName);

	if (!lobby) {
		callback({ status: false, message: `Kunde inte hitta ett spel med koden: ${lobbyName}` });
		return;
	}

	socket.data.name = player.name;
	
	socket.join(lobbyName);
	callback({ status: true, lobbyName: lobby.name });
	// console.log(`Socket ${socket.id} has joined lobby ${lobbyName}`);
}

function closeLobbysHostedBy(socket) {
	let closeLobbys = lobbys.filter((lobby) => lobby.host === socket);
	for (let lobby of closeLobbys) {
		io.socketsLeave(lobby.name);
		// console.log(
		// 	`Lobby ${lobby.name} has been closed because the host has disconnected`
		// );
	}
}

setInterval(updateAllLobbys, updateInterval);

function updateAllLobbys() {
	for (let lobby of lobbys) {
		lobby.update(io);
	}
}

function getLobbyUpdates(socket, createdLobby) {
	socket.on('update-lobby-settings', (settings) => {
		createdLobby.settings = settings;
	});
}
