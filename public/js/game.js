const list_orientations = new Array('Horizontal','Vertical');
const bateaux = new Array(
    {
        'nom' : 'Porte-avion',
        'longueur' : 5,
        'restant' : new Array(5,5),
        'etat' : new Array("",""),
        'couleur' : 'brown'
    },
    {
        'nom' : 'Croiseur',
        'longueur' : 4,
        'restant' : new Array(4,4),
        'etat' : new Array("",""),
        'couleur' : 'cyan'
    },
    {
        'nom' : 'Contre-torpilleurs',
        'longueur' : 3,
        'restant' : new Array(3,3),
        'etat' : new Array("",""),
        'couleur' : 'black'
    },
    {
        'nom' : 'Sous-marin',
        'longueur' : 3,
        'restant' : new Array(3,3),
        'etat' : new Array("",""),
        'couleur' : 'yellow'
    },
    {
        'nom' : 'Torpilleur',
        'longueur' : 2,
        'restant' : new Array(2,2),
        'etat' : new Array("",""),
        'couleur' : 'pink'
    }
);

/**
 * Initialisation des grilles
 * Retourne le jeu avec les grilles et l'initialisation des scores
 * @param {*} PARAMS_JEU 
 */
var InitGrilles = function(PARAMS_JEU){
    // INITIALISATION VARIABLES
    // Objets et tableaux
    var joueurs = new Array(
        {
            'infos': PARAMS_JEU.Player1, 
            'nb_touche': 0, 
            'nb_coups': 0, 
            'last_coup': null
        }, 
        {
            'infos': PARAMS_JEU.Player2, 
            'nb_touche': 0, 
            'nb_coups': 0, 
            'last_coup': null
        }
    );
    var jeu = new Array({"joueur":joueurs[0], "grille":new Array()},{"joueur":joueurs[1],"grille":new Array()});
    var nb_cases = parseInt(PARAMS_JEU.NbCasesPlateau);

    var JEU = {plateau: null, nb_cases: nb_cases, joueurs: joueurs};

    // Vérif saisie et initialisation du jeu
    if(nb_cases < 10 || nb_cases > 26){
        alert('Le nombre de case doit être supérieur à 11 et inférieur à 26');
        $('#tableau-J0').html('Veuillez recharger la page');
    }else{
        for(J=0; J<=1; J++){
            initialisationGrille(J);
            for(var B=0; B<bateaux.length; B++){
                bateauHasard(B, J);
            }
        }
        JEU.plateau = jeu;
    }

    // Initialisation des deux grilles du jeu
    function initialisationGrille(currentJ){
        for(var i=1; i<=nb_cases; i++){
            jeu[currentJ].grille[i] = new Array();
            for(var j=1; j<=nb_cases; j++){
                jeu[currentJ].grille[i][j] = new Object({'etat':null, 'bateau':null});
            }
        }
    }

    // Pour chaque bateau avec orientation aléatoire et première case aléatoire,
    // on vérifie d'abord que le bateau ne dépasse pas de la grille,
    // puis si une case a déjà un bateau, on arrête et on ne place pas le bateau
    var continuer;
    function bateauHasard(id_bateau, currentJ){

        var bateau_cree = false;
        while(!bateau_cree){

            // Nombre au hasard entre 1 et longueur max de la grille
            var case_depart_i = Math.floor((Math.random() * nb_cases) + 1);
            var case_depart_j = Math.floor((Math.random() * nb_cases) + 1);
            var orientation = Math.floor((Math.random() * 2));
            orientation = list_orientations[orientation];

            if(orientation == 'Horizontal'){
                if(case_depart_i + (bateaux[id_bateau].longueur) < (nb_cases)){
                    for (var i = case_depart_i; i < (case_depart_i+bateaux[id_bateau].longueur); i++){
                        if(jeu[currentJ].grille[i][case_depart_j].etat != null && jeu[currentJ].grille[i][case_depart_j].etat == "bateau"){
                            continuer = false;
                            break;
                        }else{
                            continuer = true;
                        }
                    }
                    if(continuer){
                        for (var i = case_depart_i; i < (case_depart_i+bateaux[id_bateau].longueur); i++){
                            jeu[currentJ].grille[i][case_depart_j].bateau = bateaux[id_bateau];
                            jeu[currentJ].grille[i][case_depart_j].etat = "bateau";
                        }
                        bateau_cree = true;
                    }else{
                        //bateauHasard(id_bateau);
                        bateau_cree = false;
                    }
                }else{
                    //bateauHasard(id_bateau);
                    bateau_cree = false;
                }
            }else if(orientation == 'Vertical'){
                if(case_depart_j + (bateaux[id_bateau].longueur) < (nb_cases)){
                    for (var j = case_depart_j; j < (case_depart_j+bateaux[id_bateau].longueur); j++){
                        if(jeu[currentJ].grille[case_depart_i][j].etat != null && jeu[currentJ].grille[case_depart_i][j].etat == "bateau"){
                            continuer = false;
                            break;
                        }else{
                            continuer = true;
                        }
                    }
                    if(continuer){
                        for (var j = case_depart_j; j < (case_depart_j+bateaux[id_bateau].longueur); j++){
                            jeu[currentJ].grille[case_depart_i][j].bateau = bateaux[id_bateau];
                            jeu[currentJ].grille[case_depart_i][j].etat = "bateau";
                        }
                        bateau_cree = true;
                    }else{
                        //bateauHasard(id_bateau);
                        bateau_cree = false;
                    }
                }else{
                    //bateauHasard(id_bateau);
                    bateau_cree = false;
                }
            }
        }
    }
    return JEU;
}

