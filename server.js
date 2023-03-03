// basic express server
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// serve static files from the public directory
// express.static middleware serves static files relative to the directory
// that you provide as an argument
app.use(express.static('public'));

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