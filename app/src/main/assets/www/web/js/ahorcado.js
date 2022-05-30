nsjuego.cargarAhorcado = function (datos, datosIntento) {

    nsjuego.style_letra = $("div.letras");
    nsjuego.cantIntento = datosIntento;
    nsjuego.cantIntentoF = datosIntento;
    nsjuego.contador = 0;
    nsjuego.caracter();
    nsjuego.contenido_A = datos;
    nsjuego.longitud = datos.length;
    nsjuego.pepe = 0;
    nsjuego.fallos = 0;
    nsjuego.perdidos = 0;
    nsjuego.ganados = 0;
    nsjuego.incrementador = 1000;
    nsjuego.array_letras = [];
    //nsjuego.escribePalabra(nsjuego.contenido_A[nsjuego.contador],nsjuego.array_letras,nsjuego.bandera_nivel);

    $('.letras').on('click', function (e) {
        nsjuego.cm = e.currentTarget.id.toLowerCase();
        // Codigo para saber que es pulsada la tecla �
        if (nsjuego.cm == 'ad') {
            nsjuego.cm = "\xf1";
            nsjuego.array_letras.push(nsjuego.cm);
        } else {
            nsjuego.array_letras.push(nsjuego.cm);
        }
        nsjuego.escribePalabra(nsjuego.contenido_A[nsjuego.contador], nsjuego.array_letras, nsjuego.bandera_nivel);

        // si ha ganado
        if (nsjuego.estanTodas(nsjuego.array_letras, nsjuego.contenido_A[nsjuego.contador][3])) {
            nsjuego.ganados++;
            if (nsjuego.bandera_reloj == 2) {
                clearTimeout(nsjuego.tiempo);
            }
            setTimeout("nsjuego.otraPalabra()", 1200);

        } else {

            if (!esta(nsjuego.cm, nsjuego.contenido_A[nsjuego.contador][3])) {
                nsjuego.fallos++;
                dibujaAhorado();

                // si ha aperdido
                if (nsjuego.fallos == 6) {
                    nsjuego.perdidos++;

                    if (nsjuego.bandera_reloj == 2) {
                        clearTimeout(nsjuego.tiempo);
                    }
                    // Ventana de Perdio
                    $("#lightP").css("display", "block");
                    $("#fallo_resp").html(nsjuego.contenido_A[nsjuego.contador][3]);
                    $("#light").css("display", "none");
                    $("#lightG").css("display", "none");
                    $("#fade").css("display", "block");
                }
            }
            $(e.currentTarget).removeClass('letras');
            $(e.currentTarget).addClass('clik');
        }

    });
}

function esta(caracter, miarray) {

    for (var j = 0; j < miarray.length; j++) {
        if (caracter == miarray[j] || caracter == miarray[j].toUpperCase() || caracter.toUpperCase() == miarray[j]) {
            return true;
        } else {
            for (var i = 0; i < nsjuego.carac.length; i++) {
                if ((nsjuego.carac[i][i] == miarray[j] && nsjuego.carac[i][nsjuego.carac[i][i]] == caracter) ||
                    (nsjuego.carac[i][i] == miarray[j].toUpperCase() && nsjuego.carac[i][nsjuego.carac[i][i]] == caracter) ||
                    (nsjuego.carac[i][i] == caracter && nsjuego.carac[i][nsjuego.carac[i][i]] == miarray[j]))
                    return true;
            }

        }
    }
    if (caracter == " ") {
        return true;
    }
    return false;
}

