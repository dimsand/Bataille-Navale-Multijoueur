$(function () {
    
    var socket = io('http://localhost:3000');
    var currentUSer;
    var userId = 0;
    var JEU = {};

    // Initialisation vers le serveur
    console.log('INIT');
    socket.emit('init');

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
                    $('#leave-chat').show(); //hide the container for joining the chat room.
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
                                $('#leave-chat').show(); //hide the container for joining the chat room.
                                
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
    $(document).on('click', '#leave-chat', function () {
        $('#game_screen').hide();
        $('#login_screen').show();
        $('#leave-chat').hide();
        $('#username').val('test1');
        console.log(currentUSer);
        socket.emit('disconnectUser', currentUSer);
        currentUSer = null;
        JEU = {};
        $('#log').append(logAction("Vous êtes bien déconnecté !"));
        alert('You have successfully left the chat room');
    });

    // Click sur un user de la liste
    $(document).on('click', '.defiUser', function () {
        var IDjoueurDefie = $(this).attr('id');
        var NomjoueurDefie = $(this).text();
        var Joueur2 = {
            id: IDjoueurDefie,
            name: NomjoueurDefie,
            count: null
        };

        // Saisie du nombre de cases du plateau et du nom du joueur
        var nb_cases = prompt("Entrer le nombre de case (10 <= X <= 26) - 11 par défaut");

        $('#log').append(logAction("Vous défiez " + NomjoueurDefie));
        JEU = {Player1: currentUSer, Player2: Joueur2, NbCasesPlateau: nb_cases};
        
        $('#attenteAdversaire').modal('show');

        // On envoi la demande sur le serveur qui la transmettra au joueur défié
        socket.emit('newDefi', JEU);
    });

    // Click boutton Leave
    $(document).on('click', '#btnAcceptDefi', function () {
        console.log("Lancement de la partie sur le serveur...");
        console.log("JEU : ");
        console.log(JEU);
        Game(JEU);
        $('#newDefi').modal('hide');
        socket.emit('lancerPartieServeur', JEU);
    });

    //////////////////////////////////////////////////////////////
    // EVENEMENTS SOCKETS PROVENANT DU SERVEUR

    socket.on('majNbStats', function (players) {
        console.log(players.length);
        $('#nb_users_connected').html(players.length);
    });

    // Notifie à tous les users de la connexion d'un utilisateur
    socket.on('notifyNewUser', function (retour) {
        newUser = retour.newPlayer;
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
        $('#leave-chat').show(); //hide the container for joining the chat room.
    });

    // Affichage de la demande de défi
    socket.on('newPartie', function (jeu) {
        if(parseInt(jeu.Player2.id) === parseInt(currentUSer.id)){
            JEU = jeu;
            $('#log').append(logAction(jeu.Player1.name + " vous défie !"));
            $('#nom_defieur').html(jeu.Player1.name);
            $('.nb_cases_choisies').html(jeu.NbCasesPlateau);
            $('#newDefi').modal('show');
        }
    });

    // Lancement de la partie sur les clients
    socket.on('lancerPartieClients', function (jeu) {
        if(parseInt(jeu.Player1.id) === parseInt(currentUSer.id)){
            Game(JEU);
            $('#attenteAdversaire').modal('hide');                
        }
    });

    // Notifie à tous les users de la déconnexion d'un utilisateur
    socket.on('notifyDeconnectUser', function (retour) {
        console.log('DISCONNECT LEAVING')
        $('#log').append(logAction(retour.oldUser.name + " s'est déconnecté !"));
        $('#'+retour.oldUser.id).remove();
        if(retour.players.length < 2){
            $('#nobody').show();
        }
    });

    // MAJ de la liste des adversaires dispo
    socket.on('majListAdversaires', function(retour){
        if(retour.players.length > 1){
            $('#nobody').hide();
        }
        console.log("MAJ players : " + retour.players);
        $('#list_users').empty();
        for(var i=0; i < retour.players.length; i++){
            if(retour.players[i].id != retour.newPlayer.id){
                if(parseInt(retour.players[i].id) != parseInt(currentUSer.id)){
                    $('#list_users').append('<a class="defiUser list-group-item" id="'+retour.players[i].id+'">'+retour.players[i].name+'</a>');
                }
            }
        }
    });


});