/////////////////////////////////////////////////////////////////////////////

var InitCssGrilles = function(JEU, forAdversaire){

    var jeu = JEU.plateau;
    var nb_cases = JEU.nb_cases;
    var joueurs = JEU.joueurs;

    // On crée la grille de chaque joueur
    for(currentJ=0; currentJ<=1; currentJ++){
        
        var tableau_html = "";
        tableau_html += '<div class="ligne coordonnees">';
        tableau_html += '<div class="case"></div>';
        // On crée la ligne des lettres
        for (var i = 65; i < (65+parseInt(nb_cases)); i++) {
            tableau_html += '<div class="case">'+String.fromCharCode(i)+'</div>'
        }
        tableau_html += '</div>';

        for(var i=1; i<=nb_cases; i++){
            tableau_html += '<div class="ligne">';
            tableau_html += '<div class="case coordonnees">'+i+'</div>';
            for(var j=1; j<=nb_cases; j++){
                if((!forAdversaire && currentJ == 0) || (forAdversaire && currentJ == 1)){
                    if(jeu[currentJ].grille[i][j].bateau){
                        tableau_html += '<div class="case case_perso '+jeu[currentJ].grille[i][j].bateau.couleur+' '+jeu[currentJ].grille[i][j].bateau.etat[currentJ]+' '+jeu[currentJ].grille[i][j].etat+'" data-x="'+i+'" data-y="'+j+'"></div>';
                    }else{
                        tableau_html += '<div class="case case_perso" data-x="'+i+'" data-y="'+j+'"></div>';
                    }
                }else{
                    tableau_html += '<div class="case case_adversaire" data-x="'+i+'" data-y="'+j+'"></div>';
                }
            }
            tableau_html += '</div>';
        }

        // Infos du joueur
        if((!forAdversaire && currentJ == 0) || (forAdversaire && currentJ == 1)){
            tableau_html += '<div class="ligne infos_user infos_bottom"><p>Votre jeu</p><p><span class="nb_coups"> Nombre de coups : 0</span></p></div>';
        }else{
            if(currentJ == 0){
                var adversaire =  1;
            }else{
                var adversaire = 0;
            }
            tableau_html += '<div class="ligne infos_user infos_bottom"><p>Votre adversaire : '+joueurs[adversaire].infos.name+'</p><p><span class="nb_coups"> Nombre de coups : 0</span></p></div>';
        }
        if((!forAdversaire && currentJ == 0) || (forAdversaire && currentJ == 1)){
            $('#tableau-J1').html(tableau_html);
        }else{
            $('#tableau-J0').html(tableau_html);
        }

    }
}

/////////////////////////////////////////////////////////////////////////////

