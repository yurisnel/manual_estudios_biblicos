var nsespiral = function () {

	return {
		data: new Array(),
		target: '#gal_centro',

		init: function () {
			$('img.p').hover(function () {
					this.src = "../../web/images/juegos/espiral/caras_resaltadas/2.png";
				},
				function () {
					this.src = "../../web/images/juegos/espiral/caras/2.png";
				});
			nsespiral.dado_dos = 0;

			nsespiral.cargar();
		},
		cargar: function (e) {
			if (parent.opener) {
				ejer = parent.opener.Ejercitador;
				ejerAccion = parent.opener.ejerAccion;
			}
			// si no se han cargado los datos de los ejercicios
			if (ejer && ejer.ejer_pregunta.length == 0) {
				ejer.loadData();
			}
		},
		limpiar: function () {
			$(this.target).empty();
		}
	}
}
();
nsespiral.dado = function (ponchado) {
	contar = 1;
	mostrar = 0;
	parar_avance = 0;
	mover = new Array([-35, 40], [-25, 40], [-15, 50], [-5, 45], [-5, 55], [-5, 50], [5, 50], [20, 40], [20, 40], [20, 40], [25, 50], [35, 35], [35, 35], [45, 25], [40, 25], [45, 10], [60, 10], [50, -5], [50, -5], [45, -20], [45, -30], [45, -30], [30, -30], [30, -40], [20, -35], [10, -50], [20, -50], [5, -50], [-5, -50], [-20, -50], [-30, -50], [-30, -40], [-20, -40], [-50, -30], [-50, -20], [-50, -20], [-50, -10], [-50, 5], [-50, 10], [-40, 30], [-40, 30], [-40, 30], [-20, 50], [-20, 50], [-10, 40], [-5, 50], [20, 50], [20, 50], [30, 50], [40, 30], [50, 10], [50, 5], [50, 0], [50, -15], [50, -20], [50, -30], [30, -30], [10, -60], [0, -60], [-20, -50], [-40, -40], [-50, -30], [-60, -10], [-60, 0], [-60, 50], [-20, 30]);
	compu = new Array([-30, 35], [-30, 35], [-20, 35], [-10, 40], [0, 45], [0, 45], [10, 40], [10, 35], [10, 35], [10, 35], [40, 35], [35, 15], [35, 30], [30, 30], [30, 20], [35, 15], [35, 0], [45, 0], [45, -10], [45, -15], [30, -25], [30, -25], [25, -25], [25, -30], [30, -30], [10, -40], [10, -40], [10, -30], [-5, -50], [-15, -40], [-20, -35], [-20, -35], [-20, -30], [-30, -30], [-40, -10], [-40, -10], [-40, -10], [-40, 5], [-40, 10], [-40, 10], [-30, 30], [-20, 30], [-20, 30], [-20, 40], [-10, 30], [-10, 40], [20, 30], [20, 30], [25, 30], [25, 30], [25, 10], [40, 5], [40, 5], [40, -10], [30, -10], [30, -20], [20, -30], [5, -40], [5, -40], [-20, -30], [-20, -30], [-30, -10], [-40, 0], [-30, 10], [-30, 20], [-40, 20]);


	//sones="<embed id=sonido src=[COLOR=blue]TU_MID.MID[/COLOR]  autostart=true loop=true >"; Para el sonido
	if (ponchado == 0) {
		randomnumber = 1 + Math.floor(Math.random() * 6);
		$('#dado_mostrar').html('<img src="../../web/images/juegos/espiral/caras/' + randomnumber + '.png" width="125" height="125" class="m"/>');
		nsespiral.comenzar(randomnumber);
	} else {
		randomnumber = 1 + Math.floor(Math.random() * 6);
		$('#dado_mostrar').html('<img src="../../web/images/juegos/espiral/caras/' + randomnumber + '.png" width="125" height="125" class="m"/>');
		$('.dado_mostrar').css('opacity', mostrar);
		nsespiral.comenzar(randomnumber);
		dado_anterior = randomnumber;
	}
	$('img.m').hover(function () {
			this.src = '../../web/images/juegos/espiral/caras_resaltadas/' + randomnumber + '.png';
		},
		function () {
			this.src = '../../web/images/juegos/espiral/caras/' + randomnumber + '.png';
		});

};
nsespiral.cartaA = function () {

	if (carta < 8) {
		var cadena = '0' + carta + '.png';
		$('#targeta').html('<img src="../../web/images/juegos/espiral/animacion_cartas/' + cadena + '" width="237" height="232" />');
		setTimeout('nsespiral.cartaA()', 100);
		carta++;
	}
};
// Inicio para el funcionamiento del Reloj---------------------------------///////////
nsespiral.reloj = function () {
	sec = 0;
	minu = 0;
	mil = 0;
	keepgoin = true;
	fecha_actual = new Date();
	dia = fecha_actual.getDate();
	mes = fecha_actual.getMonth() + 1;
	ano = fecha_actual.getFullYear();
	if (dia < 10) {
		dia = "0" + dia;
	}
	dia = dia + "-";
	if (mes < 10) {
		mes = "0" + mes;
	}
	mes = mes + "-";
	$('#dia').html(dia);
	$('#mes').html(mes);
	$('#anno').html(ano);
	nsespiral.cronometro();
};
nsespiral.cronometro = function () {
	if (keepgoin) {
		mil += 1;
		if (mil == 10) {
			mil = 0;
			sec += 1;
		}
		if (sec == 60) {
			sec = 0;
			minu += 1;
		}
		Strsec = "" + sec;
		Strmin = "" + minu;
		Strmil = mil;
		if (Strsec.length != 2) {
			Strsec = "0" + sec;
		}
		if (Strmin.length != 2) {
			Strmin = "0" + minu;
		}
		$('#minuto').html('' + Strmin + ':');
		$('#segundo').html(Strsec);
		$('#mili').html(Strmil);
		//bolmey setTimeout("nsespiral.cronometro()",100);
	}

};
/// Fin-----------------------------------------/////////////////////////////////////
///// Comenzar a mover los dados
nsespiral.comenzar = function (randomnumber) {
	if (contar < 10) {
		var cadena = '0' + contar + '.png';
		$('#dado').html('<img src="../../web/images/juegos/espiral/animacion/' + cadena + '" width="125" height="125" />');
		setTimeout('nsespiral.comenzar(' + randomnumber + ')', 80);
		contar++;
	} else {
		if (contar < 15) {
			var cadena = '' + contar + '.png';
			$('#dado').html('<img src="../../web/images/juegos/espiral/animacion/' + cadena + '" width="125" height="125" />');
			mostrar = mostrar + 0.25;
			$('.dado_mostrar').css('opacity', mostrar);
			setTimeout('nsespiral.comenzar(' + randomnumber + ')', 80);
			contar++;
		} else {

			if (nsespiral.dado_dos == 58)// Para la casilla especia de lanzar dos vece el dado
			{
				$('#dado_mostrar').attr('onclick', '')//deshabilitar dado
				$('#dado').attr('onclick', '')//deshabilitar dado
				if (randomnumber % 2 == 0)// Avanza
				{
					nsespiral.avanzar_jugador(randomnumber);
				} else//retrocede
				{
					nsespiral.retroceder(nsespiral.dado_dos);
				}
			} else {
				$('#dado_mostrar').attr('onclick', '')//deshabilitar dado
				$('#dado').attr('onclick', '')//deshabilitar dado
				nsespiral.avanzar_jugador(randomnumber);
			}
		}

	}

};
nsespiral.avanzar_jugador = function (numero) {
	nsespiral.dado_dos = 0;
	usuario = sumaU + numero;
	if (usuario > 65)//Terminar, has ganado
	{
		nsespiral.modificar_reloj((numero * 2), '-', '.class_reloj_maquina');
		$("#ganado").css("display", "block");
		$("#fade").css("display", "block");
	} else {
		while (sumaU < usuario) {
			$('.class_usuario').animate({
				'left': '+=' + mover[sumaU][0] + 'px',
				'top': '-=' + mover[sumaU][1] + 'px'
			}, 'slow');
			sumaU++;
			$('#contador_u').html(sumaU);

		}
		nsespiral.modificar_reloj(numero, '-', '.class_reloj_maquina');//Avanza el reloj de la maquina
		if (parar_avance == 0) {
			setTimeout('nsespiral.casilla(' + usuario + ')', 3500);
		}
	}
};
nsespiral.avanzar_maquina = function (numero) {
	if (numero < 1)// Para cuando cae el uasuario en la casilla 31 con el 1
	{
		numero = 1;
	}
	computa = sumaC + parseInt(numero);
	if (computa > 65)//Terminar, has perdido
	{
		nsespiral.modificar_reloj((numero * 2), '+', '.class_reloj_usuario');
		$("#perdido").css("display", "block");
		$("#fade").css("display", "block");
	} else {
		while (sumaC < computa) {
			$('.class_maquina').animate({
				'left': '+=' + compu[sumaC][0] + 'px',
				'top': '-=' + compu[sumaC][1] + 'px'
			}, 'slow');
			sumaC++;
			$('#contador_m').html(sumaC);
		}
		nsespiral.modificar_reloj(numero, '-', '.class_reloj_usuario');
		nsespiral.modificar_reloj(numero, '+', '.class_reloj_maquina');
	}
};
nsespiral.retroceder = function (numero) {
	switch (numero) {
		case 31: {
			usuario = sumaU - (randomnumber * 2);
			while (sumaU > usuario) {
				sumaU--;
				$('.class_usuario').animate({
					'left': '-=' + mover[sumaU][0] + 'px',
					'top': '+=' + mover[sumaU][1] + 'px'
				}, 'slow');
				if (sumaU == 0) {
					$('#contador_u').html("");
				} else {
					$('#contador_u').html(sumaU);
				}
			}
			nsespiral.modificar_reloj((randomnumber * 2), '+', '.class_reloj_maquina');
			nsespiral.avanzar_maquina(randomnumber / 2);//avanza la maquina
			break;
		}
		case 39: {
			nsespiral.avanzar_jugador(randomnumber);//avanza el jugador
			parar_avance = 1;
			if (sumaC != 0) {
				computa = sumaC - (randomnumber * 2);
				while (sumaC > computa) {
					sumaC--;
					$('.class_maquina').animate({
						'left': '-=' + compu[sumaC][0] + 'px',
						'top': '+=' + compu[sumaC][1] + 'px'
					}, 'slow');
					if (sumaC == 0) {
						$('#contador_m').html('');
					} else {
						$('#contador_m').html(sumaC);
					}

				}
			}
			break;
		}
		case 58: {
			nsespiral.dado_dos = 0;//Limpiar la variable
			usuario = sumaU - randomnumber;
			while (sumaU > usuario) {
				sumaU--;
				$('.class_usuario').animate({
					'left': '-=' + mover[sumaU][0] + 'px',
					'top': '+=' + mover[sumaU][1] + 'px'
				}, 'slow');
				if (sumaU == 0) {
					$('#contador_u').html('');
				} else {
					$('#contador_u').html(sumaU);
				}

			}

			break;
		}
		default: {


		}

	}
	$('#dado_mostrar').attr('onclick', 'nsespiral.dado(1);')//habilitar dado
	$('#dado').attr('onclick', 'nsespiral.dado(0);')//habilitar dado
}
//Fin del movimiento
nsespiral.casilla = function (numero) {
	nsespiral.numero = numero;
	switch (numero) {
		case 9: {
			nsespiral.moverTargeta();
			//nsespiral.continuar(numero);
			break;
		}
		case 19: {
			if (nsespiral.A19) {
				//$("#light9").css("display", "none");
				nsespiral.moverTargeta();
				//setTimeout('nsespiral.continuar('+numero+')',8000);
			}
			$('#dado_mostrar').attr('onclick', 'nsespiral.dado(1);')//habilitar dado
			$('#dado').attr('onclick', 'nsespiral.dado(0);')//habilitar dado
			break;
		}
		case 21: {
			//$("#light9").css("display", "none");
			//$("#light19").css("display", "none");
			nsespiral.moverTargeta();
			//setTimeout('nsespiral.continuar('+numero+')',8000);
			break;
		}
		case 31: {
			//$("#light9").css("display", "none");
			//$("#light19").css("display", "none");
			//$("#light21").css("display", "none");
			nsespiral.moverTargeta();
			//setTimeout('nsespiral.continuar('+numero+')',8000);
			break;
		}
		case 39: {
			//$("#light9").css("display", "none");
			//$("#light19").css("display", "none");
			//$("#light21").css("display", "none");
			//$("#light31").css("display", "none");
			nsespiral.moverTargeta();
			//setTimeout('nsespiral.continuar('+numero+')',8000);
			break;
		}
		case 54: {
			if (nsespiral.A54) {
				//$("#light9").css("display", "none");
				//$("#light19").css("display", "none");
				//$("#light21").css("display", "none");
				//$("#light31").css("display", "none");
				//$("#light39").css("display", "none");
				nsespiral.moverTargeta();
				//setTimeout('nsespiral.continuar('+numero+')',8000);
			}
			$('#dado_mostrar').attr('onclick', 'nsespiral.dado(1);')//habilitar dado
			$('#dado').attr('onclick', 'nsespiral.dado(0);')//habilitar dado
			break;
		}
		case 58: {
			//$("#light9").css("display", "none");
			//$("#light19").css("display", "none");
			//$("#light21").css("display", "none");
			//$("#light31").css("display", "none");
			//$("#light39").css("display", "none");
			//$("#light54").css("display", "none");
			nsespiral.moverTargeta();
			//setTimeout('nsespiral.continuar('+numero+')',8000);
			break;
		}

		default: {
			//Codigo para  la asignaciones de pregunta

			if (spe < nsespiral.pe) {
				spe += nsespiral.pe;
				nsespiral.pregunta();
			} else {
				nsespiral.pregunta();
			}

			return true;

		}

	}


};
nsespiral.cerrar = function () {
	$("#light9").css("display", "none");
	$("#light19").css("display", "none");
	$("#light21").css("display", "none");
	$("#light31").css("display", "none");
	$("#light39").css("display", "none");
	$("#light54").css("display", "none");
	$("#light60").css("display", "none");
	$("#fade").css("display", "none");
	nsespiral.continuar(nsespiral.numero);
}
nsespiral.continuar = function (numero) {
	dado = numero;
	switch (numero) {
		case 9: {
			parar_avance = 1;//Para parar el avance
			nsespiral.avanzar_jugador(randomnumber);
			break;
		}
		case 19: {
			if (nsespiral.A19) {
				cep = 1;
				nsespiral.pregunta();//Responder dos pregunta para avanzar
			}
			break;
		}
		case 31: {
			nsespiral.retroceder(numero);//retroceder jugador, avanza la maquina
			//nsespiral.avanzar_maquina(numero/2);//avanza la maquina
			break;
		}
		case 39: {
			//nsespiral.avanzar_jugador(numero);//avanza el jugador
			nsespiral.retroceder(numero);//retroceder maquina
			break;
		}
		case 54: {
			if (nsespiral.A54) {
				cep = 1;
				nsespiral.pregunta();//si quiere responder dos preguntas avanza el doble
			}
			$('#dado_mostrar').attr('onclick', 'nsespiral.dado(1);')//habilitar dado
			$('#dado').attr('onclick', 'nsespiral.dado(0);')//habilitar dado
			break;
		}
		case 58: {
			nsespiral.dado_dos = 58;//Tirar de nuevo si obtiene par avanza sino retrocede
			break;
		}
		default: {
		}
	}
	$('#dado_mostrar').attr('onclick', 'nsespiral.dado(1);')//habilitar dado
	$('#dado').attr('onclick', 'nsespiral.dado(0);')//habilitar dado

}
nsespiral.pregunta = function () {
	if (cep != 1 && spe < 66) {
		if (sumaU <= spe)//Para hacerle corresponder la pregunta de ese intervalo
		{
			if (nsespiral.AP[(spe / nsespiral.pe) - 1][0] == 0)//Saber si ya la pregunta fue respondida
			{
				/*nsespiral.idPregunta=nsespiral.AP[(spe/nsespiral.pe)-1][1];
                $("#pregunta").load(nsespiral.AP[(spe/nsespiral.pe)-1][1]+'/ejercicio');*/
				nsespiral.showEjercicio(nsespiral.AP[(spe / nsespiral.pe) - 1][1]);
				$("#pregunta").css("display", "block");
				$("#fade").css("display", "block");
				//Si la responder mal debe retrocer la cantidad del dado, ya que habia avanzado
			}


		} else {
			spe += nsespiral.pe;
			nsespiral.pregunta();
		}
		$('#dado_mostrar').attr('onclick', 'nsespiral.dado(1);')//habilitar dado
		$('#dado').attr('onclick', 'nsespiral.dado(0);')//habilitar dado
	} else {
		//responder casillas con preguntas
		switch (dado) {
			case 19: {

				if (recorridoAC <= 2)//Controlar para las dos preguntas
				{
					//nsespiral.idPregunta=nsespiral.A19[contadorAC][1];
					//$("#pregunta").load(nsespiral.A19[contadorAC][1]+'/ejercicio');
					nsespiral.showEjercicio(nsespiral.A19[contadorAC][1]);
					$("#pregunta").css("display", "block");
					$("#fade").css("display", "block");
					contadorAC++;
					//Si la responder mal debe retrocer la cantidad del dado, ya que habia avanzado
					recorridoAC++;
				} else {
					cep = 0;
					recorridoAC = 1;
					contadorAC = 0;
				}
				break;
			}
			case 54://Ojo, tengo que verificar con Amaury
			{
				if (recorridoAC <= 2)//Controlar para las dos preguntas
				{
					//nsespiral.idPregunta=nsespiral.A54[contadorAC][1];
					//$(".text_pregunta").load(nsespiral.A54[contadorAC][1]+'/enunciado');
					//$("#pregunta").load(nsespiral.A54[contadorAC][1]+'/ejercicio');
					nsespiral.showEjercicio(nsespiral.A54[contadorAC][1]);
					$("#pregunta").css("display", "block");
					$("#fade").css("display", "block");
					contadorAC++;
					//Si la responder mal debe retrocer la cantidad del dado, ya que habia avanzado
					recorridoAC++;
				} else {
					cep = 0;
					recorridoAC = 1;
					contadorAC = 0;
					nsespiral.avanzar_jugador(randomnumber);//Avanzar jugador porque respondio las preguntas
				}
				break;
			}
		}

	}

}
//ejercicio
nsespiral.showEjercicio = function (idPregunta) {

	// opener.ejer.showEjercicio(idPregunta);
	//return;

	nsespiral.idPregunta = idPregunta;

	$("#pregunta").load('../../' + parent.opener.app.urlprod + '/ejercicio/' + idPregunta + '.html', {}, function () {
		btns = $('#barra_control', "#pregunta");
		btns.children().remove();
		btns.append('<div id="linea_abajo" class="linea_abajo linea_arriba"></div>' +
			'<div id="responder" class="responder" onclick="nsespiral.revisar();"></div>' +
			'<div id="no_responder" class="no_responder" onclick="nsespiral.ocultar();"></div>');
		btnenunciado = $('#agrupa_enunciado', "#pregunta");
		nsespiral.enunciado = $("#enunciado").html();
		btnenunciado.children().remove();
		btnenunciado.append('<div style="padding:100px 100px 0 100px">' +
			'<div id="text_p" class="text_pregunta"></div>' +
			'<div id="linea_arriba" class="linea_arriba"></div>');
		$("#text_p").html(nsespiral.enunciado);

	});
	//$("#text_p").html($("#enunciado").html());
	//$("#agrupa_enunciado").remove();


};


