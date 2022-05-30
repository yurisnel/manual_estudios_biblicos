var nssopa = function () {

    return {
        data: new Array(),
        datos_Matriz: new Array(),
        target: '#gal_centro',

        init: function () {
            //nssopa.i=0;
            //nssopa.DMatriz;
            if (!parent.opener || !parent.opener.nsjuego || !parent.opener.nsjuego.juego)
                return;

            dataJuego = parent.opener.nsjuego.juego;
            /*while(!dataJuego[nssopa.i])
            {nssopa.i++;}*/
            /*var remplazo2=dataJuego[0][3];
            var remplazo1 = remplazo2.replace(" ", "\n"); */ //Nuevo para cambiar la respuesta
            nssopa.palabra_verdadera = dataJuego[0][3];
            //�="\xd1"
            var vocales = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "\xd1", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
            var matriz = dataJuego[0][2].split("@");
            var colum, fila;
            nssopa.str = "";
            nssopa.str = "<table border='0' cellpadding='0' cellspacing='0'>";
            for (fila = 0; fila < matriz.length; fila++) {
                nssopa.str += "<tr>";
                for (colum = 0; colum < matriz[fila].length; colum++) {
                    if (matriz[fila][colum] != " ") {
                        nssopa.str += "<td><div id='" + fila + "/" + colum + "'class='letraSopa'>" + matriz[fila][colum].toUpperCase() + "</div></td>";
                    } else {
                        var random = Math.floor(Math.random() * 27);
                        var vocalAleatoria = vocales[random];
                        nssopa.str += "<td><div id='" + fila + "/" + colum + "'class='letraSopa'>" + vocalAleatoria + "</div></td>";
                    }
                    nssopa.ultimaC = colum;
                }
                nssopa.str += "</tr>\n";
                nssopa.ultimaF = fila;
            }
            nssopa.str += "</table>";
            nssopa.datos_Matriz = [{'columna': nssopa.ultimaC}, {'data': nssopa.str}, {'fila': nssopa.ultimaF}];
        },
        cargar: function (e) {
        },
        limpiar: function () {
            $(this.target).empty();
        }
    }
}
();
nssopa.cargarSopa = function (datos, datosIntento, datos_Matriz) {
    nssopa.contador = 0;
    //nssopa.DMatriz=datos_Matriz;
    nssopa.datosIntento = datosIntento;
    nssopa.datos = datos;
    nssopa.ponchado = new Array();
    nssopa.estructura = new Array(6);
    nssopa.guardarDatos = new Array(nssopa.datos, nssopa.datosIntento, nssopa.datos[2]);
    //nssopa.palabra_verdadera=nssopa.datos[nssopa.i][3];
    nssopa.fila;
    nssopa.col;
    nssopa.filaA;
    nssopa.colA;
    nssopa.bandera = 0;
    nssopa.filaAn = 0;
    nssopa.coluAn = 0;
    nssopa.filaAc = 0;
    nssopa.coluAc = 0;
    nssopa.diagonalA = 0;
    nssopa.encontrar = new Array();
    nssopa.contadorP = 0;
    nssopa.marcar = 0;//Garantizar que lo primero que se hizo fue marcar
    nssopa.mat = nssopa.datos_Matriz[1]['data'];
    //nssopa.mat=nssopa.datos[i][2];
    nssopa.desmarcar = 0;// Para controlar a la hora de desmarcar
    $('#comprobar').css('display', 'none');//deshabilitar un div
}
$('.letraSopa,.letraSopaClick').live('dblclick', function (e) {
    var i = 0;
    var palabra = "";
    if (nssopa.ponchado[i][0]) {
        if (nssopa.desmarcar == 0) {
            nssopa.estructura = ["@", 0, 0, 0, 0, 0];
            nssopa.ponchado.push(nssopa.estructura);
            nssopa.contadorP++;
            nssopa.contador = 0;
            nssopa.bandera = 0;
            nssopa.marcar = 1;
        }

    }
});
$('.letraSopa,.letraSopaClick').live('mousedown', function (e) {
    switch (e.which) {
        case 1://Para cuando estamos marcando
        {
            if (nssopa.desmarcar != 1) {
                nssopa.general(e, 1);
            }
            break;
        }
        case 2:
            break;
        case 3://Para desmarcar
        {

            if (e.currentTarget.className == "letraSopaClick") {
                var id = e.currentTarget.id.split('/');
                var fila = id[0];
                var columna = id[1];
                if (nssopa.marcar != 0)//Verificar si se guardo la ultima palabra para empezar a desmarcar
                {
                    $.each(nssopa.ponchado, function (i) {
                        if (nssopa.ponchado[i][3] == fila && nssopa.ponchado[i][4] == columna) {
                            nssopa.ponchado[i][0] = "@";
                            $(nssopa.ponchado[i][5]).removeClass('letraSopaClick');
                            $(nssopa.ponchado[i][5]).addClass('letraSopa');
                        }
                    });
                    nssopa.desmarcar = 0;
                    nssopa.contador = 0;
                    nssopa.bandera = 0;
                }
            }
        }
            break;
        default:

    }

});

