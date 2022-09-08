
$.fn.mymenu = function(options){
	var caller = this;
	var options = options;
	var m = new myMenu(caller, options);

	/*$(this)
	.mousedown(function(){
		if (!m.menuOpen) { m.showLoading(); };
	})
	.click(function(){
		if (m.menuOpen == false) { m.showMenu(); }
		else { m.kill(); };
		return false;
	});*/
};

function myMenu(caller, options) {
	var menu = this;
	var caller = $(caller);
	var container = $('<div  class="menuDesplegable ui-corner-all sombraTex"></div>').appendTo('body');


	/*ocultar los submenu*/
	caller.children('li').find('ul').hide();
	/*ponerle flechita a los items qque tenga submenu*/
	caller.find('ul').parent('li').addClass('linksubmenu');

	caller.find('li').hover(function(e){
		
		e.preventDefault();		
		var op=e.currentTarget;
		
		//$(op).removeClass('ui-corner-bottom').addClass('opoverlist');
		
		var opciones= $(op).children('ul').clone();

		if(opciones.length>0){
        	
			$(op).addClass('clicksubmenu');
			$(opciones).addClass('menudesplazado');
			container.empty();
			opciones.show();
			
			container.append(opciones);		

			container.css({'left':op.offsetLeft,'top':op.offsetTop+18,'min-width':$(op).css('width')})
			.delay(50).slideDown(function(){ menu.actual=op});
		}

	},function(e){
		//$(e.currentTarget).addClass('ui-corner-bottom ')
	}).click(function(e){
	$(e.currentTarget).addClass('opSelect');
	});
	
		/*ocultar menu cuando se de click en cualquier parte de lap pagina*/
	$(document).click(function(){
	
		    container.hide();
		  if($(menu.actual))
		  {
		   $(menu.actual).removeClass('clicksubmenu');
		   menu.actual=false;
		  }	    				
			    
	});
	
};
/*
function create_menu(target){
$("ul[class*='menu']",target).each(function(i,el){	
	id= el.attr(id);
});

}*/



