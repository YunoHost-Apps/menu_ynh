var ynh_url = 'YUNOPATH';

var ynh_not_in_frame = (top.location==self.document.location); 

if (ynh_not_in_frame) {
    ynh_loadScript(ynh_url+'lib/jquery/jquery.min.js', function(){
        ynh_loadCSS(ynh_url+"lib/bootstrap/css/bootstrap.min.css", 'end', "all");
        ynh_loadCSS(ynh_url+"lib/bootstrap/css/bootstrap-accessibility.css", 'end', "all");
        ynh_loadCSS(ynh_url+'lib/font-awesome/css/font-awesome.min.css','end','all');
        ynh_loadCSS(ynh_url+'nav.css');
        
        var $ = jQuery.noConflict();
        $(document).ready(function() {
            $.getScript(ynh_url+'lib/bootstrap/js/bootstrap.min.js', function() {
				
                $.ajax({
                    url: '/yunohost/api/menus?group=public&info',
                    crossdomain: true,
                    traditional: true,
                    dataType: 'json',
                })
                .done(function(tree) {
                    if (tree.menus.length>0)
                    {
                        function create_menu_from_tree(tree) {
                            var html="";
                            for (elt in tree)
                            {
                                elt=tree[elt];
                                if (elt.tree.length==0)
                                    html+='<li><a href="'+elt.link+'"><span class="glyphicon '+elt.icon+'" aria-hidden="true"></span>&nbsp'+elt.title+'</a></li>';
                                else
                                {
                                    html+='<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" data-original-title="'+elt.short_description+'" data-content="'+elt.description+'">'+elt.title+' <span class="caret"></span></a>';
                                    html+='<ul class="dropdown-menu" role="menu">'+create_menu_from_tree(elt.tree)+'</ul>';
                                    html+='</li>';
                                }
                            }
                            return html
                        }    
                        var html='<div style="height: 42px; position: fixed; width: 100%; top: 0px; z-index: 1000;" id="menu_ynh_container" class="hidden-print">'
                        html+='<meta charset="utf-8">'; 
                        
                        html+='<nav class="navbar navbar-default navbar-fixed-top" id="menu_ynh"> '; 
                        html+='<button data-target=".navbar-ex1-collapse" data-toggle="collapse" class="navbar-toggle" type="button">'; 
                        html+='    <span class="sr-only">Afficher/masquer le menu</span>'; 
                        html+='    <span class="icon-bar"></span>'; 
                        html+='    <span class="icon-bar"></span>'; 
                        html+='    <span class="icon-bar"></span>'; 
                        html+='</button>'; 
                        html+='  <div class="nav-container">'; 
                        html+='    <div class="navbar-header">'; 
                        html+='      <a class="navbar-brand" href="#">'; 
                        html+='        <img alt="Reald" src="...">'; 
                        html+='      </a>'; 
                        html+='      <a id="nav-skip" href="#nav-end">Sauter le menu</a>';
                        html+='    </div>';
                        html+='    <div class="collapse navbar-collapse navbar-ex1-collapse" id="menu_ynh">';   
                        html+='      <ul class="nav navbar-nav">';     
                        html+=create_menu_from_tree(tree.menus[0].tree);        
                        html+='      </ul>';     
                        html+='      <ul class="nav navbar-nav navbar-right">';    
                        html+='        <li><a href="#">Inscription</a></li>';     
                        html+='        <li><a href="#">Se connecter</a></li>';    
                        html+='      </ul>';   
                        html+='    </div>';   
                        html+='  </div>'; 
                        html+='  <a id="nav-end"></a>'; 
                        html+='</nav>'; 
                          
                        html+='</div>'; 
                        $('body').prepend(html);
                    }
                });
            });
        });
            
    });


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
