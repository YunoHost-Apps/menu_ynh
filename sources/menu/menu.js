var ynh_url = '/menu/';

var ynh_not_in_frame = (top.location==self.document.location); 

if (ynh_not_in_frame) {
    ynh_loadScript(ynh_url+'lib/jquery/fquery.min.js', function(){
        var f$=fQuery;
        f$(document).ready(function(f$) {
            function choose_menu(tree) {
                if (tree.menus.length>0)
                {
                    menu=tree.menus[0];
                    if (menu.style=='default')
                    {
                        display_menu(ynh_url,f$,menu);
                    }
                    else
                    {
                        f$.getScript(ynh_url+'themes/'+menu.style+'/'+menu.style+'.js', function() {
                            create_menu(ynh_url,f$,menu);
                        });
                    }
                }
            }
            /*f$.ajax({
                url:'/ynhpanel.json',
                crossdomain: true,
                traditional: true,
                dataType: 'json',
            })
            .done(function(panel) {
                f$.ajax({
                    url: '/yunohost/api/menus?group=member&info',
                    crossdomain: true,
                    traditional: true,
                    dataType: 'json',
                })
                .done(choose_menu);
            })
            .fail(function(panel) {*/
                f$.ajax({
                    url: '/yunohost/api/menus?group=public&info',
                    crossdomain: true,
                    traditional: true,
                    dataType: 'json',
                })
                .done(choose_menu);
            //});
        });
            
    });


}