var Game = function(JEU){
    
    // Joueur en cours
    var currentJ = 0;

    var jeu = JEU.plateau;
    var nb_cases = JEU.nb_cases;
    var joueurs = JEU.joueurs;

    // Au click sur une case
    $(document).on('click', '.case_adversaire', function(){
        // Si c'est pas une case du jeu, on ne fait rien
        if($(this).parent().hasClass('desactived') || $(this).parent().hasClass('coordonnees')){
            return false;
        }
        // Si ça en est une, on récupère les coordonnees de la case et on vérifie
        var data_x = $(this).attr('data-x');
        var data_y = $(this).attr('data-y');
        if(verifTouche(data_x, data_y)){
            calculNbCoups();
            changeUser();
            jeuOrdi();
        }
    });

    function changeUser(){
        if(currentJ == 0){
            currentJ = 1;
            $('#tableau-J0 .ligne').addClass('desactived');
            $('#tableau-J1 .ligne').removeClass('desactived');
            $('#consignes').html("Au tour de <strong>" + joueurs[0].infos.name + "</strong> de jouer !");
        }else{
            currentJ = 0;
            $('#tableau-J0 .ligne').removeClass('desactived');
            $('#tableau-J1 .ligne').addClass('desactived');
            $('#consignes').html("Au tour de <strong>" + joueurs[1].infos.name + "</strong> de jouer !");
        }
    }

    function jeuOrdi(){
        var data_x = Math.floor((Math.random() * nb_cases) + 1);
        var data_y = Math.floor((Math.random() * nb_cases) + 1);
        console.log("ORDI : " + data_x + " - " + data_y);
        console.log(jeu[currentJ].grille[data_x][data_y]);
        verifTouche(data_x, data_y);
        calculNbCoups();
        changeUser();
    }

    // Vérification d'une case touché
    function verifTouche(x,y){
    var coule = false;
        // Si il y a un bateau
        if(jeu[currentJ].grille[x][y].etat == "bateau"){
            jeu[currentJ].grille[x][y].bateau.restant[currentJ]--;   // On décrémente le nombre de touché du bateau avant qu'il coule
            if(jeu[currentJ].grille[x][y].bateau.restant[currentJ] == 0){
                jeu[currentJ].grille[x][y].bateau.etat[currentJ] = "coule";
                jeu[currentJ].grille[x][y].etat = "coule";
                coule = true;
                // Si il y a eu un coulé sur un bateau, on met une image d'explosion
                $('#tableau-J'+currentJ+' .ligne .case[data-x="'+x+'"][data-y="'+y+'"]').html('<img class="img-explose" src="img/gradiusiiiexplosiona.GIF"/>')
            }else{
                jeu[currentJ].grille[x][y].etat = "touche";
                jeu[currentJ].grille[x][y].bateau.etat[currentJ] = "touche";
            }
            jeu[currentJ].joueur.nb_touche++; // On incrémente le nombre de touché du joueur qu'il doit y avoir pour gagner
        // Case déjà cliqué
        }else if(jeu[currentJ].grille[x][y].etat == "clique" || jeu[currentJ].grille[x][y].etat == "touche"){
            if(currentJ == 1)
            alert("déjà touché !");
            return false;
        } // Bateau raté
        else{
            jeu[currentJ].grille[x][y].etat = "clique";
        }
        // On reconstruit le tableau en HTML CSS  -- On attends 2 secondes pour l'animation d'explosion si le bateau a coulé
        if(coule){
        setTimeout(function(){
            InitCssGrilles(JEU);
            checkGagnant(); // On vérifie si un joueur a gagné
        }, 1400);
        }else{
            InitCssGrilles(JEU)
        checkGagnant(); // On vérifie si un joueur a gagné
        }
        return true;
    }

    // Vérification que le joueur a bien fait ses 17 touchés, si oui, il a gagné
    function checkGagnant(){
        for(J=0; J<2; J++){
            if(jeu[currentJ].joueur.nb_touche == 17){
                changeUser();
                alert(jeu[currentJ].joueur.nom + " a gagné !");
                changeUser();
            }
            changeUser();
        }
    }

    function calculNbCoups(){
        jeu[currentJ].joueur.nb_coups++;
        console.log(jeu[currentJ].joueur.nb_coups);
        $('#tableau-J0 .infos_user .nb_coups').html('Nombre de coups : '+jeu[0].joueur.nb_coups);
        $('#tableau-J1 .infos_user .nb_coups').html('Nombre de coups : '+jeu[1].joueur.nb_coups);
    }
}