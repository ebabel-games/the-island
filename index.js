const express = require('express');
const app = express();
const port = 3000;

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let chatLog = [];

// Update the server chat log.
// Emit a message to all connected players by default.
const emitChatMessage = (m = [], sender = io) => {
  chatLog = chatLog.concat(m);
  m.map(msg => sender.emit('chat message', msg));
};

io.on('connection', (socket) => {
  emitChatMessage(chatLog, socket); // Only send the history to newly connected player.
  emitChatMessage(['Player connected.']);

  socket.on('disconnect', () => {
    emitChatMessage(['Player disconnected.']);
  });

  socket.on('chat message', (m) => {
    emitChatMessage([m]);
  });
});

http.listen(process.env.PORT || port, () => {
  console.log(`The Island server is listening on port ${port}.`);
});
