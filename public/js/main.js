$(function () {
    
    var socket = io();
    var currentUSer;
    var userId = 0;

    // On met à jour le user_id
    $.ajax({
        url: '/getLastUserId',
        type: 'GET',
        data: {},
        success: function(response) {
            if (response.status == 'OK') { //username doesn't already exists
                console.log("lastUserId : "+response.lastUserId);
                $('#login_screen').attr('user_id', parseInt(response.lastUserId) + 1);
            } else if (response.status == 'NOPLAYERS') { //username already exists

            }
        }
    });

    // Click boutton Join
    $('#join-chat').click(function() {

        // ON récupère la valeur du username
        username = $.trim($('#username').val());

        // On créé l'objet user
        currentUSer = {
            id: $('#login_screen').attr('user_id'),
            name: username,
            count: 1
        };
        console.log(currentUSer);

        // On envoi la requete en post sur le serveur
        $.ajax({
            url: '/join',
            type: 'POST',
            data: {
                user: currentUSer
            },
            success: function(response) {
                if (response.status == 'OK') { //username doesn't already exists
                    $('#game_screen').show();
                    $('#leave-chat').data('username', username);
                    $('.username').text(username);

                    // On prévient le serveur de l'arrivée du nouveau user
                    socket.emit('newUser', currentUSer);
                    $('#log').append(logAction("Vous êtes bien connecté en tant que : " + username ));

                    $('#login_screen').hide(); //hide the container for joining the chat room.
                } else if (response.status == 'FAILED') { //username already exists
                    // Si l'ID existe déjà, on incrémente l'ID et on rééessaye
                    currentUSer.id = parseInt(currentUSer.id) + 1;
                    $.ajax({
                        url: '/join',
                        type: 'POST',
                        data: {
                            user: currentUSer
                        },
                        success: function(response) {
                            if (response.status == 'OK') { //username doesn't already exists
                                $('#game_screen').show();
                                $('#leave-chat').data('username', username);
                                $('.username').text(username);
            
                                // On prévient le serveur de l'arrivée du nouveau user
                                socket.emit('newUser', currentUSer);
                                $('#log').append(logAction("Vous êtes bien connecté en tant que : " + username ));
            
                                $('#login_screen').hide(); //hide the container for joining the chat room.
                            } else if (response.status == 'FAILED') { //username already exists
                                alert("Sorry but the username already exists, please choose another one");
                                $('#username').val('').focus();
                            }
                        }
                    });
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

    // Click boutton Leave
    $(document).on('click', '.defiUser', function () {
        $('#log').append(logAction(currentUSer.name + " défie le joueur " + $(this).attr('id')));
        Game(currentUSer, $(this).attr('id'));
    });

    //////////////////////////////////////////////////////////////
    // EVENEMENTS SOCKETS PROVENANT DU SERVEUR

    // Notifie à tous les users de la connexion d'un utilisateur
    socket.on('notifyNewUser', function (newUser) {
        $('#log').append(logAction(newUser.name + " vient de se connecter !"));
        if($("#nobody").css('display') != 'none'){
            $('#nobody').hide();
        }
        $('#list_users').append('<a class="defiUser list-group-item" id="'+newUser.id+'">'+newUser.name+'</a>');
        console.log('user actuel : ' + newUser.name);
    });

    socket.on('alreadyLogged', function (user) {
        $('#log').append(logAction(user.name + ", vous êtes déjà connecté !"));
        $('#game_screen').show();
        $('#login_screen').hide(); //hide the container for joining the chat room.
    });

    // Notifie à tous les users de la déconnexion d'un utilisateur
    socket.on('notifyDeconnectUser', function (oldUser) {
        $('#log').append(logAction(oldUser.name + " s'est déconnecté !"));
        $('#'+oldUser.id).remove();
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