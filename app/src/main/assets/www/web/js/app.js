var app = function () {

    var $title_bar;
    var $nav_bar;
    var $menu_li;

    return {
        targetLoad: '#page_body',
        //popup_inf: '#popup_info',
        loader: '#loader',
        callback: 0,
        urlprod: "",
        moduleActive: "",
        menu: {},
        lastState: "",
        thema: {
            data: [],
            color: "",
            model: ""
        },
        /*
         * listado de los nodos con posicion de forma asecendente
         */
        nodeList: {},
        /*
         * posicion de cada valor en el arreglo
         */
        node: {
            id: 0,
            pos: 1,
            parent: 2,
            name: 3,
            show: 4,
            tpl: 5,
            sicontent: 6,
            metadata: 7
        },
        /*
         * estructura en forma de arbol de los nodos nodo=app.nodeTree[id_nodo];
         * datos=app.nodeList[n.pos];
         */
        nodeTree: new Array(),
        fromHistory: false,

        init: function () {
            app.$title_bar = $("#title_bar");
            app.$nav_bar = $('#main-nav');

            app.targetLoad = $(app.targetLoad);

            // INICIO ESTILO PARA LA CAPA DE ESPERA
            app.loader = $(app.loader);
            $(document).ajaxStart(function (d, e) {
                if (window.LoadComplete) {
                    app.loader.show();
                }

                // e.url=config.producto+'/'+e.url;
            }).ajaxComplete(function (event, request, settings) {
                if (window.LoadComplete) {
                    app.loader.hide();
                }
            });

            var $body = $("body");
            var toggler = document.getElementsByClassName("navbar-toggler")[0];
            var myCanvasNav = document.getElementById("myCanvasNav");

            app.$nav_bar.on('show.bs.collapse', function () {
                toggler.style.left = "230px";
                myCanvasNav.style.width = "100%";
                myCanvasNav.style.opacity = "0.8";
            });

            app.$nav_bar.on('hide.bs.collapse', function () {
                toggler.style.left = "0";
                myCanvasNav.style.width = "0%";
                //document.getElementById("mainContent").style.marginLeft= "0%";
                document.body.style.backgroundColor = "white";
                myCanvasNav.style.width = "0%";
                myCanvasNav.style.opacity = "0";
            });

            $body.on('click', function (e) {
                $("#tooltip").css("display", "none");
            });

            $body.on('c' +
                'lick', "#myCanvasNav", function (e) {
                app.$nav_bar.collapse('hide');
            });

            $body.on('click', "#main-nav a", function (e) {
                var op = $(e.currentTarget);
                if (!op.hasClass('noajax')) {
                    e.preventDefault();
                    app.module(op.attr('id'), op.attr('href'), true);
                }
            });


            // palabras calientes
            $body.on('click', "a.fireWord", function (e) {
                e.preventDefault();
                el = $(e.currentTarget);
                var url = el.attr('href');
                part = url.split("/");
                resp = glosario.loadGlosario();
                if (resp) {
                    resp.success(function () {
                        glosario.showModalTermino(part[2], el.text());
                    });
                } else {
                    glosario.showModalTermino(part[2], el.text());
                }

            });

            // vinculos entre los demas modulos

            $body.on('click', "a.linkModulo,a.catGaleria, a.cntPagina,a.linkAjax", function (e) {
                e.preventDefault();
                var target = $(e.currentTarget).attr('target');
                if (target) {
                    app.targetLoad = $('#' + target);
                } else {
                    app.targetLoad = $("#page_body");
                }
            });
            $body.on('click', "a.catGaleria", function (e) {
                nsgaleria.loadModule($(e.currentTarget).attr('href'));
            });
            $body.on('click', "a.linkAjax", function (e) {
                app.linkAjax($(e.currentTarget).attr('href'));
            });

            $body.on('click', "a.linkModulo", function (e) {
                var el = $(e.currentTarget);
                var name = el.attr('name');
                var id = el.attr('id');
                if (!name) name = id;
                app.module(name);
            });

            $body.on('click', "a.cntPagina", function (e) {
                var url = $(e.currentTarget).attr('href');
                var pos = url.indexOf("#");
                if (pos != -1) {
                    app.ancla = url.substring(pos + 1);
                } else {
                    app.ancla = null;
                }
                var id = url.substr(url.lastIndexOf("/") + 1);
                if (!id) id = e.currentTarget.id;
                temario.showPage(id);

            });

            $body.on('click', "a.showVnt", function (e) {
                e.preventDefault();
                url = $(e.currentTarget).attr('href');
                p = url.lastIndexOf("ejercicio");
                if (p > 0) {
                    id = url.substr(url.lastIndexOf("/") + 1);
                    temario.showEjercicio(id);
                    return;
                }
                var etitulo = $(e.currentTarget).attr('title');

                //app.loadWindow(url, {title: etitulo});

                app.get(url, function (result) {
                    var modal = Modal.show(result, etitulo);
                    app.refreshPag(modal);
                });

            });

            $body.on('click', "a.ancla", function (e) {
                //$body.on('click', "a.ancla[href*=#]",  function (e) {

                if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                    && location.hostname == this.hostname) {

                    var $target = $(this.hash);

                    $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');

                    if ($target.length) {

                        var targetOffset = $target.offset().top - 20;

                        $('html,body').animate({
                            scrollTop: targetOffset
                        }, 100);

                        return false;
                    }
                }

            });

            $body.on('click', "span.error_field", function (e) {
                var $el = $(e.currentTarget);
                Ejercitador.ventana_complement('Retroalimentaci&oacute;n de la Pregunta', $el.attr("title"));
            });

            $body.on('click', "#cerrar_secion", function (e) {
                app.storageRemove('respuestas');
                app.storageRemove('id_ejer_list');
                app.storageRemove('posicion');
                app.storageRemove('escala');
            });

            var $scroll_obj = $("#btn-scrollup");

            if ($scroll_obj.length > 0) {
                $(window).scroll(function () {
                    $(this).scrollTop() > 100 ? $scroll_obj.fadeIn() : $scroll_obj.fadeOut()
                }), $scroll_obj.click(function () {
                    return $("html, body").animate({scrollTop: 0}, 600), !1
                });
            }

            redimencion();
            //app.lightbox = new Lightbox(configLightbox);
            app.refreshPag();
            swipedEvent();

        },
        get: function (url, callback) {

            if (url && url != "#") {

                return $.ajax(url, {
                    type: "GET",
                    complete: function (request, textStatus) {
                        callback(request.responseText);
                    }
                });
            }
        },

        linkAjax: function (url) {

            return $.ajax(url, {
                type: "GET",
                complete: function (request, textStatus) {

                    app.targetLoad.html(request.responseText);

                    $('html,body').animate({
                        scrollTop: 0
                    }, 100);

                    app.refreshPag();
                    app.saveHistory({
                        "module": "app",
                        "call": "linkAjax",
                        "params": [url]
                    });
                }
            });


        },
        loadWindow: function (url, options) {

            this.options = options ? options : {};
            var ventana_popup = $('#ventana_popup');
            ventana_popup.load(url, function (data, textResult) {


                // $('#ventana_popup').dialog('option',
                // 'title', titulo?titulo:'Producto');
                var config = $('#ventana_popup').find('.show');

                if (config.length > 0) {

                    if (config.html()) {
                        this.options.title = config.html();
                    } else {
                        this.options.title = 'Producto';
                    }

                    if (config.attr('width'))
                        this.options.width = config.attr('width');
                    if (config.attr('height'))
                        this.options.height = config.attr('height');


                    config.remove();
                }


                ventana_popup.dialog('option', app.options);
                ventana_popup.dialog('open');
                app.refreshPag(ventana_popup);
            });

        },

        replace_link: function (html) {
            re = /..\/producto\//gi;
            return html.replace(re, "");

        },
        refreshPag: function (targetLoad) {

            if (!targetLoad)
                targetLoad = app.targetLoad;

            /* para lo ejercicios */
            temario.initEjerCnt(targetLoad);

            $(' object.animacion', targetLoad)
                .each(
                    function (i, data) {

                        var src = $(data).find('embed').attr('src');
                        var link = $('<a href="javascript:void(0);"'
                            + 'onClick="PantallaCompleta(\'' + src + '\')"'
                            + '"style="display:block">Pantalla completa</a>');


                        $(data).after(link);
                        $(data).after('<br />');
                        // link.append(data);
                    });


            $('.video-js', targetLoad).each(function (i, el) {
                videojs(el, {
                    //language: 'fr',
                    flash: {
                        swf: 'web/libs/video.js/video-js.swf'
                    },
                    techOrder: ["html5", "flash"],
                    controls: true,
                    autoplay: false,
                    preload: "none"
                });
            });

            //app.lightbox.refresh();
            // $("a[rel*='lightbox']",targetLoad).click(function (e) {
            $("a[rel*='photoSwipe'], a[rel*='lightbox'], a[class*='photoSwipe']", targetLoad).click(function (e) {
                e.preventDefault();
                app.linkImgOpen(e);
            });

            if (app.ancla) {
                var ancla = $('a[name=' + app.ancla + '] , a[id=' + app.ancla + ']');
                if (ancla.length > 0) {
                    var targetOffset = ancla.offset().top;

                    // $('html,body').scrollTop(targetOffset);
                    $('html,body').animate({
                        scrollTop: targetOffset - 310
                    });
                    // document.body.scrollTop = targetOffset;
                    // ancla[0].scrollIntoView(true);
                }
                app.ancla = "";
            }

            // galeria
            $('galeria, complementos', targetLoad).each(
                function (i, gal) {
                    $el = $(this);
                    var link = $el.attr('id');
                    if (parseInt(link)) {
                        nsgaleria.render(link, $el.parent());
                    } else {
                        $el.parent().load(nsgaleria.view,
                            function () {
                                var param = link.split('/');
                                var idGal = getIdGaleria(param[1]);
                                nsgaleria.init(idGal, $el);
                            });
                    }

                });

            // juegos
            $('juegos', targetLoad).each(function (i, gal) {
                link = $(this).find('llave');
                nsjuego.loadData();
                var url = link.html();
                var param = url.split('/');

                setTimeout(function () {

                    nsjuego.cargar(param[2], link.parent());
                }, 100);

            });

            // ejercitador
            $('ejercitador', targetLoad).load(Ejercitador.view, function () {
                    Ejercitador.init($(this));
                }
            );

            // glosario
            $('glosario', targetLoad).load(glosario.view, glosario.init);


            $('span.error_field').hide();


            $('.tip').Tooltip({
                track: true,
                delay: 0,
                showURL: false,
                showBody: "[sep]"
            });

            $(".ayoshare").ayoshare({
                counter: true,
                button: {
                    google : true,
                    facebook : true,
                    twitter : true,
                    whatsapp : true,
                    telegram : true,
                    linkedin : true,
                    email : true,
                   /*
                    pinterest : true,
                    flipboard : true,
                    line : true,
                    bbm : true,
                    viber : true,
                    sms : true
                    */
                }
            });
            // objetos html
            //objCrhea.load(targetLoad);
            //subMenu.init(targetLoad);
        },
        getDataNode: function (idNode, attr) {
            pos = app.nodeTree[idNode].pos;
            var idat = app.nodeList[pos];
            return idat[attr];
        },
        module: function (moduleName, url, saveHistory= false) {

            var ownDeferred = $.Deferred();
			if(moduleName)
				var moduleId = moduleName.substring(3);
			else
				var moduleId = app.module.inicio ;
           
		   app.currentModule = moduleId;

            var metadata = {};
            var metadataStr = app.getDataNode(moduleId, app.node.metadata);
            if(metadataStr){
                metadata = $.parseJSON(metadataStr);
            }
            if(!metadata || !metadata.href) {
                metadata.href = "fuentes/" + config.producto + "/contenido/" + moduleId +".html";
            }

            var loadUrl;
            if (!metadata.href) {
                alert(". Nada para cargar.");
                return false;
            }else{
                //loadUrl = "htdocs/" + metadata.href;
                loadUrl = metadata.href;
            }

            app.get(loadUrl, function (result) {
                
                $('html,body').animate({
                    scrollTop: 0
                }, 100);

                if(metadata.tpl){
                    result = $.tmpl(metadata.tpl ,  {content: result});
                }          
              
                app.targetLoad.html(result);
                app.selectOp(moduleName);

                if (saveHistory) {
                    app.saveHistory({
                        "module": "app",
                        "call": "module",
                        "params": [moduleName, loadUrl]
                    });
                }
             
                switch (parseInt(moduleId)) {
                  case app.home:
                    app.postLoadHome();
                    break;
                  case config.mod.ejercicio:
                    Ejercitador.init();
                    break;
                  case config.mod.simulador:
                    sim.init();
                    break;
                  case config.mod.simulador:
                    saveHistory = false;
                    break;
                  case config.mod.juegos:
                  case config.complemento.id:
                  case config.imagen.id:
                  case config.video.id:
                  case config.sonido.id:
                  case config.animacion.id:
                    saveHistory = false;
                    nsgaleria.init(app.currentModule);
                    break;
                }
                return ownDeferred.promise();
            });

            app.$nav_bar.collapse('hide');

            return true;
        },

        selectOp: function (moduleName) {
            if (moduleName) {
                var op = $('#' + moduleName);
                var ul = op.parents("ul");
                ul.find("li a").removeClass('active');

                ul.parent("li").children(0).addClass('active');
                op.addClass('active');

                var title = stripHTML(op.html());
                app.$title_bar.html(title);

                app.moduleActive = moduleName;
            }
        },

        loadIndex: function () {
            if (config.datosProd) {
                d = config.datosProd.temaPlantilla;
                app.thema.model = d[0];
                app.thema.color = d[1];
            }

            app.init();
            app.menuIndex = 0;
            var menu = app.loadMenu(-1);
            app.$nav_bar.append(menu);
            app.$menu_li = $("#main-nav > ul > li");

            var redirect = window.location.href.split('#')[1];
            if (redirect) {
                pageload(redirect);
                return;
            }

            if (!initHistory()) {
                app.module("mod"+ app.home);
            }
            //app.loader.css({background: "none"});
        },

        loadMenu: function (parent_id) {
            var addClass, menu  = "", menu_li = "", addClassLi, addClassA, addAttrs;
            if (parent_id == -1)
                addClass = "navbar-nav justify-content-end list-hover-line mt-3";
            else
                addClass = "dropdown-menu";

            var children = app.nodeTree[parent_id].list;

            if (children && children.length > 0) {

                for(var i in children) {
                    var pos = children[i];
                    var idat = app.nodeList[pos], data = {}, submenu = "";
                    data.node_id = idat[app.node.id];
                    data.name = idat[app.node.name];
                    data.oculto = idat[app.node.show];
                    if(data.oculto=="0"){
                        /* if (idat[app.node.sicontent])
                         data.content = parseInt(idat[app.node.sicontent]);*/

                        if (data.node_id == config.mod.galeria || data.node_id == config.mod.ayuda) {
                            submenu = app.loadMenu(data.node_id);
                            if(!submenu) continue;
                        }

                        if (submenu.trim()) {
                            addClassLi = " dropdown ";
                            addClassA = " dropdown-toggle ";
                            addAttrs = ' data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false" ';
                        } else {
                            addClassLi = "";
                            addClassA = "";
                            addAttrs = "";
                        }

                        addAttrs += ' data-id="' + data.node_id + '"';
                        module = data.node_id;
                        if(!app.home){
                            app.home = module;
                        }

                        var options = app.getMenuOptions(module, idat);
                        if (options){
                            if(addClassA)
                                options.class+= " "+ addClassA;

                            var icon = options.icon;
                            delete options.icon;

                            var myAattrs = addAttrs;
                            $.each(options, function(index, value){
                                myAattrs +=' ' + index+'="' + value + '"';
                            });

                            menu_li += "<li class=\"nav-item " + addClassLi + " \"><a" + myAattrs +"><i class=\"fa " + icon + "\"></i> <span>" + data.name + "</span></a>" + submenu + "</li>";

                        }
                    }
                };
                if(menu_li){
                    menu = '<ul class="' + addClass + '">' + menu_li + "</ul>";
                }
            }

            return menu;

        },
        getMenuOptions:function(nodeID, idat) {

            var metadata = idat[app.node.metadata];
            if(metadata){
                metadata = $.parseJSON(metadata);
            }else{
                metadata ={};
            }

            if(!metadata || !metadata.href) {
                metadata.href = "fuentes/" + config.producto + "/contenido/" + nodeID +".html";
            }

            metadata.id = "mod" + nodeID;
            if(!metadata.class) metadata.class = "";
            metadata.class+= "nav-link" ;

            if(metadata.external){
                delete metadata.external;
                metadata.class+= " noajax";
                metadata.target="_blank";
                if(!metadata.icon)metadata.icon = "fa-file-text";
            }

            if(app.home == nodeID){
                metadata.icon = "fa-home";
            }

            return metadata;

       },

        fullScren: false,

        loadStruct: function () {

            app.get(app.urlData + '/struct.dat', function (result) {
                struct = $.parseJSON(result);
                app.nodeTree = new Array();
                app.nodeList = struct;
                n = {};
                totalp = 0;
                $.each(struct, function (i, d) {
                    id = d[app.node.id];
                    padre = d[app.node.parent];

                    if (!app.nodeTree[id]) {
                        app.nodeTree[id] = {};
                    }
                    if (!app.nodeTree[padre]) {
                        app.nodeTree[padre] = {};
                    }
                    if (!app.nodeTree[padre].list) {
                        app.nodeTree[padre].list = new Array();
                    }
                    app.nodeTree[id].pos = i;
                    app.nodeTree[padre].list.push(i);

                    // si tiene contenido y no es plantilla => procedo a
                    // contarlo
                    if (parseInt(d[app.node.sicontent])
                        && parseInt(d[app.node.parent]) != -2) {
                        app.nodeTree[id].posPag = totalp;
                        totalp++;
                        temario.pag.nodes.push(i);
                    }

                });
                temario.pag.total = totalp;

                //nsgaleria.init();
                app.loadIndex();

            });
        },
        postLoadHome: function () {
            app.refreshPag();
            if (true == false && !app.fullScren && config.datosProd.checkPresenInicio == "on" && !app.storage('closePresent')) {
                var present = "present.html";
                //window.open(present);
                //app.loadWindow(present,{width:750,height:550,title:"Presentaci&oacute;n"});

                //$("#fullScren",cpoPag).load(present);
                app.get(present, function (result) {
                    app.fullScren = $('<div id="fullScren"></div>').appendTo(document.body);
                    app.fullScren.html(result);
                });
            }

        },
        loadTpl: function (name, url) {

            return $.ajax({
                url: url,
                contentType: "text/plain",
                crossDomain: true,
                dataType: "text"
            })
                .done(function (resp, textStatus, result) {
                    $.template(name, result.responseText);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {

                    alert(textStatus);
                });

        },

        saveHistory: function (data) {
            if (!app.fromHistory) {
                //var data = {state: app.lastState, url: accion};
                var json = JSON.stringify(data);
                var state = btoa(json);
                app.lastState = state.replace(/\=/g, "")
                History.pushState(data, null, URL_SEARC + "state=" + state);
            }
        },
        storageRemove: function (key) {
            //window.localStorage.removeItem(key);
            window.sessionStorage.removeItem(key);
            //window.sessionStorage.setItem(key, null);
        },
        storage: function (key, value) {
            if (value) {
                window.sessionStorage.setItem(key, value);
                //window.localStorage.setItem(key, value);
                //$.cookie(key, value);
            } else {
                return window.sessionStorage.getItem(key);
                //return window.localStorage.getItem(key);
                //  return $.cookie(key);
            }
        },
        swipedApp: function (action) {

            var index = app.$menu_li.find("a.active").parent().index();

            if (action == "prev") {
                if (index > 0)
                    index--;
            } else {
                if (index < app.$menu_li.length + 1)
                    index++;
            }
            if (index == -1) index = 0;
            $("a", app.$menu_li[index]).click();
        },
        linkImgOpen: function (e) {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var items = [];
            var anchor = e.currentTarget;
            var title = anchor.getAttribute("title");
            var img = $("img", anchor);
            if (title) {
                var tmp = title.split('[sep]');
                title = "<h2>" + tmp[0] + "</h2>";
                if (tmp[1])
                    title += tmp[1];
            }
            $window = $(window);
            $h = $window.height();
            $w = $window.width();
            if (img.length) {
                img = img[0];
                $rh = $h / img.offsetHeight;
                $rw = $w / img.offsetWidth;
                $rr = $rh > $rw ? $rw : $rh;
                $rr = Math.round($rr) + 1;
                $w = img.offsetWidth * $rr;
                $h = img.offsetHeight * $rr;
            }
            items.push({
                src: anchor.getAttribute("href"),
                //msrc: img.getAttribute("src"),
                w: $w,
                h: $h,
                title: title
            });

            var options = {
                index: 0, // start at first slide,
                history: false,
                shareEl: false,
                // fullscreenEl:false,
                //zoomEl:true,
                //showAnimationDuration: 0,
                //hideAnimationDuration: 0
                maxSpreadZoom: 3,
                /* getDoubleTapZoom : function (isMauseClick, item){
                 if(isMauseClick){
                 return 2;
                 }
                 }*/
            };

            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        },
		share: function(el){
			alert("hola");
		}
    }
	
}();

