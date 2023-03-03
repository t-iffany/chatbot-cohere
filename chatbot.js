const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');

// takes in 'server' object as a parameter
// sets up the socket.io server and 
// defines the chatbot logic inside the io.on('connection') callback
function setupChatbot(server) {
  const io = socketio(server);
  
  // listen for incoming connections and set up a socket.io connection
  io.on('connection', (socket) => {
    console.log('A user connected');

    // listen for chat message events
    socket.on('chat message', (msg) => {
      console.log('Message:', msg);

      // send the message to all connected clients
      io.emit('chat message', msg);
    });

    // listen for disconnect events
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

module.exports = { setupChatbot };
