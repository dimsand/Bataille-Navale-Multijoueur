var http = require('http');
var fs = require('fs');

let users = [];

function removeUserFromUserList(pseudoToRemove){
    var indexUser = users.indexOf(pseudoToRemove);
    if (indexUser > -1) {
        users.splice(indexUser, 1);
    }
}

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {

    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on ajoute dans la liste
    socket.on('petit_nouveau', function(pseudo) {        
        if(pseudo != null && pseudo != undefined){
            socket.pseudo = pseudo;
            users.push({pseudo: pseudo});
            console.log(users);
            socket.broadcast.emit('addUserList', pseudo);
        }
    });

    // On met à jour la liste des users déjà connecté pour le nouveau user
    socket.emit('majUserList', users);

    // On signale aux autres clients qu'il y a un nouveau venu
    socket.broadcast.emit('notifNewUserToAll', 'Un autre client vient de se connecter ! ', users);

    socket.on('disconnect', function(){
        console.log('user disconnected');
        removeUserFromUserList(socket.pseudo);
        socket.broadcast.emit('removeUserList', socket.pseudo);
    });
});


server.listen(8080);