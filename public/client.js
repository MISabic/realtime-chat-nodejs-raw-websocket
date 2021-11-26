const client = new WebSocket('wss://realtimechat-websocket.herokuapp.com', 'echo-protocol');

client.onerror = () => {
    console.log('Connection Error');
};

client.onopen = () => {
    console.log('WebSocket Client Connected');
    document.getElementById("send-message").addEventListener("click", function() {
        const text = document.getElementById("message-text").value;
        client.send(text);
    });
};

client.onclose = () => {
    console.log('echo-protocol Client Closed');
};

client.onmessage = e => {
    if (typeof e.data === 'string') {
        const { user, userName, text } = JSON.parse(e.data);

        const prevMsg = document.getElementById("previous-message").innerHTML += `<p id=${(user === 'self') ? "selfMessage" : "peerMessage"}>${userName}: ${text}</p>`;
        prevMsg.scrollTop = prevMsg.scrollHeight;
    }
};