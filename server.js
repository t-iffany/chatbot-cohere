// basic express server
const express = require('express');
const http = require('http');
// require chatbot.js file
const { setupChatbot } = require('./chatbot');
const dotenv = require('dontenv');
const cohere = require('cohere-ai');

const app = express();
// const http = require('http').createServer(app);
const server = http.createServer(app);

// cohere
dotenv.config();
cohere.init(process.env.API_KEY);

// set up chatbot by calling function and passing in server obj
setupChatbot(server);

// serve static files from the public directory
// express.static middleware serves static files relative to the directory
// that you provide as an argument
app.use(express.static('public'));

// set up server to listen on port 3000
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// define route for handling incoming HTTP requests to server
app.get('/', (req, res) => {
  res.send('Hello!');
});