nssopa.esta = function (palabra)//Funcion para ver si la palabra a desmarcar se encuentra en las palabras encontra
{
    var bandera = 1;
    var encontrado = 0;
    nssopa.guardar();
    $.each(nssopa.encontrar, function (i) {
        if (typeof (nssopa.encontrar[i]) != "undefined") {
            if (nssopa.encontrar[i].length == palabra.length) {
                bandera = 0;
                $.each(nssopa.encontrar[i], function (j) {
                    if (nssopa.encontrar[i][j] == palabra[j] && bandera == 0) {
                        bandera = 0;
                    } else {
                        bandera = 1;
                    }
                });
                if (bandera == 0) {
                    encontrado = 1;
                    nssopa.encontrar[i] = "";
                }

            }
        }

    });
    if (encontrado == 1) {
        return true;
    } else {
        return false;
    }
}
nssopa.guardar = function ()//Funcion para ver si la palabra a desmarcar se encuentra en las palabras encontra
{
    var palabra = "";
    $.each(nssopa.ponchado, function (i) {

        if (nssopa.ponchado[i][0] != "@" && nssopa.ponchado[i][0]) {
            palabra += nssopa.ponchado[i][0];
        } else {
            if (nssopa.ponchado[i][0] != "undefined") {
                nssopa.encontrar.push(palabra);
                palabra = "";
            }
        }
    });

}
nssopa.columna = function (col, fil, matriz) {
    if (parseInt(matriz[3]) > parseInt(fil)) {
        nssopa.y = matriz[1] - 50;
        nssopa.x = matriz[2];
        return true;
    }
    if (parseInt(matriz[3]) < parseInt(fil)) {
        nssopa.y = matriz[1] + 25;
        nssopa.x = matriz[2];
        return false;
    }
}

nssopa.filaF = function (col, fil, matriz) {
    if (parseInt(matriz[4]) > parseInt(col)) {
        nssopa.x = matriz[2] - 50;
        nssopa.y = matriz[1];
        return true;
    }
    if (parseInt(matriz[4]) < parseInt(col)) {
        nssopa.y = matriz[1];
        nssopa.x = matriz[2] + 25;
        return false;
    }
}

nssopa.d = function (e, col, fil, matriz, camino) {
    if (nssopa.paso == 0 || nssopa.paso == 1) {
        if (parseInt(fil) + 1 == parseInt(matriz[3]) && parseInt(col) + 1 == parseInt(matriz[4])) {
            if (matriz[1] - 25 >= e.layerY && matriz[2] - 25 >= e.layerX) {
                contenido(e, 1, camino);
            }
        }

    }
    if (nssopa.paso == 0 || nssopa.paso == 2) {
        if (parseInt(fil) + 1 == parseInt(matriz[3]) && parseInt(col) - 1 == parseInt(matriz[4])) {
            if (matriz[1] - 25 >= e.layerY && matriz[2] + 25 >= e.layerX) {
                contenido(e, 2, camino);
            }
        }

    }
    if (nssopa.paso == 0 || nssopa.paso == 3) {
        if (parseInt(fil) - 1 == parseInt(matriz[3]) && parseInt(col) + 1 == parseInt(matriz[4])) {
            if (matriz[1] + 25 >= e.layerY && matriz[2] - 25 >= e.layerX) {
                contenido(e, 3, camino);
            }
        }

    }
    if (nssopa.paso == 0 || nssopa.paso == 4) {
        if (parseInt(fil) - 1 == parseInt(matriz[3]) && parseInt(col) - 1 == parseInt(matriz[4])) {
            if (matriz[1] + 25 >= e.layerY && matriz[2] + 25 >= e.layerX) {
                contenido(e, 4, camino);
            }
        }

    }
}

