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

// Get le dernier id user
app.get('/getLastUserId', function (req, res) {
    if(players.length > 0){
        res.send({
            'status': 'OK',
            'lastUserId': players[(players.length)-1].id
        });
    }else{
        res.send({
            'status': 'NOPLAYERS'
        });
    }
});

// Connexion à partir du boutton Join
app.post('/join', function(req, res) {
    var user = req.body.user;
    let player = players.find(u => u.id === user.id)
    if (player) {
        player.count++;
        res.send({
            'status': 'FAILED'
        });
    } else {
        players.push(user);
        console.log(players);
        res.send({
            'status': 'OK',
            'players': players
        });
    }
});

//////////////////////////////////////////////////////////////
// EVENEMENTS SOCKETS PROVENANT DU CLIENT
io.on('connection', function(socket) {

    // Affichage de la page
    socket.on('init', function() {
        console.log('nb users : ' + players.length);
        socket.broadcast.emit('majNbStats', players);
    });

    // New User
    socket.on('newUser', function(user) {
        if(socket.user == null && socket.user == undefined){
            socket.user = user;
            socket.broadcast.emit('notifyNewUser', {newPlayer: user, players: players});
            console.log('maj adversaire')
            socket.emit('majListAdversaires', {newPlayer: user, players: players});
            socket.broadcast.emit('majNbStats', players);
        }else{
            socket.emit('alreadyLogged', user);
        }
    });

    // Nouvelle demande de défi
    socket.on('newDefi', function(JEU) {
        var searchPlayer2 = players.find(u => u.id === JEU.Player2.id)
        JEU.Player2 = searchPlayer2;
        console.log("JOueur qui défi : " + JEU.Player1.name)
        console.log("JOueur défié : " + JEU.Player2.name)
        socket.broadcast.emit('newPartie', JEU);
    });

    // Lancement de la partie
    socket.on('lancerPartieServeur', function(JEU) {
        socket.broadcast.emit('lancerPartieClients', JEU);
    });

    // User disconnect with leave button
    socket.on('disconnectUser', function(user){
        console.log('DISCONNECT HERE !!!')
        console.log(user);
        console.log(players);
        let player = players.find(u => parseInt(u.id) === parseInt(user.id))
        if(player){
            console.log('user '+user.name+' disconnected from leaving button');
            players = players.filter(u => parseInt(u.id) !== parseInt(user.id));
            socket.broadcast.emit('notifyDeconnectUser', {oldUser: user, players: players});
            socket.user = null;
            console.log("USERS RESTANTS : ");
            console.log(players);
            socket.broadcast.emit('majNbStats', players);          
        }
    });

    // User disconnect with close windows
    socket.on('disconnect', function(){
        if(socket.user != null && socket.user != undefined){
            let player = players.find(u => parseInt(u.id) === parseInt(socket.user.id))
            if(player){
                console.log('user '+socket.user.name+' disconnected from close window');
                players = players.filter(u => parseInt(u.id) !== parseInt(socket.user.id));
                socket.broadcast.emit('notifyDeconnectUser', socket.user);
                socket.user = null;
                socket.broadcast.emit('majNbStats', players);
            }
        }
    });

});