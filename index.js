require('dotenv').config();

const wsServer = require('./app');
const nameGenerator = require('unique-names-generator');
const { uniqueNamesGenerator, names } = nameGenerator;

const originIsAllowed = (origin) => {
    const allowedOrigin = process.env.ALLOWED_ORIGIN.split(',');
    return allowedOrigin.includes(origin);
}

const connections = {};
const userName = {};

wsServer.on('request', request => {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    
    const connection = request.accept('echo-protocol', request.origin);
    
    if(connection.remoteAddress in connections) {
        connections[connection.remoteAddress].push(connection);
    } else {
        const characterName = uniqueNamesGenerator({ dictionaries: [names] });
        userName[connection.remoteAddress] = characterName;
        connections[connection.remoteAddress] = [connection];
    }
    // console.log(`--> ${connections[connection.remoteAddress]}  -->  ${connections[connection.remoteAddress].length}`)

    console.log((new Date()) + ' Connection accepted.');

    connection.on("open", () => console.log("New user joined!"));

    connection.on('message', message => {
        for(const [key, value] of Object.entries(connections)) {
            for(let i = 0; i < value.length; i++) {
                const messageData = {
                    user: (connection.remoteAddress === key) ? 'self' : 'peer',
                    userName: userName[connection.remoteAddress],
                    text: (message.type === 'utf8') ? message.utf8Data : message.binaryData
                }
                value[i].send(JSON.stringify(messageData));
            }
        }
    });

    connection.on('close', (reasonCode, description) => {
        connections[connection.remoteAddress] = connections[connection.remoteAddress].filter(data => data.remoteAddresses[1] !== connection.remoteAddresses[1]);
        if(connections[connection.remoteAddress].length === 0) {
            delete connections[connection.remoteAddress];
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        }
    });
});