function contenido(e, paso, camino) {
    if (camino == 1) {
        $(e.currentTarget).removeClass('letraSopa');
        $(e.currentTarget).addClass('letraSopaClick');

    }
    nssopa.estructura = [e.currentTarget.textContent, nssopa.ponchado[nssopa.contadorP - 1][1] + 25, nssopa.ponchado[nssopa.contadorP - 1][2] + 25, nssopa.filaA, nssopa.colA, e.currentTarget];
    nssopa.ponchado.push(nssopa.estructura);
    nssopa.contador++;
    nssopa.contadorP++;
    nssopa.fila = nssopa.filaA;
    nssopa.col = nssopa.colA;
    nssopa.bandera = 3;
    nssopa.paso = paso;

}

$('#comensar').live('click', function (e) {
    $("#lightSopa").css("display", "block");
    $("#fade").css("display", "block");
});
$('#cerrar').live('click', function (e) {
    window.close();
});
$('#ver_palabra').live('click', function (e)//Palabra  no encontrada
{
    $("#palabras").css("display", "block");
    $("#fade").css("display", "block");
    $("#lightEstadist").css("display", "none");
    nssopa.palabra_e = 1;
    var texto = "";
    for (var i = 0; i < nssopa.final_NE.length; i++) {
        texto += '<span class="letra">';
        texto += nssopa.final_NE[i];
        texto += '</span></br>';
    }
    $("#contenido_palabra").html(texto);
});
$('#ver_palabraC').live('click', function (e)//Palabra encontrada
{
    $("#palabras").css("display", "block");
    $("#fade").css("display", "block");
    $("#lightEstadist").css("display", "none");
    nssopa.palabra_e = 1;
    var texto = "";
    for (var i = 0; i < nssopa.final_E.length; i++) {
        texto += '<span class="letra">';
        texto += nssopa.final_E[i];
        texto += '</span></br>';
    }
    $("#contenido_palabra").html(texto);
});
$('#lightEstadist').live('click', function (e) {
    if (nssopa.palabra_e != 1)//Para a la hora de ver las palabras no encontradas que aparesca las palabras con el fondo en negro
    {
        $("#lightEstadist").css("display", "none");
        $("#sopa_fondo").css("display", "block");
        $("#fade").css("display", "none");
        switch (nssopa.sopa_nivel) {
            case 1: {
                $("#sopa").html("");
                $("#contenido_pizarra").html("");
                $("#contenido_pizarra1").html("");
                $('#comprobar').css('display', 'none');
                $('#comensar').css('display', 'block');
                nssopa.cargarSopa(nssopa.guardarDatos[0], nssopa.guardarDatos[1], nssopa.guardarDatos[2]);

            }
                break;
            case 2: {
                $("#sopa").html("");
                $("#contenido_pizarra").html("");
                $('#comprobar').css('display', 'none');
                $('#comensar').css('display', 'block');
                nssopa.cargarSopa(nssopa.guardarDatos[0], nssopa.guardarDatos[1], nssopa.guardarDatos[2]);

            }
                break;
            case 3: {
                clearTimeout(nssopa.tiempo);
                $("#contenido_pizarra").html("");
                $('#comprobar').css('display', 'none');
                $('#comensar').css('display', 'block');
                nssopa.cargarSopa(nssopa.guardarDatos[0], nssopa.guardarDatos[1], nssopa.guardarDatos[2]);

            }
                break;
            default:
                break;
        }
    }
});
nssopa.comprobar = function (perdio) {
    nssopa.palabra_verdadera = nssopa.palabra_verdadera.trim();
    var cambiar = nssopa.palabra_verdadera.split("<br>");//Variable donde
    cambiar.pop();
    nssopa.final_E = [];
    nssopa.final_NE = [];
    $.each(cambiar, function (i) {
        {
            if (nssopa.esta(cambiar[i].toUpperCase())) {
                nssopa.final_E.push(cambiar[i]);
            } else {
                nssopa.final_NE.push(cambiar[i]);
            }
        }

    });

    if (cambiar != "")//Condicion para cuando no le entran palabras correctas
    {
        nssopa.palabra_E = cambiar.length - nssopa.final_NE.length;
        $("#est_gan").html(nssopa.palabra_E);
        $("#est_perd").html(nssopa.final_NE.length);
        var efect = (nssopa.palabra_E * 100) / cambiar.length;
        nssopa.convertido = efect.toFixed(0);
        if (perdio == 1)//Si perdio por tiempo que nada mas me muestre la ventana de estadistica aunque haya adivinado todas
        {
            $("#est_efect").html(nssopa.convertido + " %");
            $("#lightEstadist").css("display", "block");
            $("#fade").css("display", "block");
            $("#lightP").css("display", "none");
            $("#ver_palabra").css("display", "block");
            $("#ver_palabraC").css("top", "137px");
        } else {
            if (nssopa.convertido == 100) {
                if (nssopa.sopa_nivel == 3) {
                    clearTimeout(nssopa.tiempo);
                }
                //$("#sopa_pizarra1").css("display", "block");
                $("#fade").css("display", "block");
                $("#lightG").css("display", "block");
                $("#lightP").css("display", "none");

            } else {
                $("#est_efect").html(nssopa.convertido + " %");
                //$("#sopa_pizarra1").css("display", "none");
                $("#lightEstadist").css("display", "block");
                $("#fade").css("display", "block");
                $("#lightP").css("display", "none");
                $("#ver_palabra").css("display", "block");
                $("#ver_palabraC").css("top", "137px");
            }
            if (nssopa.palabra_E != 0) {
                $("#ver_palabraC").css("display", "block");
            } else {
                $("#ver_palabraC").css("display", "none");
            }
        }
    }

}
nssopa.continuar = function () {
    if (nssopa.convertido == 100) {
        $("#ver_palabra").css("display", "none");
        $("#ver_palabraC").css("top", "169px");

    } else {
        $("#ver_palabra").css("display", "block");
        $("#ver_palabraC").css("top", "137px");
    }
    if (nssopa.palabra_E != 0) {
        $("#ver_palabraC").css("display", "block");
    } else {
        $("#ver_palabraC").css("display", "none");
    }

    $("#est_gan").html(nssopa.palabra_E);
    $("#est_perd").html(nssopa.final_NE.length);
    $("#est_efect").html(nssopa.convertido + " %");
    $("#lightEstadist").css("display", "block");
    $("#fade").css("display", "block");
    $("#lightG").css("display", "none");
}
nssopa.estadisticas = function () {
    $("#est_gan").html(nssopa.palabra_E);
    $("#est_perd").html(nssopa.final_NE.length);
    $("#est_efect").html(nssopa.convertido + " %");
    $("#lightEstadist").css("display", "block");
    $("#fade").css("display", "block");
    $("#palabras").css("display", "none");
    nssopa.palabra_e = 0;
}
nssopa.entrarNivel = function (nivel) {
    $("#lightSopa").css("display", "none");
    $("#sopa_fondo").css("display", "block");
    $("#fade").css("display", "none");
    nssopa.sopa_nivel = nivel;
    if (nivel == 1) {
        $("#sopa_nivel").html("<img src='../../web/images/juegos/sopa/nivel_1.png'/>");
        $("#sopa").html(nssopa.mat);
        $("#contenido_pizarra").html(nssopa.datosIntento);
        $("#contenido_pizarra1").html(nssopa.palabra_verdadera);
        $("#reloj").css("display", "none");
        $("#sopa_pizarra").css("display", "block");
        $("#sopa_pizarra1").css("display", "none");
        $('#comprobar').css('display', 'block');
        $('#comensar').css('display', 'none');
    }
    if (nivel == 2) {
        $("#sopa_nivel").html("<img src='../../web/images/juegos/sopa/nivel_2.png'/>");
        $("#sopa").html(nssopa.mat);
        $("#contenido_pizarra").html(nssopa.datosIntento);
        $("#reloj").css("display", "none");
        $("#sopa_pizarra").css("display", "block");
        $("#sopa_pizarra1").css("display", "none");
        $('#comprobar').css("display", "block");
        $('#comensar').css('display', 'none');

    }
    if (nivel == 3) {
        $("#sopa_nivel").html("<img src='../../web/images/juegos/sopa/nivel_3.png'/>");
        nssopa.pepe = 97;
        $("#sopa").html(nssopa.mat);
        $("#contenido_pizarra2").html(nssopa.datosIntento);
        $("#reloj").css("display", "block");
        $("#sopa_pizarra").css("display", "none");
        $("#sopa_pizarra1").css("display", "block");
        $("#contenido").addClass("capa_reloj");
        $(".capa_reloj").progressbar({
            value: nssopa.pepe
        });
        setTimeout("nssopa.Segundero()", 1000);
        $('#comprobar').css('display', 'block');
        $('#comensar').css('display', 'none');
    }
    $('#sopa').bind('contextmenu', function (e) {
        e.preventDefault();
    });

}
nssopa.Segundero = function () {
    nssopa.pepe--;
    if (nssopa.pepe > 0) {
        $(".capa_reloj").progressbar({
            value: nssopa.pepe
        });
        nssopa.tiempo = setTimeout("nssopa.Segundero()", 1000);
    } else {
        $("#lightP").css("display", "block");
        $("#fade").css("display", "block");
    }
}

