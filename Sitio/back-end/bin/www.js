const http = require('http');
const app = require('../app');

const port = parseInt(process.env.PORT, 10) || 8010; //const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
console.log('Server running on port: ' + port);