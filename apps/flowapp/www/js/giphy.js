(function (factory) {
  /* Global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function ($) {
    $.extend(true,$.summernote.lang, {
            'en-US': { /* US English(Default Language) */
                giphy: {
                dialogTitle: 'Giphy',
                okButton: 'OK',
            }
        }
    });
    $.extend($.summernote.options, {
        giphy: {
          icon: '<span>GIF<span/>',
          tooltip: 'gif',
        }
    });
    $.extend($.summernote.plugins, {
        'giphy': function (context) {
            var self = this,
                // ui has renders to build ui elements
                // for e.g. you can create a button with 'ui.button'
                ui = $.summernote.ui,
                $note = context.layoutInfo.note,

                // contentEditable element
                $editor   = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                $toolbar  = context.layoutInfo.toolbar,

                // options holds the Options Information from Summernote and what we extended above.
                options   = context.options,

                // lang holds the Language Information from Summernote and what we extended above.
                lang      = options.langInfo;

            context.memo('button.giphy', function () {

                var $api           = '/giphy/',
                    $apiquery      = 'funny',
                    $apiproperty   = '10';

                var apiurl = localStorage.remoteHost + $api + $apiquery + '/' + $apiproperty
                options.giphy.giphyRowDivFirst = $('<div/>')

                $giphyRowDivSecond          = $('<div/>')
                var $giphyColumnDivFirst    = $('<div/>')
                                              .addClass('col-sm-12')
                                              .addClass('giphy-first-col');

                var $giphyInput             = $('<input/>')
                                              .addClass('giphy-search-input')
                                              .attr('placeholder', ' Search')


                $giphyColumnDivFirst.append($giphyInput)
                $giphyRowDivSecond.append($giphyColumnDivFirst)
                options.giphy.giphyRowDivFirst.append($giphyRowDivSecond)


                giphyList = ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-toggle',
                        contents: options.giphy.icon,
                        tooltip: "Insert Giphy",
                        data: {
                            toggle: 'dropdown'
                        },
                        click: function () {
                            context.invoke('editor.saveRange');
                        }
                    }),
                    ui.dropdown({
                        className: 'giphy-list',
                        //items: giphy, // list of style tag
                        contents: options.giphy.giphyRowDivFirst,
                    })
                ]).render();

                $.getJSON(apiurl, function(data){

                    $giphyColumnDivSecond   = $('<div/>')
                                    .addClass('col-sm-12')
                                    .addClass('giphy-col-12-div')

                    $giphyRowDivThird     = $('<div/>')


                    for (var i = data.data.length - 1; i >= 0; i--) {
                        $giphyColumnDivThird   = $('<div/>')
                                            .addClass('col-sm-6')
                                            .addClass('giphy-col-div')

                        var $giphyATag  = $('<a/>')
                                          .attr('href', '#')
                                          .attr('data-original-url', data.data[i].images.original.url)
                                          .addClass('giphy-a-tag')

                        var $img        = $('<img/>')
                                          .attr('src', data.data[i].images.preview_gif.url)
                                          .addClass('giphy-imgs');

                        $giphyATag.append($img)
                        $giphyColumnDivThird.append($giphyATag)
                        $giphyRowDivThird.append($giphyColumnDivThird)
                    }
                    $giphyColumnDivSecond.append($giphyRowDivThird)
                    options.giphy.giphyRowDivFirst.append($giphyColumnDivSecond)

                    $giphyAttributionMark   = $('<img/>')
                                              .addClass('giphy-attribution-mark-img')
                                              .attr('src', './img/PoweredBy_200px-White_HorizText.png')
                    $giphyRowDivForth       = $('<div/>')
                                              .addClass('giphy-attribution-mark-div col-sm-12')
                                              .append($giphyAttributionMark)
                    options.giphy.giphyRowDivFirst.append($giphyRowDivForth)

                })

                return giphyList;

            });

            // This events will be attached when editor is initialized.
            this.events = {
                // This will be called after modules are initialized.
                'summernote.init': function (we, e) {
                    addListener();
                    $(document).on('click', '.giphy-search-input', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                },
                // This will be called when user releases a key on editable.
                'summernote.keyup': function (we, e) {
                }
            };

            var addListener = function () {
                $('body').on('click', '.giphy-a-tag', function(e){
                    var img = new Image();
                    img.src = $(this).data('original-url');
                    context.invoke('editor.insertNode', img);
                })

                $('body').on('keyup', '.giphy-search-input', function (e) {

                    var $queryvalue = $(this).val()

                    if (!$(this).val()){
                        $queryvalue = 'funny'
                    }

                    var $api           = '/giphy/',
                        $apiquery      = $queryvalue,
                        $apiproperty   = '10';

                    var apiurl = localStorage.remoteHost + $api + $apiquery + '/' + $apiproperty

                    $.getJSON(apiurl, function(data){

                        $giphyColumnDivSecond   = $('<div/>')
                                        .addClass('col-sm-12')
                                        .addClass('giphy-col-12-div')

                        $giphyRowDivThird     = $('<div/>')

                        options.giphy.giphyRowDivFirst.find('.giphy-col-12-div').remove()
                        options.giphy.giphyRowDivFirst.find('.giphy-attribution-mark-div').remove()
                        for (var i = data.data.length - 1; i >= 0; i--) {
                            $giphyColumnDivThird   = $('<div/>')
                                                .addClass('col-sm-6')
                                                .addClass('giphy-col-div')

                            var $giphyATag  = $('<a/>')
                                              .attr('href', '#')
                                              .attr('data-original-url', data.data[i].images.original.url)
                                              .addClass('giphy-a-tag')

                            var $img        = $('<img/>')
                                              .attr('src', data.data[i].images.preview_gif.url)
                                              .addClass('giphy-imgs');

                            $giphyATag.append($img)
                            $giphyColumnDivThird.append($giphyATag)
                            $giphyRowDivThird.append($giphyColumnDivThird)
                        }
                        $giphyColumnDivSecond.append($giphyRowDivThird)
                        options.giphy.giphyRowDivFirst.append($giphyColumnDivSecond)


                        $giphyAttributionMark   = $('<img/>')
                                                  .addClass('giphy-attribution-mark-img')
                                                  .attr('src', './img/PoweredBy_200px-White_HorizText.png')
                        $giphyRowDivForth       = $('<div/>')
                                                  .addClass('giphy-attribution-mark-div col-sm-12')
                                                  .append($giphyAttributionMark)
                        options.giphy.giphyRowDivFirst.append($giphyRowDivForth)

                    })

                });
            };
        }

    });

}));