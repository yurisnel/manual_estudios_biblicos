var glosario = function () {

    return {
        view: "model/glosario/index.html",
        term: {id: 0, title: 1, caliente: 2, cat: 3},  // posiciones de los datos en el json
        data: new Array(),  // listado de terminos
        fireWords: new Array(),  // listado de plabras calientes
        index: new Array(),   // indexacion de los terminos (idtermino=>posicion en data)
        init: function (targetLoad) {

            if (!targetLoad) {
                targetLoad = app.targetLoad;
            }

            glosario.mytarget = targetLoad;

            glosario.title = $("#glosario_termino", targetLoad);
            $.template('terminoLiTpl', '<li  class="nav-item"><a class="nav-link" href="#" id="${id_termino}term">${termino}</a></li>');

            var textBuscar = $('#glosario_buscar', targetLoad);
            var form_bus_term = $('#form_bus_term', targetLoad);
            form_bus_term.submit(glosario.submitform);

            textBuscar
                .focus(function () {
                    if (this.value == 'Buscar...')
                        this.value = '';
                })
                .blur(function () {
                    if (this.value == '')
                        this.value = 'Buscar...';
                })
                .keypress(function () {
                    $('#form_bus_term').submit();
                });


            // evento de la lista de terminos
            $("body").on('click', "#glosarioTerm li a", glosario.showTermino);

            // evento del combo
            $('#selecCateg', targetLoad).change(function () {
                textBuscar.val("");
                form_bus_term.submit();
            });

            /* $.when( glosario.loadGlosario())
             .done( glosario.loadCategorias );*/

            glosario.loadGlosario();
            setTimeout(glosario.loadCategorias, 100);

            //glosario.loadGlosario(glosario.loadCategorias);


        },
        loadGlosario: function () {

            if (glosario.data.length == 0) {

                //ownDeferred = $.Deferred();
                return $.get(app.urlData + "/glosario.dat", function (resp, textStatus, result) {

                    resp = $.parseJSON(result.responseText);

                    $.each(resp, function (i, dat) {
                        idt = parseInt(dat[glosario.term.id]);
                        icat = dat[glosario.term.cat];
                        caliente = dat[glosario.term.caliente];
                        if (!glosario.data[icat]) {
                            glosario.data[icat] = new Array();

                        }
                        if (!glosario.index[idt]) {
                            glosario.index[idt] = new Array();
                        }
                        glosario.data[icat].push(dat);
                        glosario.index[idt][0] = icat; // 0=> id categoria
                        glosario.index[idt][1] = glosario.data[icat].length - 1;  // 1=> posicion en la lista (data)

                        if (parseInt(caliente) == 2) {
                            glosario.fireWords.push(dat);
                        }
                    });

                });
                //return  ownDeferred.promise();
            }
        },

        parseFireWord: function (html) {
            //var textos_sin_etiquetas_html = /(<.*?>)?([^<]*)/gi;
            var textos_sin_etiquetas_html = new RegExp(">([^<]){2,}<", "g");


            for (var i in glosario.fireWords) {
                var dat = glosario.fireWords[i];
                var word = dat[glosario.term.title];
                var id_termino = dat[glosario.term.id];
                // hay que escapar los caracteres especiales como son: ( ) /
                //word = addcslashes(word, "()/");
                word = helper.escapeHtml(word);
                // \b- para que se exacatamente y no parte de la palabra
                //var patron = "/\b" + word + "\b/gi";
                var patron = new RegExp("(" + word + ")", "gi");

                var reemplazo = ' <a href="glosario/termino/' + id_termino + '" title="' + helper.ucwords(word) + '"   class="fireWord">$1</a> ';

                //XRegExp.replace(html,textos_sin_etiquetas_html ,function (text) {
                html = html.replace(textos_sin_etiquetas_html, function (text) {
                    text = text.replace(patron, reemplazo);
                    return text;
                });
            }
            return html;
        },
        loadCategorias: function () {
            var glosario = app.nodeTree[config.mod.glosario];
            $.each(glosario.list, function (i, pos) {
                dat = app.nodeList[pos];
                $("#selecCateg").append(
                    '<option value="' + dat[app.node.id] + '">'
                    + dat[app.node.name] + '</option>');
            });

            // ejecutar el primero si existe
            if ($("#selecCateg option").length > 0) {
                sel = $("#selecCateg")[0];
                sel.options[0].selected = true;
                $('#form_bus_term').submit();
            }
        },
        submitform: function (e) {
            e.preventDefault();
            //con la libreria form
            // var datos=$(e.target).formToArray()

            // sin la libreria form
            // var datos=$.param($(e.target.elements).toArray());

            var catSelect = $("#selecCateg").val();
            var buscar = $("#glosario_buscar").val();
            var ul = $('#glosarioTerm');
            ul.empty();

            for (idCat in glosario.data) {
                if (!catSelect || idCat == catSelect) {

                    list = glosario.data[idCat];
                    for (el in list) {
                        idat = list[el];

                        idterm = idat[glosario.term.id];
                        title = idat[glosario.term.title];

                        expresion = new RegExp(buscar.toLowerCase());

                        if (buscar == "Buscar..." || expresion.test(title.toLowerCase())) {
                            var dat = {
                                id_termino: idterm,
                                termino: title
                            };

                            $.tmpl("terminoLiTpl", dat).appendTo(ul);
                        }
                    }
                }
                if (idCat == catSelect) // si selecciona una categoria no seguir mostrando terminos de la demas categorias
                    break;
            }
            glosario.primerTermino();
        },
        primerTermino: function () {
            var li = $('#glosarioTerm li a');

            if (li.length > 0) {
                $(li[0]).click();
            }
        },
        showTermino: function (e) {
            var $glosario_centro = $('#glosario_centro');
            if (glosario.selecAct)
                glosario.selecAct.removeClass('active');

            glosario.selecAct = $(e.currentTarget);
            $(e.currentTarget).addClass('active');

            var idt = parseInt(e.currentTarget.id);
            if (idt) {

                $glosario_centro.removeClass("page_show");
               // $glosario_centro.addClass("from_left");
               setTimeout(function () {
                    $glosario_centro.addClass("page_show");
                }, 200);

                var pathurl = app.urlprod + '/termino/' + idt + ".html";
                $glosario_centro.load(pathurl, function () {
                    app.refreshPag($glosario_centro);
                    glosario.title.html(glosario.selecAct.html());
                    $glosario_centro.addClass("page_show");
                });

            } else {
                $glosario_centro.html("Sin Descripci&oacute;n");
            }

        },
        searchTermino: function (idt) {

            if (glosario.index[idt]) {
                d = glosario.index[idt];
                return glosario.data[d[0]][d[1]];

            }
            return false;
        },
        showModalTermino: function (idt, title) {
            var data = glosario.searchTermino(idt);
            if (data) {
                var loadUrl = app.urlprod + '/termino/' + idt + ".html";

                app.get(loadUrl, function (result) {
                    var modal = Modal.show(result, title);
                    app.refreshPag(modal);
                });
            }
        }

    }
}();

$(document).ready(
    function () {
        glosario.loadGlosario();
    });