function swipedEvent() {
    document.addEventListener('swiped-left', function (e) {
            initSwiped("next", e);
        }
    );

    document.addEventListener('swiped-right', function (e) {
        initSwiped("prev", e);
    });
}

function initSwiped(action, e) {
    if (app.moduleActive == "mod" + config.mod.contenido) {
        temario.swiped(action);
    } else {
        // para navegar entre item del menu superior
        /* if ($(e.path).filter(".nav").length == 0)
             app.swipedApp(action);*/
    }
}

function initHistory() {

    var is_state = false;
    if (URL_SEARC = window.location.search) {
        URL_SEARC += "&";
        var pos = URL_SEARC.indexOf("&state");
        if (pos != -1) {
            var query = parseQueryString(URL_SEARC);
            var state = query["state"];
            loadState(state);
            URL_SEARC = URL_SEARC.substring(0, pos) + "&";
            is_state = true;
        }
    } else {
        URL_SEARC += "?";
    }

    History.Adapter.bind(window, 'statechange', function (event) { // Note: We are using statechange instead of popstate
        var State = History.getState();
        var query = parseQueryString(window.location.search);
        var state = query["state"];
        if (state != app.lastState) {
            app.lastState = state;
            if (state) {
                loadState(state);
                History.log('statechange:', State.url, State.data, State.title);
            } else {
                //location.reload();
                app.module("mod" + app.home);
            }
        }
    });
    return is_state;
}

