$(function () {
    
    var socket = io();
    var currentUSer;

    // Click boutton Join
    $('#join-chat').click(function() {
        username = $.trim($('#username').val());
        currentUSer = username;
        $.ajax({
            url: '/join',
            type: 'POST',
            data: {
                username: username
            },
            success: function(response) {
                if (response.status == 'OK') { //username doesn't already exists
                    $('#game_screen').show();
                    $('#leave-chat').data('username', username);
                    $('.username').text(username);
                    
                    socket.emit('newUser', username);
                    $('#log').append(logAction("Vous êtes bien connecté en tant que : " + username ));

                    console.log(response.players);
                    $('#login_screen').hide(); //hide the container for joining the chat room.

                } else if (response.status == 'FAILED') { //username already exists
                    alert("Sorry but the username already exists, please choose another one");
                    $('#username').val('').focus();
                }
            }
        });
    });

    // Click boutton Leave
    $('#leave-chat').click(function () {
        var username = $(this).data('username');
        $.ajax({
            url: '/leave',
            type: 'POST',
            dataType: 'json',
            data: {
                username: username
            },
            success: function (response) {
                if (response.status == 'OK') {
                    $('#game_screen').hide();
                    $('#login_screen').show();
                    $('#username').val('');
                    socket.emit('disconnectUser', username);
                    alert('You have successfully left the chat room');
                }
            }
        });
    });

    //////////////////////////////////////////////////////////////
    // EVENEMENTS SOCKETS PROVENANT DU SERVEUR

    // Notifie à tous les users de la connexion d'un utilisateur
    socket.on('notifyNewUser', function (newUsername, players) {
        $('#log').append(logAction(newUsername + " vient de se connecter !"));
        if(players.length > 0){
            $('#nobody').hide();
        }
        console.log('user actuel : ' + currentUSer);
    });

    // Notifie à tous les users de la déconnexion d'un utilisateur
    socket.on('notifyDeconnectUser', function (oldUsername) {
        $('#log').append(logAction(oldUsername + " s'est déconnecté !"));
        $('#'+oldUsername).remove();
    });

    // MAJ de la liste des adversaires dispo
    socket.on('majListAdversaires', function(players){
        if(players.length > 1){
            $('#nobody').hide();
        }
        console.log("MAJ players : " + players);
        $('#list_users').empty();
        for(var i=0; i < players.length; i++){
            if(players[i] != currentUSer){
                $('#list_users').append('<li id="'+players[i]+'">'+players[i]+'</li>');
            }
        }
    });


});