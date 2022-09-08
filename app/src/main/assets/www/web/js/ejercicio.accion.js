var ejerAccion = function () {

    //botones
    var terminar, resultado, revisar, tu_respuesta, resp_correcta, orient_preg;


    return {
        ejer_datos: {},
        opciones: new Array(),

        salvar_session: function (idEjer, campos_respuestas) {// TERMINADA

            var tipoPreg = Ejercitador.ejer_pregunta_list[idEjer][Ejercitador.epreg.id_tipo_preg];

            var respuesta = JSON.parse(app.storage('respuesta_' + idEjer));
            if (!respuesta) {
                respuesta = {items: {}};
            }

            if (respuesta['revisado'] != 1) {

                var item = {}, resp_user = [];

                if (tipoPreg == config.ejercicio.simple) {// Preg SSimple

                    resp_user = getInputChecked($(':radio', campos_respuestas));
                    if (resp_user.length > 0) {
                        id = resp_user[0].value;
                        respuesta.items[id] = 1;
                    }

                } else if (tipoPreg == config.ejercicio.multiple) {// Preg SMultiple
                    resp_user = getInputChecked($(':checkbox', campos_respuestas));
                    $.each(resp_user, function (i, data) {
                        respuesta.items[data.value] = 1;
                    });
                } else if (tipoPreg == config.ejercicio.abierta) {
                    resp_user = $('textarea', campos_respuestas);
                    respuesta.value = resp_user.val();
                } else {
                    resp_user = $(':input', campos_respuestas);

                    $.each(resp_user, function (i, el) {
                        var $el = $(el);
                        var idcampo = $el.data("id");
                        var val= $el.val();
                        if (!idcampo){
                            idcampo = i;
                        }
                        respuesta.items[idcampo] = helper.trim(val);
                    });
                }

                if (!$.isEmptyObject(respuesta.items) || respuesta.value) {
                    respuesta = JSON.stringify(respuesta);
                    app.storage('respuesta_' + idEjer, respuesta);
                    return true;
                }
            }

            return false;
        },

        revisado: function (idEjer, targetLoad) {
            old$ = $;
            if (app.window) $ = app.window.$;

            var campos_respuestas = $("form[name=campos_respuestas]", targetLoad);

            var putdata = ejerAccion.salvar_session(idEjer, campos_respuestas);
            if (!putdata) {
                Modal.show("Por favor indique su respuesta.", "Alerta!");
                return;
            }
            //datEjer = app.storage('id_ejer_list').split(',');
            //idEjer = datEjer[pos];// para coger el id de la pregunta
            tipoPreg = Ejercitador.ejer_pregunta_list[idEjer][Ejercitador.epreg.id_tipo_preg];

            datos = Ejercitador.ejer_pregunta_list[idEjer];
            datos_cuerpo = Ejercitador.ejer_cuerpo_list[idEjer];
            // answer = ejerAccion.getRespuestas(idEjer);

            respuesta = JSON.parse(app.storage('respuesta_' + idEjer));
            max_intento = datos[Ejercitador.epreg.max_intento];

            if (respuesta.intento && respuesta.intento < max_intento) {
                respuesta.intento = respuesta.intento + 1; // Aumentar en uno el intento.
            } else {
                respuesta.intento = {};
                respuesta.intento = 1;
            }

            mi_respuesta = respuesta['items'];
            array_resp = {};
            resp = [];

            switch (parseInt(tipoPreg)) {
                case  config.ejercicio.simple: {// Seleccion Simple
                    for (i = 0; i < datos_cuerpo.length; i++) {
                        if (!datos_cuerpo[i][Ejercitador.cuerpo.correcta])
                            array_resp[datos_cuerpo[i][Ejercitador.cuerpo.idcuerpo]] = 0;
                        else
                            array_resp[datos_cuerpo[i][Ejercitador.cuerpo.idcuerpo]] = parseInt(datos_cuerpo[i][Ejercitador.cuerpo.correcta]);
                    }
                    resp = helper.array_diff_assoc(mi_respuesta, array_resp);
                }
                    break;

                case  config.ejercicio.multiple: {// Seleccion Multiple

                    num_incorrecta = 0;
                    num_correcta = 0;
                    for (i = 0; i < datos_cuerpo.length; i++) {
                        if (!datos_cuerpo[i][Ejercitador.cuerpo.correcta]) {
                            array_resp[datos_cuerpo[i][Ejercitador.cuerpo.idcuerpo]] = 0;
                            num_incorrecta++;
                        } else {
                            array_resp[datos_cuerpo[i][Ejercitador.cuerpo.idcuerpo]] = parseInt(datos_cuerpo[i][Ejercitador.cuerpo.correcta]);
                            num_correcta++;
                        }
                    }

                    /*alert(JSON.stringify(array_resp, null, 2));
                     alert(JSON.stringify(mi_respuesta, null, 2));	*/


                    resp = helper.array_diff_assoc(mi_respuesta, array_resp);
                    num_unos = 0;
                    $.each(resp, function (i, data) {
                        if (data == 1)
                            num_unos = num_unos + 1;
                    });
                }
                    break;

                case config.ejercicio.intriga: {// Para cuando es verdadero o falso
                    for (i = 0; i < datos_cuerpo.length; i++) {
                        if (!datos_cuerpo[i][Ejercitador.cuerpo.correcta])
                            array_resp[datos_cuerpo[i][Ejercitador.cuerpo.idcuerpo]] = 'F';
                        else
                            array_resp[datos_cuerpo[i][Ejercitador.cuerpo.idcuerpo]] = 'V';
                    }
                    resp = helper.array_diff_assoc(mi_respuesta, array_resp);
                }
                    break;

                case config.ejercicio.relaciona: {// Relacionar Elementos.
                    for (i = 0; i < datos_cuerpo.length; i++) {
                        if (datos_cuerpo[i][Ejercitador.cuerpo.respuesta] != '')
                            array_resp[datos_cuerpo[i][Ejercitador.cuerpo.idcuerpo]] = datos_cuerpo[i][Ejercitador.cuerpo.respuesta];
                    }
                    resp = helper.array_diff_assoc(array_resp, mi_respuesta);
                }
                    break;

                case config.ejercicio.completa: {// Completar Espacios en Blanco
                    html = datos_cuerpo[0][2];
                    numSelec = 0;
                    selects = helper.preg_match_all("<\s*select[^>]*>(.*?)<\s*/\s*select>", html);
                    opciones = new Array();

                    for (var i in selects) {
                        options = helper.preg_match_all("<\s*option[^>]*>(.*?)<\s*/\s*option>", selects[i]);
                        opciones[numSelec] = options;
                        numSelec++;
                    }

                    for (i = 0; i < numSelec; i++) {
                        //Comparar a traves de elemento por elemento.
                        for (j = 0; j < opciones[i].length; j++) {
                            /* mi_respuesta[i] = helper.trim(mi_respuesta[i]);
                             opciones[i][j] = helper.trim(opciones[i][j]);*/
                            mi_respuesta[i] = mi_respuesta[i].trim();
                            opciones[i][j] = opciones[i][j].trim();

                            if (mi_respuesta[i].toLowerCase() == opciones[i][j].toLowerCase()) {
                                array_resp[i] = opciones[i][j].toLowerCase();
                                mi_respuesta[i] = mi_respuesta[i].toLowerCase();
                            }
                        }
                    }
                    ejerAccion.opciones[idEjer] = opciones;
                    resp = helper.array_diff_assoc(mi_respuesta, array_resp);
                }
                    break;
                case config.ejercicio.ordena: {// Ordenar segun corresponda
                    for (i = 0; i < datos_cuerpo.length; i++) {
                        array_resp[datos_cuerpo[i][Ejercitador.cuerpo.idcuerpo]] = datos_cuerpo[i][3];
                    }
                    resp = helper.array_diff_assoc(array_resp, mi_respuesta);
                }
                    break;
                case config.ejercicio.identifica: {// Identificar Respuesta Correcta

                    for (i = 0; i < datos_cuerpo.length; i++) {
                        txt = datos_cuerpo[i][Ejercitador.cuerpo.respuesta];
                        array_resp = splitRespuestas(txt);
                    }
                    /*
                    for (i = 0; i < array_resp.length; i++) {
                        array_resp[i] = array_resp[i].trim().toLowerCase();
                        mi_respuesta[i] = mi_respuesta[i].trim().toLowerCase();
                    }
                    */
                    resp = helper.array_diff_assoc(array_resp, mi_respuesta);
                }

                    break;
            }


            // PARA MOSTRAR LA RETROALIMENTACION QUE CORRESPONDE Y MARCAR COMO
            // REVISADO
            if (tipoPreg == config.ejercicio.completa) {
                max_items = helper.countObject(mi_respuesta);
            } else {
                max_items = helper.countObject(array_resp);
            }
            if (tipoPreg == config.ejercicio.simple) {
                llave = 0;
                $.each(mi_respuesta, function (i, data) {
                    llave = i;
                });
                cuerpRetro = Ejercitador.cuerpo_retro_list[llave];
            }
            if (tipoPreg == config.ejercicio.identifica) {
                max_items = helper.countObject(respuesta['items']);
            }
            respuesta['max_item'] = max_items;
            countResp = helper.countObject(resp);
            countMiRespuesta = helper.countObject(mi_respuesta);
            countArrayResp = helper.countObject(array_resp);
            retroalimentos = Ejercitador.ejer_retro_list[idEjer];

            if (countResp == 0) {// Estrictamente Correcto
                if (tipoPreg == config.ejercicio.multiple) {
                    if (num_correcta == countMiRespuesta) {
                        datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_correcto];
                        respuesta['revisado'] = 1; // Usar esta estructura
                        // para marcar como revisado
                        respuesta['items_correctos'] = max_items;
                        respuesta['items_incorrectos'] = countResp;
                        respuesta['correcta'] = 1;
                    } else {
                        qued_intentos = max_intento - respuesta['intento'];
                        if (qued_intentos != 0 && countMiRespuesta != 0) {
                            datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_parcial] + '<br><p>Aviso: Estimado usuario le queda(n) ' + qued_intentos + ' intento(s).</p>';
                            respuesta['correcta'] = 0;
                            respuesta['items_correctos'] = countMiRespuesta + num_incorrecta;
                            respuesta['items_incorrectos'] = num_correcta - countMiRespuesta;

                        } else if (countMiRespuesta == 0) {
                            datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_incorrecto] + '<br><p>Aviso: Este ha sido su &uacute;ltimo intento. Lo sentimos.</p>';
                            respuesta['correcta'] = -1;
                            respuesta['items_correctos'] = 0;
                            respuesta['items_incorrectos'] = countArrayResp;
                            respuesta['revisado'] = 1;
                        } else {
                            datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_parcial] + '<br><p>Aviso: Este ha sido su &uacute;ltimo intento. Lo sentimos.</p>';
                            respuesta['revisado'] = 1; // marcar como revisado.
                            respuesta['items_correctos'] = countMiRespuesta + num_incorrecta;
                            respuesta['items_incorrectos'] = num_correcta - countMiRespuesta;
                            respuesta['correcta'] = 0;
                        }
                    }
                } else {
                    if (tipoPreg == config.ejercicio.simple) {
                        if (cuerpRetro)
                            datos['mostrar_retro'] = '<strong>Informaci&oacute;n sobre el item respondido:</strong> ' + cuerpRetro + '<strong>Informaci&oacute;n sobre la pregunta: </strong><br>' + retroalimentos[Ejercitador.tipoRetro.retro_correcto];
                        else
                            datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_correcto];
                    } else
                        datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_correcto];

                    respuesta['revisado'] = 1; // Usar esta estructura para
                    // marcar como revisado
                    respuesta['items_correctos'] = max_items;
                    respuesta['items_incorrectos'] = countResp;
                    respuesta['correcta'] = 1;
                }
            } else if (max_intento == respuesta['intento']) {

                if (tipoPreg == config.ejercicio.simple) {
                    if (cuerpRetro)
                        datos['mostrar_retro'] = '<strong>Informaci&oacute;n sobre el item respondido: </strong>' + cuerpRetro + '<strong>Informaci&oacute;n sobre la pregunta</strong><br>' + retroalimentos[Ejercitador.tipoRetro.retro_incorrecto] + '<br><p>Aviso: Este ha sido su &uacute;ltimo intento. Lo sentimos.</p>';
                    else {
                        datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_incorrecto] + '<br><p>Aviso: Este ha sido su &uacute;ltimo intento. Lo sentimos.</p>';
                    }
                    respuesta['correcta'] = -1;
                    respuesta['revisado'] = 1; // marcar como revisado.
                    respuesta['items_correctos'] = 0;
                    respuesta['items_incorrectos'] = countArrayResp;
                } else if (countResp == max_items) {
                    datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_incorrecto] + '<br><p>Aviso: Este ha sido su &uacute;ltimo intento. Lo sentimos.</p>';
                    respuesta['correcta'] = -1;
                    respuesta['revisado'] = 1; // marcar como revisado.
                    respuesta['items_correctos'] = 0;
                    respuesta['items_incorrectos'] = max_items;
                } else {
                    if (tipoPreg == config.ejercicio.multiple) {
                        resp1 = helper.array_diff_assoc(mi_respuesta, resp);
                        if (helper.countObject(resp1) === 0 /* && num_unos */) {
                            datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_incorrecto] + '<br><p>Aviso: Este ha sido su &uacute;ltimo intento. Lo sentimos.</p>';
                            respuesta['correcta'] = -1;
                            respuesta['revisado'] = 1; // marcar como
                            // revisado.
                            respuesta['items_correctos'] = 0;
                            respuesta['items_incorrectos'] = max_items;
                        } else {
                            datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_parcial] + '<br><p>Aviso: Este ha sido su &uacute;ltimo intento. Lo sentimos.</p>';
                            respuesta['correcta'] = 0;
                            respuesta['revisado'] = 1; // marcar como
                            // revisado.
                            respuesta['items_correctos'] = max_items - num_unos;
                            respuesta['items_incorrectos'] = num_unos;
                        }
                    } else {
                        datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_parcial] + '<br><p>Aviso: Este ha sido su &uacute;ltimo intento. Lo sentimos.</p>';
                        respuesta['correcta'] = 0;
                        respuesta['revisado'] = 1; // marcar como revisado.
                        respuesta['items_correctos'] = max_items - countResp;
                        respuesta['items_incorrectos'] = countResp;
                    }
                }
            } else {
                qued_intentos = max_intento - respuesta['intento'];
                if (tipoPreg == config.ejercicio.simple) {
                    if (cuerpRetro)
                        datos['mostrar_retro'] = '<strong>Informaci&oacute;n sobre el item respondido:</strong>' + cuerpRetro + '<strong>Informaci&oacute;n sobre la pregunta: </strong><br>' + retroalimentos[Ejercitador.tipoRetro.retro_incorrecto] + '<br><p>Aviso: Estimado usuario le queda(n) ' + qued_intentos + ' intento(s).</p>';
                    else
                        datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_incorrecto] + '<p>Aviso: Estimado usuario le queda(n) ' + qued_intentos + ' intento(s).</p>';
                    respuesta['correcta'] = -1;
                } else if (countResp == max_items) {
                    datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_incorrecto] + '<br><p>Aviso: Estimado usuario le queda(n) ' + qued_intentos + ' intento(s).</p>';
                    respuesta['correcta'] = -1;
                } else {
                    if (tipoPreg == config.ejercicio.multiple) {
                        resp1 = helper.array_diff_assoc(mi_respuesta, resp);
                        if (helper.countObject(resp1) === 0) {
                            datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_incorrecto] + '<br><p>Aviso: Estimado usuario le queda(n) ' + qued_intentos + ' intento(s).</p>';
                            respuesta['correcta'] = -1;
                        } else {
                            datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_parcial] + '<br><p>Aviso: Estimado usuario le queda(n) ' + qued_intentos + ' intento(s).</p>';
                            respuesta['correcta'] = 0;
                        }
                    } else {
                        datos['mostrar_retro'] = retroalimentos[Ejercitador.tipoRetro.retro_parcial] + '<br><p>Aviso: Estimado usuario le queda(n) ' + qued_intentos + ' intento(s).</p>';
                        respuesta['correcta'] = 0;
                    }
                }
                respuesta['items'] = {};
            }

            if (tipoPreg == config.ejercicio.abierta) {
                datos['mostrar_retro'] = "Gracias por responder la pregunta";
            }

            respuesta['mostrar_retro'] = datos['mostrar_retro'];

            //Guardar en la Cookie
            respuesta_str = JSON.stringify(respuesta);
            app.storage('respuesta_' + idEjer, respuesta_str);

            datos.mostrar = datos['mostrar_retro'];
            datos.revisado = respuesta['revisado'];
            if (datos.revisado != 1)
                campos_respuestas.resetForm();

            Ejercitador.updateView(idEjer, targetLoad);

            Modal.show(datos.mostrar);

            var error_field = $('span.error_field', campos_respuestas);
            if (respuesta.correcta == -1)
                error_field.show();
            else
                error_field.hide();

            if (Ejercitador.funCallBack) // ejecutar despues que revise
                Ejercitador.funCallBack(respuesta['correcta']);


            Ejercitador.funCallBack = 0;

            $ = old$;
        },

        verificar: function () {
            var temp = app.storage('id_ejer_list');
            var ejer_sinrev = Array();
    
            if(temp){
                var datosEjer = temp.split(',');
                var cont_sinrev = 0;
    
                for (i = 0; i < datosEjer.length; i++) {
                    idPreg = datosEjer[i];
                    respuesta = JSON.parse(app.storage('respuesta_' + idPreg));
    
                    if (!respuesta || respuesta['revisado'] != 1) {
                        ejer_sinrev[cont_sinrev++] = i + 1;
                    }
    
                }
            }           

            var msg_terminar = " Seguro que desea terminar el entramiento ? <br>";
            if (ejer_sinrev == 0) {
                msg_terminar += 'Todos los ejercicios fueron revisados, acepte para ver los resultados del entrenamiento.';
            } else {
                msg_terminar += 'Le quedan por revisar ' + cont_sinrev + ' ejercicios. El: ';

                for (i = 0; i < ejer_sinrev.length; i++) {
                    msg_terminar += '[' + ejer_sinrev[i] + '] ';
                }

                msg_terminar += ' .<br>Si acepta estos ejercicios se dar&aacute;n por revisados.';
            }
            app.storage('ejer_sinrev', ejer_sinrev);
            Ejercitador.terminarModal(msg_terminar, "estadisticas");

        },
        escalarPuntos: function (puntos, escala) {
            switch (escala) {
                case 'esc_5': {
                    puntos = puntos / 100;
                    if (puntos < 0.6) puntos = 2;
                    else if (puntos > 0.6 && puntos < 0.85) puntos = 3;
                    else if (puntos > 0.85 && puntos < 0.95) puntos = 4;
                    else if (puntos > 0.95 || puntos == 1) puntos = 5;

                }
                    break;
                case 'esc_e': {
                    puntos = puntos / 100;
                    if (puntos < 0.6) puntos = 'Mal';
                    else if (puntos > 0.6 && puntos < 0.7) puntos = 'Regular';
                    else if (puntos > 0.7 && puntos < 0.85) puntos = 'Bien';
                    else if (puntos > 0.85 && puntos < 0.95) puntos = 'Muy Bien';
                    else if (puntos > 0.95 || puntos == 1) puntos = 'Excelente';
                }
                    break;
            }

            return puntos;

        },
        getPuntos: function (idPreg, respuesta) {
            respuesta['terminado'] = 1;
            if (respuesta['revisado'] != 1) {
                respuesta['revisado'] = 1;
                respuesta['items_correctos'] = 0;

                var cuerpo = Ejercitador.ejer_cuerpo_list[idPreg];
                if (cuerpo)
                    respuesta['items_incorrectos'] = cuerpo.length;
                else
                    respuesta['items_incorrectos'] = 1;

                respuesta['correcta'] = -1;
            }
            if (!respuesta['max_item'])
                total_items = respuesta['items_correctos'] + respuesta['items_incorrectos'];
            else
                total_items = respuesta['max_item'];

            var puntos = 0;

            if (total_items == respuesta['items_correctos'])
                puntos = 100;
            else if (respuesta['items_incorrectos'] != total_items) {
                var tipoPreg = Ejercitador.ejer_pregunta_list[idPreg];
                var tipoPregId = tipoPreg [Ejercitador.epreg.id_tipo_preg];

                if (tipoPregId == 2 || tipoPregId == 3) {
                    penalizar = 0.25 / total_items;
                    formula_eval = (respuesta['items_correctos'] / total_items) - (penalizar * respuesta['items_incorrectos']);
                    puntos = Math.round(100 * formula_eval);
                } else {
                    formula_eval = (respuesta['items_correctos'] / total_items);
                    puntos = Math.round(100 * formula_eval);
                }
            }
            respuesta['puntuacion'] = puntos;
            return respuesta;
        },
        estadisticas: function () {

            var datosEjer = Array();
            var temp = app.storage('id_ejer_list');
            if(temp){
                datosEjer = temp.split(',');
            }
            var escala = app.storage('escala');
            var numPreg = 0;
            var cadena = '';
            var puntosTotal = 0;

            //PARA GRAFICAR
            var datos = Array();
            datos['escala'] = 100;
            datos['escalagraf'] = 100;

            datos['correctas'] = 0;
            datos['incorrectas'] = 0;
            datos['parcial'] = 0;
            datos['total'] = 0;


            for (i = 0; i < datosEjer.length; i++) {
                var idPreg = datosEjer[i];
                var respuesta = JSON.parse(app.storage('respuesta_' + idPreg));

                if (!respuesta) respuesta = {};

                respuesta = ejerAccion.getPuntos(idPreg, respuesta);
                var puntos = respuesta["puntuacion"];
                puntosTotal += puntos;
                puntos = ejerAccion.escalarPuntos(puntos, escala);
                respuesta['puntuacion'] = puntos;


                var tipoPreguntaId = Ejercitador.ejer_pregunta_list[idPreg][Ejercitador.epreg.id_tipo_preg];
                tipoPregunta = Ejercitador.tipo_preg_list[tipoPreguntaId];
                cadena += 'Pregunta # ' + numPreg + '. Tipo de Pregunta: ' + tipoPregunta + '. Clificaci&oacute;n: ' + puntos + "\n";

                //PARA EL PRIMER GRAFICO
                if (respuesta['correcta'] == 1)
                    datos['correctas']++;
                else if (respuesta['correcta'] == -1)
                    datos['incorrectas']++;
                else if (respuesta['correcta'] == 0)
                    datos['parcial']++;

                //PARA EL 2DO GRAFICO
                if (!datos['tipo' + tipoPreguntaId]) datos['tipo' + tipoPreguntaId] = 0;
                if (!datos['inc' + tipoPreguntaId]) datos['inc' + tipoPreguntaId] = 0;

                datos['tipo' + tipoPreguntaId] += puntos;
                datos['inc' + tipoPreguntaId]++;
                datos['total'] += puntos;

                numPreg++;

            }

            var ejer_sinrev = app.storage('ejer_sinrev');
            ejerAccion.puntosTotal = Math.round(puntosTotal / datosEjer.length);
            ejerAccion.puntosTotal = ejerAccion.escalarPuntos(ejerAccion.puntosTotal, escala);

            switch (escala) {
                case 'esc_5': {
                    datos['escala'] = 5;
                    datos['escalagraf'] = 5;
                }
                    break;
                case 'esc_e': {
                    datos['escala'] = 'Excelente';
                    datos['escalagraf'] = 5;
                }
                    break;
            }

            for (var i = 1; i < 8; i++) { //  corresponde  a los ids de los tipo de pregunta
                if (!datos['tipo' + i])
                    datos['tipo' + i] = 0;
                else
                    datos['tipo' + i] = Math.round(datos['tipo' + i] / datos['inc' + i]);
            }

            if (!datos['total'])
                datos['total'] = 0;
            else
                datos['total'] = Math.round(datos['total'] / datosEjer.length);

            ejerAccion.graficar = datos;
            ejerAccion.misEjer = datosEjer;

            $.get('model/ejercicio/estadisticas.html', function (resp, textStatus, result) {
                Ejercitador.mytarget.html(result.responseText);

                ejerAccion.crearGraficos();
                var actual = parseInt(app.storage('posicion')) + 1;
                $('#cant_ejer').html(actual + '/' + ejerAccion.misEjer.length);
                $('#resultado_total').html('Puntuaci&oacute;n Total: ' + ejerAccion.graficar.total + ' de ' + datos['escala']);

                Ejercitador.eventosBtn();
            });

        },
        crearGraficos: function () {

            var graficar = ejerAccion.graficar;
            var datos1 = [];
            if (graficar.correctas) {
                datos1.push(['Correctas(' + graficar.correctas + ')', graficar.correctas]);
            }
            if (graficar.incorrectas) {
                datos1.push(['Incorrectas(' + graficar.incorrectas + ')', graficar.incorrectas]);
            }
            if (graficar.parcial) {
                datos1.push(['Parciales(' + graficar.parcial + ')', graficar.parcial]);
            }
            
            if(datos1.legend == 0){
                Ejercitador.terminar("salir");
            }

            var datos2 = [
                [graficar.tipo1, 'Selecci&oacute;n Simple'],
                [graficar.tipo2, 'Selecci&oacute;n Multiple'],
                [graficar.tipo3, 'Verdadero o Falso'],
                [graficar.tipo4, 'Relacionar Elementos'],
                [graficar.tipo5, 'Ordenar Seg&uacute;n Corresponda'],
                [graficar.tipo6, 'Completar Espacios en Blanco'],
                [graficar.tipo7, 'Identificar Respuesta Correcta']
            ];

          
            var plot1 = $.jqplot('graf_general', [datos1], {
                title: 'Por calificaci&oacute;n',
                seriesColors: ['#C07C3B', '#AA2211', '#F1E4C2'],
                seriesDefaults: {
                    renderer: $.jqplot.PieRenderer,
                    rendererOptions: {sliceMargin: 5}
                },
                legend: {show: true, escapeHtml: true}
            });

            var plot2 = $.jqplot('graf_tipologia', [datos2], {
                title: 'Por Tipo de Pregunta',
                seriesDefaults: {
                    renderer: $.jqplot.BarRenderer,
                    rendererOptions: {
                        barWidth: 30,
                        barPadding: -25,
                        barMargin: 25,
                        barDirection: 'horizontal',
                        varyBarColor: false
                    },
                    shadow: true
                },
                legend: {show: true},
                series: [{
                    label: 'Puntuaci&oacute;n'
                }],
                seriesColors: ['#C07C3B'],
                axes: {
                    xaxis: {min: 0, max: graficar.escalagraf, tickOptions: {formatString: '%.0f', showGridLine: false}},
                    yaxis: {
                        show: true, renderer: $.jqplot.CategoryAxisRenderer,
                        tickOptions: {show: true, showLabel: true},
                        showTicks: true
                    }
                }
            });
        }
    }//FIN ejerAccion
}();

function splitRespuestas(resp) {
    var array_resp = splitRespuestasVersionOld(resp);
    if (array_resp.length <= 1) {
        var txt = helper.trim(resp);
        array_resp = txt.split(" ");
    }
    //eliminar espacios del inincio y fin de las respuestas para evit ar errores
    $.each(array_resp, function (i, dat) {
        array_resp[i] = helper.trim(dat);
    });

    return array_resp;
}

function splitRespuestasVersionOld(resp) {
    //eliminar ultimas apariciones de <br> que pueden haber introducido el usuario por error
    var cad = resp.replace(/\<br\>+$/gi, "");
    //remplazar <br> por --
    cad = cad.replace(/\<br\>/gi, "--");
    //eliminar ttiquetas html que pueden haber introducido el usuario por error
    cad = helper.stripTags(cad);
    // separar cadena por --
    array_resp = cad.split("--");
    return array_resp;
}