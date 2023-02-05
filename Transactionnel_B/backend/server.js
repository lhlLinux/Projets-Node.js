/*
� l'exception de quelques modifications mineures, le code de ce fichier provient enti�rement
du cours openclassrooms, intitul�: "Passez au Full Stack avec Node.js, Express et MongoDB"
Lien: https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb
*/
const http = require('http');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) { return val; };
  if (port >= 0) { return port; };
  
  return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set('port', port);

// Cette proc�dure s'occupe de la gestion des erreurs lors de l'�coute du port
const errorHandler = error => {
  if (error.syscall !== 'listen') { throw error; }
  
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler); // on associe une proc�dure lors d'une erreur
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
