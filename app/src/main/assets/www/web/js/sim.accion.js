var simAccion = function () {

    return {
        EscenasLlegadas: function (idEsc, utilidad) {

            var escena;
            for (idCuerpo in sim.escena_cuerpo_list[idEsc]) {
                data = sim.escena_cuerpo_list[idEsc][idCuerpo];

                if (data[sim.cuerpo.utilidad] == utilidad) {

                    if (escena && sim.ruta_list[idCuerpo] != escena) {
                        return false;
                    }

                    escena = sim.ruta_list[idCuerpo];
                }
            }

            return true;
        },

        simulacionTerminada: function () {
            datSim = JSON.parse(app.storage('datosSim'));
            pos = parseInt(app.storage('posSim'));
            simulacion = datSim[pos] || datSim[--pos] ;

            var data = sim.getSimulacion(simulacion.idsim);

            contOptimo = 0;

            $.each(datSim[pos]['ruta'], function (pos, camino) {
                if (camino['tipoRuta'] == 'optima')
                    contOptimo++;

                data.items.push({text: camino['nombre_escena']});
            });


            if (contOptimo == (helper.countObject(datSim[pos]['ruta'])) - 1)
                data.message = "optimo";
            else
                data.message = "no_optimo";

            data.intentos = -1;
            data.pager = (pos + 1) + '/' + helper.countNoEmpty(datSim);
            data.pagerSize = config.datosProd.pager_size?config.datosProd.pager_size: "full"; //full or min

            var html = $.tmpl("escena_finalizada", data);
            sim.mytarget.html(html);
            sim.eventosBtn(Ejercitador.mytarget);

        },
        haFallado: function (intentos) {

            datSim = JSON.parse(app.storage('datosSim'));
            pos = parseInt(app.storage('posSim'));
            simulacion = datSim[pos] || datSim[--pos] ;

            var data = sim.getSimulacion(simulacion.idsim);


            $.each(datSim[pos]['ruta'], function (pos, camino) {
                data.items.push({text: camino['nombre_escena']});
            });

            data.message = "fallido";
            data.intentos = intentos;

            data.pager = (pos + 1) + '/' + helper.countNoEmpty(datSim);
            data.pagerSize = config.datosProd.pager_size?config.datosProd.pager_size: "full"; //full or min

            data.intentos = (pos + 1) + '/' + helper.countNoEmpty(datSim);
            var html = $.tmpl("escena_finalizada", data);
            sim.mytarget.html(html);
            sim.eventosBtn(Ejercitador.mytarget);

        },

        revisado: function (id_esc) {
            datSim = JSON.parse(app.storage('datosSim'));
            pos = parseInt(app.storage('posSim'));
            total = helper.countObject(datSim);
            var simulacion = datSim[pos] || datSim[--pos];

            if (sim.escena_list[id_esc][sim.escena.tipo] == 'Escena final') {
                simulacion['termine'] = 1;
                datSim[pos] = simulacion;
                app.storage('datosSim', JSON.stringify(datSim));
            }

            if (!simulacion.termine) {
                var resp_user = getInputChecked($(':checkbox', sim.mytarget));
                if (resp_user.length) {
                    // Para saber la cantidad de elementos utiles y neutros de una escena para luego comparar
                    utiles = sim.escena_list[id_esc]['cu'];
                    neutras = sim.escena_list[id_esc]['cn'];

                    mismaEscU = simAccion.EscenasLlegadas(id_esc, 1);
                    mismaEscN = simAccion.EscenasLlegadas(id_esc, 3);

                    i = 0;

                    var esc_sigte = 0, cant_util = 0, cant_neutras = 0;
                    $.each(resp_user, function (i, item) {
                        //datos[i] = simAccion.Escena_sgte(id_esc,data);
                        idcuerpo = $(item).val();
                        cuerpo = sim.escena_cuerpo_list[id_esc][idcuerpo];
                        if (sim.ruta_list[idcuerpo])
                            esc_sigte = sim.ruta_list[idcuerpo];

                        if (cuerpo[sim.cuerpo.utilidad] == 1)// Para saber la cantidad de utiles
                            cant_util++;
                        else if (cuerpo[sim.cuerpo.utilidad] == 3)// Para saber la cantidad de neutras
                            cant_neutras++;

                    });

                    if ((utiles == cant_util) && (resp_user.length == utiles) && mismaEscU != false) {
                        ruta = 'optima';
                    }
                    else if ((cant_neutras == neutras) && (resp_user.length == neutras) && mismaEscN != false) {
                        ruta = 'no optima';
                    }
                    else if (cant_util && mismaEscU == false && resp_user.length == cant_util) {//Para el caso extremo en las utiles
                        ruta = 'optima';
                    }
                    else if (cant_neutras && mismaEscN == false && resp_user.length == cant_neutras) {//Para el caso extremo en las utiles
                        ruta = 'no optima';
                    }
                    else  ruta = 'ninguna';

                    // Para saber cual es la siguiente escena
                    if (ruta != 'ninguna') {
                        sim_actual = simulacion['idsim'];

                        /* if (sim.escena_list[esc_sigte][sim.escena.tipo] == 'Escena final') {
                             simulacion['termine'] = 1;
                        }*/

                        simulacion['id_escena'] = esc_sigte;
                        camino = simulacion['camino'] + 1;
                        //Descomentar luego esto es para la tabla final de la sim para saber si la ruta fue optima o no.

                        if (!simulacion['ruta'] || !simulacion['ruta'][camino - 1]) {
                            simulacion['ruta'] = new Object();
                            simulacion['ruta'][camino - 1] = new Object();
                        }

                        simulacion['ruta'][camino - 1]['tipoRuta'] = ruta;
                        simulacion['ruta'][camino] = new Object();
                        simulacion['ruta'][camino]['nombre_escena'] = sim.escena_list[esc_sigte][sim.escena.nombre];
                        simulacion['camino'] = camino;

                        datSim[pos] = simulacion;
                        app.storage('datosSim', JSON.stringify(datSim));

                        sim.loadSimulacion(pos);

                    }
                    else if (parseInt(simulacion['intentos']) !== 0) { //LLEGA AQUI CUANDO NO VA A NINGUNA RUTA Y LE QUEDAN INTENTOS

                        simulacion['intentos']--;

                        if (simulacion['intentos'] != 0) {
                            sim_actual = simulacion['idsim'];
                            esc_actual = sim.dameEscena(sim_actual, 'Escena inicial');

                            simulacion['ruta'] = new Object();//Reiniciar la ruta para que empiece del inicio
                            simulacion['camino'] = 0;
                            simulacion['ruta'][0] = new Object();
                            simulacion['ruta'][0]['nombre_escena'] = sim.escena_list[esc_actual][sim.escena.nombre];
                            simulacion['id_escena'] = esc_actual;

                            var mensaje = '<b>No ha demostrado los conocimientos necesarios para terminar la simulaci&oacute;n.</b><br>Le quedan ' + simulacion['intentos'] + ' intentos';
                            Modal.show( mensaje);
                        }
                        else {
                            simAccion.haFallado(0);
                        }

                        datSim[pos] = simulacion;
                        app.storage('datosSim', JSON.stringify(datSim));

                    } else {
                        simAccion.haFallado(0);
                    }
                }
                else {
                    var mensaje = '<b>Usted debe seleccionar al menos una opci&oacute;n';
                    Modal.show(mensaje);
                }

            }
            else if (simulacion.termine == 1) {
                simAccion.simulacionTerminada();
            }

        }

    }
}();