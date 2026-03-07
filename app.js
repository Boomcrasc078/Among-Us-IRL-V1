import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import Lobby from "./Lobby.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "public/index.html"));
});

let lobbys = [];

io.on("connection", (socket) => onConnection(socket));

function update() {}

setInterval(update, 15);

server.listen(3000, () => {
	console.log("server running at http://localhost:3000");
});

function onConnection(socket) {
	console.log(`Socket ${socket.id} has been connected`);

	socket.on("disconnect", (reason) => onDisconnection(socket, reason));

	socket.on("host-lobby", (callback) => onHostLobby(socket, callback));

	socket.on("join-lobby", (lobbyName, player, callback) =>
		onJoinLobby(socket, lobbyName, player, callback)
	);
}

function onDisconnection(socket, reason) {
	closeLobbysHostedBy(socket);
	console.log(`Socket ${socket.id} has been disconnected: ${reason}`);
}

function onHostLobby(socket, callback) {
	let newLobby = new Lobby(socket);
	lobbys.push(newLobby);
	socket.join(newLobby.name);
	const callbackData = {
		status: true,
		lobbyName: newLobby.name
	};
	callback(callbackData);
	console.log(`Socket ${socket.id} has hosted a new lobby`);
}

function onJoinLobby(socket, lobbyName, player, callback) {
	const lobby = lobbys.find((lobby) => lobby.name === lobbyName);

	if (!lobby) {
		callback({ status: false, message: "Lobby not found" });
		return;
	}

	lobby.players.push(player);

	socket.join(lobbyName);
	callback({ status: true, lobbyName: lobby.name });
	console.log(`Socket ${socket.id} has joined lobby ${lobbyName}`);
}

function closeLobbysHostedBy(socket) {
	let closeLobbys = lobbys.filter((lobby) => lobby.host === socket);
	for (let lobby of closeLobbys) {
		io.socketsLeave(lobby.name);
		console.log(
			`Lobby ${lobby.name} has been closed because the host has disconnected`
		);
	}
}

setInterval(updateAllLobbys, 1000);

function updateAllLobbys() {
	for (let lobby of lobbys) {
		updateLobby(lobby);
	}
}

function updateLobby(lobby) {

	function updatePlayers() {
		io.to(lobby.name).emit("update-players", lobby.players);
	}

	updatePlayers();
}