nssopa.general = function (e, camino) {
    if (nssopa.contador == 0)//Primera letra ponchada
    {

        var id = e.currentTarget.id.split('/');
        nssopa.fila = id[0];
        nssopa.col = id[1];
        var fila = id[0];
        var columna = id[1];
        nssopa.paso = 0;
        fila++;
        columna++;
        if (camino == 1)//Si se cumple estamos en la opcion de marcar
        {
            $(e.currentTarget).removeClass('letraSopa');
            $(e.currentTarget).addClass('letraSopaClick');

        }

        nssopa.estructura = [e.currentTarget.textContent, fila * 25, columna * 25, nssopa.fila, nssopa.col, e.currentTarget];
        nssopa.ponchado.push(nssopa.estructura);
        nssopa.contador++;
        nssopa.contadorP++;
        nssopa.diagonal = 0;
        nssopa.filaAn = nssopa.fila;
        nssopa.coluAn = nssopa.col;
    } else {
        var id = e.currentTarget.id.split('/');
        nssopa.filaA = id[0];
        nssopa.colA = id[1];
        if (nssopa.ponchado[nssopa.contadorP - 1][3] != nssopa.filaA || nssopa.ponchado[nssopa.contadorP - 1][4] != nssopa.colA)//Para garantizar que no se duplique la misma palabra
        {
            if (nssopa.fila == nssopa.filaA) {
                if (nssopa.bandera == 0 || nssopa.bandera == 1) {
                    if (nssopa.filaF(nssopa.colA, nssopa.filaA, nssopa.ponchado[nssopa.contadorP - 1]))// Para comprobar si se marcar abajo-arriba o arriba-abajo
                    {
                        if (nssopa.x < e.layerX) {
                            if (nssopa.y >= e.layerY) {
                                if (camino == 1) {
                                    $(e.currentTarget).removeClass('letraSopa');
                                    $(e.currentTarget).addClass('letraSopaClick');

                                }
                                nssopa.estructura = [e.currentTarget.textContent, nssopa.ponchado[nssopa.contadorP - 1][1], nssopa.ponchado[nssopa.contadorP - 1][2] - 25, nssopa.filaA, nssopa.colA, e.currentTarget];
                                nssopa.ponchado.push(nssopa.estructura);
                                nssopa.contador++;
                                nssopa.contadorP++;
                                nssopa.fila = nssopa.filaA;
                                nssopa.col = nssopa.colA;
                                nssopa.bandera = 1;
                            }
                        }
                    }//Vertical(Columna)
                    else {
                        if (nssopa.x > e.layerX) {
                            if (nssopa.y >= e.layerY) {
                                if (camino == 1) {
                                    $(e.currentTarget).removeClass('letraSopa');
                                    $(e.currentTarget).addClass('letraSopaClick');

                                }
                                nssopa.estructura = [e.currentTarget.textContent, nssopa.ponchado[nssopa.contadorP - 1][1], nssopa.ponchado[nssopa.contadorP - 1][2] + 25, nssopa.filaA, nssopa.colA, e.currentTarget];
                                nssopa.ponchado.push(nssopa.estructura);
                                nssopa.contador++;
                                nssopa.contadorP++;
                                nssopa.fila = nssopa.filaA;
                                nssopa.col = nssopa.colA;
                                nssopa.bandera = 1;
                            }
                        }

                    }
                }
            } else {
                if (nssopa.col == nssopa.colA) {
                    if (nssopa.bandera == 0 || nssopa.bandera == 2) {
                        if (nssopa.columna(nssopa.colA, nssopa.filaA, nssopa.ponchado[nssopa.contadorP - 1]))// Para comprobar si se marcar abajo-arriba o arriba-abajo
                        {
                            if (nssopa.y < e.layerY)//abajo-arriba
                            {

                                if (nssopa.x >= e.layerX) {
                                    if (camino == 1) {
                                        $(e.currentTarget).removeClass('letraSopa');
                                        $(e.currentTarget).addClass('letraSopaClick');

                                    }
                                    nssopa.estructura = [e.currentTarget.textContent, nssopa.ponchado[nssopa.contadorP - 1][1] - 25, nssopa.ponchado[nssopa.contadorP - 1][2], nssopa.filaA, nssopa.colA, e.currentTarget];
                                    nssopa.ponchado.push(nssopa.estructura);
                                    nssopa.contador++;
                                    nssopa.contadorP++;
                                    nssopa.fila = nssopa.filaA;
                                    nssopa.col = nssopa.colA;
                                    nssopa.bandera = 2;
                                }
                            }

                        } else// Si arriba-abajo
                        {

                            if (nssopa.y > e.layerY) {

                                if (nssopa.x >= e.layerX) {

                                    if (camino == 1) {
                                        $(e.currentTarget).removeClass('letraSopa');
                                        $(e.currentTarget).addClass('letraSopaClick');


                                    }
                                    nssopa.estructura = [e.currentTarget.textContent, nssopa.ponchado[nssopa.contadorP - 1][1] + 25, nssopa.ponchado[nssopa.contadorP - 1][2], nssopa.filaA, nssopa.colA, e.currentTarget];
                                    nssopa.ponchado.push(nssopa.estructura);
                                    nssopa.contador++;
                                    nssopa.contadorP++;
                                    nssopa.fila = nssopa.filaA;
                                    nssopa.col = nssopa.colA;
                                    nssopa.bandera = 2;
                                }
                            }
                        }
                    }

                }//Horizontal(Fila)
                else {
                    if (nssopa.bandera == 0 || nssopa.bandera == 3) {
                        nssopa.d(e, nssopa.colA, nssopa.filaA, nssopa.ponchado[nssopa.contadorP - 1], camino)
                    }

                }//Diagonal
            }
        }
    }
}

function redimencion() {
	var alto = window.innerHeight;

	$('#fondo').css('min-height', alto - 18);

	setTimeout("redimencion()", 1000);
}

$(document).ready(function () {
	redimencion();
	window.opener;
	nssopa.cargarSopa(window.opener.nsjuego.juego[0], window.opener.title, window.opener.nsjuego.juego[0][2]);

    nssopa.init();

});
