var thema = function () {

    return {
        model: '',
        color: '',
        data: [],
        temario: function () {
            d = thema.data;
            $('.ui-dialog-content', '#cuerpoContenido').css({'color': d.texCuerpo});
            $('img.imgCnt', '#temarioFlotante').css({'border-color': d.borde});
            $('.ejercicioCnt', '#cuerpoContenido').css({
                'color': d.texCuerpo,
                'background-color': d.fondo,
                'border-color': d.borde,
            });
            $('.btnEjerCnt a', '#cuerpoContenido').css({'background-color': d.barra}).hover(function () {
                $(this).css({color: d.hoverBoton})
            });
            $('.orient_ejercnt', '#cuerpoContenido').css({'background-image': 'url(web/images/' + thema.color + '/orienta-normal.png)'}).hover(function () {
                $(this).css({'background-image': 'url(web/images/' + thema.color + '/orienta-resaltado.png)'})
            });

            $('.temaSelect', '#temarioFlotante').css({
                'color': d.texTitulo,
                'background-color': d.barra,
                'border-color': d.marco,
            });
            $('.subtemaSelect', '#temarioFlotante').css({
                'color': d.texTitulo,
                'background-color': d.barra
            });
            $('div.linkSubtema', '#temarioFlotante').css({'background-color': d.lineaImpar}).hover(function () {
                $(this).css({'color': d.lineaPar})
            });
            $('#temarioTitulo', '#temarioFlotante').css({'color': d.texCuerpo})
            $('.temarioTema', '#temarioFlotante').css({
                'background-color': d.lineaImpar,
                'border-color': d.marco,
            });

            $('.temarioTema a', '#temarioFlotante').css({
                'color': d.texIni,
                'background-image': 'url(web/images/' + thema.color + '/img_cont/vineta-temas-normal.png)',
            }).hover(function () {
                $(this).css({
                    'background-color': d.lineaPar,
                    'background-image': 'url(web/images/' + thema.color + '/img_cont/vineta-temas-resaltado.png)',
                })
            });

            $('.temarioSubTema a', '#temarioFlotante').css({
                'color': d.texIni,
                'background-image': 'url(web/images/' + thema.color + '/img_cont/vineta-subtemas-normal.png)',
            }).hover(function () {
                $(this).css({
                    'background-color': d.lineaPar,
                    'background-image': 'url(web/images/' + thema.color + '/img_cont/vineta-subtemas-resaltado.png)',
                })
            });

            $('#ventanaTemario', '#temarioFlotante').css({'background-image': 'url(web/images/' + thema.color + '/img_cont/fondo-plegable-pixel.png)'})
            $('#div_plegable', '#temarioFlotante').css({'background-image': 'url(web/images/' + thema.color + '/img_cont/fondo-plegable-remate.png)'})

            $('#btnOcultar', '#temarioFlotante').css({'background-image': 'url(web/images/' + thema.color + '/img_cont/ocultar-normal.png)'}).hover(function () {
                $(this).css({'background-image': 'url(web/images/' + thema.color + '/img_cont/ocultar-resaltado.png)'})
            })

            $('#btnMostrar', '#temarioFlotante').css({'background-image': 'url(web/images/' + thema.color + '/img_cont/desplegar-normal.png)'}).hover(function () {
                $(this).css({'background-image': 'url(web/images/' + thema.color + '/img_cont/desplegar-resaltado.png)'})
            });

            $('#piePagina', '#cuerpoContenido').css({
                'border-top': ' 2px solid ' + d.marco,
                'background-color': d.barra
            });
            $('#cantidades', '#cuerpoContenido').css({'background-color': d.barra});
        }
    }
}();