function loadState(state) {
    var data = JSON.parse(atob(state));
    var module = data.module;
    var call = data.call;
    var params = data.params;

    if (module && call) {
        app.fromHistory = true;
        this[module][call].apply(this, params);
        app.fromHistory = false;
    } else {
        location.reload();
    }
}

function getIdGaleria(nombre) {
    if (nombre == "imagenes")
        return config.imagen.id;
    if (nombre == "videos")
        return config.video.id;
    if (nombre == "sonidos")
        return config.sonido.id;
    if (nombre == "complementos")
        return config.complemento.id;

}

/*
*  return {
                        "href": metaDat.url,
                        "addClass": "noajax",
                        "addAttrs": " target=\"_blank\" ",
                        "icon": "fa-file-text"
                    };
* */


$(document).ready(
    function () {
        app.urlprod = 'fuentes/' + config.producto;
        app.urlData = app.urlprod + "/data";
        Modal.init();
        $.when(app.loadTpl("coleciones", "model/admin/colecciones.tpl.html"))
            .then(function () {
                if (config.producto) {
                    app.loadStruct();

                } else {
                    app.init();
                    $.tmpl("coleciones", {products: products}).appendTo(app.targetLoad);
                    //app.loader.css({background: "none"});
                }
            })

    }
);


function isJson(data) {
    return (/^[\],:{}\s]*$/
        .test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
            .replace(/(?:^|:|,)(?:\s*\[)+/g, "")));
}

