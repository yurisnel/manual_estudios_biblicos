$.widget("ui.mydialog", $.extend({}, $.ui.dialog.prototype, {

    _init: function () {
        //this.element.data('sortable', this.element.data('customsortable'));
        return $.ui.dialog.prototype._init.apply(this, arguments);

    },
    _create: function () {
        $.ui.dialog.prototype._create.apply(this);

        uiDialogTitlebarHide = $('<a href="#"></a>')
            .addClass(
                'ui-dialog-titlebar-hide ' +
                'ui-corner-all'
            )
            .attr('role', 'button')
            .hover(
                function () {
                    uiDialogTitlebarHide.addClass('ui-state-hover');
                },
                function () {
                    uiDialogTitlebarHide.removeClass('ui-state-hover');
                }
            )
            .focus(function () {
                uiDialogTitlebarHide.addClass('ui-state-focus');
            })
            .blur(function () {
                uiDialogTitlebarHide.removeClass('ui-state-focus');
            })
            .click(function (event) {
                //$(this).parent().parent().hide();
                event.preventDefault();
                $(this).parent().parent().css('visibility', 'hidden');
                $(this).parent().next().find('object').css('visibility', 'hidden');

            })
            .appendTo(this.uiDialogTitlebar),

            uiDialogTitlebarHideText = $('<span></span>')
                .addClass(
                    'ui-icon ' +
                    'ui-icon-hidethick'
                )
                .appendTo(uiDialogTitlebarHide);

    }, mostrar: function () {
        // $.ui.dialog.prototype.open.apply(this);
        this.uiDialog.css('visibility', '');

    }


}));

//$.ui.mydialog.defaults = $.extend({}, $.ui.dialog.defaults);

