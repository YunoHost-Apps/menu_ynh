menu_ynh
===============

Menu for YunoHost

Menu create menu on all pages served by a yunohost instance.

How to create a menu ?
---------------

    yunohost menu create
    yunohost menu add_item -p <ID_MENU> -t "Categorie"
    yunohost menu add_item -p <ID_CAT> -t "Lien 1" -l "http://exemple1.com" -s"Exemple 1" -d"Lorem ipsum dolor et semo"
    yunohost menu add_item -p <ID_CAT> -t "Lien 2" -l "http://exemple2.com" -s"Exemple 2" -d"Lorem ipsum dolor et semo"
    yunohost menu add_item -p <ID_MENU> -t "Lien 3" -l "http://exemple3.com" -s"Exemple 3" -d"Lorem ipsum dolor et semo"