nsespiral.btnEjerShow = function (id) {

	$('#btns_comp div', Ejercitador.mytarget).click(function (e) {
		e.preventDefault();
		el = $(e.target);
		var idStr = e.target.id;

		if (!window['ejer_datos']) {
			window['ejer_datos'] = {};
		}

		if (idStr.indexOf("tu_respuesta") != -1) {

			ejerAccion.selec_respuesta("tu_respuesta", id);
			nsespiral.updateEjerShow(id);

		}


	});
};

//fin


nsespiral.Arreglos_Pregunta = function (cantP, IDPregunta) {

	nsespiral.deg = 10;// Para rotacion carte
	nsespiral.rotar = 70;//rotar
	nsespiral.tiempo = 0;// Variable para setTimeout
	contadorAC = 0;//Contador para el arreglo de las carta
	recorridoAC = 1;//Controlador de las dos pregunta
	nsespiral.dado_dos = 0;//Controlar la casilla especial 58
	dado_anterior = 0;// Controlar el numero anterior para la casilla 58, cuando tenga que retroceder
	if (cantP > 4)// Saber si la cantidad de pregunta es mayor que cuatro para arrgloe targeta
	{
		nsespiral.pe = parseInt(65 / (cantP - 4));//parte entera, se le resta cuatro para quitarle las preguntas de las targetas
		nsespiral.AP = new Array(cantP - 4);
		nsespiral.A19 = new Array(2);//Arreglo Tarjeta19
		nsespiral.A54 = new Array(2);//Arreglo Tarjeta54
		var j = 0;
		var j54 = 0;//Controlador para la tarjeta54
		for (i = 0; i < cantP; i++) {
			if (cantP - i > 4) {
				nsespiral.AP[i] = new Array(0, parseInt(IDPregunta[i][1]));
			} else {
				if (j < 2)// Para el arreglo de la targeta 19
				{
					nsespiral.A19[j] = new Array(0, parseInt(IDPregunta[i][1]));
					j++;
				} else {
					if (j54 < 2) {
						nsespiral.A54[j54] = new Array(0, parseInt(IDPregunta[i][1]));
						//j++;
						j54++;
					}
				}
				//Arreglos para las targetas
			}
		}
	} else {
		nsespiral.pe = parseInt(65 / cantP);// No se le pone pregunta a las targetas
		nsespiral.AP = new Array(cantP);
		for (i = 0; i < cantP; i++) {
			nsespiral.AP[i] = new Array(0, parseInt(IDPregunta[i][1]));
		}
	}
}
nsespiral.ocultar = function () {
	if (dado != 54)// Validando para esa casilla ya que no es obligatorio
	{
		if (dado == 19)// Validando para cuando se de ocultar
		{
			cep = 0;
			recorridoAC = 1;
			contadorAC = 0;
		}
		$("#pregunta").css("display", "none");
		$("#fade").css("display", "none");
		usuario = sumaU - randomnumber;
		while (sumaU > usuario) {
			sumaU--;
			$('.class_usuario').animate({
				'left': '-=' + mover[sumaU][0] + 'px',
				'top': '+=' + mover[sumaU][1] + 'px'
			}, 'slow');
			if (sumaU == 0) {
				$('#contador_u').html("");
			} else {
				$('#contador_u').html(sumaU);
			}
		}
		nsespiral.modificar_reloj(randomnumber, '+', '.class_reloj_maquina');
		//nsespiral.modificar_reloj(randomnumber,'-','.class_reloj_usuario');
		computa = sumaC + randomnumber;
		if (computa > 65)//Terminar, has perdido
		{
			$("#perdido").css("display", "block");
			$("#fade").css("display", "block");
		} else {
			while (sumaC < computa) {
				$('.class_maquina').animate({
					'left': '+=' + compu[sumaC][0] + 'px',
					'top': '-=' + compu[sumaC][1] + 'px'
				}, 'slow');
				sumaC++;
				$('#contador_m').html(sumaC);
			}
			nsespiral.modificar_reloj(randomnumber, '-', '.class_reloj_usuario');
		}
	} else {
		cep = 0;
		recorridoAC = 1;
		contadorAC = 0;
		$("#pregunta").css("display", "none");
		$("#fade").css("display", "none");
	}
};