nsjuego.escribePalabra = function (objeto, array_letras, nivel) {
    $("#descripcion").html(objeto[2]);
    if (nivel == 1)// Para poner la primera letra del Nivel 2
    {
        var texto = '';
        texto += '<span class="letra">';
        texto += objeto[3].charAt(0);
        texto += '</span>';
        nsjuego.array_letras.push(objeto[3].charAt(0).toLowerCase());
        for (var i = 1; i < objeto[3].length; i++) {
            texto += '<span class="letra">';
            var cActual = objeto[3].charAt(i);
            if (esta(cActual, array_letras)) {
                texto += cActual;
            } else {
                texto += '_';
            }
            texto += '</span>';
        }
    } else {
        var texto = '';
        for (var i = 0; i < objeto[3].length; i++) {
            texto += '<span class="letra">';
            var cActual = objeto[3].charAt(i);
            if (esta(cActual, array_letras)) {
                texto += cActual;
            } else {
                texto += '_';
            }
            texto += '</span>';

        }
    }
    $('#juego_palabra').html(texto);
}
nsjuego.estanTodas = function (arrayAciertos, mipalabra) {
    for (var i = 0; i < mipalabra.length; i++) {
        if (!esta(mipalabra.charAt(i).toUpperCase(), arrayAciertos))
            return false;
    }
    return true;
}

//------------------Para mostrar mu�eco------------------//

function dibujaAhorado() {

    if (nsjuego.fallos == 0) {
        $("#cuerpo_ahorcado").html("<img src='../../web/images/juegos/ahorcado/mucheco_00.png'/>");
    } else if (nsjuego.fallos == 1) {
        $("#cuerpo_ahorcado").html("<img src='../../web/images/juegos/ahorcado/mucheco_01.png'/>");
    } else if (nsjuego.fallos == 2) {
        $("#cuerpo_ahorcado").html("<img src='../../web/images/juegos/ahorcado/mucheco_02.png'/>");
    } else if (nsjuego.fallos == 3) {
        $("#cuerpo_ahorcado").html("<img src='../../web/images/juegos/ahorcado/mucheco_03.png'/>");
    } else if (nsjuego.fallos == 4) {
        $("#cuerpo_ahorcado").html("<img src='../../web/images/juegos/ahorcado/mucheco_04.png'/>");
    } else if (nsjuego.fallos == 5) {
        $("#cuerpo_ahorcado").html("<img src='../../web/images/juegos/ahorcado/mucheco_05.png'/>");
    } else if (nsjuego.fallos == 6) {
        $("#cuerpo_ahorcado").html("<img src='../../web/images/juegos/ahorcado/mucheco_06.png'/>");
    }
}

nsjuego.continuar = function () {

    nsjuego.contador++;

    $("#lightP").css("display", "none");
    $("#light").css("display", "none");
    $("#lightG").css("display", "none");
    $("#fade").css("display", "none");


    if (nsjuego.contador < nsjuego.longitud)//para la otra palabra
    {
        nsjuego.fallos = 0;
        dibujaAhorado();

        //Poner continuar para otra palabra
        $.each(nsjuego.style_letra, function (i, cambiar) {
            $(cambiar).removeClass('clik');
            $(cambiar).addClass('letras');
        });

        for (j = nsjuego.array_letras.length; j > 0; j--)
            nsjuego.array_letras.pop(j);

        nsjuego.escribePalabra(nsjuego.contenido_A[nsjuego.contador], nsjuego.array_letras, nsjuego.bandera_nivel);
        if (nsjuego.bandera_reloj == 2) {
            nsjuego.pepe = 0;
            $(".contenido_reloj").progressbar({
                value: nsjuego.pepe
            });
            setTimeout("nsjuego.Segundero()", nsjuego.incrementador - 200);
        }
    } else {
        // Ventana para el que gane
        if (nsjuego.bandera_reloj == 2) {
            clearTimeout(nsjuego.tiempo);
        }
        nsjuego.perdidos = nsjuego.longitud - nsjuego.ganados;
        $("#est_gan").html(nsjuego.ganados);
        $("#est_perd").html(nsjuego.perdidos);
        var efect = (nsjuego.ganados * 100) / nsjuego.longitud;
        var convertido = efect.toFixed(0);
        $("#est_efect").html(convertido + " %");
        $("#lightP").css("display", "none");
        $("#light").css("display", "none");
        $("#lightEstadist").css("display", "block");
        $("#fade").css("display", "block");

    }
}


nsjuego.empezar = function () {
    location.reload();
}