function display_menu(ynh_url,f$,menu)
{
    var create_html_menu=function () {			
                
        function create_menu_from_tree(tree) {
            var html="";
            for (elt in tree)
            {
                elt=tree[elt];
                if (elt.tree.length==0)
                {
                    html+='<li>';
                    if (!elt.link)
                        elt.link='#';
                    html+='<a href="'+elt.link+'" ';
                    if (elt.short_description && elt.description) html+='rel="popover" ';
                    if (elt.short_description) html+='data-original-title="'+elt.short_description+'" ';
                    if (elt.description) html+='data-content="'+elt.description+'" ';
                    html+='>';
                    if (elt.icon) html+='<span class="glyphicon '+elt.icon+'" aria-hidden="true"></span>&nbsp';
                    html+=elt.title;
                    html+='</a>';
                    html+='</li>';
                }
                else
                {
                    html+='<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" ';
                    if (elt.short_description) html+='data-original-title="'+elt.short_description+'" ';
                    if (elt.description) html+='data-content="'+elt.description+'" ';
                    html+='>';
                    if (elt.icon) html+='<span class="glyphicon '+elt.icon+'" aria-hidden="true"></span>';
                    if (elt.title && elt.icon) html+='&nbsp';
                    if (elt.title) html+=elt.title;
                    html+='<span class="caret"></span></a>';
                    html+='<ul class="dropdown-menu" role="menu">'+create_menu_from_tree(elt.tree)+'</ul>';
                    html+='</li>';
                }
            }
            return html
        }    
        var html='<div style="height: 42px; position: fixed; width: 100%; top: 0px; z-index: 1000;" id="menu_ynh_container" class="hidden-print">'
        html+='<meta charset="utf-8">'; 
        
        html+='<nav class="navbar navbar-default navbar-fixed-top" id="menu_ynh" role="menubar"> '; 
        html+='<button data-target=".navbar-ex1-collapse" data-toggle="collapse" class="navbar-toggle collapsed" type="button">'; 
        html+='    <span class="sr-only">Afficher/masquer le menu</span>'; 
        html+='    <span class="icon-bar"></span>'; 
        html+='    <span class="icon-bar"></span>'; 
        html+='    <span class="icon-bar"></span>'; 
        html+='</button>'; 
        html+='  <div class="nav-container">'; 
        if (menu.title)
        {
            html+='    <div class="navbar-header">'; 
            if (menu.link)
                html+='      <a class="navbar-brand" href="'+menu.link+'">'; 
            if (menu.image)
            {
                html+='        <img alt="'+menu.title+'" src="'+menu.image+'">'; 
            }
            else
            {
                html+=menu.title; 
            }
            if (menu.link)
                html+='      </a>'; 
            html+='      <a id="nav-skip" href="#nav-end">Sauter le menu</a>';
            html+='    </div>';
        }
        html+='    <div class="collapse navbar-collapse navbar-ex1-collapse" id="menu_ynh">';   
        html+='      <ul class="nav navbar-nav">';     
        html+=create_menu_from_tree(menu.tree.filter(function (item) 
        {
            return item.category!='right';
        }));        
        html+='      </ul>';     
        html+='      <ul class="nav navbar-nav navbar-right">';    
        html+=create_menu_from_tree(menu.tree.filter(function (item) 
        {
            return item.category=='right';
        }));  
        html+='      </ul>';   
        html+='    </div>';   
        html+='  </div>'; 
        html+='  <a id="nav-end"></a>'; 
        html+='</nav>'; 
          
        html+='</div><div style="height: 42px;" />'; 
        f$('body').prepend(html);
        if(typeof f$().popover == 'function') {
            f$('a[rel="popover"]').each(function() {
                f$(this).popover({
                    html: true,
                    trigger: 'hover',
                    // utilisation de 'template' pour ajout du lien sur la popover en mode tactile
                    template: '<div class="popover" role="tooltip"><div class="arrow"></div><a href="'+f$(this).attr('href')+'"><h3 class="popover-title"></h3><div class="popover-content"></div></a></div>'
                });
            });
        }
    };
    ynh_loadCSS(ynh_url+"lib/bootstrap/css/bootstrap.min.css", 'end', "all");
    ynh_loadCSS(ynh_url+"lib/bootstrap/css/bootstrap-accessibility.css", 'end', "all");
    ynh_loadCSS(ynh_url+'lib/font-awesome/css/font-awesome.min.css','end','all');
    ynh_loadCSS(ynh_url+'nav.css');
    var bootstrap_enabled = (window.jQuery && typeof window.jQuery().modal == 'function');
    if (bootstrap_enabled)
    {
        f$=window.jQuery;
        create_html_menu();
    }
    else
        f$.getScript(ynh_url+'lib/bootstrap/js/fbootstrap.min.js',create_html_menu);
        
}
// Fonction d'ajout de scripts
function ynh_loadScript(url, callback, forceCallback) {
    if (!this.loadedScript) {
        this.loadedScript = new Array();
    }

    // indexOf n'existe pas pour IE8
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
          from += len;
        for (; from < len; from++) {
          if (from in this &&
              this[from] === elt)
            return from;
        }
        return -1;
        };
    }
    // fin teste indexOf

    if (this.loadedScript.indexOf(url) == -1) {
        this.loadedScript.push(url);
        var head = document.getElementsByTagName("head")[0];
        var e = document.createElement("script");
        e.src = url;
        e.type = "text/javascript";
        e.charset ="utf-8";

        var done = false;
        e.onload = e.onreadystatechange = function() {
            if ( !done && (!this.readyState ||
                this.readyState === "loaded" || this.readyState === "complete") ) {
                done = true;
                callback();
                // Handle memory leak in IE
                e.onload = e.onreadystatechange = null;
            }
        };

        head.appendChild(e);
    } else {
        if (forceCallback) { // pas utilisé
            callback();
        }
    }
}

// Ajout de CSS
function ynh_loadCSS(url, position, media) {
    if (position==undefined) position='end';
    if (media==undefined) media='screen';
    var f$_link = document.createElement('link');
        f$_link.rel = "stylesheet";
        f$_link.media=media;
        f$_link.href= url;

    if (position == 'start') {
        document.getElementsByTagName('head')[0].insertBefore(f$_link, document.getElementsByTagName('head')[0].firstChild);
    } else {
        document.getElementsByTagName('head')[0].appendChild(f$_link);
    }
}

                /*var tree=[{
                    id:1,
                    title:'test',
                    link:'https://grimaud.me',
                    short_description:'test sd',
                    description:'d',
                    icon:'a.png',
                    tree:[{
                        id:3,
                        title:'test3',
                        link:'https://grimaud.me/#3',
                        short_description:'test3 sd',
                        description:'d3',
                        icon:'a3.png',
                        tree:[]
                        },{
                            id:4,
                            title:'test4',
                            link:'https://grimaud.me/#4',
                            short_description:'test4 sd',
                            description:'d4',
                            icon:'a4.png',
                            tree:[]
                        }]
                    },{
                        id:2,
                        title:'test2',
                        link:'https://grimaud.me/#4',
                        short_description:'test2 sd',
                        description:'d2',
                        icon:'a2.png',
                        tree:[]
                    }];*/
