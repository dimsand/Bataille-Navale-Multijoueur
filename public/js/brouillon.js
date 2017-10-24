var InitCssGrilles = function(jeu){
    
        let nb_cases = jeu.nb_cases;
    
        var tableau_html = "";
        tableau_html += '<div class="ligne coordonnees">';
        tableau_html += '<div class="case"></div>';
        // On crée la ligne des lettres
        for (var i = 65; i < (65+parseInt(nb_cases)); i++) {
            tableau_html += '<div class="case">'+String.fromCharCode(i)+'</div>'
        }
        tableau_html += '</div>';
    
        // On crée les cases du plateau de jeu
        for(var i=1; i<=nb_cases; i++){
            tableau_html += '<div class="ligne">';
            tableau_html += '<div class="case coordonnees">'+i+'</div>';
            for(var j=1; j<=nb_cases; j++){
                var clique = (jeu[currentJ].grille[i][j].etat == "clique" || jeu[currentJ].grille[i][j].etat == "coule" || jeu[currentJ].grille[i][j].etat == "touche")?true:false;
                // Si on reconstruit le style du plateau de l'ordi
                if(currentJ == 1){   // currentJ == 1
                    if(jeu[currentJ].grille[i][j].bateau){
                        var coule = (jeu[currentJ].grille[i][j].bateau.etat[currentJ] == "coule")?true:false;
                        var touche = (jeu[currentJ].grille[i][j].bateau.etat[currentJ] == "touche")?true:false;
                        tableau_html += '<div class="case'+((coule)?" "+jeu[currentJ].grille[i][j].bateau.couleur:"")+''+((touche)?" "+jeu[currentJ].grille[i][j].etat:"")+'" data-x="'+i+'" data-y="'+j+'">'+((clique||coule)?"X":"")+'</div>';
                    }else{
                        tableau_html += '<div class="case" data-x="'+i+'" data-y="'+j+'">'+((clique)?"X":"")+'</div>';
                    }
                }else{
                    if(jeu[currentJ].grille[i][j].bateau){
                        tableau_html += '<div class="case '+jeu[currentJ].grille[i][j].bateau.couleur+' '+jeu[currentJ].grille[i][j].bateau.etat[currentJ]+' '+jeu[currentJ].grille[i][j].etat+'" data-x="'+i+'" data-y="'+j+'">'+((clique||coule)?"X":"")+'</div>';
                    }else{
                        tableau_html += '<div class="case" data-x="'+i+'" data-y="'+j+'">'+((clique)?"X":"")+'</div>';
                    }
                }
            }
            tableau_html += '</div>';
        }
        // Infos du joueur
        tableau_html += '<div class="ligne infos_user infos_bottom">'+joueurs[currentJ].nom+' - <span class="nb_coups"> Nombre de coups : 0</span></div>';
        $('#tableau-J'+currentJ).html(tableau_html);
    }