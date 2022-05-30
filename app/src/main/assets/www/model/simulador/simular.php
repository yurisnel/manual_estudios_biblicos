<?php
$mostrar = @$objModulo->datos;
$sesion = @$objModulo->datos_sesion;
$pos = @$sesion['posicionSimula'];
$sim = @$sesion['datosSimula'];
$r=@$sesion['respuestasSim'];//$objModulo->session('respuestas');
$id=@$mostrar['id_sim'];
$datos['revisado'] = @$r[$id][revisado];

$datos['idSim'] = @$mostrar['id_sim'];
$datos['msg_terminar'] = @$mostrar['verificar'];
$datos['idEsc'] = @$objModulo->datos_escena['id_escena'];
$datos['items'] = @$objModulo->datos_cuerpo;


App::phpToJs('sim_datos',$datos);
?>

<div id="sim_general">
  	<div id="sim_agrupa_enunciado">
  	
    	<div id="sim_tematica"> <?php echo $mostrar['nombre_sim']?> </div>
    	<?php if (!@$sesion['salir']){
    	?>
  		<div id="sim_enunciado">
  		<?php echo $mostrar['inf_sim'];?></div>
  	</div>
    <div style="clear:both; padding-bottom:15px;"></div>
    <div id="sim_desabilitar">
	<div id="sim_agrupa_cuerpo" class="redondear-top"><?php echo @$objModulo->datos_escena['inf_escena'];?>
	<form id="sim_campos_respuestas" name="campos_respuestas" method="post" action="">
	<?php
	if (!@$sesion['ruta']){
		if(@$sim[$pos]['termine'] != 1){
			if(@$sim[$pos]['intentos'] === 0)
			echo @$sesion['error'];
			else{
				if(@$objModulo->datos_cuerpo){
				shuffle($objModulo->datos_cuerpo);//Desordena un Arreglo

				foreach ($objModulo->datos_cuerpo as $item)
				{
					if(@$valores[$item['id_escena_cuerpo']] == 1)
					$checked='checked';
					else
					$checked='';
	        ?>
          <div class="agrupa_item redondear-top-item" >
            <div class="campo_respuesta">
              <input name="valores[]" type="checkbox" <?php echo $checked?> value="<?php echo $item['id_escena_cuerpo']?>" />
            </div>
            <div class="cuerpo"><?php echo $item['inf_item']?>
			<?php if (@$item['inf_apoyo']) { ?>
             <div id="<?php echo $item['id_escena_cuerpo']?>inf_apoyo" class="inf_apoyo"></div>
			 <?php } ?>
            </div>
          </div>
		  <?php
				}//Fin del Foreach Principal
			}
			}
		}
	}
	else {
		echo $sesion['error'];
	}
    	}
    	else {
		  ?>   
		  <div id="sim_enunciado">
		  <div style="clear:both; padding-bottom:15px;"></div>
		  <div id="sim_desabilitar">
		  <div id="sim_agrupa_cuerpo" class="redondear-top">  
		  <form id="sim_campos_respuestas" name="campos_respuestas" method="post" action="">
		  <center><b>Ha terminado satisfactoriamente la simulaci&oacute;n</b></center><br><br>
		  <center>
		  <table border="1" cellspacing="0" cellpadding="0">
 			 <tr>
 		  	 <td colspan="2" align="center"><b>Pasos seguidos en la simulaci&oacute;n</b></td>
 			 </tr>
 			 <tr>
		  <?php
		  $contOptimo = 0;
		  foreach ($sim[$pos]['ruta'] as $camino){
		  	if(@$camino['tipoRuta'] == 'optima')
		  	$contOptimo++;
		  	?>		  	
   			 <td colspan="2" align="center"><?php echo $camino['nombre_escena']?></td>
 			 </tr>			
		  	<?php
		  }
			?>
		  </table>
		  
		  <?php
			  if (@$contOptimo == count($sim[$pos]['ruta'])-1)
			  echo '<br>Simulaci&oacute;n terminada de forma &oacute;ptima. Felicidades.';
			  else
			  echo '<br>Simulaci&oacute;n terminada de forma no &oacute;ptima.';``
			  ?>
			  </center>
			  </form>
			  </div>
			  </div>
			  </div>
		  <?php } ?>
		    
        </form>
        <div style="clear:both;"></div>
    </div>
    <!--Fin del Div que engloba a todo el cuerpo del ejercicio-->
</div><!--Fin del Div General-->
<div id="barra_control" class="barra_control">
	<div id="botones" style="margin-left:50px; height:25px">
          <div id="btns_control">
              <div id="btn_primero" class="pag_primero"></div>
              <div id="btn_atras" class="pag_atraz"></div>
          	  <div id="cant_ejer"><?php echo (@$sesion['posicionSimula']+1).'/'.count($sesion['datosSimula'])?></div>
              <div id="btn_siguiente" class="pag_siguiente"></div>
              <div id="btn_ultimo" class="pag_ultimo"></div>
              <div id="btn_home" class="pag_home"></div>
          </div>
          <div id="btns_comp"> 					
              <? if (!@$sesion['salir']){?>
          	  <div id="revisar" class="revisar sombraTex">CONTINUAR</div>  
          	  <? }else {?> 
              <div id="btns_comp"><div id="btn_salir" class="sombraTex">SALIR DE LA SIMULACI&Oacute;N</div>    
              <? } ?>                  
          </div>
  	</div>
</div><!--Div para la barra de control de ejercicios-->