// basic express server
const express = require('express');
const { allowedNodeEnvironmentFlags } = require('process');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// listen for incoming connections and set up a socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // listen for disconnect events
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// set up server to listen on port 3000
http.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// define route for handling incoming HTTP requests to server
app.get('/', (req, res) => {
  res.send('Hello!');
});