const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');

const path = require('path');

const http = require('http');
const WebSocketServer = require('websocket').server;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, function() {
    console.log((new Date()) + ` Server is listening on port ${PORT}`);
});

wsServer = new WebSocketServer({
    httpServer,
    autoAcceptConnections: false
});

module.exports = wsServer;
