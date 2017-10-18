# TestSocketIo
Test d'un jeu avec socket IO sur serveur NodeJs

## Bugs à corriger
- Déconnexion d'un utilisateur à partir du boutton Leave Chat : mettre à jour la liste des users connectés
- Après la déconnexion d'un utilisateur, si on se reconnecte, on a pas la liste des utilisateurs connectés qui est mis à jour

## Todo

**# Le 18/10/2017**
- Enlever le système d'ordinateur et permettre aux 2 joueurs de jouer
- Gérer la synchronisation des jeux des 2 cotés à chaque fois qu'un des 2 joueurs jouent
- Toujours le bug du 3e joueur qui se connecte et qui n'arrive pas à récupérer la liste des joueurs déjà connectés
- Faire du design sur la partie connexion du client
- Faire ressortir les joueurs qui sont en train de jouer dans la liste des users connectés + redesigner cetet partie et replacer les éléments sur la page
- Ajouter une partie sur les scores
- Pour plus tard, ajouter d'autres infos sur les users (quand on aura une bdd pour les stocker en ligne) + gérer une vraie authentification des joueurs inscrits (ou pas ??)

**# Le 17/10/2017**
- Créer un projet Laravel pour l'authentification (avec token, ... AIDE : https://www.youtube.com/watch?v=cdRFGsG2PI0&t=1078s&list=WL&index=587)
- Intégrer une base de données pour les scores
- Intégrer le système des joueurs dans le jeu

**Autres**
- Organigramme chronologie d'une partie (de la connexion jusqu'à la déconnexion en passant par la partie finie avec un gagnant et un perdant)
- Faire du design (formulaire connexion, ...)
- Créer un objet pour l'user pour qu'il ait plus de données
- Intégrer le jeu de la bataille navale : https://github.com/dimsand/BatailleNavaleJS