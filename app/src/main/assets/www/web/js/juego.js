var nsjuego = function () {

    return {
        view: nsgaleria.view,
        data: new Array(),
        tipos: new Array(),
        cuerpos: new Array(),
        ejer: new Array(),
        tipo: {id: 0, tipo: 1},
        game: {id: 0, tipo: 1, cat: 2, title: 3},
        cuerpo: {idJuego: 1},

        init: function () {
            $.when(nsjuego.loadData())
                .then(function (e) {
                    var links = nsgaleria.createMenu(config.mod.juego);
                    if (links && links.length > 0)
                        $(links[0]).click();
                });
        },
        loadData: function () {
            var ownDeferred = $.Deferred();

            if (!nsjuego.loaded) {
                var ajax1 = $.Deferred();
                $.getJSON(app.urlData + '/tipo_juego.dat', function (result) {
                    $.each(result, function (i, dat) {
                        nsjuego.tipos[dat[nsjuego.tipo.id]] = dat[nsjuego.tipo.tipo];
                    });
                    ajax1.resolve();
                });
                var ajax2 = $.Deferred();
                $.getJSON(app.urlData + '/juegos.dat', function (result) {
                    //result=$.parseJSON(result);
                    //0:id_juego 1:id_tipo_juego 2:id_elemento 3:enunciado 4:max_intento 5:nivel_complejidad
                    $.each(result, function (i, dat) {

                        idcat = dat[nsjuego.game.cat];
                        idjuego = dat[nsjuego.game.id];
                        if (!nsjuego.data[idcat]) {
                            nsjuego.data[idcat] = new Array();
                        }
                        nsjuego.data[idcat][idjuego] = dat;
                    });
                    ajax2.resolve();
                });

                var ajax3 = $.Deferred();
                $.getJSON(app.urlData + '/cuerpo_juego.dat', function (result) {
                    //para el ahorcado 0:id_cuerpo,1:id_juego,2:pregunta,3:respuesta
                    $.each(result, function (i, datCuerpo) {
                        idJuego = datCuerpo[nsjuego.cuerpo.idJuego];
                        if (!nsjuego.cuerpos[idJuego]) {
                            nsjuego.cuerpos[idJuego] = new Array();
                        }
                        nsjuego.cuerpos[idJuego].push(datCuerpo);
                    });
                    ajax3.resolve();
                });

                var ajax4 = $.Deferred();
                $.getJSON(app.urlData + '/juego_ejer.dat', function (result) {
                    //para el espiral 0:id_juego,1:id_ejercicio
                    $.each(result, function (i, dat) {

                        if (!nsjuego.ejer[dat[0]]) {
                            nsjuego.ejer[dat[0]] = new Array();
                        }
                        nsjuego.ejer[dat[0]].push(dat);
                    });
                    ajax4.resolve();
                });

                $.when(ajax1, ajax2, ajax3, ajax4)
                    .then(function (e) {
                        nsjuego.loaded = true;
                        //if (callback) callback();
                        return ownDeferred.resolve();
                    });

                return ownDeferred.promise();

            } else {
                return ownDeferred.resolve();
            }
        }
        , loadModule: function (url, loadTarget) {
            if (!loadTarget) loadTarget = app.targetLoad;
            $(loadTarget).load(nsgaleria.view,
                function () {
                    nsgaleria.createMenu(config.mod.juego);
                    nsjuego.render(url, nsgaleria.target);
                });
        }
        , render: function (url, loadTarget) {
            $.when(nsjuego.loadData())
                .then(function () {
                    nsjuego.renderData(url, loadTarget);
                });
        }
        , renderData: function (url, loadTarget) {

            if (!loadTarget) loadTarget = nsgaleria.target;
            var $loadTarget = $(loadTarget);

            $loadTarget.empty();

            var param = url.split('/');

            var data = {
                href: '', src: '', title: '', tipo: '', id_juego: ''
            };


            var idCatjuego = param[0];
            var store = nsjuego.data[idCatjuego];
            var title, typeId;
            var pos = 0;
            var classAdd = "";

            var cant =0;
            $.each(store, function (i, idat) {

                if (Array.isArray(idat)) {
                    typeId = idat[nsjuego.game.tipo];
                    switch (parseInt(typeId)) {
                        case 1:
                            data.type = "fa-spoon";
                            classAdd = "sopa";
                            break;
                        case 2:
                            data.type = "fa-street-view";
                            classAdd = "ahorcado";
                            break;
                        case 3:
                            data.type = "fa-bullseye";
                            classAdd = "espiral";
                            break;
                    }


                    title = idat[nsjuego.game.title];
                    title = title.replace('<br mce_bogus="1">', '');
                    title = title.replace(/'/g, "\&#39");	 //comillas simples
                    title = title.replace(/"/g, "\&#34");	// comillas dobles

                    if (!title) title = "Sin enunciado";

                    data.title = "[sep]"+title;

                    //data.name = stripHTML(title);
                    data.name = nsjuego.tipos[typeId].toLowerCase() + " " ;
                    data.node_id = idat[nsjuego.game.id];

                    data.linkclass = "execGame " + classAdd;
                    data.href = "#";

                    var item = $.tmpl("item_media", data);
                    item.appendTo($loadTarget);

                    setTimeout(function () {
                        item.addClass("show");
                    }, 200 * (pos++));
                }
            });

            $(function () {
                $('.tip').Tooltip({
                    track: true,
                    delay: 0,
                    showURL: false,
                    showBody: "[sep]"
                });
            });

            $(".execGame").click(function (e) {
                e.preventDefault();
                var $el = $(this);
                nsjuego.idJuegoSelect = $el.data("id");
                //nsjuego.juego=new Array();
                nsjuego.juego = nsjuego.cuerpos[nsjuego.idJuegoSelect];


                if ($el.hasClass("espiral")) {
                    url = "model/juego/espiral.html";
                } else if ($el.hasClass("ahorcado")) {
                    url = "model/juego/ahorcado.html";
                } else if ($el.hasClass("sopa")) {
                    url = "model/juego/sopa.html";
                }

                app.window = window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,fullscreen=yes');
                title = this.title;//Nuevo
            });

        },
        load: function (target) {

            $(target).find('juegos').each(function (i, gal) {
                var link = $(this).find('llave');
                nsjuego.render(link.html(), $(this).parent());
            })
        }
    }
}
();


$(document).ready(function () {

    $('a.catJuego').on('click', function (e) {
        e.preventDefault();
        app.selectOp();//para limpiar modulo seleccionado
        app.saveHistory('nsjuego/cargar/' + $(e.currentTarget).attr('href'));
        nsjuego.render($(e.currentTarget).attr('href'), app.targetLoad);

        //objCrhea.load(app.targetLoad);
    });
    //nsjuego.init();
});


