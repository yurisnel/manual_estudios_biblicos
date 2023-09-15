//$("#op_intervalo").css("display",'');
var Ejercitador = function () {
    
    Date.prototype.YYYYMMDDHHMMSS = function () {
        var yyyy = this.getFullYear().toString();
        var MM = pad(this.getMonth() + 1,2);
        var dd = pad(this.getDate(), 2);
        var hh = pad(this.getHours(), 2);
        var mm = pad(this.getMinutes(), 2)
        var ss = pad(this.getSeconds(), 2)

        return yyyy + MM + dd+  hh + mm + ss;
    };
    function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    function createDownloadLink(text, filename) {
      var link = document.createElement("a");
      link.setAttribute("target", "_blank");

      if (Blob !== undefined) {
        var blob = new Blob([text], { type: "text/html" });
        link.setAttribute("href", URL.createObjectURL(blob));
      } else {
        link.setAttribute(
          "href",
          "data:text//plain;charset=utf-8," + encodeURIComponent(text)
        );
      }
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return {
        view: "model/ejercicio/index.html",
        ejer_pregunta: new Array(), // ejercicios por categoria
        ejer_pregunta_list: new Array(), // ejercios indexados por idpreg =>epreg
        ejer_cuerpo_list: new Array(), // cuerpos de ejercicios indexados por idpreg =>ecuerpo
        tipo_preg_list: new Array(), // tipos de preguntas por indexados por id_tipo_preg
        cuerpo_retro_list: new Array(), // retroalimentacion de los items(seleccion simple) indexados por id_cuerpo
        ejer_retro_list: new Array(),   // retroalimentacion de la pregunta indexados por idpreg =>tipoRetro

        tipoRetro: { idpreg: 0, retro_correcto: 1, retro_parcial: 2, retro_incorrecto: 3, orientacion: 4 },
        epreg: { idpreg: 0, max_intento: 1, id_elemento: 2, seleccion: 3, enunciado: 4, id_tipo_preg: 5 },
        cuerpo: { idcuerpo: 0, id_pregunta: 1, text: 2, respuesta: 3, correcta: 4 },
        select: 0,
        total: 0,

        init: function (targetLoad = false, sin_categorias = false) {

            if (targetLoad) {
                Ejercitador.mytarget = targetLoad;
            } else {
                Ejercitador.mytarget = app.targetLoad;
            }

            var datosEjer = Array();
            var temp = app.storage('id_ejer_list'); // ejercicio actual del entrenamiento
            if (temp) {
                datosEjer = temp.split(",");
            }

            if (datosEjer.length || sin_categorias) { // si hay ejercicios pendientes

                if (Ejercitador.ejer_pregunta.length == 0) {   // si no se han cargado los datos de los ejercicios
                    $.when(Ejercitador.loadData())
                    .done(function(a1){
                        Ejercitador.postInit()
                    });
                } else {
                    Ejercitador.postInit();
                }
            } else     // si se cargara las categorias de ejercicio(configuracion del ejercitador)
                if (Ejercitador.ejer_pregunta.length == 0) {     // si no se han cargado los datos de los ejercicios
                    $.when(Ejercitador.loadData())
                    .done(function(a1){
                        Ejercitador.createCategoria();
                    });
                } else {
                    Ejercitador.createCategoria();
                }
        },


        loadData: function () {

            //PARA CARGAR LOS DATOS DE LA TABLA ejer_pregunta
            /*COMENTARIOS IMPORTANTES
             idat[0]-- ES EL ID DE LA PREGUNTA
             idat[1]-- CANTIDAD DE INTENTOS
             idat[2]-- ES EL ID DE LA CATEGORIA
             idat[4]-- ES EL ENUNCIADO DE LA PREGUNTA
             idat[5]-- Tipo pregunta
             */


            var ajax1 = $.getJSON(app.urlData + '/ejer_pregunta.dat', function (resp) {

                // resp = $.parseJSON(result.responseText);
                $.each(resp, function (i, idat) {
                    idcat = parseInt(idat[Ejercitador.epreg.id_elemento]);
                    idpreg = parseInt(idat[Ejercitador.epreg.idpreg]);
                    if (!Ejercitador.ejer_pregunta[idcat]) {
                        Ejercitador.ejer_pregunta[idcat] = new Array();
                    }
                    if (app.nodeTree) {
                        if (!app.nodeTree[idcat].cantEjer) {
                            app.nodeTree[idcat].cantEjer = 0;
                        }
                        app.nodeTree[idcat].cantEjer++;
                    }
                    Ejercitador.ejer_pregunta[idcat].push(idpreg);
                    Ejercitador.ejer_pregunta_list[idpreg] = idat;
                });
            }).fail(function(jqXHR, textStatus, errorThrown) { 
                 console.log('Error ajax1. ' + errorThrown.message);
            });

            //PARA CARGAR LOS DATOS DE LA TABLA ejer_cuerpo
            /*COMENTARIOS IMPORTANTES
             idat[0]-- ES EL ID DEL ITEM
             idat[1]-- ES EL ID DE LA PREGUNTA
             idat[2]-- CUERPO DEL ITEM (CONTENIDO)
             idat[3]-- RESPUESTA DEL ITEM
             idat[4]-- VALOR CORRECTO DEL ITEM
             */    
             var ajax2 = $.getJSON(app.urlData + '/ejer_cuerpo.dat', function (resp) {
                $.each(resp, function (i, idat) {
                    idpreg = parseInt(idat[Ejercitador.cuerpo.id_pregunta]);
                    if (!Ejercitador.ejer_cuerpo_list[idpreg]) {
                        Ejercitador.ejer_cuerpo_list[idpreg] = new Array();
                    }
                    Ejercitador.ejer_cuerpo_list[idpreg].push(idat);
                });

            }).fail(function(jqXHR, textStatus, errorThrown) { 
                console.log('Error ajax2. ' + errorThrown.message);
            });
    
            var ajax3 = $.getJSON(app.urlData + '/tipo_pregunta.dat', function (resp) {
                $.each(resp, function (i, idat) {
                    idtipo = parseInt(idat[0]);
                    Ejercitador.tipo_preg_list[idtipo] = idat[1];
                });
            }).fail(function(jqXHR, textStatus, errorThrown) { 
                console.log('Error ajax3. ' + errorThrown.message);
            });

            var ajax4 = $.getJSON(app.urlData + '/cuerpo_retro.dat', function (resp) {
                $.each(resp, function (i, idat) {
                    idretro = parseInt(idat[0]);
                    Ejercitador.cuerpo_retro_list[idretro] = idat[1];
                });

            }).fail(function(jqXHR, textStatus, errorThrown) { 
                console.log('Error ajax4. ' + errorThrown.message);
            });
 
            var ajax5 = $.getJSON(app.urlData + '/ejer_retro.dat', function (resp) {
                $.each(resp, function (i, idat) {
                    var idpreg = parseInt(idat[Ejercitador.tipoRetro.idpreg]);
                    Ejercitador.ejer_retro_list[idpreg] = idat;                   
                });
              
            }).fail(function(jqXHR, textStatus, errorThrown) { 
                console.log('Error ajax5. ' + errorThrown.message);
            });

           return $.when(ajax1, ajax2, ajax3, ajax4, ajax5);
        },

        createCategoria: function (module) {

            if (!module) {
                module = config.mod.ejercicio;
            }

            if ($("#ejerConfig").length > 0) {

                var catejer = app.nodeTree[module];

                var $categorias_ejer = $("#categorias_ejer");
                var total = 0, d, data;
                $.each(catejer.list, function (i, pos) {
                    d = app.nodeList[pos];

                    var vcant = app.nodeTree[d[app.node.id]].cantEjer;
                    if (vcant) {
                        data = {
                            node_id: d[app.node.id],
                            name: d[app.node.name],
                            cant: vcant,
                            // clase: vclase
                        };
                        total += vcant;

                        $.tmpl("item_cat_ejer", data).appendTo($categorias_ejer);
                    }
                });

                Ejercitador.total = total;
                $("#mostrar_total").html("Seleccionados " + Ejercitador.select + " de: " + Ejercitador.total);

                Ejercitador.eventosTemario();
            }
        },
        showListadoEjercicios: function () {

            Modal.show(Ejercitador.getListadoEjercicios(), 'Selección de ejercicios para entrenar');
        },
        getListadoEjercicios: function () {

            $loadTarget = $('<table id="lista_ejer_selec" class="table table-striped"></table>');

            form = $('#datos_config')[0];

            $(":checked[name='check[]']", form).each(function (pos, op) {
                if (op.checked == true && op.value) {
                    n = app.nodeTree[op.value];
                    node = app.nodeList[n.pos];
                    d = {
                        id_elemento: node[app.node.id],
                        nombre: node[app.node.name]
                    };

                    $.tmpl("tplTema", d).appendTo($loadTarget);
                    var index = 1;
                    $.each(Ejercitador.ejer_pregunta[d.id_elemento], function (i, pos) {
                        dat = Ejercitador.ejer_pregunta_list[pos];
                        data = {
                            index: index++,
                            id_pregunta: dat[Ejercitador.epreg.idpreg],
                            enunciado: dat[Ejercitador.epreg.enunciado],
                            tipo: Ejercitador.tipo_preg_list[dat[Ejercitador.epreg.id_tipo_preg]]
                        };

                        $.tmpl("item_ejer_min", data).appendTo($loadTarget);
                    });
                }
            });

            return $loadTarget;
        },

        selectEjercicios: function () {
            $show = Modal.show(Ejercitador.getListadoEjercicios(), 'Selección de ejercicios para entrenar', function (e) {
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

        terminarModal: function (body, ver) {
            var title = 'Informaci&oacute;n';
            if (!body)
                body = 'Est&aacute; seguro que desea salir del Entrenamiento.';

            Modal.show(body, title, function () {
                Ejercitador.terminar(ver);
            });
        },
        terminar: function (ver) {

            if (ver == 'estadisticas') {
                ejerAccion.estadisticas();
            } else if (!$('#btnSimula').hasClass('active')) {
                Ejercitador.resetCookie();
                $(Ejercitador.mytarget).load('model/ejercicio/index.html', function () {
                    Ejercitador.init(Ejercitador.mytarget);              
                });
            }
        },
        resetCookie: function () {
            var temp = app.storage('id_ejer_list');
            if (temp) {
                ejer = temp.split(',');
                for (i = 0; i < Ejercitador.length; i++) {
                    idPreg = ejer[i];
                    app.storageRemove('respuesta_' + idPreg);
                }
            }
            // app.storageRemove('respuestas', null);
            app.storageRemove('id_ejer_list');
            app.storageRemove('posicion');
            app.storageRemove('escala');
        },

        setAttrPath: function (attrName, target) {
            $("[" + attrName + "]", target).each(function (i, data) {
                el = $(data);
                path = el.attr(attrName);
                if (path) {
                    path = path.replace("../producto/", "");
                    el.attr(attrName, path);
                }
            });
        },

        eventosTemario: function () {

            $('#ver', Ejercitador.mytarget).click(function (e) {

                e.preventDefault();
                var categorias = getInputChecked($(':checkbox'));
                if (categorias.length) {
                    Ejercitador.showListadoEjercicios();
                } else {
                    Modal.show('Debe seleccionar al menos uno de los temas que est&aacute;n disponibles en la lista.');
                }
            });

            $('#btnSelec', Ejercitador.mytarget).click(function () {
                var inputs = getInputChecked($(':checkbox'));
                if (inputs.length) {
                    Ejercitador.selectEjercicios('Seleccionar los ejercicios que desea incluir en el entrenamiento.');
                } else Modal.show('Debe seleccionar al menos uno de los temas que est&aacute;n disponibles en la lista.');
            });

            $('#btn_comenzar', Ejercitador.mytarget).click(Ejercitador.comenzarEntranamiento);
            $('#btn_config_save', Ejercitador.mytarget).click(Ejercitador.saveConfiguration);
            $('#btn_config_load', Ejercitador.mytarget).click(Ejercitador.loadConfiguration);


            //Para mostrar los distintos tipos de opciones
            $('#intervalo', Ejercitador.mytarget).click(function (evento) {

                $("#op_intervalo").hide().delay(200).slideDown();
                $("#op_asignados").fadeOut();
            });

            $('#asignado', Ejercitador.mytarget).click(function (evento) {
                $("#op_asignados").hide().delay(200).slideDown();
                $("#op_intervalo").fadeOut();
            });

            //Para Mostrar la cantidad de elementos al azar
            $('#azar1', Ejercitador.mytarget).click(function (evento) {
                $("#int_azar").show('slow');
                var ini = $('#inicio').attr('value');
                var fin = $('#fin').attr('value');
                var total = parseInt(fin) - parseInt(ini) + 1;
                $('#intervalo_cant').attr('value', total);
            });

            $('#secuencial1', Ejercitador.mytarget).click(function (evento) {
                $("#int_azar").hide();
            });

            $('#azar2', Ejercitador.mytarget).click(function (evento) {
                $("#asig_azar").show('slow');
                var total1 = $('#lista_select').find('option').length;
                $('#asig_cant').attr('value', total1);
            });
            $('#secuencial2', Ejercitador.mytarget).click(function (evento) {
                $("#asig_azar").hide();
            });

            //evento clic para todos los checkbox
            $("#div_categoria :checkbox", Ejercitador.mytarget).click(function (e) {
                if (e.currentTarget.id == 'todos') {
                    $("#div_categoria :checkbox").prop('checked', e.currentTarget.checked);
                }

                var suma = 0;
                var total = 0;
                //seleccionar todos los checkbox marcados
                $("#div_categoria :checkbox").each(function (pos, check) {
                    if (check.checked == true && check.id != 'todos') {
                        var id = check.value;
                        suma += parseInt(app.nodeTree[id].cantEjer);
                        total++;
                    }
                });

                if (total == $("#div_categoria :checkbox").length - 1)
                    $("#todos").prop('checked', true);
                else {
                    $("#todos").prop('checked', false);
                    $('#inicio').attr('value', '');
                    $('#fin').attr('value', '');
                }
                Ejercitador.select = suma;
                $('#mostrar_total').html('Seleccionados: ' + Ejercitador.select + " de " + Ejercitador.total);
                if (suma != 0) {
                    $('#inicio').attr('value', 1);
                    $('#fin').attr('value', suma);
                }
            });

        },

        comenzarEntranamiento: function (data = false) {
            if(!data){
                data = Ejercitador.getDataForm();
            }

            if (data.length == 0) {
                Modal.show("Debe seleccionar los ejercicios que desea ejercitar.");
            } else {
                Ejercitador.resetCookie();
                // Guardando datos en las cookies y sacando los datos para la primera pregunta.
                app.storage('id_ejer_list', data);
                app.storage('posicion', "0");
                app.storage('escala', $('#escalas :radio[checked]').val());

                Ejercitador.loadEjercicioPos(0);
            }
        },

        saveConfiguration: function(e){
            e.preventDefault();
            var datos = Ejercitador.getDataForm();

            if (datos.length == 0) {
                Modal.show("Debe seleccionar los ejercicios que desea ejercitar.");
            } else {
                createDownloadLink(JSON.stringify(datos), "config"+new Date().YYYYMMDDHHMMSS()+".txt");
            }
        },

        loadConfiguration: function(e){
            e.preventDefault();
            $('#file_config').on('change', function(e){
                if(this.files.length > 0){	
                    var file = this.files[0];
                    
                    let reader = new FileReader();
                    reader.onload = (function(theFile) {
                        return function(e) {
                            let data = JSON.parse(e.target.result);
                            Ejercitador.comenzarEntranamiento(data);
                        };
                      })(file);
                
                      reader.readAsText(file);
                }
            })
            $('#file_config').click();
        },

        updateView: function (idEjer, targetLoad) {
            app.refreshPag(targetLoad);

            var resp = JSON.parse(app.storage('respuesta_' + idEjer));
            terminar = $("[data-action=terminar]", targetLoad).hide();
            resultado = $("[data-action=resultado]", targetLoad).hide();
            revisar = $("[data-action=revisar]", targetLoad).hide();
            tu_respuesta = $("[data-action=tu_respuesta]", targetLoad).hide();
            resp_correcta = $("[data-action=resp_correcta]", targetLoad).hide();
            orient_preg = $("[data-action=orient_preg]", targetLoad).hide();

            if (!resp) {
                revisar.show();
                terminar.show();
                orient_preg.show();
                return;
            }


            if (resp.terminado != 1) { // si no ha terminado

                if (resp.revisado == 1) { // si ya esta revisado
                    if (resp.correcta != 1) {
                        tu_respuesta.show();
                    }

                    resp_correcta.show();
                    //desabilitar campos
                    $("input, select, textarea", targetLoad).attr('disabled', 'disabled');
                } else {
                    if (resp.correcta != 1) { // si no es correcta
                        revisar.show();
                    }
                }
                terminar.show();
                orient_preg.show();
                // }
            } else {  // si ha terminado

                if (resp.correcta != 1) {// si no es correcta
                    tu_respuesta.show();
                    resp_correcta.show();
                }
                resultado.show();
                orient_preg.show();

                //desabilitar campos
                $("input, select, textarea", targetLoad).attr('disabled', 'disabled');
            }

            if (resp.revisado == 1) {
                Ejercitador.selec_respuesta("tu_respuesta", idEjer, targetLoad);
            }

            $('span.error_field', targetLoad).hide();

        },

        eventosBtn: function (targetLoad) {

            $("a.page-link", targetLoad).on('click', function (e) {
                e.preventDefault();
                var $el = $(e.currentTarget);
                // if (!e.isDefaultPrevented()) {
                var action = $el.data("action");
                Ejercitador.navegation(action);
                //}
            });

            $(".btns_comp .btn", targetLoad).on('click', function (e) {
                e.preventDefault();
                var $el = $(e.currentTarget);
                var action = $el.data("action");
                var parent = $el.parents(".ejercicio");
                var idEjer = parent.data("id");

                switch (action) {
                    case "orient_preg":
                        var ejer_datos = Ejercitador.getEjercicio(idEjer);
                        Modal.show(ejer_datos.orientacion, 'Orientaci&oacute;n de la pregunta');
                        break;
                    case "revisar":
                        ejerAccion.revisado(idEjer, targetLoad);
                        break;
                    case "resp_correcta":
                        Ejercitador.selec_respuesta(action, idEjer, targetLoad);
                        break;
                    case "tu_respuesta":
                        Ejercitador.selec_respuesta(action, idEjer, targetLoad);
                        break;
                    case "terminar":
                        ejerAccion.verificar();
                        break;
                    case "resultado":
                        ejerAccion.verificar();
                        break;
                    case "salir":
                        Ejercitador.terminar("salir");
                        break;
                    case "send":
                        var link = "mailto:ybolmey@gmail.com"
                            + "?subject=" + encodeURIComponent("Resultados de cuestionario")
                            + "&body=" + encodeURIComponent("<table><tr><td><b>nombre</b></td><td>Pepe</td></tr></table>");

                        window.location = link;
                        break;
                }
            });


            $(".tipo4 input", targetLoad).keyValue(/[0-9]/);
            $(".tipo6 input", targetLoad).keyValue(/[0-9]/);
            $(".tipo3 input", targetLoad).keyValue(['v', 'V', 'f', 'F']);


        },
        navegation: function (action) {// TERMINADA
            var pos = parseInt(app.storage('posicion'));
            var datEjer = app.storage('id_ejer_list').split(',');
            ejerAccion.salvar_session(datEjer[pos]);

            switch (action) {
                case 'first':
                    pos = 0;
                    break;
                case 'prev':
                    if (pos != 0)
                        pos--;
                    break;

                case 'next':
                    if (pos != (helper.countNoEmpty(datEjer) - 1))
                        pos++;
                    break;

                case 'last':
                    pos = helper.countNoEmpty(datEjer) - 1;
                    break;

                case 'up':
                    Ejercitador.terminarModal('Est&aacute; seguro que desea salir del Entrenamiento.', 'salir');
                    return;
            }
            if (datEjer[pos]) {
                app.storage('posicion', pos);
                Ejercitador.loadEjercicioPos(pos);
            }

        },

        postInit: function () {
            if (app.storage('posicion')){
                var pos = parseInt(app.storage('posicion'));
            }else{
                pos = 0;
            }
            Ejercitador.loadEjercicioPos(pos);
        },

        loadEjercicioPos: function (pos) {
            var temp = app.storage('id_ejer_list');
            if (temp) {
                var datEjer = temp.split(',');
                var idEjer = datEjer[pos];// para coger el id de la pregunta
                if (!idEjer) {
                    // alert("No existe el ejercicio !!");
                    return;
                }
                var ejer_datos = Ejercitador.getEjercicio(idEjer);
                var url = app.urlprod + '/ejercicio/' + idEjer + ".html";
                $.get(url, function (resp, textStatus, result) {
                    ejer_datos.enunciado = result.responseText;
                    ejer_datos.pager = (pos + 1) + '/' + helper.countNoEmpty(datEjer);
                    ejer_datos.pagerSize = config.datosProd.pager_size ? config.datosProd.pager_size : "full"; //full or min
                    ejer_datos.fromModuleExternal = false;
                    Ejercitador.mytarget.html($.tmpl("interior_ejer", ejer_datos));
                    Ejercitador.eventosBtn(Ejercitador.mytarget);
                    Ejercitador.updateView(idEjer, Ejercitador.mytarget);
                    window.scrollTo(0, 0);
                });

            }
        },
        // mostrar ejericio desde modulo exterior asincronico por si hay que cargar los ejericios
        loadEjercicioIdFromExternalAsc: function (idEjer, target) {

            if (Ejercitador.ejer_pregunta_list.length > 0) {
                return Ejercitador.loadEjercicioIdFromExternalAux(idEjer, target);
            } else {
                return $.when(Ejercitador.loadData())
                .done(function(a1){
                    Ejercitador.loadEjercicioIdFromExternalAux(idEjer, target);
                });
            }
        },

        loadEjercicioIdFromExternalAux: function (idEjer, target) {
            var ejer_datos = Ejercitador.getEjercicio(idEjer);
            var url = app.urlprod + '/ejercicio/' + idEjer + ".html";
            return $.get(url, function (resp, textStatus, result) {
                ejer_datos.enunciado = result.responseText;

                ejer_datos.fromModuleExternal = true;
                target.html($.tmpl("interior_ejer", ejer_datos));
                Ejercitador.eventosBtn(target);
                Ejercitador.updateView(idEjer, target);
            });

        },

        getEjercicioFull: function (idEjer) {
            var ownDeferred = $.Deferred();
            var url = app.urlprod + '/ejercicio/' + idEjer + ".html";
            $.get(url, function (resp, textStatus, result) {
                var ejercicio = Ejercitador.getEjercicio(idEjer);
                ejercicio.enunciado = result.responseText;
                return ownDeferred.resolve(ejercicio);
            });
            return ownDeferred.promise();
        },
        getEjercicio: function (idEjer) {
            var e = Ejercitador.ejer_pregunta_list[idEjer];
            var idcat = e[Ejercitador.epreg.id_elemento];
            var dat = {
                categoria: app.nodeList[app.nodeTree[idcat].pos][app.node.name],
                idPreg: parseInt(idEjer),
                tipoPreg: parseInt(e[Ejercitador.epreg.id_tipo_preg]),
                enunciado: e[Ejercitador.epreg.enunciado],
                orientacion: Ejercitador.ejer_retro_list[idEjer][Ejercitador.tipoRetro.orientacion],
                items: [],
                itemsLeft: [],
                itemsRigth: [],
            };

            var items = Ejercitador.ejer_cuerpo_list[idEjer], it;
            $.each(items, function (i, idat) {
                it = {
                    id: idat[Ejercitador.cuerpo.idcuerpo],
                    text: idat[Ejercitador.cuerpo.text],
                    respuesta: idat[Ejercitador.cuerpo.respuesta]
                };

                if (dat.tipoPreg == config.ejercicio.completa) {

                    it.text = selectToInput(it.text);

                } else if (dat.tipoPreg == config.ejercicio.relaciona) {

                    if (it.respuesta == "") {
                        dat.itemsLeft.push(it)
                    } else {
                        dat.itemsRigth.push(it)
                    }
                }
                dat.items.push(it);
            });

            return dat;
        },

        selec_respuesta: function (action, idEjer, targetLoad) {

            var tipoPreg = Ejercitador.ejer_pregunta_list[idEjer][Ejercitador.epreg.id_tipo_preg];

            var datos_cuerpo = Ejercitador.ejer_cuerpo_list[idEjer];
            var array_resp = new Array();

            //$('.'+seleccion).addClass(seleccion+':hover');

            //if (saber[idEjer]['correcta'] != 1)
            if (action == 'resp_correcta') {
                if (tipoPreg == config.ejercicio.simple || tipoPreg == config.ejercicio.multiple) {//Seleccion Simple y Multiple
                    for (i = 0; i < datos_cuerpo.length; i++) {
                        if (datos_cuerpo[i][4])
                            array_resp[datos_cuerpo[i][0]] = parseInt(datos_cuerpo[i][4]);
                    }
                } else if (tipoPreg == config.ejercicio.intriga) {//Verdadero o Falso
                    for (i = 0; i < datos_cuerpo.length; i++) {
                        if (!datos_cuerpo[i][4])
                            array_resp[datos_cuerpo[i][0]] = 'F';
                        else
                            array_resp[datos_cuerpo[i][0]] = 'V';
                    }
                } else if (tipoPreg == config.ejercicio.relaciona) {//Relacionar Elementos
                    for (i = 0; i < datos_cuerpo.length; i++) {
                        if (datos_cuerpo[i][3] != '')
                            array_resp[datos_cuerpo[i][0]] = datos_cuerpo[i][3];
                    }
                } else if (tipoPreg == config.ejercicio.completa) {//Completar Espacios en Blanco.

                    for (i = 0; i < ejerAccion.opciones[idEjer].length; i++)
                        array_resp[i] = ejerAccion.opciones[idEjer][i][0];
                } else if (tipoPreg == config.ejercicio.ordena) {//Ordenar segun corresponda

                    for (i = 0; i < datos_cuerpo.length; i++) {
                        array_resp[datos_cuerpo[i][0]] = datos_cuerpo[i][3];
                    }
                } else if (tipoPreg == config.ejercicio.identifica) {//Identificar Respuesta Correcta

                    for (i = 0; i < datos_cuerpo.length; i++) {
                        txt = datos_cuerpo[i][Ejercitador.cuerpo.respuesta];
                        array_resp = splitRespuestas(txt);
                    }
                }

            } else {
                var id = 0;
                var respuesta = JSON.parse(app.storage('respuesta_' + idEjer));
                var pos = parseInt(app.storage('posicion'));
                var temp = app.storage('id_ejer_list');
                if (temp) {
                    var datosEjer = temp.split(',');
                    idEjer = datosEjer[pos];
                }
                // if (!id) id = idEjer;

                if (respuesta)
                    array_resp = respuesta['items'];

            }

            var data, Arraytipo5 = new Array();

            campos_respuestas = $("form[name=campos_respuestas]", targetLoad);

            //Esto es para limpiar todos los items
            if (tipoPreg == config.ejercicio.simple || tipoPreg == config.ejercicio.multiple) {
                $('input', campos_respuestas).prop('checked', false)
                    .parent().parent().removeClass('selected');

            } else if (tipoPreg == config.ejercicio.completa) {
                Arraytipo5 = $('input[name*=valores]', campos_respuestas);
            } else if (tipoPreg == config.ejercicio.identifica) {
                Arraytipo5 = $('select[name*=valores]', campos_respuestas);
            } else if (tipoPreg == config.ejercicio.abierta) {
                $('textarea', campos_respuestas).val(respuesta['value']);
            }

            for (var i in array_resp) {
                data = array_resp[i];
                if (tipoPreg == config.ejercicio.simple || tipoPreg == config.ejercicio.multiple) {
                    if (data != 0) {
                        $('input[value=' + i + ']', campos_respuestas).prop('checked', true)
                            .parent().parent().addClass('selected');
                    }
                } else if (tipoPreg == config.ejercicio.intriga || tipoPreg == config.ejercicio.ordena || tipoPreg == config.ejercicio.relaciona) {
                    $('select[name*=' + i + ']', campos_respuestas).val(data);
                } else if (tipoPreg == config.ejercicio.completa) {
                    $(Arraytipo5[i]).val(data);
                } else if (tipoPreg == config.ejercicio.identifica) {
                    var selectedValue = data;
                    var $options = $("option", Arraytipo5[i]);
                    for (j = 0; j < $options.length; j++) {
                        $el = $($options[j]);
                        if (helper.trim($el.val()) == selectedValue) {
                            $el.prop("selected", true)
                        }
                    };
                }
            }
        },

        // para mostrar ejercicios en ventana popup

        showEjercicio: function (idEjer) {
            if (Ejercitador.ejer_pregunta_list.length > 0) {
                Ejercitador.showEjercicioAux(idEjer);
            } else {
                $.when(Ejercitador.loadData())
                .done(function(a1){
                    Ejercitador.showEjercicioAux(idEjer);
                });
            }
        },
        showEjercicioAux: function (idEjer) {
            var ejer_datos = Ejercitador.getEjercicio(idEjer);
            var url = app.urlprod + '/ejercicio/' + idEjer + ".html";
            $.get(url, function (resp, textStatus, result) {
                ejer_datos.enunciado = result.responseText;
                ejer_datos.fromModuleExternal = true;
                var html = $.tmpl("interior_ejer", ejer_datos);
                var modal = Modal.show(html, 'Ejercicio');
                Ejercitador.eventosBtn(modal);
                Ejercitador.updateView(idEjer, modal);
            });
        },

        getDataForm: function (itemsList) {
            var form = $('#datos_config')[0], datos = new Array();

            if (form.opcion[0].checked == true) {
                // Para cuando la opcion que se escogio es para un intervalo con seleccion al azar.
                if (form.interv_modo[1].checked == true) {
                    datos = Ejercitador.getEjerSelec(form, itemsList);
                    datos = helper.shuffle(datos);// Desordena un Arreglo
                    datos = helper.chunks(datos, form.intervalo_cant.value);
                    datos = datos[0];
                } else // Para cuando la opcion que se escogio es para un intervalo secuencial.
                {
                    datos = Ejercitador.getEjerSelec(form, itemsList);
                }
            }// fin de la parte de intervalos
            else {// INICIO DE ASIGNADOS Para cuando la opcion que se escogio es para un Asignado al azar.

                $.each(form["lista_select"].options, function (i, data) {
                    datos[i] = data.value;
                });
                if (form.asig_modo[1].checked == true) {
                    datos = helper.shuffle(datos);// Desordena un Arreglo
                    datos = datos.slice(0, form.asig_cant.value);
                }
            }

            return datos;
        },
        getEjerSelec: function (form, itemsList) {
            if (!itemsList)
                itemsList = Ejercitador.ejer_pregunta;

            var ini = parseInt(form.inicio.value);
            var fin = parseInt(form.fin.value);

            var posTotal = 1;
            var select = [];
            var listaselect = [];

            if (!form["check[]"].length) {
                listaselect[0] = form["check[]"];
            } else
                listaselect = form["check[]"];


            $.each(listaselect, function (pos, op) {
                if (op.checked == true) {
                    // list = Ejercitador.ejer_pregunta[op.value];
                    var list = itemsList[op.value];
                    for (var p in list) {
                        var idPreg = list[p];
                        if (posTotal >= ini && posTotal <= fin) {
                            // select[id]=data1;
                            select.push(idPreg);
                        } else if (posTotal > fin) {
                            break;
                        }
                        posTotal++;
                    }
                }
            });
            return select;
        }
    }
}();


function selectToInput(txt) {
    var reg = new RegExp("<s*select[^>]*>(.*?)<s*/s*select>", "g"), html;
    //var txt2 = "<p>5+6 es <select data=\"retroalimentacion\"><option>11</option></select>&nbsp;<br> 6-5 es <select data=\"retroalimentacion\"><option>1</option></select> </p>";
    var html = txt.replace(reg, ' <input type="text" name="valores[]" class="form-control" /> ');

    /*var matches = txt.match(reg);
     for (var i in matches) {

     }*/
    return html;
}

function getInputChecked(inputs) {
    var result = [];
    inputs.each(function (i, input) {
        if (input.checked) {
            result.push(input);
        }
    });
    return result;
}

/*
 function select(s)
 {
 var select = preg_replace_callback(
 '/<option.[^>]*?>' + valores[incremento].trim() + '<\/option>/is',
 "options",
 s[0]
 );
 incremento ++;
 return select;
 }

 function options(op)
 {
 return '<option selected value="' + valores[incremento].trim() + '">' +valores[incremento].trim()+ '</option>';
 }*/


$(document).ready(function () {
    app.loadTpl("item_cat_ejer", "model/ejercicio/item_cat.tpl.html");
    app.loadTpl("item_ejer_min", "model/ejercicio/item_ejer_min.tpl.html");
    app.loadTpl("interior_ejer", "model/ejercicio/interior.tpl.html");

    $.template("tplTema", '<tr><th colspan="3"> Tema: ${nombre}</th></tr>');

});