nsespiral.CallBack = function (result) {

	if (result != 1) {
		if (nsespiral.numero != 54)//Porque la casilla 54 no es obligado a responder bien
		{
			usuario = sumaU - randomnumber;
			while (sumaU > usuario) {
				sumaU--;
				$('.class_usuario').animate({
					'left': '-=' + mover[sumaU][0] + 'px',
					'top': '+=' + mover[sumaU][1] + 'px'
				}, 'slow');

				if (sumaU == 0) {
					$('#contador_u').html("");
				} else {
					$('#contador_u').html(sumaU);
				}
			}
			//nsespiral.modificar_reloj(randomnumber,'-','.class_reloj_maquina');
			spe -= nsespiral.pe;
			nsespiral.avanzar_maquina(randomnumber);
			contadorAC = 0;
			//Si la responder mal debe retrocer la cantidad del dado, ya que habia avanzado
			recorridoAC = 1;
			cep = 0;
		}
		if (nsespiral.numero == 54) {
			contadorAC = 0;
			recorridoAC = 1;
			cep = 0;
		}

	} else {
		if (nsespiral.numero == 19 || nsespiral.numero == 54) {
			nsespiral.pregunta();// Poner la segunda pregunta
		} else {
			nsespiral.AP[(spe / nsespiral.pe) - 1][0] = 1;// Marcar esa pregunta como respondida
		}
	}
	$("#pregunta").css("display", "none");
	$("#fade").css("display", "none");
	$('#dado_mostrar').attr('onclick', 'nsespiral.dado(1);')//habilitar dado
	$('#dado').attr('onclick', 'nsespiral.dado(0);')//habilitar dado
	app.storage('respuestas', 0);

};
nsespiral.revisar = function () {
	//var array_resp=$('#campos_respuestas').formSerialize();
	//var resp=JSON.stringify(array_resp, null, 2);
	//app.storage('respuestas',resp);
	Ejercitador.mytarget = "#pregunta";
	Ejercitador.funCallBack = nsespiral.CallBack;
	ejerAccion.revisado(nsespiral.idPregunta);
};
nsespiral.salir = function () {

	$.getJSON('../../juego/terminarI', function (data, textStatus) {
	})
	window.close();
};
nsespiral.modificar_reloj = function (dado, operacion, clas) {
	actual = parseInt($(clas).css('height').replace('px', ""));
	if (operacion == '-') {
		actual -= dado * 2;
	} else {
		actual += dado * 2;
	}
	d = '' + actual + 'px';
	$(clas).css('height', d);
};

