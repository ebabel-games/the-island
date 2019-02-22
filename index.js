const express = require('express');
const app = express();
const port = 3000;

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let chatLog = [];

// Update the server chat log.
// Emit a message to all connected players.
const emitChatMessage = (m = []) => {
  chatLog = chatLog.concat(m);
  m.map(msg => io.emit('chat message', msg));
};

io.on('connection', (socket) => {
  socket.on('chat message', (m) => {
    emitChatMessage([m]);
  });
});

http.listen(process.env.PORT || port, () => {
  console.log(`The Island server is listening on port ${process.env.PORT || port}.`);
});
