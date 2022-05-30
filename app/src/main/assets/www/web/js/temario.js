/*function pageload(funcion) {
 if(funcion){
 var a=funcion.split('/');
 var nf=a.slice(0,1);
 var param=a.slice(1);
 temario[nf](param.join());// para llamar una funcion(nf) dinamicamente del objeto(temario)
 }
 };*/

var temario = function () {

    return {
        view: "model/contenido/index.html",
        tplDefault: "model/contenido/page.tpl.html",
        currentTplHTml: "",
        currentTplId: 0,
        //current_template:'default',
        pag: {   // paginado
            actual: -1, // posicion del elemento actual
            total: 0, // cantidad total de nodos con contenido
            nodes: [],
            orientation: "left" //left or rigth
        },
        creado: false,
        init: function () {
            $('embed').css('visibility', 'hidden');
            temario.loadTree(false);
            app.refreshPag();
            temario.pag.actual = -1;
        },

        loadTree: function (e) {

            var idNode, addClass, parent_id, addClass, addClassLi;

            if (e) {
                e.preventDefault();
                e.stopPropagation();
                if ($(e.target).hasClass("libro")) return;

                idNode = parseInt(e.currentTarget.id);
                addClass = "subtemas";
                addClassLi = "";
                parent_id = idNode + '_tema';
            } else {
                idNode = config.mod.contenido;
                addClass = "list-group flex-column";
                addClassLi = "list-group-item list-group-item-action";
                parent_id = "temarioList";
            }


            /*verificar si se tiene que cargar los datos o solo mostrar o ocultar*/
            var $parent = $('#' + parent_id);
            if ($parent.length == 0) return;

            var items_ui = $("ul.subtemas", $parent)
            if (items_ui.length > 0) {
                //$subtema.delay(10).slideToggle();
                if ($parent.hasClass("show")) {
                    $parent.removeClass("show");
                    //$("ul.subtemas",$parent ).attr("style","margin-top:inherit");
                } else {
                    $parent.addClass("show");
                }

                return;
            }

            $.template('liTpl', '<li class="' + addClassLi + ' py-1 tema ${addClass}" id="${node_id}_tema">' +
                '<a  href="" id="${node_id}_link">${name}</a></li>');

            /*cargar temario y subtemario*/

            var children = app.nodeTree[idNode].list;

            if (children && children.length > 0) {

                var items_ui = $('<ul class="' + addClass + '">').appendTo($parent);
                $parent.addClass("show");

                $.each(children, function (i, pos) {

                    var idat = app.nodeList[pos], data = {};
                    data.node_id = idat[app.node.id];
                    data.name = idat[app.node.name];
                    data.content = parseInt(idat[app.node.sicontent]);

                    if (!app.nodeTree[data.node_id].list || app.nodeTree[data.node_id].list.length == 0) {
                        data.addClass = "";
                    } else {
                        data.addClass = "is_parent";
                    }

                    $.tmpl('liTpl', data).appendTo(items_ui);

                    if (data.content) {
                        var libro = ' <i title="Mostrar Contenido" class="libro fa fa-book"></i>';
                        $('#' + data.node_id + '_tema').append(libro);
                    }

                });

            } else {
                $parent.find('.libro').click();
            }

        },

        swiped: function (action) {

            if (temario.pag.actual == -1) {
                if (action == "next")
                    action = "first";
                else {
                    app.swipedApp("prev");
                    return;
                }
            } else if (temario.pag.actual == 0) {
                if (action == "prev"){
                    app.module("mod1");
                    return;
                }
            }
            if (temario.pag.actual == temario.pag.total - 1) {
                app.swipedApp("next");
                return;
            }
            var id_tema = temario.pager(action, true);
            if (id_tema) {
                temario.showPage(id_tema);
            }
        },
        navegation: function (targetLoad) {

            $("a.page-link", targetLoad).on('click', function (e) {
                e.preventDefault();
                // if (!e.isDefaultPrevented()) {
                var action = $(e.currentTarget).data("action");
                var id_tema = temario.pager(action, true);

                if (id_tema) {
                    temario.showPage(id_tema);
                }
                //}
            });
        },

        pager: function (action, fromInterfas) {

            var position = temario.pag.actual;
            var orientation;

            switch (action) {
                case 'first':
                    position = 0;
                    orientation = "right";
                    break;

                case 'prev':
                    if (position > 0) {
                        position--;
                    }
                    orientation = "right";
                    break;

                case 'next':
                    if (position >= (temario.pag.total - 1)) {
                        position = 0;
                    } else {
                        position++;
                    }
                    orientation = "left";
                    break;
                case 'last':
                    position = temario.pag.total - 1;
                    orientation = "left";
                    break;
                case 'up':
                    app.module("mod1"); // temario
                    return false;
                    break;
            }
            if (fromInterfas) {
                temario.pag.actual = position;
                temario.pag.orientation = orientation;
            }

            var pos = temario.pag.nodes[position];
            if (pos && pos > 0) {
                var d = app.nodeList[pos];
                return d[app.node.id];
            }

            return 0;
        },

        getTema: function (id_tema) {

            var pathurl = app.urlprod + '/contenido/';

            $.get(pathurl + id_tema + '.html', function (resp, textStatus, result) {
                temario.render(id_tema, result.responseText);
            });

            app.selectOp("mod1");//temario1
            app.saveHistory({
                "module": "temario",
                "call": "showPage",
                "params": [id_tema]
            });
        },

        getDataTema: function (id_tema) {
            var n = app.nodeTree[id_tema];
            return app.nodeList[n.pos];
        },

        render: function (id_tema, html) {

            var n = app.nodeTree[id_tema];
            var d = app.nodeList[n.pos];
            temario.pag.actual = n.posPag;

            var data = {};
            data.id_tema = id_tema;
            html = glosario.parseFireWord(html);
            data.content = html;

            var padrePosition = app.nodeTree[d[app.node.parent]].pos;

            if (padrePosition > 1) {
                var padre = app.nodeList[padrePosition];
                data.parentTitle = padre[app.node.name];
                data.title = d[app.node.name];
            } else {
                data.parentTitle = d[app.node.name];
                data.title = "";
            }
            data.pager = (temario.pag.actual + 1) + '/' + temario.pag.total;
            data.pagerSize = config.datosProd.pager_size?config.datosProd.pager_size: "full"; //full or min

            var id_tema_prev = temario.pager("prev", false);
            if(id_tema_prev){
                var d_prev = temario.getDataTema(id_tema_prev);
                data.prev = d_prev[app.node.name];
            }


            var id_tema_next = temario.pager("next", false);
            if(id_tema_next){
                var d_next = temario.getDataTema(id_tema_next);
                data.next = d_next[app.node.name];
            }


            app.targetLoad.html("");
            $.tmpl("contentTpl", data).appendTo(app.targetLoad);

            var pageContent = $("#content_body");
            var fromClass = "from_left";
            if (temario.pag.orientation == "right")
                fromClass = "from_right";

            pageContent.removeClass();
            pageContent.addClass(fromClass);
            setTimeout(function () {
                pageContent.addClass("page_show");
            }, 10);

            // $('#textoContenido').show('clip');
            app.refreshPag(app.targetLoad);
            temario.navegation(app.targetLoad);

            window.scrollTo(0, 0);
        },

        selectWook: function (e) {
            e.preventDefault();
            var padre = $(e.currentTarget).parent();
            temario.showPage(padre.attr('id'));
        },

        /*seleccionar un tema del menu*/
        showPage: function (idShow) {

            var id_tema = parseInt(idShow);

            if (idTpl = d[app.node.tpl]) {	// si tiene plantilla
                urlTpl = pathurl + idTpl + '.html';
            } else {
                idTpl = -1;
                urlTpl = temario.tplDefault; // plantilla por defecto
            }

            if (idTpl != temario.currentTplId) { // si la plantilla que se desea cargar es la misma que la ultima cargada, no hay que volverla a cargar

                temario.currentTplId = idTpl;

                $.when(app.loadTpl("contentTpl", urlTpl))
                    .then(function () {
                        temario.getTema(id_tema);
                    })

            } else {
                temario.getTema(id_tema);
            }
        },
        LoadEjerFormHtml: function (txt) {
            var reg = new RegExp("<s*ejercicio[^>]*>(.*?)<s*/s*ejercicio>", "g"), html;
            var reg2 = new RegExp("<s*llave[^>]*>(.*?)<s*/s*llave>", "g");
            // var html = txt.replace(reg, ' <input type="text" name="valores[]" class="form-control" /> ');

            var matches = txt.match(reg);
            for (var i in matches) {
                var matches2 = matches[i].match(reg2);
                for (var j in matches2) {
                    var id = matches[j];
                    console.log(matches[id]);
                }
            }
            return html;
        }

        , initEjerCnt: function (mytarget) {
            $ejercicios = $("ejercicio", mytarget);
            temario.initNextEjerCnt($ejercicios, 0);
        },

        initNextEjerCnt: function ($ejercicios, pos) {
            if ($ejercicios.length > pos) {
                $el = $($ejercicios[pos]);
                ejer.loadEjercicioIdFromExternalAsc($el.attr("id"), $el, function () {
                    temario.initNextEjerCnt($ejercicios, ++pos);
                });
            }
        },

        showEjercicio: function (idPregunta) {
            ejer.showEjercicio(idPregunta, function (resp) {
                /*if(resp==1){
                 alert("corrrecta");
                 }else{
                 alert("mal");
                 }*/
            });
        },
    }

}();

$(document).ready(function () {

    app.loadTpl("creditos", "model/admin/creditos.tpl.html");

    var body = $('body');
    body
        .on('click', '#temarioList .tema', temario.loadTree)
        .on('click', "#temarioList .libro", temario.selectWook);

});




