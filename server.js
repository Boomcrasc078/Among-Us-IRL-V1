import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'));
});

var messages = [];

io.on('connection', (socket) => {
  let connectionMessage = { user: socket.id, message: "Connected to the server" };
  messages.push(connectionMessage);
  socket.on('chat message', (msg) => {
    let userMessage = { user: socket.id, message: msg };
    messages.push(userMessage);
  });
});

io.on('disconnection', (socker) => {
    let disconnectionMessage = { user: socket.id, message: "Disconnected to the server" };
  messages.push(disconnectionMessage);

})


function update() {
  io.emit('updateMessages', messages);
}
setInterval(update, 15);

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});