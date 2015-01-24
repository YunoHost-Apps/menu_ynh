menu_ynh
===============

Menu for YunoHost

Menu create menu on all pages served by a yunohost instance.

<img src="/img/menu.png" style="max-width:100%;" alt="Screen containing a menu created with this yunohost app"/>

How to create a menu ?
---------------

    yunohost menu create -gpublic -tMenu
    yunohost menu additem -p1 -tDate -o5 -l/date/
    yunohost menu additem -p1 -tFile -o10 
    yunohost menu additem -p2 -tFile1 -o5 -l/file1/
    yunohost menu additem -p2 -tFile2 -o10 -l/file2/
    yunohost menu additem -p1 -t"Se connecter" -o5 -l/yunohost/sso/ -cright
    


How to get the menu in image ?
---------------
    # yunohost menu create -gpublic -tRéald -lhttps://le-reald.org -sdefault
    admin_password: 
    Success! Menu created
    group: public
    id: 2
    image: None
    link: https://le-reald.org
    style: None
    title: Réald

    #yunohost menu additem -p2 -tDocuments -o5 -s "Gestion de documents" -d "Permet de synchroniser vos documents sur plusieurs équipements et entre plusieurs personnes" -iglyphicon-folder-open
    admin_password: 
    Success! Item created
    category: None
    description: Permet de synchroniser vos documents sur plusieurs équipements et entre plusieurs personnes
    icon: glyphicon-file
    id: 3
    link: /file/
    order: 5
    parent: 2
    short_description: Gestion de documents
    title: Documents


    #yunohost menu additem -p3 -t "Fiches pratiques" -o15 -l/file/ -s "Fiches pratiques" -d "Contient un ensemble de fiches pratiques" -iglyphicon-folder-open

    #yunohost menu additem -p3 -t "Sensibilisation" -o20 -l/file/ -s "Supports de sensibilisations" -d "Un ensemble de supports de sensibilisation prêt à être réutilisé/rediffusé" -iglyphicon-folder-open

    #yunohost menu additem -p3 -t "Documents types" -o25 -l/file/ -s "Documents types" -d "Des documents type pour l'animation de vos structures" -iglyphicon-folder-open


    #yunohost menu additem -p2 -t "Listes de discussions" -o10 -l/list/ -s "Listes de discussions par mail" -d "Une liste de diffusion permet d'envoyer un courriel identique à toutes les personnes inscrites à la liste ; les discussions ont ainsi lieu entre plusieurs personnes, dont chacune peut lire les messages envoyés." -iglyphicon-comment

    #yunohost menu additem -p2 -t "Carte" -o15 -l/map/ -s "Carte participative des LCD" -d "Une carte permetant de découvrir les strucutures de lutte contre les discriminations prés de chez soi ainsi que les évenements." -iglyphicon-pushpin

    #yunohost menu additem -p2 -t "Sondage" -o20 -l/limesurvey/ -s "Création de sondage" -d "Réalisez et diffusez des sondages complets avec LimeSurvey." -iglyphicon-question-sign

    #yunohost menu additem -p2 -t " " -o25 -iglyphicon-plus

    #yunohost menu additem -p10 -t "Créer un pad" -o5 -l/pad/ -s "Documents collaboratifs (Connexion requise)" -d "Ecrivez à plusieurs sur un même documents en même temps." -iglyphicon-file

    #yunohost menu additem -p10 -t "Créer un calc" -o10 -l/calc/ -s "Feuille de calcul collaborative (Connexion requise)" -d "Créer des feuilles de calcul à plusieurs sur un même documents en même temps." -iglyphicon-stats

    #yunohost menu additem -p10 -t "Créer un strut" -o15 -l/strut/ -s "Créer des présentations (Connexion requise)" -d "Permet de créer des présentations avec des effets d'agrandissement et de rétrécissement." -iglyphicon-text-background

    #yunohost menu additem -p10 -t "Trouver une date" -o20 -l/date/ -s "Sondage de date (Connexion requise)" -d "Trouvez le meilleurs créneau pour vos réunions." -iglyphicon-time

    #yunohost menu additem -p10 -t "Créer un siteweb" -o25 -l/siteweb/ -s "Créer un siteweb (Connexion requise)" -d "Déployez votre siteweb wordpress en quelques questions, puis écrivez vos pages dans l'interface d'administration dédiée." -iglyphicon-globe

    #yunohost menu additem -p10 -t "Mail" -o30 -l/mail/ -s "Mail (Connexion requise)" -d "Obtenez une boite mail avec votre domaine." -iglyphicon-envelope


    #yunohost menu additem -p2 -t "Se connecter" -o5 -l/yunohost/sso/ -cright

    #yunohost menu additem -p2 -t "S'inscrire" -o10 -l/register/ -cright


    #yunohost menu additem -p3 -tRessources -o10 -l/file/ -s "Ressources" -d "" -iglyphicon-folder-open
