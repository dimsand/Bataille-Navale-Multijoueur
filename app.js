var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs');
var creds = '';

var redis = require('redis');
var client = '';
var port = process.env.PORT || 8080;

// Express Middleware for serving static
// files and parsing the request body
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Start the Server
http.listen(port, function() {
    console.log('Server Started. Listening on *:' + port);
});

// Store people in chatroom
var players = [];

// Render Main HTML file
app.get('/', function (req, res) {
    res.sendFile('views/index.html', {
        root: __dirname
    });
});

// Connexion à partir du boutton Join
app.post('/join', function(req, res) {
    var username = req.body.username;
    if (players.indexOf(username) === -1) {
        players.push(username);
        res.send({
            'players': players,
            'status': 'OK'
        });
    } else {
        res.send({
            'status': 'FAILED'
        });
    }
});

// Déconnexion à partir du bouton Leave
app.post('/leave', function(req, res) {
    var username = req.body.username;
    players.splice(players.indexOf(username), 1);
    res.send({
        'status': 'OK'
    });
});


//////////////////////////////////////////////////////////////
// EVENEMENTS SOCKETS PROVENANT DU CLIENT
io.on('connection', function(socket) {
    
    // New User
    socket.on('newUser', function(username) {
        socket.username = username;
        socket.broadcast.emit('notifyNewUser', username, players);
        socket.broadcast.emit('majListAdversaires', players);
    });

    // User disconnect with leave button
    socket.on('disconnectUser', function(username){
        console.log('user '+socket.username+' disconnected');
        players.splice(players.indexOf(username), 1);
        socket.broadcast.emit('notifyDeconnectUser', username);
    });

    // User disconnect with close windows
    socket.on('disconnect', function(){
        if(socket.username != null && socket.username != undefined){
            console.log('user '+socket.username+' disconnected');
            players.splice(players.indexOf(socket.username), 1);
            socket.broadcast.emit('notifyDeconnectUser', socket.username);
        }
    });

});