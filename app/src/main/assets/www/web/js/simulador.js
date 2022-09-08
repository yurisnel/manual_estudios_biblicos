//$("#op_intervalo").css("display",'');
var sim = function () {

    return {
        view: "model/ejercicio/index.html",
        simulaciones: new Array(), // simulaciones por categoria
        simulaciones_list: new Array(),
        escena_list: new Array(), // Escenas indexados por idesc
        escenas_sim: new Array(), //Escenas de cada simulacion
        escena_cuerpo_list: new Array(), // cuerpos de escenas indexados por idesc
        ruta_list: new Array(), // rutas de escenas indexadas idcuerpo => idesc
        //traza_ruta_list: new Array(), // retroalimentacion de los items(seleccion simple) indexados por id_cuerpo

        sim: {idsim: 0, id_elemento: 1, nombre_sim: 2, enunciado: 3, estado: 4, max_intentos: 5},
        escena: {idesc: 0, idsim: 1, inf_escena: 2, nombre: 3, tipo: 4},
        cuerpo: {idcuerpo: 0, idesc: 1, text: 2, utilidad: 3, inf_apoyo: 4},

        init: function (targetLoad) {
            sim.mytarget = targetLoad;
            if (!targetLoad) {
                sim.mytarget = app.targetLoad;
            }

            var datSim = JSON.parse(app.storage('datosSim'));

            if (datSim && datSim.length > 0) { // si ya comenzo el entrenamiento se carga el ejercicio en que se quedo

                if (sim.simulaciones.length == 0) {   // si no se han cargado los datos de los ejercicios
                    sim.loadData(sim.postInit);  // se cargan y luego se inicia el ejercicio en que se quedo
                } else {
                    sim.postInit();
                }
            } else     // si se cargara las categorias de ejercicio(configuracion del ejercitador)
            if (sim.simulaciones.length == 0) { // si no se han cargado los datos de los ejercicios
                sim.loadData(sim.createCategoria); // se cargan los datos y se se muestran las categorias
            } else {
                sim.createCategoria();
            }
        },

        postInit: function () {
            var pos = parseInt(app.storage('posSim'));
            sim.loadSimulacion(pos);
        },

        loadSimulacion: function (pos) {
            var datSim = JSON.parse(app.storage('datosSim'));
            var simulacion = datSim[pos];
            if (!simulacion) {
                //   alert("No existe la simulacion !!");
                return;
            }

            var sim_actual = simulacion['idsim'];

            var esc_actual = simulacion['id_escena'];
            if (!esc_actual) {
                esc_actual = sim.dameEscena(sim_actual, 'Escena inicial');
            } else {
                var max_intentos = sim.simulaciones_list[sim_actual][sim.sim.max_intentos];
                if (max_intentos != simulacion['intentos'])
                    esc_actual = sim.dameEscena(sim_actual, 'Escena inicial');
            }

            var camino = simulacion['camino'];

            if (!simulacion['ruta']) {
                simulacion['ruta'] = {};
                simulacion['ruta'][camino] = {};
            }

            simulacion['ruta'][camino]['nombre_escena'] = sim.escena_list[esc_actual][sim.escena.nombre];
            datSim[pos] = simulacion;
            var tmp = JSON.stringify(datSim);
            app.storage('datosSim', tmp);

            if (simulacion.termine == 1) {
                simAccion.simulacionTerminada();
                return;
            }

            if (simulacion.intentos == 0) {
                simAccion.haFallado(0);
                return;
            }

            var escena = sim.getEscena(esc_actual);
            escena.pager = (pos + 1) + '/' + helper.countNoEmpty(datSim);
            escena.pagerSize = config.datosProd.pager_size?config.datosProd.pager_size: "full"; //full or min

            var url = app.urlprod + '/simulacion/' + sim_actual + ".html";
            $.get(url, function (resp, textStatus, result) {
                escena.enunciado = result.responseText;
                var html = $.tmpl("escena_interior", escena);
                sim.mytarget.html(html);
                sim.eventosBtn(sim.mytarget);
                app.refreshPag(sim.mytarget);
            });
        },

        getSimulacion: function (idSim) {
            var simulacion = sim.simulaciones_list[idSim];
            var idCat = simulacion[sim.sim.id_elemento];
            var dat = {
                idSim: idSim,
                idCat: idCat,
                categoria: app.nodeList[app.nodeTree[idcat].pos][app.node.name],
                enunciado: simulacion[sim.sim.enunciado],
                items: []
            };
            return dat;
        },
        getEscena: function (idEsc) {
            var escena = sim.escena_list[idEsc];
            var idesc = escena[sim.escena.idesc];
            var idSim = escena[sim.escena.idsim];

            var dat = sim.getSimulacion(idSim);
            dat.id_esc = parseInt(idesc);
            dat.inf_escena = escena[sim.escena.inf_escena];
            dat.inf_escena = escena[sim.escena.inf_escena];

            var items = sim.escena_cuerpo_list[idesc], it;
            $.each(items, function (i, idat) {
                if (idat) {
                    it = {
                        id: idat[sim.cuerpo.idcuerpo],
                        text: idat[sim.cuerpo.text],
                        respuesta: idat[sim.cuerpo.inf_apoyo]
                    };

                    dat.items.push(it);
                }

            });

            return dat;
        },


        createCategoria: function () {
            Ejercitador.createCategoria(config.mod.simulador);
            sim.eventosTemario();
        },

        eventosTemario: function () {

            if ($('#btnSimula', sim.mytarget).hasClass('active')) {
                $('#configuraciones').css('display', "none");
                $('#escalas').css('visibility', "hidden");
            }

            $('#ver', sim.mytarget).off("click")
                .click(function (e) {
                e.preventDefault();
                var inputs = getInputChecked($(':checkbox'));
                if (inputs.length) {
                    sim.showListado();
                } else
                    Modal.show('Debe seleccionar al menos uno de los temas que est&aacute;n disponibles en la lista.', 'Aviso al usuario');
            });


            $('#btnSelec', sim.mytarget).off("click")
                .click(function () {
                var inputs = getInputChecked($(':checkbox'));
                if (inputs.length) {
                    sim.showListadoSelect();
                } else
                    Modal.show('Debe seleccionar al menos uno de los temas que est&aacute;n disponibles en la lista.', 'Aviso al usuario');
            });

            $('#btn_comenzar', sim.mytarget).off("click")
                .click(sim.comenzarEntranamiento);

        },

        comenzarEntranamiento: function () {

            var datosSim = Ejercitador.getDataForm(sim.simulaciones);

            if (datosSim.length == 0) {
                Modal.show("Debe seleccionar las simulaciones que desea realizar.", "Aviso!!!");
            } else {

                for (var i in datosSim) {
                    id = datosSim[i];
                    max_intentos = sim.simulaciones_list[id][sim.sim.max_intentos];
                    obj = {idsim: id, camino: 0, intentos: max_intentos};
                    datosSim[i] = obj;
                }

                // POR SI EXISTEN COOKIES CREADAS.
                app.storageRemove('respuestasSim');

                var tmp = JSON.stringify(datosSim);
                app.storage('datosSim', tmp);
                app.storage('posSim', "0"); // no se puede quitar la comilla

                sim.loadSimulacion(0);
            }
        },

        navegation: function (action) {

            var pos = parseInt(app.storage('posSim'));
            var datSim = JSON.parse(app.storage('datosSim'));
          //  var datSim = app.storage('datosSim').split(',');


            switch (action) {
                case 'first':
                    pos = 0;
                    break;
                case 'prev':
                    if (pos != 0)
                        pos--;
                    break;

                case 'next':
                    if (pos != (helper.countNoEmpty(datSim) - 1))
                        pos++;
                    break;

                case 'last':
                    pos = helper.countNoEmpty(datSim) - 1;
                    break;

                case 'up':
                    sim.terminar();
                    return;
            }
            if (datSim[pos]) {
                app.storage('posSim', pos);
                sim.loadSimulacion(pos);
            }

        },

        loadData: function (CallBack) {
            var ownDeferred = $.Deferred();
            var ajax1 = $.Deferred();
            $.getJSON(app.urlData + '/sim_principal.dat', function (resp, textStatus, result) {

                $.each(resp, function (i, idat) {
                    idcat = parseInt(idat[sim.sim.id_elemento]);
                    idsim = parseInt(idat[sim.sim.idsim]);
                    if (!sim.simulaciones[idcat]) {
                        sim.simulaciones[idcat] = new Array();
                    }
                    if (!app.nodeTree[idcat].cantEjer) {
                        app.nodeTree[idcat].cantEjer = 0;
                    }
                    app.nodeTree[idcat].cantEjer++;
                    sim.simulaciones[idcat].push(idsim);
                    sim.simulaciones_list[idsim] = idat;
                });

                ajax1.resolve();

            });
            var ajax2 = $.Deferred();
            //MODIFICAR ESTO REVISAR.
            $.getJSON(app.urlData + '/sim_escena.dat', function (resp, textStatus, result) {

                $.each(resp, function (i, idat) {
                    idsim = parseInt(idat[sim.escena.idsim]);
                    idesc = parseInt(idat[sim.escena.idesc]);
                    if (!sim.escenas_sim[idsim]) {
                        sim.escenas_sim[idsim] = new Array();
                    }

                    sim.escena_list[idesc] = idat;
                    sim.escenas_sim[idsim].push(idesc);
                });

                ajax2.resolve();
            });

            var ajax3 = $.Deferred();
            $.getJSON(app.urlData + '/sim_escena_cuerpo.dat', function (resp, textStatus, result) {

                $.each(resp, function (i, idat) {
                    idesc = parseInt(idat[sim.cuerpo.idesc]);
                    if (!sim.escena_cuerpo_list[idesc]) {
                        sim.escena_cuerpo_list[idesc] = [];
                    }
                    //sim.escena_cuerpo_list[idesc].push(idat);
                    idcuerpo = idat[sim.cuerpo.idcuerpo];
                    sim.escena_cuerpo_list[idesc][idcuerpo] = idat;

                    if (!sim.escena_list[idesc]['cu']) {
                        sim.escena_list[idesc]['cu'] = 0;
                    }

                    if (!sim.escena_list[idesc]['cn']) {
                        sim.escena_list[idesc]['cn'] = 0;
                    }

                    if (!sim.escena_list[idesc]['cn']) {
                        sim.escena_list[idesc]['cn'] = 0;
                    }

                    if (idat[3] == 1) {
                        sim.escena_list[idesc]['cu']++; // cantidad util
                    }
                    if (idat[3] == 3) {
                        sim.escena_list[idesc]['cn']++;  // cantidad neutra
                    }
                });

                ajax3.resolve();
            });

            var ajax4 = $.Deferred();
            $.getJSON(app.urlData + '/sim_ruta.dat', function (resp, textStatus, result) {

                $.each(resp, function (i, idat) {
                    sim.ruta_list[parseInt(idat[sim.cuerpo.idcuerpo])] = idat[sim.cuerpo.idesc];
                });
                ajax4.resolve();
            });

            $.when(ajax1, ajax2, ajax3, ajax4)
                .then(function (e) {
                    if (CallBack) CallBack();
                    return ownDeferred.resolve();
                });

            return ownDeferred.promise();
        },

        dameEscena: function (idsim, tipoEsc) {
            var idResp = 0;
            $.each(sim.escenas_sim[idsim], function (i, id) {
                if (sim.escena_list[id][sim.escena.tipo] == tipoEsc) {
                    idResp = id;
                }
            });
            return idResp;

        },

        showListado: function () {

            Modal.show(sim.getListado(), 'Selección de simulaciones');
        },
        getListado: function () {

            $loadTarget = $('<table id="lista_ejer_selec" class="table table-striped"></table>');

            form = $('#datos_config')[0];
            var index =1;
            $(":checked[name='check[]']", form).each(function (pos, op) {
                if (op.checked == true && op.value) {
                    n = app.nodeTree[op.value];
                    node = app.nodeList[n.pos];
                    dt = {
                        id_elemento: node[app.node.id],
                        nombre: node[app.node.name]
                    };

                    $.tmpl("tplTema", dt).appendTo($loadTarget);

                    $.each(sim.simulaciones[dt.id_elemento], function (i, pos) {
                        var d = sim.simulaciones_list[pos];
                        var de = {
                            index: index++,
                            id_pregunta: d[sim.sim.idsim],
                            enunciado: d[sim.sim.enunciado]
                            //tipo: Ejercitador.tipo_preg_list[dat[Ejercitador.epreg.id_tipo_preg]]
                        };

                        $.tmpl("item_ejer_min", de).appendTo($loadTarget);
                    });
                }
            });

            return $loadTarget;
        },

        showListadoSelect: function () {
            $show = Modal.show(sim.getListado(),'Selección de ejercicios para entrenar', function (e) {
                $show.modal('hide');
                $list = $("#lista_select");
                $list.empty();
                $(":checkbox.ejer_select", $show).each(function (pos, check) {
                    if (check.checked) {
                        $list.append('<option value="' + check.value + '">' + (pos + 1) + '</option>');
                    }
                });
            });

            $(':checkbox.ejer_select', $show).css('display', "block");

        },
        terminar: function () {
            Modal.show('Est&aacute; seguro que desea salir de las Simulaciones.', 'Informaci&oacute;n al usuario', function () {

                sim.mytarget.load('model/ejercicio/index.html', {}, function () {
                    app.storageRemove('respuestasSim');
                    app.storageRemove('datosSim');
                    app.storageRemove('posSim');
                    sim.init();
                });
            })

        },


        eventosBtn: function (targetLoad) {
            $("a.page-link", targetLoad).on('click', function (e) {
                    e.preventDefault();
                    var action = $(e.currentTarget).data("action");
                    sim.navegation(action);
            });

            $("#btns_comp .btn", targetLoad).on('click', function (e) {
                e.preventDefault();
                var $el = $(e.currentTarget);
                var action = $el.attr("id");
                /*var idEscena = $el.parents(".ejercicio").data("id");
                var escena = sim.getEscena(idEscena);*/
                switch (action) {
                    case "orient_preg":
                        Modal.show("Sin orientaci&oacute;n", 'Orientaci&oacute;n a la Pregunta');
                        break;
                    case "revisar":
                        var idEscena = $el.parents(".ejercicio").data("id");
                        simAccion.revisado(idEscena);
                        break;

                    case "terminar":
                        sim.terminar();
                        break;
                }
            });

        }

    }
}();

$(document).ready(function () {
    app.loadTpl("escena_interior", "model/simulador/interior.tpl.html");
    app.loadTpl("escena_finalizada", "model/simulador/finalizada.tpl.html");

});