function isMovil() {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true;
    } else {
        return false;
    }
}

function stripHTML(html) {
    var re = /(<([^>]+)>)/gi;
    if (html)
        return html.replace(re, "");
    return "";
}

function PantallaCompleta(url) {
    var optionsRep = {width: 750, height: 550, path: url};
    execAnime(optionsRep);
    $(".animacion", "#iniMediaPresent").hide();

    /* var w = window.open();
     var html = $("#toNewWindow").html();
     $(w.document.body).html(html);*/
}


function pageload(accion) {

    if (!accion) {
        app.module('mod' + app.home);
    } else if (accion.search("js:") != -1) {
        accion = accion.replace("js:", "");
    }
    var a = accion.split('/');
    var nm = a.slice(0, 1);
    var nf = a.slice(1, 2);
    var param = a.slice(2); // window[a[0]] //para el modulo
    // app[nf](param.join());// para llamar una funcion(nf) dinamicamente del
    // objeto(cnt)
    if (accion && window[nm] && window[nm][nf]) {
        window[nm][nf](param.join('/'));
    } else {
        home.loadHome();
    }
};

function redimencion() {

    var alto = window.innerHeight;
    var sumarBanner = 100, dimcont = 73;

    // mincont = alto - sumarBanner - dimcont;

    $('.full-height').css('min-height', alto - sumarBanner);

    setTimeout("redimencion()", 1000);
}

function parseQueryString(queryString) {
    if (!queryString) {
        return false;
    }

    var queries = queryString.split("&"), params = {}, temp;

    for (var i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        if (temp[1] !== '') {
            params[temp[0].replace(/\?/g, "")] = temp[1];
        }
    }
    return params;
}


var Modal = function () {

    return {
        el: null, body: null, title: null, footer: null, callbackAccept: null,
        init: function () {
            this.el = $("#myModal");
            this.body = $(".modal-body", this.el);
            this.title = $(".modal-title", this.el);
            this.footer = $(".modal-footer", this.el);

            $el = this.el;
            this.el.on('click', ".accept", function (e) {
                if (Modal.callbackAccept)
                    Modal.callbackAccept();
                $el.modal("hide");
            });
        },
        show: function (body, title, callbackAccept) {

            if (!title) title = "Informaci&oacute;n";

            this.title.html(title);
            this.body.html(body);

            this.el.modal("show");

            if (callbackAccept) {
                this.footer.show();
                this.callbackAccept = callbackAccept;
            } else {
                this.footer.hide();
            }

            Ejercitador.setAttrPath("src", this.body);
            Ejercitador.setAttrPath("href", this.body);

            return this.el;

        }
    }
}();

