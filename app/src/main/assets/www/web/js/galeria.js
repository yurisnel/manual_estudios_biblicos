var nsgaleria = function () {

    return {
        view: "model/galeria/index.html",
        data: new Array(),
        target: '#gal_centro',
        model3: {rotacion: new Array(10, -20, 30, -10, 20, -30)},
        loaded: false,
        store: [],

        init: function (module) {
            nsgaleria.loadData(module, function () {
                var links = nsgaleria.createMenu(module);
                // acceder a la primera categoria del menu
                if (links && links.length > 0) {
                    $(links[0]).click();
                }
            })
        },

        loadData: function (module, callback) {

            if (!nsgaleria.loaded) {
                // ownDeferred =$.Deferred();
                return $.get(app.urlData + '/galeria.dat', function (resp, textStatus, result) {

                    resp = $.parseJSON(result.responseText);

                    $.each(resp, function (i, dat) {
                        var idgal = dat[0];
                        var idcat = dat[1];
                        if (!nsgaleria.store[idgal]) {
                            nsgaleria.store[idgal] = new Array();
                        }
                        if (!nsgaleria.store[idgal][idcat]) {
                            nsgaleria.store[idgal][idcat] = new Array();
                        }
                        nsgaleria.store[idgal][idcat].push(dat);
                    });

                    nsgaleria.loaded = true;
                    if (callback) callback();

                    // return ownDeferred.promise();
                });

            } else {
                if (callback) callback();
            }
        },
        createMenu: function (module) {
            // crear el menu
            var $menu = $('#gal_menu');

            // si ya est creado cancelo la operacion
            if ($menu.length == 0 || $("li", $menu).length > 0) return;
            var dat, li;

            var data = app.nodeTree[module];
            if (module && data.list)
                $.each(data.list, function (i, pos) {
                    dat = app.nodeList[pos];
                    li = '<li class="nav-item"><a class="nav-link" href="' + dat[app.node.id] + '/' + dat[app.node.parent] + '"">';
                    li += '&nbsp;' + dat[app.node.name];
                    li += '</a></li>';
                    $menu.append(li);
                });

            $menu.addClass('nav nav-pills flex-md-column');
            var $links = $("a.nav-link", $menu);
            $links.on("click", function (e) {
                e.preventDefault();
                var $target = $(e.target);
                $("#gal_title").html($target.html());
                $links.removeClass('active');
                $target.addClass('active');
                var href = $target.attr('href');
                var part = href.split('/');
                var module = part[1];
                if (module == config.mod.juego) {
                    nsjuego.render(href);
                    module = "nsjuego";
                } else {
                    nsgaleria.render(href);
                    module = "nsgaleria";
                }

                //if ($target[0] != $links[0]) {
                app.saveHistory({
                    "module": module,
                    "call": "loadModule",
                    "params": [href]
                });
                //  }

            });
            return $links;
        },

        //from historial
        loadModule: function (url, loadTarget) {
            if (!loadTarget) loadTarget = app.targetLoad;

            $(loadTarget).load("model/galeria/index.html",
                function () {
                    var param = url.split('/');
                    var module = param[1];
                    var data = app.nodeTree[module];
                    var title = app.nodeList[data.pos][app.node.name];
                    app.$title_bar.html(title);
                    var links = nsgaleria.createMenu(module);
                    // acceder a la categoria del menu deseada
                    if (links && links.length > 0) {
                        links.filter("[href*='" + url + "']").click();
                    }
                    // nsgaleria.render(url, nsgaleria.target);
                });
        },

        render: function (url, loadTarget) {
            if (!nsgaleria.loaded) {
                var param = url.split('/');
                var module = param[1];
                nsgaleria.loadData(module, function ($links) {
                    nsgaleria.renderData(url, loadTarget);
                })

            } else {
                nsgaleria.renderData(url, loadTarget);
            }
        }
        , renderData: function (url, loadTarget) {

            if (!loadTarget) loadTarget = nsgaleria.target;
            var $loadTarget = $(loadTarget);
            $loadTarget.empty();
            $loadTarget.addClass("row");

            var param = url.split('/');
            var template, linkclass;

            switch (parseInt(param[1])) {
                case config.imagen.id:
                    template = "item_image";
                    break;

                case config.complemento.id:
                    template = "item_compl";
                    break;

                    break;
                case config.video.id:
                case config.sonido.id:
                case config.animacion.id:
                    template = "item_media";

                    switch (parseInt(param[1])) {
                        case config.video.id:
                            linkclass = 'execVideo';
                            break;
                        case config.sonido.id:
                            linkclass = 'execSonido';
                            break;
                        case config.animacion.id:
                            linkclass = 'execAnime';
                            break;

                    }
            }

            var pos = 0;
            var idgal = param[1];
            var idcat = param[0];
            var gal = nsgaleria.store[idgal];

            if (gal && gal[idcat]) {
                $.each(gal[idcat], function (i, idat) {

                    // nsgaleria.data[idat.id]=idat;
                    var name = idat[2];
                    var file = formatFile(name);

                    idat.desc_peq = idat[5];
                    idat.desc_ampl = idat[6];
                    idat.indentif = file.name;

                    var size = parseInt(idat[3]);

                    if (size > 1024) {
                        size = size / 1024;
                        if (size < 1024)
                            file.size = Math.ceil(size) + " kb";
                        else {
                            size = size / 1024;
                            file.size = size.toFixed(1) + " Mb";
                        }
                    } else {
                        file.size = size + " byte"
                    }

                    var ptitle = "";
                    if (idat.desc_peq && idat.desc_ampl)
                        ptitle = idat.desc_peq + '[sep]' + idat.desc_ampl;
                    else if (idat.desc_peq && !idat.desc_ampl)
                        ptitle = idat.desc_peq;
                    if (!idat.desc_peq && idat.desc_ampl)
                        ptitle = ' [sep]' + idat.desc_ampl;


                    var pnombre = idat.desc_peq ? idat.desc_peq : idat.indentif;

                    //datos.nombre=shortName(pnombre);
                    file.name = pnombre;
                    file.title = ptitle ? ptitle : pnombre;
                    //file.description = idat.desc_ampl?idat.desc_ampl: idat.typeTitle ;
                    file.description = idat.desc_ampl;
                    // Las comillas simples son & #39; y las dobles & #34; (sin
                    // el espacio separador)
                    file.title = file.title.replace(/'/g, "\&#39");
                    file.title = file.title.replace(/"/g, "\&#34");
                    file.linkclass = linkclass;
                    /*
                     if (app.thema.model == 'mod3') {
                     // pos=Math.floor(Math.random()*6);
                     if (!nsgaleria.model3.rotacion[pos]) {
                     pos = 0;
                     }
                     val = nsgaleria.model3.rotacion[pos++];
                     file.style = '-moz-transform:rotate(' + val + 'deg)';
                     }*/

                    d = getUrls(idat);
                    file.href = d.urlFile;
                    file.src = d.urlShow;

                    //$loadTarget.append(mostrar, datos);
                    var item = $.tmpl(template, file);
                    item.appendTo($loadTarget);

                    setTimeout(function () {
                        item.addClass("show");
                    }, 200 * (pos++));

                });

                if (config.imagen.id == param[1])  // si es la galeria de imagen
                {
                    //app.lightbox.refresh();

                    $("a[rel*='photoSwipe'],a[rel*='lightbox']", loadTarget).click(function (e) {
                        e.preventDefault();
                        photoSwipeOpen(loadTarget, e.currentTarget);
                    });

                }
                //if (config.complemento.id != param[1]) {  // si es diferente de complemento

                $('.tip', nsgaleria.target).Tooltip({
                    track: true,
                    delay: 0,
                    showURL: false,
                    showBody: "[sep]"
                });
                //}
            }
        },
        /*load: function (target) {

            $(target).find('galeria, complementos').each(function (i, gal) {
                link = $(this).find('llave');
                nsgaleria.render(link.html(), $(this).parent());
            })
        },*/
        exec: function (e) {
            e.preventDefault();
            var $target = $(e.currentTarget);

            var ventana = $("#myModal");
            var $body = $(".modal-body", ventana);
            var $title = $(".modal-title", ventana);
            var $footer = $(".modal-footer", ventana);
            $footer.hide();

            var url = $target.attr('href');
            var titleShow = e.currentTarget.title ? e.currentTarget.title : '';

            if (!titleShow && e.currentTarget.tSettings && e.currentTarget.tSettings.oldTitle) {
                titleShow = e.currentTarget.tSettings.oldTitle;
            }


            if (!titleShow) titleShow = "Reproductor de medias";
            else {

                var tmp = titleShow.split('[sep]');
                if (tmp instanceof Array) {
                    titleShow = tmp[0];
                }

                titleShow = titleShow.length > 22 ? titleShow.replace(/<[^>]+>/g, '').substr(0, 22) + '...' : titleShow;
            }

            if ($target.hasClass('execAnime')) {

                var anime = $('<div><embed height="100%" width="100%" name="plugin" src="' + url + '" type="application/x-shockwave-flash"></div>').appendTo("body");
                $body.html(anime);
                $title.html("Reproductor de animaciones");
                ventana.modal("show");
                // optionsRep = {width: 750, height: 550, path: url};
                //execAnime(optionsRep);
                return;
            } else if ($target.hasClass('execFile')) {
                // url=app.urlprod+'/complemento/'+url;
                execFile(url);
                return;
            }
            /*else if ($target.hasClass('execGame')) {
                execFile(url);
                return;
            }*/
            else if ($target.hasClass('execVideo')) {
                param = url.split('/');
                files = param[param.length - 1];
                id_ventana = 'reprodVideo';
                optionsRep = {width: 350, height: 280, path: app.urlprod + '/medias/videos/'};
            } else if ($target.hasClass('execSonido')) {
                param = url.split('/');
                files = param[param.length - 1];
                id_ventana = 'reprodSonido';
                optionsRep = {width: 350, height: 50, path: app.urlprod + '/medias/sonidos/'};

            } else if ($target.hasClass('execList')) {
                files = url;
                id_ventana = 'reprodList';
                optionsRep = {width: 350, height: 200, path: app.urlprod + '/medias/sonidos/'};
            }

            $title.html(titleShow);

            if (!isMovil()) {
                reproducirHtml5(files, $body, optionsRep);
                ventana.on('hidden.bs.modal', function (e) {
                    $body.html("");
                });
                ventana.modal("show");
            } else {
                var videoNames = files.split('[li]');
                window.location.href = optionsRep.path + videoNames[0];
            }
        }
    }
}();

//MediaElementPlayer
var reproducirHtml5 = function (files, $target, optionsRep) {
    var player;
    var listMedias = [];
    var index = 0;
    var mediaSource = {}, extension, type;

    var videoNames = files.split('[li]');
    var listaRep = "";
    var mediaId = 'playerID_' + cantRep++;

    var mediaAttrib = {
        'id': mediaId,
        'controls': 'controls',
        'width': optionsRep.width,
        'height': optionsRep.height,
        'poster': "",
        'preload': 'true'
    };
    var extension = videoNames[0].split('.').pop().toLowerCase();

    var MediaType = "video";
    if (extension == "mp3" || extension == "wav") {
        MediaType = "audio";
    }
    var renderers = ["html5"];
    if (extension == "flv") {
        //renderers = ['flash_video'];
        reproducirFlash(files, $target, optionsRep);
        return;
    }

    var mediaElem = $('<' + MediaType + '/>').attr(mediaAttrib);

    var mediaSource;
    $(videoNames).each(function (i, idata) {

        extension = idata.split('.').pop().toLowerCase();

        type = MediaType + '/' + extension;

        mediaSource = {
            'src': optionsRep.path + idata,
            'type': type
        };
        if (listaRep) listaRep.append("<li>" + idata + "</li>");

        listMedias.push(mediaSource);
        mediaElem.append($('<source/>').attr(mediaSource));
    });


    mediaElem.append('<object width="320" height="240" type="application/x-shockwave-flash" data="web/libs/mediaelement/mediaelement-flash-video.swf">' +
        '<param name="movie" value="web/libs/mediaelement/mediaelement-flash-video.swf" />' +
        '<param name="flashvars" value="controls=true&amp;file=' + mediaSource.src + '" />' +
        // '<img src="myvideo.jpg" width="' + optionsRep.width + '" height="' + optionsRep.height + '" title="No video playback capabilities" />' +
        '</object>');


    $target.empty();
    $target.append(mediaElem);
    $target.append(listaRep);
    $target.append("<p class='error'></p>");

    mediaElem.onerror = function () {
        console.log("Error " + mediaElem.error.code + "; details: " + mediaElem.error.message);
    }

    mejs.i18n.language("es");

    var mediaElements = document.querySelectorAll('video, audio'), i, total = mediaElements.length;

    for (i = 0; i < total; i++) {
        new MediaElementPlayer(mediaElements[i], {
            stretching: "auto", //responsive, auto, fill, none
            pluginPath: 'web/libs/mediaelement/',
            //plugin: ["flash", "silverlight"],
            //flashName: "mediaelement-flash-video.swf",
            success: function (media) {
                media.addEventListener('error', function (e) {
                    $('.error', $target).html('<p style="padding-top:10px">Formato inv&aacute;lido' + '<a href="' + node.src + '"> Descargar video </a> </p>');
                });
            }
        });
    }
};
//videojs
var reproducirHtml5_2 = function (files, $target, optionsRep) {

    var player;
    var listMedias = [];
    var index = 0;

    var videoNames = files.split('[li]');
    var listaRep = "";

    if (videoNames.length > 1) {

        listaRep = $('<ul id="listaRep" class="vjs-playlist" ></ul>').click(function (e) {
            if (e.target.tagName == "LI") {
                index = $(e.currentTarget).find('li').index($(e.target));
                select(index);
            }
        });

    }
    var extension = videoNames[0].split('.').pop().toLowerCase();

    if (extension == "swf") {
        $target.remove();
        optionsRep = {width: 360, height: 300, path: optionsRep.path + videoNames[0]};
        execAnime(optionsRep);
    } else {

        var mediaId = 'playerID_' + cantRep++;

        var mediaAttrib = {
            'id': mediaId,
            'class': 'video-js vjs-default-skin',
            'width': optionsRep.width,
            'height': optionsRep.height,
            'poster': "",
            'preload': 'true',
            'data-setup': '{}'
        };

        var MediaType = "video";
        if (extension == "mp3" || extension == "wav") {
            MediaType = "audio";
        }

        var mediaElem = $('<' + MediaType + '/>').attr(mediaAttrib);


        $(videoNames).each(function (i, idata) {

            var extension = idata.split('.').pop().toLowerCase();

            var type = MediaType + '/' + extension;

            var mediaSource = {
                'src': optionsRep.path + idata,
                'type': type
            };
            if (listaRep) listaRep.append("<li>" + idata + "</li>");

            listMedias.push(mediaSource);
            mediaElem.append($('<source/>').attr(mediaSource));
        });


        mediaElem.append('<p class="vjs-no-js">To view this audio/video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>');
        mediaElem.onerror = function () {
            console.log("Error " + mediaElem.error.code + "; details: " + mediaElem.error.message);
        }


        if (videoNames.length > 1) height:optionsRep.height += 100;

        //$target.dialog('option', {width: optionsRep.width, height: optionsRep.height});

        $target.append(mediaElem);
        $target.append(listaRep);

        //videojs.players = {};

        videojs(mediaId, {
            //language: 'fr',
            flash: {
                swf: 'web/libs/video.js/video-js.swf'
            },
            techOrder: ["flash", "html5"],

            //techOrder: ["html5", "flash"],//"flvjs"

            /*flvjs: {
             mediaDataSource: {
             isLive: true,
             cors: true,
             withCredentials: false,
             },
             // config: {},
             },*/

            controls: true,
            //autoplay: true,
            //preload: "auto"
        }).ready(function (event) {

            player = this;
            select(0);

            player.on('ended', function () {
                select(index++);
            });

            var err = player.on('error', function (e) {
                console.log("Error n caught" + this.error());
                console.log(this.error());  // Is not printing anything
            }.bind(this));

        });
    }

    function select(index) {
        if (index >= 0 && index < listMedias.length) {
            player.src(listMedias[index]);
            li = $(listaRep).find("li").removeClass('temaSelect');
            li.filter(':eq(' + index + ')').addClass('temaSelect');
        }

    }
}

onCleanup = function () {
    var vidId = $(this).data('vid-id');
    videojs(vidId).dispose();
    videojs.players = {};
}

var cantRep = 0;
var reproducirFlash = function (files, $target, optionsRep) {
    $target.html("");
    // ventana.dialog('option', {width: optionsRep.width, height: optionsRep.height});

    var list = new Array();
    var urls = files.split('[li]');
    //optionsRep.path="/fuentes/libre/medias/sonidos/";


    if (urls.length > 1) {
        var listaRep = $('<ul id="listaRep"></ul>').click(function (e) {
            if (e.target.tagName == "LI") {
                pos = $(e.currentTarget).find('li').index($(e.target));
                jwplayer(playerID).playlistItem(pos);
            }
        });
        $target.append(listaRep);
        optionsRep.height -= 130;
    }

    $(urls).each(function (i, idata) {
        var pos = idata.lastIndexOf("/");
        if (pos > 0) {
            var idata = idata.substring(pos + 1);
        }
        idata = encodeURI(idata); //encodeURIComponent
        list.push({file: optionsRep.path + idata, title: idata});
        if (listaRep) listaRep.append("<li>" + idata + "</li>");
    });
    this.list = list;

    var playerID = 'playerVideoID' + cantRep++;
    $target.append('<center><object id="' + playerID + '"></object></center>');

    var flashvars = {
        file: optionsRep.path + urls[0],
        autostart: true,
        usekeys: 'true',
        "controlbar.position": "bottom",
        repeat: 'always',
        /*
         * "playlist.position": "top", "playlist.size":250,
         */
    };
    var params = {
        allowfullscreen: 'true',
        allowscriptaccess: 'always',
    };
    var attributes = {
        'id': playerID,
        'name': playerID,
    };

    swfobject.embedSWF("player.swf", playerID, optionsRep.width - 30, optionsRep.height - 55, '9', 'false',
        flashvars, params, attributes, function (e) {
            if (!e.success) {
                $target.html('<p style="padding-top:10px">No se pudo reproducir el video, necesita tener flashplayer instalado en el naveador ' + '<a href="' + list[0].file + '"> Descargar video </a> </p>');
                return;
            }
            jwplayer(e.ref).load(list);

            if (list.length == 1) {

                jwplayer(e.ref).onComplete(function () {
                    $target.dialog("close");
                    // $target.parents("modal").modal("hide");
                });
            }

            // para cuando hay listas de reproduccion
            jwplayer(e.ref).onPlaylistItem(function (play) {
                $('ul#listaRep li').removeClass('temaSelect');
                $('ul#listaRep li:eq(' + play.index + ')').addClass('temaSelect');
            });
            //jwplayer(e.ref).play();


        });
    //ventana.append(swfobject);

}


var execAnime = function (optionsRep) {
    var anime = $('<div><embed height="100%" width="100%" name="plugin" src="' + optionsRep.path + '" type="application/x-shockwave-flash"></div>').appendTo("body");

    anime.dialog({
        autoOpen: true,
        title: "Reproductor de animaciones",
        width: optionsRep.width,
        height: optionsRep.height,
        beforeclose: function () {
            $(this).remove();
            $(".animacion", "#iniMediaPresent").show();
        }
    });
}

var execFile = function (urlmedia) {
    var p = urlmedia.lastIndexOf("/");
    if (p == -1) {
        urlmedia = 'fuentes/' + config.producto + '/complemento/' + urlmedia;
    }
    //urlmedia=escape(urlmedia);
    //urlmedia = encodeURIComponent( urlmedia ).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");

    //window.location.href = urlmedia;
    window.open(urlmedia, 'toolbar=0,locat ion=0,directories=0,status=yes,menubar=0,scrollbar s=yes,resizable=yes,width=600,height=625,titlebar= yes');

}

function getUrls(idat) {
    var directorio, path = "medias/";
    var galeriaId = parseInt(idat[0]);
    switch (galeriaId) {
        case config.imagen.id:
            directorio = config.imagen.directorio;
            break;
        case config.video.id:
            directorio = config.video.directorio;
            break;
        case config.sonido.id:
            directorio = config.sonido.directorio;
            break;
        case config.animacion.id:
            directorio = config.animacion.directorio;
            break;
        case config.complemento.id:
            path = "";
            directorio = config.complemento.directorio;
            break;
    }
    var imgshow = urlShow = null;
    //file.img_remplazo = idat[7];
    if (galeriaId != config.imagen.id) {
        if (idat[7]) {
            imgshow = idat[7];
        }
    } else
        imgshow = idat[2];

    if (imgshow) {
        urlShow = app.urlprod + "/medias/" + config.imagen.directorio + "/" + config.thumbnails + "/" + imgshow;
    }
    urlgaleria = app.urlprod + "/" + path + directorio + "/";
    urlfile = urlgaleria + idat[2];

    return {'urlShow': urlShow, 'urlFile': urlfile};
}

function shortName(name) {

    var pos = name.lastIndexOf(".");
    if (pos != -1) {
        name = name.substring(0, pos);
    }
    if (name && name.length > 15) {
        return name.substr(0, 14) + '...';
    } else {
        if (name)
            return name;
        else {
            name = 'Sin descripci&oacute;n';
            return name;
        }
    }
}

function formatFile(nombreFile) {

    var pos = nombreFile.lastIndexOf(".");
    var name = nombreFile.substring(0, pos);
    var ext = nombreFile.substr(pos + 1);
    var type, typeTitle;

    switch (ext.toLowerCase()) {
        case 'pdf':
            type = 'fa-file-pdf-o';
            typeTitle = 'Documento PDF';
            break;

        case 'doc':
        case 'docx':
            type = 'fa-file-word-o';
            typeTitle = 'Documento Word';
            break;

        case 'flv':
        case 'swf':
        case 'avi':
        case 'mpg':
        case 'mp4':
        case 'ogg':
        case 'webm':
            type = 'fa-file-video-o';
            typeTitle = 'Video tipo ' + ext;
            break;

        case 'mp3':
        case 'wma':
        case 'wma':
        case 'wave':
        case 'wav':
            type = 'fa-file-audio-o';
            typeTitle = 'Audio tipo ' + ext;
            break;

        case 'txt':
        case 'rtf':
            type = 'fa-file-text-o';
            typeTitle = 'Documento de texto';
            break;

        case 'jpg':
        case 'bmp':
        case 'gif':
        case 'png':
        case 'jpeg':
            type = 'fa-file-image-o';
            typeTitle = 'Imagen tipo ' + ext;
            break;

        case 'ppt':
        case 'pps':
        case 'pptx':
            type = 'fa-file-powerpoint-o';
            typeTitle = 'Power Point';
            break;

        case 'xls':
        case 'xlsx':
            type = 'fa-file-excel-o';
            typeTitle = 'Documento Excel';
            break;

        case 'accdb':
        case 'mdb':
            type = 'fa-file-word-o';
            typeTitle = 'Documento Access';
            break;

        case 'rar':
            type = 'fa-file-zip-o';
            typeTitle = 'Archivo WinRAR';
            break;

        case 'zip':
            type = 'fa-file-zip-o';
            typeTitle = 'Archivo WinZIP';
            break;

        case '7z':
            type = 'fa-file-zip-o';
            typeTitle = 'Archivo 7Z';
            break;

        case 'tar':
            type = 'zip';
            typeTitle = 'Archivo TAR';
            break;

        case 'gz':
            type = 'zip';
            typeTitle = 'Archivo GZ';
            break;

        case 'tgz':
            type = 'zip';
            typeTitle = 'Archivo TGZ';
            break;

        case 'html':
        case 'htm':
        case 'js':
        case 'css':
            type = 'fa-file-code-o';
            typeTitle = 'Archivo Web ' + ext;
            break;

        case 'chm':
            type = 'fa-file-code-o';
            typeTitle = 'Archivo CHM';
            break;

        case 'swf':
            type = 'fa-file-video-o';
            typeTitle = 'Animaci&oacute;n Flash';
            break;


        default:
            break;
    }
    return {'type': type, 'typeTitle': typeTitle, 'name': name};
}

function photoSwipeOpen(parentTarget, target) {

    var pswpElement = document.querySelectorAll('.pswp')[0];

    if (!parentTarget) parentTarget = nsgaleria.target;
    var items = [];
    var links = $("a[rel*='photoSwipe'], a[rel*='lightbox']", parentTarget);
    var index = 0;
    for (var i = 0; i < links.length; i++) {
        var anchor = links[i];

        if (anchor == target)
            index = i;

        var title = anchor.getAttribute("title");
        if (!title && anchor.tSettings)
            title = anchor.tSettings.oldTitle;

        if (title) {
            var tmp = title.split('[sep]');
            title = "<h2>" + tmp[0] + "</h2>";
            if (tmp[1])
                title += tmp[1];
        }

        $window = $(window);
        $h = $window.height();
        $w = $window.width();

        var img = $("img", anchor);
        if (img.length) {
            img = img[0];
            $rh = $h / img.offsetHeight;
            $rw = $w / img.offsetWidth;
            $rr = $rh > $rw ? $rw : $rh;
            $rr = Math.round($rr) + 1;
            items.push({
                src: anchor.getAttribute("href"),
                msrc: img.getAttribute("src"),
                w: img.offsetWidth * $rr,
                h: img.offsetHeight * $rr,
                title: title
            });
        } else {
            items.push({
                src: anchor.getAttribute("href"),
                //msrc: img.getAttribute("src"),
                w: $w,
                h: $h,
                title: title
            });
        }
    }

    var options = {
        index: index || 0, // start at first slide,
        history: false,
        shareEl: false,
        // fullscreenEl:false,
        //zoomEl:true,

        //showAnimationDuration: 0,
        //hideAnimationDuration: 0
        maxSpreadZoom: 3,
        /* getDoubleTapZoom : function (isMauseClick, item){
         if(isMauseClick){
         return 2;
         }
         }*/
    };

    nsgaleria.gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    nsgaleria.gallery.init();
}

$(document).ready(function () {

    $('body')
        .on('click', "a.execVideo,a.execSonido,a.execAnime, a.execFile, a.execList", nsgaleria.exec);

    app.loadTpl("item_image", "model/galeria/item_image.tpl.html");
    app.loadTpl("item_compl", "model/galeria/item_compl.tpl.html");
    app.loadTpl("item_media", "model/galeria/item_media.tpl.html");

});