nsjuego.otraPalabra = function () {
    $("#lightP").css("display", "none");
    $("#light").css("display", "none");
    $("#lightG").css("display", "block");
    $("#fade").css("display", "block");
}
nsjuego.salir = function () {

    $.getJSON('../../juego/terminarI', function (data, textStatus) {
    })
    window.close();
}

nsjuego.entrarNivel = function (nivel) {
    $("#light").css("display", "none");
    $("#juego_general").css("display", "block");
    $("#fade").css("display", "none");
    switch (nivel) {
        case 1: {
            nsjuego.bandera_reloj = 1;
            nsjuego.bandera_nivel = 1;
            nsjuego.escribePalabra(nsjuego.contenido_A[nsjuego.contador], nsjuego.array_letras, nsjuego.bandera_nivel);
            $("#reloj").css("display", "none");
            $("#juego_nivel").html("<img src='../../web/images/juegos/ahorcado/nivel_1_normal.png'/>");
        }
            break;
        case 2: {
            nsjuego.bandera_reloj = 1;
            nsjuego.bandera_nivel = 2;
            nsjuego.escribePalabra(nsjuego.contenido_A[nsjuego.contador], nsjuego.array_letras, nsjuego.bandera_nivel);
            $("#reloj").css("display", "none");
            $("#juego_nivel").html("<img src='../../web/images/juegos/ahorcado/nivel_2_normal.png'/>");
        }
            break;
        case 3: {
            nsjuego.bandera_reloj = 2;
            nsjuego.bandera_nivel = 2;
            nsjuego.escribePalabra(nsjuego.contenido_A[nsjuego.contador], nsjuego.array_letras, nsjuego.bandera_nivel);
            $("#juego_nivel").html("<img src='../../web/images/juegos/ahorcado/nivel_3_normal.png'/>");
            $("#contenido").addClass("contenido_reloj");
            $(".contenido_reloj").progressbar({
                value: nsjuego.pepe
            });
            setTimeout("nsjuego.Segundero()", nsjuego.incrementador - 200);
        }
            break;
        default: {
            break;
        }
    }


}
nsjuego.Segundero = function () {
    nsjuego.pepe++;
    if (nsjuego.pepe < 46) {
        $(".contenido_reloj").progressbar({
            value: nsjuego.pepe
        });
        nsjuego.tiempo = setTimeout("nsjuego.Segundero()", nsjuego.incrementador);
    } else {
        $("#lightP").css("display", "block");
        $("#fallo_resp").html(nsjuego.contenido_A[nsjuego.contador][3]);
        $("#light").css("display", "none");
        $("#lightG").css("display", "none");
        $("#fade").css("display", "block");
        nsjuego.perdidos++;
    }
}
//-----------------------------------------------------//
nsjuego.caracter = function () {
    nsjuego.carac = new Array(12);
    nsjuego.carac[0] = {a: "\xe1", 0: "a"}
    nsjuego.carac[1] = {o: "\xf3", 1: "o"}
    nsjuego.carac[2] = {u: "\xfa", 2: "u"}
    nsjuego.carac[3] = {e: "\xe9", 3: "e"}
    nsjuego.carac[4] = {i: "\xed", 4: "i"}
    nsjuego.carac[5] = {ad: "\xf1", 5: "ad"}
    nsjuego.carac[6] = {AD: "\xd1", 6: "AD"}
    nsjuego.carac[7] = {A: "\xc1", 7: "A"}
    nsjuego.carac[8] = {O: "\xd3", 8: "O"}
    nsjuego.carac[9] = {U: "\xda", 9: "U"}
    nsjuego.carac[10] = {E: "\xc9", 10: "E"}
    nsjuego.carac[11] = {I: "\xcd", 11: "I"}

}

function redimencion() {

    var alto = window.innerHeight;
    $('#juego_general').css('min-height', alto - 18);
    //$('#fade').css('height',alto-13);
    setTimeout("redimencion()", 1000);
}

$(document).ready(function () {
    redimencion();
    nsjuego.cargarAhorcado(window.opener.nsjuego.juego, 0);
});

