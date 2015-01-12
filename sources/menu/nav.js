var f$_version = '140903';
var f$_site = window.location.host
f$_site = f$_site.replace(/^(www|test)\./i,"");
f$_site = f$_site.replace(/\.(com|net|org|fr|pro)$/i,"");

var f$_url = window.location.href;

var f$_not_in_frame = (top.location==self.document.location); // Pas dans une Frame
console.log('Not in frame ? '+f$_not_in_frame);

// console n'existe pas sur IE8
(function() {
  if (!window.console) {
    window.console = {};
  }
  var m = [
    "log", "info", "warn", "error", "debug", "trace", "dir", "group",
    "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
    "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
  ];
  for (var i = 0; i < m.length; i++) {
    if (!window.console[m[i]]) {
      window.console[m[i]] = function() {};
    }
  }
})();

/**
 * f$() = jQuery() = $()
 * f$_  = variables ou fonctions
 * f$   = free $oftware = frama$oft :P
 **/

/*******************
 *  Config globale
 *******************/
var f$_start_global_config = function() {
    if (f$_config == 'global') {
        console.log('Ok config.js');
        f$_loadScript(f$_nav+'config/'+f$_site+'.js', f$_start_local_config);
    } else {
        console.error('config.js');
    }
}; // ---> site.js

/*******************
 *  Config locale
 *******************/
var f$_start_local_config = function() {
    if (f$_config == 'local') {
        console.log('Ok '+f$_site+'.js');
        if(f$_page('/nav/html/')) { // Si pages « À propos » on reinit la config
            f$_jquery = 'jQuery';
            f$_bootstrap_css = true;
            f$_bootstrap_js = true;
            f$_accessible = true;
        }

        if (f$_jquery == 'jQuery') {
            if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.10.2') {
                console.log('jQuery chargé par AJAX - Mode isolé');
                f$_loadScript(f$_nav+'lib/jquery/jquery.min.js', f$_start_jquery);
            } else {
                console.log('jQuery chargé par HTML');
                f$_start_jquery();
            }
        } else if (f$_jquery == 'fQuery') {
            if (window.fQuery === undefined) {
                console.log('fQuery chargé par AJAX - Mode isolé');
                f$_loadScript(f$_nav+'lib/jquery/fquery.min.js', f$_start_jquery);
            } else {
                console.log('fQuery chargé par HTML');
                f$_start_jquery();
            }
        } else {
            if (window.jQuery === undefined) {
                console.log('Pas de jQuery :-( ');
            } else {
                console.log('jQuery chargé par HTML - version '+window.jQuery.fn.jquery);
                f$_start_jquery();
            }
        }
    } else {
        console.error(f$_site+'.js');
    }
} // ---> jQuery

/*******************
 *     Nav init
 *******************/
var f$_scripts = document.getElementsByTagName('script');
var f$_nav = ''; // racine de la nav
var f$_nav_container = false;

var f$_nav_init = function() {
    for (var i = 0; i < f$_scripts.length; i++) {
        if (f$_scripts[i].getAttribute("src") && f$_scripts[i].getAttribute("src").indexOf("/nav.js") > -1) {
            // Emplacement de la nav (racine ? sous-dossier ?)
            f$_nav = f$_scripts[i].getAttribute("src").replace('nav.js',''); // = 'http://'+f$_site+'/nav/';

            // On ajout une div vide de 42px qui contiendra la nav (évite les sauts de mise en page avant le chargement des fichiers)
            if (f$_scripts[i].parentNode.tagName.toLowerCase() == 'body' ) {
                // si nav.js est appelé en haut du body, c'est super rapide
                var navContainer = (f$_not_in_frame) ? '<div id="framanav_container" style="height:42px"></div>' : '<div id="framanav_container"></div>';
                document.write(navContainer);
                console.log('Nav fast');
                f$_nav_container = true;
            } else {
                // sinon c'est dans le head, il faut attendre document.ready (voir plus bas)
                console.log('Nav slow');
            }
        }
    }

    f$_loadScript(f$_nav+'config/config.js?'+f$_version, f$_start_global_config);
}; // ---> config.js

