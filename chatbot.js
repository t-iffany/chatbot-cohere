// import required modules
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const cohere = require('cohere-ai');
const axios = require('axios');

// setup chatbot function that takes server object and cohere module as parameters
function setupChatbot(server, cohere) {
  // create a socket.io instance attached to the server
  const io = socketio(server);
  
  // set up event listener for new connections to the socket.io server
  io.on('connection', (socket) => {
    console.log('A user connected');

    // set up event listener for incoming chat msgs from client
    socket.on('chat message', async(msg) => {
      console.log('Message:', msg);
      
      // define prompt for the cohere API, using received chat msg as industry
      const prompt = `
This program generates a startup idea and name given the industry.

Industry: Workplace
Startup Idea: A platform that generates slide deck contents automatically based on a given outline
Startup Name: Deckerize
--
Industry: Home Decor
Startup Idea: An app that calculates the best position of your indoor plants for your apartment
Startup Name: Planteasy
--
Industry: Healthcare
Startup Idea: A hearing aid for the elderly that automatically adjusts its levels and with a battery lasting a whole week
Startup Name: Hearspan

--
Industry: Education
Startup Idea: An online school that lets students mix and match their own curriculum based on their interests and goals
Startup Name: Prime Age

--
Industry: Productivity
Startup Idea: A trello clone to track your tasks
Startup Name: Tasker

Industry: ${msg}
      `;

        // define the options for the API request to cohere
        const options ={
          method: 'POST',
          url: 'https://api.cohere.ai/v1/generate',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`,
          },
          data: {
            model: 'xlarge',
            max_tokens: 20,
            return_likelihoods: 'NONE',
            truncate: 'END',
            prompt: prompt,
          },
        };

        try {

        // make an API request using Axios
        const response = await axios.request(options);
        
        // extract the generated text from the API response
        const generatedText = response.data.generations[0].text.trim();
        console.log('generatedText: ', generatedText);

        // send the generated text to all connected clients
        io.emit('chat message', generatedText);
      } catch (error) {
        // log errors that occurred during the API request
        console.error('Error generating response from Cohere:', error);
        // send a generic error message to the clients
        io.emit('chat message', 'Sorry, I am unable to generate a response at this time.');
      }
    });

    // set up event listener for client disconnections
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

module.exports = { setupChatbot };
