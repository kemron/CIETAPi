const app = require('./app');
const http = require('http');
const mongoose = require('mongoose');
const dbSeed = require("./app/components/DbSeed");

const port = process.env.PORT || 5000;
app.set('port', port);


var server = http.createServer(app);
server.on('error', onError);


const connectionString = process.env.DB ? process.env.DB : "mongodb://db/cietDb";

mongoose.connect(connectionString);
mongoose.Promise = Promise;
const connection = mongoose.connection;
connection.once('open', () => {
  dbSeed();
  server.listen(port, "0.0.0.0", onListening);
})


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
    case 'EACCES':
      console.error(port + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(port + ' is currently in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  console.log('listening on', port);
}