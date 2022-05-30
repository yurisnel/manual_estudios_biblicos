$.widget("ui.mydatetimepicker", {
	options : {	
	language: 'en',
	format:"dd/mm/yyy hh:mm:ss PP",
	//pick12HourFormat: true,	
	pickDate: true,
	pickTime: true
	
	},	
	// the constructor
	_create : function() {
		//this._draw();
		if(this.element.data("format")!==null)this.options.format=this.element.data("format");
		if(this.element.data("pickdate")!==null)this.options.pickDate=this.element.data("pickdate");
		if(this.element.data("minviewmode")!==null)this.options.minViewMode=this.element.data("minviewmode");
		if(this.element.data("picktime")!==null)this.options.pickTime=this.element.data("picktime");
		
		var f = new Date();
		var day=f.getDate();month=f.getMonth()+1;year=f.getFullYear();
		//this.options.maxDate=  "01/" + month + "/" +  (year+1);
		//this.options.minDate=  "01/" + month + "/" +  (year-1);
		
		this.options.minDate= moment({y: year-3});
		this.options.maxDate= moment().add(3, 'y');
        
		 
		this.element.datetimepicker(this.options);
		/*this._on( this.element.parent(),this._events );
		
		this.options.min=parseInt(this.element.data("min"));
		this.options.max=parseInt(this.element.data("max"));*/
			
	},
_draw:function(){
		
		this.element			
			.wrap('<div id="datetimepicker1" class="input-append date"></div>' )
			.parent()
				.append( "<span>:</span>" )
				.append('<span class="add-on"><i data-time-icon="icon-time" data-date-icon="icon-calendar"></i></span>' )		
				;
		
		
	},
	
	
	
});






$.widget("ui.myspinner", {
	options : {
	   // type:"time", //time,day
	    step:1,
	    min:"",
	    max:"",
		icons: {
		down: "ui-icon-triangle-1-s",
		up: "ui-icon-triangle-1-n"
	},
	},
	// the constructor
	_create : function() {
		this._draw();
		this._on( this.element.parent(),this._events );
		
		this.options.min=parseInt(this.element.data("min"));
		this.options.max=parseInt(this.element.data("max"));
		
		
	
	},
	
	 // called when created, and later when changing options
	_refresh: function() {
		
		 // trigger a callback/event
		this._trigger( "change" );
	},
		
	
	 // events bound via _on are removed automatically
	_destroy: function() {	
		
	},
	
	
	 // _setOptions is called with a hash of all options that are changing
	// always refresh when changing options
	_setOptions: function() {
		// _super and _superApply handle keeping the right this-context
		this._superApply( arguments );
		this._refresh();
	},
	
	
	// _setOption is called for each individual option that is changing
	_setOption: function( key, value ) {	
		this._super( key, value );
	},
	
	_events:{		
		"mousedown": function( event ){
						
			el=$(event.target);		
						
			if(el.hasClass('myspinner-input') || el.hasClass('spinner-input')){				
				this.elfocus = el;
			}
			else if(el.parent().hasClass('ui-spinner-up')){								
				
				this._show_result(1);
				
			}else if(el.parent().hasClass('ui-spinner-down')){
				
				this._show_result(-1);
			}
		},
		focusout: function( event ) {			
			this.myinput.val(this.element.val()+":"+this.myclone.val());
		},
		mousewheel: function( event, delta ) {
			if ( !delta ) {
				return;
			}
			
			event.preventDefault();
		},
		keydown: function( event ) {
			
			keyCode = $.ui.keyCode;

			switch ( event.keyCode ) {
			case keyCode.UP:
				this._show_result(1);
				return true;
			case keyCode.DOWN:
				this._show_result(-1);
				return true;
			case keyCode.PAGE_UP:				
				return true;
			case keyCode.PAGE_DOWN:				
				return true;
			}

		return false;
		}
	},
	_show_result:function(direct){
		
		if(!this.elfocus){
			this.elfocus=this.element;
		}		
		
		var val=this.elfocus.val();
		result= parseInt(val)+direct*this.options.step;
		
		
		if(this.options.type=="time" ){			
			if(result<10 && result>=0 ){
			result="0"+result;
			}
			if(result<0 || (this.elfocus.hasClass("first") && result>12 ) || result>60){
				return;
			}	
		}
		else {	
			if(result<this.options.min || result>this.options.max){
				return;
			}	
		}
		
		this.elfocus.val(result);
		this.elfocus.focus();		
		
	},
	
	_draw:function(){
		
		if(this.options.type=="time"){
			
			this.element
			.addClass( "myspinner-input" )		
			.wrap( this._uiSpinnerHtml() )
			.parent()
				.append( "<span>:</span>" )
				.append( this._myclone() )		
				.append( this._buttonHtml() );
		
		}else {
			this.element
			.addClass( "spinner-input" )		
			.wrap( this._uiSpinnerHtml() )
			.parent()				
				.append( this._buttonHtml() );
		}
	},
	
	_myclone:function(){
		this.myinput = $("<input>").attr("type", "hidden")
        .attr("name", this.element.attr("name"))
        .val(this.element.val())
        .appendTo(this.element.parent());
		
		this.element.attr("name","" );
		var value=this.element.val();
		
		var hours="00";
		var minutes="00";
		
		if(value){			
			var time = value.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
		    if (time) {
		    	hours = time[1];			       
			    minutes=time[2]?time[2]:"00";
		    }		    
		}
		
		
		this.myclone=this.element.clone();			
		this.element.addClass("first");	
		
		this.element.val(hours);
		this.myclone.val(minutes);
		
		return this.myclone;
	},
	
	_uiSpinnerHtml: function() {
		return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>";
	},

	_buttonHtml: function() {
		return "" +
			"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'>" +
				"<span class='ui-icon " + this.options.icons.up + "'>&#9650;</span>" +
			"</a>" +
			"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>" +
				"<span class='ui-icon " + this.options.icons.down + "'>&#9660;</span>" +
			"</a>";
	},
	
});