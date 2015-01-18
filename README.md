menu_ynh
===============

Menu for YunoHost

Menu create menu on all pages served by a yunohost instance.

How to create a menu ?
---------------

    yunohost menu create -gpublic -tMenu
    yunohost menu additem -p1 -tDate -o5 -l/date/
    yunohost menu additem -p1 -tFile -o10 
    yunohost menu additem -p2 -tFile1 -o5 -l/file1/
    yunohost menu additem -p2 -tFile2 -o10 -l/file2/
    yunohost menu additem -p1 -t"Se connecter" -o5 -l/yunohost/sso/ -cright