nsespiral.moverTargeta = function () {

	if (nsespiral.deg < 1480) {
		$('.caja').css('left', '+=' + 3 + 'px');
		$('.caja').css('top', '-=' + 2 + 'px');
		$('.css3').css('-moz-transform', 'rotate(' + nsespiral.rotar + 'deg)');
		nsespiral.tiempo = setTimeout('nsespiral.moverTargeta()', 1);
		nsespiral.deg += 10;
		nsespiral.rotar += 10;
	} else {
		clearTimeout(nsespiral.tiempo);
		//Para ponerlo en su principal posicion
		$('.caja').css('left', '255px');
		$('.caja').css('top', '597px');
		$('.css3').css('-moz-transform', 'rotate(69deg)');
		nsespiral.deg = 10;
		switch (nsespiral.numero) {
			case 9: {

				$("#light9").css("display", "block");
				$("#fade").css("display", "block");
				break;
			}
			case 19: {
				$("#light19").css("display", "block");
				$("#fade").css("display", "block");
				break;
			}
			case 21: {
				$("#light21").css("display", "block");
				$("#fade").css("display", "block");
				break;
			}
			case 31: {
				$("#light31").css("display", "block");
				$("#fade").css("display", "block");
				break;
			}
			case 39: {
				$("#light39").css("display", "block");
				$("#fade").css("display", "block");
				break;
			}
			case 54: {
				$("#light54").css("display", "block");
				$("#fade").css("display", "block");
				break;
			}
			case 58: {
				$("#light60").css("display", "block");
				$("#fade").css("display", "block");
				break;
			}

		}
	}

};
$(document).ready(function () {
	//necesitar datos, datosCpregunta, datosIPregunta
	nsespiral.reloj();
	idJuegoSelect = opener.nsjuego.idJuegoSelect;
	datosIPregunta = opener.nsjuego.ejer[idJuegoSelect];
	datosCpregunta = datosIPregunta.length;
	nsespiral.Arreglos_Pregunta(datosCpregunta, datosIPregunta);
	//nsespiral.moverTargeta();
	carta = 1;
	dado = 0;
	nsespiral.cartaA();
	spe = 0;//suma parte entera
	//pe=parseInt(65/datosCpregunta-4);//parte entera, se le resta cuatro para quitarle las preguntas de
	//las targetas
	cep = 0;//casillas especiales con pregunta
	sumaU = 0;
	sumaC = 0;
	bandera = 1;
	usuario = 0;
	computa = 0;

	nsespiral.init();

});