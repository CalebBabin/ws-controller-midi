let config = {};
try {
    config = require(`${__dirname}/config/config.js`);
} catch (e) {
    config = require(`${__dirname}/config/config-default.js`);
}




const WebSocket = require('ws');

const ws = new WebSocket(config.host);

ws.on('open', function open() {
    console.log('server connection open');
});

/*ws.on('message', function incoming(data) {
    console.log(data);  
});*/



const midi = require('midi');

const input = new midi.input();
 
// Count the available input ports.
input.getPortCount();
 
// Get the name of a specified input port.
const name = input.getPortName(0);
 
// Configure a callback.
input.on('message', function(deltaTime, message) {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log('m:' + message + ' d:' + deltaTime);

  ws.send(JSON.stringify({
      c: 's',
      channel: config.channel,
      controller: name,
      d: message,
  }))
});
 
// Open the first available input port.
input.openPort(0);