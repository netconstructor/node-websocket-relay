var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;

var http = require('http');
var sockets = [];
var server = new WebSocketServer({
    port: 5000
});

var make_response = function(data, errors, notifications, status) {
    data = typeof data !== 'undefined' ? data : {};
    errors = typeof errors !== 'undefined' ? errors : [];
    notifications = typeof notifications !== 'undefined' ? notifications : [];
    status = typeof status !== 'undefined' ? status : 'OK';

    return JSON.stringify({
        data: data,
        errors: errors,
        notifications: notifications,
        status: status
    });
}

server.on('connection', function(socket) {
    console.log('Client connected.');
    sockets.push(socket);
    console.log('Total clients: ' + sockets.length);
});

http.createServer(function (req, res) {
    if (req.method == 'POST') {
        var content = [];

        req.on('data', function(data) {
            content.push(data);
        });

        req.on('end', function() {
            content = decodeURIComponent(content.join('')).split('&');

            var new_content = {};
            var temp;

            for (i = 0; i < content.length; i++) {
                temp = content[i].split('=');
                new_content[temp[0]] = temp[1];
            }

            var alive_sockets = [];
            var response = make_response(new_content);

            for (var i = 0; i < sockets.length; i++) {
                var socket = sockets[i];
                if (socket.readyState == WebSocket.OPEN) {
                    socket.send(response);
                    alive_sockets.push(i);
                } else
                    console.log('Client disconnected.');
            }

            var temp_sockets = [];

            for (var i = 0; i < alive_sockets.length; i++)
                temp_sockets.push(sockets[alive_sockets[i]]);

            sockets = temp_sockets;
            console.log('Total clients: ' + sockets.length);

            console.log(req.connection.remoteAddress + '200 OK: ' + response);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(response);
        });
    } else {
        console.log(req.socket.remoteAddress + '405 Unimplemented Method: "' + req.method + '"')
        res.writeHead(405);
        res.end();
    }
}).listen(8000, '127.0.0.1');

console.log('Listening on 127.0.0.1:5000/8000...');
