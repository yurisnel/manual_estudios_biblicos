/*
* $.fn.keyValue(exp,maxlength)
* By JFco Diaz.
* wariodiaz@gmail.com
* www.devtics.com.mx
* 19/02/2010
* plugin jQuery, para evaluar una entrada en un input x expresi�n regular
* y poder discriminar el car�cter si no se encuentra en la expresi�n regular
* evitando su inserccion
*
* @param expOarr, es un arreglo de caracteres y/o enteros que representen
* el charCode del car�cter a permitir, o bien una expresi�n regular que indique
* en el patr�n los caracteres que se permitir�n, ademas opcionalmente coloca un
* m�ximo de caracteres permitidos
* Nota: la evaluaci�n es del car�cter que se esta tecleado no sobre la cadena ingresada
*
* ejemplo:
*
* $(".soloNumeros").keyValue(/[0-9]/);
*
* $(".soloNumeros").keyValue([0,1,2,3,4,5,6,7,8,9]/);
*
* ambos solo permiten la entrada de n�meros o solo caracteres en min�sculas
*
* $(".soloNumeros").keyValue(/[a-z]/);
*
* o solo numeros y "-" y solo 10 caracteres
*
* $(".soloNumeros").keyValue([0,1,2,3,4,5,6,7,8,9,'-'],10);
*
* o con expresi�n regular
*
* $(".soloNumeros").keyValue(/[0-9\-]/,10);
*
* */
(function ($){
$.fn.keyValue=function(expOarr,maxLength){
try{
var $this=$(this);
if(maxLength)
$this.attr("maxlength",maxLength);
$this.keypress(function(event){
var key = event.charCode;
if(key==0)return true;
if(maxLength && this.value.length==maxLength)return false;
if(typeof expOarr ==='object'&& expOarr.length!=undefined){
for(var i in expOarr)
if(key==((typeof expOarr[i]=="number")? expOarr[i] : expOarr[i].charCodeAt(0)))
return true;
return false;
}
return expOarr.test(String.fromCharCode(key));
});
}catch(e){alert(e.message);}
}
return $(this);
})(jQuery);