f$_nav_init();

/*******************
 *     jQuery
 *******************/
function f$_start_jquery() {
    /*
     * CSS
     */
    // Bootstrap
    if (f$_bootstrap_css) {
        f$_loadCSS(f$_nav+"lib/bootstrap/css/bootstrap.min.css", f$_css_position, "all");
    }
    // Bootstrap-a11y
    if(f$_accessible) {
        f$_loadCSS(f$_nav+"lib/bootstrap/css/bootstrap-accessibility.css", 'end', "all");
    }

    // Font-awesome
    f$_loadCSS(f$_nav+'lib/font-awesome/css/font-awesome.min.css','end','all');

    // Nav.css
    f$_loadCSS(f$_nav+'nav.css?'+f$_version);

    // Extra.css
    if(f$_extra_css) {
        f$_loadCSS(f$_nav+'config/'+f$_site+'_extra.css');
    }

    /*
     * Nav
     */
    console.log('Ok '+f$_jquery);
    if (f$_jquery == 'fQuery') {
        var f$ = (f$_jquery_noconflict) ? fQuery.noConflict() : fQuery;
    } else {
        var f$ = (f$_jquery_noconflict) ? jQuery.noConflict() : jQuery;
    }

    f$(document).ready(function() {
        f$.ajaxSetup({ cache: f$_cache });

        if(!f$_nav_container) {
            (f$_not_in_frame) ? f$('body').prepend('<div id="framanav_container" style="height:42px"></div>') : f$('body').prepend('<div id="framanav_container"></div>');
        }

        // On charge ensuite le code HTML
        f$.ajax({
            url: f$_nav+'nav.html'
        })
        .fail(function() {
            console.error('Pas de nav.html');
        })
        .done(function(html) {
            // On ajoute le viewport si Responsive
            if (f$_responsive) {
                f$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
                console.log('Ok Responsive activé');
            } else {
                console.info('Responsive désactivé');
            }

            // On affiche le code html
            f$('#framanav_container').addClass('hidden-print');
            f$('#framanav_container').prepend(html);
            // Correctif sur les url relatives (les images) dans le code html
            f$('img[src^="nav/"]').each(function(){
                link=f$(this).attr('src');
                f$(this).attr('src',link.replace('nav/',f$_nav));
            });

            /*******************
             *   BootStrap JS
             *******************/
            if (f$_bootstrap_js) {
                if (typeof f$().modal == 'function' || f$_bootstrap_js == 'html') {
                    console.log('Ok Bootstrap actif (html)');
                    go_BootStrap();
                } else {
                    if (f$_jquery == 'fQuery') {
                        f$.getScript(f$_nav+'lib/bootstrap/js/fbootstrap.min.js', function() {
                            console.log('Ok Bootstrap actif (ajax) fbootstrap.min.js');
                            go_BootStrap();
                        });
                    } else {
                        f$.getScript(f$_nav+'lib/bootstrap/js/bootstrap.min.js', function() {
                            console.log('Ok Bootstrap actif (ajax) bootstrap.min.js');
                            go_BootStrap();
                        });
                    }
                }
            } else {
                console.info('bootstrap.min.js désactivé');
            }


            // Audio JS
            if (f$_audio_js) {
                f$('audio').each(function() {
                    f$(this).wrap('<div class="audio" />');
                        var outer = this.outerHTML;
                    var regex = new RegExp('<' + this.tagName, 'i');
                        var newTag = outer.replace(regex, '<video');
                        regex = new RegExp('</' + this.tagName, 'i');
                        newTag = newTag.replace(regex, '</video');
                    f$(this).replaceWith(newTag);
                });
            }

            // Video JS
            if (f$_video_js) {
                f$('link[href*="/nav/nav.css"]').before('<link rel="stylesheet" type="text/css" href="'+f$_nav+'lib/video-js/video-js.css" />');
                 // Paramètres à ajouter à la vidéo pour appliquer VideoJS en surcouche
                f$('video').attr({
                    'class':'video-js vjs-default-skin',
                    'data-setup':'{}'});
                // Numérotation des vidéos (pour pouvoir utiliser l'API : videojs('id').ready() )
                f$('video').each(function(index) { f$(this).attr('id','f_video_'+index); });

                f$.getScript(f$_nav+'lib/video-js/video.js', function() {
                    console.log('Ok video.js');
                    videojs.options.flash.swf = f$_nav+'lib/video-js/video-js.swf';
                    // On "clique" sur les sous-titres Français
                    // pour chaque vidéo dès que VideoJS est prêt
                    f$('video').each(function(index) {
                            videojs('f_video_'+index).ready(function() { f$("li.vjs-menu-item:contains('Français')").trigger('click'); });
                    });
                });
            }

            // Bloqueur d'iframe style Flashblock
            var f$_i=0;
            f$('a[iframe]').click(function() {
                // Si attribut iframe sur <a> on l'ajoute le code au clic + ajout d'un Id à l'iframe
                f$(this).after(f$(this).attr('iframe').replace('iframe','iframe id="frame'+f$_i+'"'));
                // On supprime <a><img/></a>
                f$(this).remove();

                var iframe = document.getElementById('frame'+f$_i);
                // Autoplay Soundcloud
                if(iframe.src.indexOf('soundcloud') > -1) {
                    iframe.src = iframe.src.replace('auto_play=false','auto_play=true');
                // Autoplay Youtube, Vime, Dailymotion
                } else if(iframe.src.indexOf('youtube') > -1 || iframe.src.indexOf('dailymotion') > -1 || iframe.src.indexOf('vimeo') > -1) {
                    if(iframe.src.indexOf('?') > -1) {
                        iframe.src = iframe.src+'&autoplay=1';
                    } else {
                        iframe.src = iframe.src+'?autoplay=1';
                    }
                // Reload de la frame (au cas où ça passerait mal)
                } else {
                    iframe.src = iframe.src
                }
                f$_i++;
                return false;
            });

            // Piwik
            if(f$_piwik_url != '' && f$_piwik_id != '') {
                console.log('Ok piwik');
                var _paq = _paq || [];
                _paq.push(["trackPageView"]);
                _paq.push(["enableLinkTracking"]);

                (function() {
                  var u=(("https:" == document.location.protocol) ? "https:" : "http:") + f$_piwik_url.replace(/(http:|https:)/,'');
                  _paq.push(["setTrackerUrl", u+"piwik.php"]);
                  _paq.push(["setSiteId", f$_piwik_id]);
                  var d=document, g=d.createElement("script"), s=d.getElementsByTagName("script")[0]; g.type="text/javascript";
                  g.defer=true; g.async=true; g.src=u+"piwik.js"; s.parentNode.insertBefore(g,s);
                })();
            }
            /** On peut ajouter des scripts jQuery "génériques" ici mais... **/

            function go_BootStrap() {
                if(f$_accessible) {
                    if (f$_jquery == 'fQuery') {
                        f$.getScript(f$_nav+'lib/bootstrap/js/fbootstrap-accessibility.min.js', function() {
                            console.log('Ok accessibility.min.js');
                        });
                    } else {
                        f$.getScript(f$_nav+'lib/bootstrap/js/bootstrap-accessibility.min.js', function() {
                            console.log('Ok accessibility.min.js');
                        });
                    }
                }

                if (f$_not_in_frame) { // Pas de bandeau, nav, modale et macaron en mode iframe
                    f$('#framanav').fadeIn('fast');

                    if(f$_nav_static) {
                        f$('#framanav_container ~ *:not(script):first').css('padding-top', function(value) { return value+42; });
                        f$('#framanav_container').css({
                            'position':'fixed',
                            'width':'100%',
                            'top':'0'
                        });
                    }

                    /** ... on ajoute surtout les scripts qui font appel à BootStrap et jQuery ici **/
                    // Activation des popovers
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

                    // Fenêtre modale et bandeau d'alerte
                    var f$_alert_dejavu = getCookie('nav-alert');
                    var f$_alert_modal_dejavu = getCookie('nav-alert-modal');
                    f$_alert_more = '';

                    // Ajout de la fenêtre modale
                    if (f$_alert_modal_text!='') {
                        f$('body').append(
                        '<div class="modal fade hidden" id="modal-alert" tabindex="-1" role="dialog" aria-labelledby="modal-alertLabel" aria-hidden="true">'+
                            '<div class="modal-dialog">'+
                                '<div class="modal-content">'+
                                    '<div class="modal-header">'+
                                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                        '<h1 id="modal-alertLabel">'+f$_alert_modal_title+'</h1>'+
                                    '</div>'+
                                    '<div class="modal-body">'+f$_alert_modal_text+'</div>'+
                                    '<div class="modal-footer">'+
                                        '<button class="btn" id="modal-close" data-dismiss="modal" aria-hidden="true">Fermer</button>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>');
                        if(f$_alert_modal_btn) {
                            f$_alert_more = ' <button type="button" id="nav-alert-more" class="btn btn-'+f$_alert_type+' btn-xs">plus d\'infos</button>';
                        }

                        if(!f$_alert_modal_dejavu && f$_alert_modal_onstart) {
                            f$('#modal-close').after('<button class="btn btn-primary" id="modal-set-cookie" >Ne plus afficher</button>')
                            f$('#modal-alert').modal('show');
                            f$('#modal-set-cookie').click(function() {
                                setCookie(f$_alert_modal_cookie_name,true,f$_alert_modal_cookie); // cookie pour 7 jours par défaut (cf config.js)
                                f$('#modal-alert').modal('hide');
                            });
                        }
                        f$('#modal-alert .close, #modal-close').click(function() {
                            setCookie('nav-alert-modal',true); // cookie pour la session
                            f$('#modal-alert').modal('hide');
                        });
                    }

                    // Ajout du bandeau d'alerte
                    if (f$_alert_text!='' && !f$_alert_dejavu) {

                        f$('#framanav_container').after(
                            '<div id="nav-alert" class="alert alert-'+f$_alert_type+' fade in" style="border-radius:0">'+
                                '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                                '<p style="text-align:center">'+f$_alert_text+f$_alert_more+'</p>'+
                            '</div>'
                        );

                        // Cookie enregistré en fermant (7 jours par défaut cf config.js)
                        f$('#nav-alert').bind('closed.bs.alert', function () {
                            setCookie(f$_alert_cookie_name,true,f$_alert_cookie);
                        });

                        // Ouvrir la modal sur "plus d'info"
                        f$('#nav-alert-more').click(function() {
                            f$('#modal-alert').modal('show');
                        });
                    }

                    // Fenêtre modal pour dons sur téléchargements
                    if (f$_modal_don_liendl!='') {
                        f$('body').append(
                        '<div class="modal fade" id="modal-soutenir" tabindex="-1" role="dialog" aria-labelledby="modal-soutenirLabel" aria-hidden="true">'+
                            '<div class="modal-dialog">'+
                                '<div class="modal-content">'+
                                    '<div class="modal-header">'+
                                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                        '<h1 id="modal-soutenirLabel">Soutenez Framasoft</h1>'+
                                    '</div>'+
                                    '<div class="modal-body">'+
                                        '<div id="lldemars-framasoft"></div>'+
                                        '<p>Vous êtes sur le point '+f$_modal_don_txtdl1+' une ressource <b>libre</b> issue de la vingtaine de projets du réseau Framasoft.</p>'+
                                        '<p>Cette ressource est <b>gratuite</b> (et le sera tant que nous existerons) parce que <b>Framasoft est une association d’intérêt général à but non lucratif</b> dont l’objectif est justement la diffusion du logiciel libre et sa culture au plus large public.'+
                                        '<p>Mais tout ceci est rendu possible parce que Framasoft est <b>soutenue par les dons (défiscalisables) de ses utilisateurs</b>.</p>'+
                                        '<p>Merci de prendre quelques minutes en nous aidant à pérenniser et développer notre action.</p>'+
                                    '</div>'+
                                    '<div class="modal-footer">'+
                                        '<div style="width:100%; float:left; text-align:center"><a target="_blank" id="modal-don" href="http://soutenir.framasoft.org/?f=modal&s='+f$_site+'" style="color:white;margin:5px" class="btn btn-large btn-success">Je veux faire un don à l’association Framasoft&nbsp;<span class="fa fa-external-link new-window"></span><span class="sr-only"> (nouvelle fenêtre)</span></a></div>'+
                                    //  '<div style="width:50%; float:left; text-align:center"><a target="_blank" id="modal-contact" href="http://contact.framasoft.org/?f=modal&s='+fsite+'"  style="color:white;margin:5px" class="btn btn-large btn-info">Je veux participer. Par où on commence ?</a></div>'+
                                        '<p style="clear:left;text-align:right"><a id="modal-dl" href="javascript:void(0);" class="text-warning" >Non merci, je souhaite seulement '+f$_modal_don_txtdl2+'</a></p>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>');

                        f$(f$_modal_don_liendl).click(function() {
                            var dejavu = getCookie('dondl')
                            if(!dejavu) {
                                link=f$(this).attr('href');
                                f$('#modal-soutenir').modal('show');
                                f$('#modal-contact, #modal-don, #modal-dl').click(function() {
                                    setCookie('dondl',true,f$_modal_don_cookie)
                                    f$('#modal-soutenir').modal('hide');
                                    window.location.href = link;
                                });
                            return false;
                            }
                        });
                    }

                    // Opt-in
                    var f$_optin_dejavu = getCookie('opt-in');
                    if (f$_email_field1!='' && !f$_optin_dejavu) {
                        f$(f$_email_field1).after(
                            '<div class="alert alert-info fade in" id="fs_opt-in">'+
                            '<input type="checkbox" id="fs_opt-in_checkbox" value="false" />'+
                            '<label for="fs_opt-in_checkbox">J’accepte de recevoir à cette adresse des informations importantes de la part de Framasoft</label>'+
                            '<br /><small>(Promis, nous ne revendons pas nos fichiers, même à la NSA&nbsp;! '+
                            '<a href="http://contact.framasoft.org/newsletter" id="link-opt-in" target="_blank" >Pourquoi m’inscrire&nbsp;?&nbsp;<span class="fa fa-external-link new-window"></span><span class="sr-only"> (nouvelle fenêtre)</span></a>)</small></div>'
                        );

                        f$(f$_email_field1).focusin(function() {
                            f$('#fs_opt-in_error').remove();
                            // Ajout du cookie (expire au bout d'un an)
                            setCookie(f$_optin_cookie_name,true,f$_optin_cookie);
                        });

                        // Requête ajax crossdomain lorsque la case est cochée
                        f$('#fs_opt-in input, #fs_opt-in label').on('click', function() {
                            f$('#fs_opt-in_error').remove();
                            f$_email = f$(f$_email_field1).val();
                            if(f$_email_field2!='' && f$(f$_email_field1).val()!=f$(f$_email_field2).val()) { // Cas où il y a un champs pour confirmer email
                                f$(f$_email_field1).after(
                                    '<div class="alert alert-danger fade in" id="fs_opt-in_error">'+
                                    'Les adresses emails ne correspondent pas.</div>'
                                );
                                return false;
                            } else if( !f$_isValidEmail(f$(f$_email_field1).val())) {
                                f$(f$_email_field1).after(
                                    '<div class="alert alert-danger fade in" id="fs_opt-in_error">'+
                                    'L’adresse email '+f$_email+' n’est pas valide.</div>'
                                );
                                return false;
                            } else {
                                f$('#fs_opt-in input').attr('checked', true);
                                f$.ajax({
                                    type: "POST",
                                    url: 'http://contact.framasoft.org/php_list/lists/?p=subscribe&id=2', // URL d'abonnement à la liste
                                    crossDomain:true,
                                    data: 'makeconfirmed=1&htmlemail=0&list%5B5%5D=signup&listname%5B5%5D=Newsletter&email='+f$_email.replace('@','%40')+'&VerificationCodeX=&subscribe=Abonnement' // Paramètres habituellement passés dans le formulaire
                                });
                                // On supprime la case à cocher (pas possible de décocher ; l'annulation se fait depuis le mail reçu)
                                f$('#fs_opt-in').remove();
                                // Message d'alert pour confirmer l'inscription
                                f$(f$_email_field1).after(
                                    '<div class="alert alert-success fade in" id="fs_opt-in_confirm">'+
                                    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
                                    'Votre adresse email <strong>'+f$_email+'</strong> a été ajoutée à notre liste. Vous devriez avoir reçu un email de confirmation.</div>'
                                );
                            }
                        });
                    }

                    // Macaron
                    if(f$_donate) {
                        f$('#framanav_donation').show();
                        p_donationsTimer(false)
                    }

                    // Liens de la nav à ouvrir dans un onglet
                    if(!f$_page('/nav/html/')) {
                        f$('#framanav .dropdown-menu a').attr('target','_blank').append('<span class="fa fa-external-link new-window"></span><span class="sr-only"> (nouvelle fenêtre)</span>');
                    }

                    // Crédits
                    if(!f$_page('/html/credits_'))  {
                        f$('#framanav_container').append('<div id="framanav_test" class="hidden"></div>');
                        f$('#framanav_test').load(f$_nav+'html/credits_'+f$_credits+'.html title', function() {
                            if(f$(this).html()!='') {
                                f$('nav a[href$="html/credits.html"]').removeClass('hidden');
                                f$('nav a[href$="html/credits.html"]').attr('href',f$_nav+'html/credits_'+f$_credits+'.html');
                            }
                        });
                    }

                    // Liens À propos
                    f$('nav a[href^="/nav/html/"]').attr('href', function() {
                        return f$(this).attr('href').replace('/nav/html/', f$_nav+'html/');
                    });

                    // Hébergeur sur Mentions légales
                    if(f$_page('/html/legals.html')) {
                        f$('#modal-legals-host').load(f$_nav+'html/host_'+f$_host+'.html');
                    }

                    // Bug fix (bootstrap a11y fait correspondre le focus sur le hover mais pas pour le dernier menu)
                    f$('#framanav .navbar-right .dropdown-menu li a').hover(function() {
                        f$(this).focus();
                    });

                } // </f$_not_in_frame>

                if(f$_extra_js) {
                    f$.getScript(f$_nav+'config/'+f$_site+'_extra.js', function() {
                        console.log('Ok extra.js');
                    });
                }

            }   // </go_BootStrap>
        }); // </nav.html>
    }); // </document.ready>
}   // </start_jQuery>

