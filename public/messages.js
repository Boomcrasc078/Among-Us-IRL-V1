const socket = io();

function sendMessage() {
  const input = document.getElementById('input');
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
}

socket.on('updateMessages', (messages) => {
  const messagesElement = document.getElementById('messages');
  messagesElement.innerHTML = ""
  for (msg of messages) [
    messagesElement.innerHTML +=msg.user + ": " + msg.message + "<br>"
  ]
  });