function create_menu(ynh_url,$,menu)
{
    ynh_loadCSS(ynh_url+"lib/bootstrap/css/bootstrap.min.css", 'end', "all");
    ynh_loadCSS(ynh_url+"lib/bootstrap/css/bootstrap-accessibility.css", 'end', "all");
    ynh_loadCSS(ynh_url+'lib/font-awesome/css/font-awesome.min.css','end','all');
    ynh_loadCSS(ynh_url+'themes/blue/nav.css');
    $.getScript(ynh_url+'lib/bootstrap/js/bootstrap.min.js', function() {
				
                
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
        if (menu.title)
        {
            html+='    <div class="navbar-header">'; 
            html+='      <a class="navbar-brand" href="'+menu.link+'">'; 
            if (menu.image)
            {
                html+='        <img alt="'+menu.title+'" src="'+menu.image+'">'; 
            }
            else
            {
                html+=menu.title; 
            }
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
        $('body').prepend(html);
    });
}
