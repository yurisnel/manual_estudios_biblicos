
function historial(){


	this.velocidadTemporizador=500;


	this.init=function(pcallback){
		this.callback=pcallback;
	}

	this.load=function(pactual){
		this.actual=pactual;

		if (this.esNavegadorIE()){

			var rutaExterna= this.ObtenerRutaExterna();

			Obtenir("historial").src=rutaExterna + "/unFicheroVacio.php?variableEngaño=" + idHistorialActual+ "#"+idHistorialActual;

		}else{

			//window.location=this.LimpiarUrl(window.location)+'#'+idHistorialActual;
			window.location=window.location.href.split('#')[0]+'#'+pactual;

		}

		histGuardian();

	}


	this.ObtenerRutaExterna=function(){

		//existe el problema de across domain denegation Script

		var protocoloUrlPrincipal=document.location.protocol;

		var dominioUrlPrincipal=document.location.host;

		return protocoloUrlPrincipal+"//"+dominioUrlPrincipal;

	}


	this.esNavegadorIE=function(){

		if (window.ActiveXObject) {
			return true;
		}else{
			return false;
		}
	}

}

$(document).ready(function() {
	histor = new historial(); // singleton instance
});

function histGuardian(){

	temporitzador=setTimeout("histGuardian()",histor.velocidadTemporizador); //1000= 1 seg.

	pactual=window.location.href.split('#')[1];
	if(pactual && histor.actual!=pactual){
		histor.actual!=pactual;
		histor.callback(pactual);
	}
	/*if(!pactual && histor.actual){
		window.location=window.location.href.split('#')[0]+'#'+histor.actual;
	}*/
}