/************** Fonctions globales ****************/
function p_donationsTimer(t) {
    if(f$_jquery=='fQuery') {
        if (t) fQuery('#framanav_donation').fadeOut(600).fadeIn(600);
    } else {
        if (t) jQuery('#framanav_donation').fadeOut(600).fadeIn(600);
    }
    t = f$_donate_blink_time + Math.floor(Math.random()*f$_donate_blink_time);
    setTimeout('p_donationsTimer(1)',t);
}

// Cookies
function setCookie(sName, sValue, sTime) {
    sTime = typeof sTime !== 'undefined' ? sTime : 365*24*60*60*1000;
    var today = new Date(), expires = new Date();
    expires.setTime(today.getTime() + sTime);
    document.cookie = sName + "=" + encodeURIComponent(sValue) + ";expires=" + expires.toGMTString();
}

function getCookie(sName) {
    var oRegex = new RegExp("(?:; )?" + sName + "=([^;]*);?");
    if (oRegex.test(document.cookie)) {
        return decodeURIComponent(RegExp["$1"]);
    } else {
        return null;
    }
}

// Fonction d'ajout de scripts
function f$_loadScript(url, callback, forceCallback) {
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
function f$_loadCSS(url, position, media) {
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

function f$_isValidEmail(emailAddress) {
    var pattern = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
    if (pattern.test(emailAddress)==true) {
        return true;
    } else {
       return false;
    }
}

function f$_page(string) {
    return (f$_url.indexOf(string) > -1);
}
