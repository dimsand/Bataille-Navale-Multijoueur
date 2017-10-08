function Server(opt){
    this.opt = opt;
    this.httpServer = require('http').createServer();
    this.io = require('socket.io')(this.httpServer);
    this.start();
};

Server.prototype.start = function(){
    that = this;
    this.io.on('connection', function(socket){
        console.log('le client ' + socket.id + ' s\'est connecté !');
        socket.broadcast.emit('print_server_message', "Le client " + socket.id + " s'est connecté !");
        socket.on('join_room', function(username, room_name){
            console.log("["+room_name+"] L'utilisateur " + username + " s'est connecté au salon !");
            socket.to(room_name).emit('print_server_message', "["+room_name+"] L'utilisateur " + username + " s'est connecté au salon !");
            socket.join(room_name);
        });
        socket.on('leave_room', function(username, room_name){
            console.log("["+room_name+"] L'utilisateur " + username + " s'est déconnecté au salon !");
            socket.to(room_name).emit('print_server_message', "["+room_name+"] L'utilisateur " + username + " s'est déconnecté au salon !");
            socket.leave(room_name);
        });
        socket.on('my_name_is', function(username, room_name){
            console.log("Le client " + socket.id + " s'est identifié avec le nom : " + username);
            socket.to(room_name).emit('print_server_message', "Enchanté " + username + ", je suis le server !");
        });
        socket.on('disconnect', function(){
            console.log("le client " + socket.id + " s'est déconnecté !");
            socket.broadcast.emit('print_server_message', "Le client " + socket.id + " s'est déconnecté !");
        });
    });

    this.httpServer.listen(this.opt.port, function(){
        console.log("Le serveur écoute le port : " + that.opt.port);
    })
};

module.exports = Server;