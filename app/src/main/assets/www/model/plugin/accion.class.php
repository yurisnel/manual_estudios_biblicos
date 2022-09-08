<?php

class accionPlugin
{
	var $pluginLoad;
	var $pluginCss=array();

	public function init(){
		$path_url= baseDir."/modulos/plugin/";
		$d = dir($path_url);
	
		while($d && $name = $d->read()){

			if($name=='.' || $name=='..' || $name=='.svn') continue;

			$direct=$path_url.$name;
			if(is_dir($direct) )	{
				$this->pluginLoad=$name;
				include $direct."/init.php";
			}
		}
	}
	
	public function export(){		
		$this->init();
	}
	
	/*public function load($name){
		$this->pluginLoad=$name;
		//include baseDir."/modulos/plugin/".$pluginLoad."/init.php";
	}*/
	

	public function addCss($nameCss){
		$add=$this->pluginLoad.'/'.$nameCss;
		$this->pluginCss[]=$add;	
		App::putFileCSS('modulos/plugin/'.$add );
	
	}
	
	public function getPluginCss(){
		return $this->pluginCss;
	}
	
	public function exportPluginCss(){
		$sinclupde = '';

            foreach ($this->pluginCss as $file) {
            $sinclude.="\n <link rel='stylesheet' type='text/css' media='screen' href='model/plugin/" . $file . "' /> ";
        }

        return $sinclude;
	}
	
}

?>