$(document).on('pagebeforeshow', 'div[data-role="dialog"]', function (e, ui) {
    ui.prevPage.addClass("ui-dialog-background ");
});

$(document).on('pagehide', 'div[data-role="dialog"]', function (e, ui) {
    $(".ui-dialog-background ").removeClass("ui-dialog-background ");
});

// Library Modal
$(document).on("pagecreate", function () {
    $("#library-info-modal").on("click", function () {
        // text you get from Ajax
        var content = `
            <div data-role="header" data-theme="a">
             <h1> Library Page Modal ;) </h1>
            </div>
           <div role="main" class="ui-content flow-modal-btn-container">
            <button class='flow-modal-btn'>close</button>
          </div>
      `;

        var popup = $("<div/>", {
            "data-role": "popup",
            "id": "library-info-modal"
        }).css({
            //   width: $(window).width() / 5 + "px",
            padding: 5 + "px",
            margin: 15 + 'px',
        })
            // .append(closeBtn)
            .append(content);

        // Append it to active page
        $.mobile.pageContainer.append(popup);

        // Create it and add listener to delete it once it's closed
        // open it
        $("[data-role=popup]").popup({
            dismissible: true,
            history: false,
            theme: "b",
            /* or a */
            positionTo: "window",
            overlayTheme: "b",
            /* "b" is recommended for overlay */
            transition: "pop",
            beforeposition: function () {
                $.mobile.pageContainer.pagecontainer("getActivePage")
                    .addClass("blur-filter");
            },
            afterclose: function () {
                $(this).remove();
                $(".blur-filter").removeClass("blur-filter");
            },
            afteropen: function () {
                /* do something */
            }
        }).popup("open");
    });
});

// News Noticeboard Modal
$(document).on("pagecreate", function () {
    $("#training-noticeboard-info-modal").on("click", function () {
        // close button
        //   var closeBtn = $('<a href="#" data-rel="back" class="ui-btn-right ui-btn ui-btn-b ui-corner-all ui-btn-icon-notext ui-icon-delete ui-shadow">Close</a>');

        // text you get from Ajax
        var flow_content = `
            <div data-role="header" data-theme="a">
                 <h1> Noticeboard </h1>
            </div>
           <div role="main" class="ui-content">
                <div class='flow-modal-btn-container'>
                    <button class='flow-modal-btn'></button>
                </div>
            </div>
            <div role="footer">
                <span>
                    Tap the categories to explore items saved  to your library
                </span>
            </div>
      `;

        var popup = $("<div/>", {
            "data-role": "popup",
            "id": "noticeboard-info-modal-style"
        }).css({
            //   width: $(window).width() / 5 + "px",
            padding: 5 + "px",
            margin: 15 + 'px',
        })
            // .append(closeBtn)
            .append(flow_content);

        // Append it to active page
        $.mobile.pageContainer.append(popup);

        // Create it and add listener to delete it once it's closed
        // open it
        $("[data-role=popup]").popup({
            dismissible: true,
            history: false,
            theme: "b",
            /* or a */
            positionTo: "window",
            overlayTheme: "b",
            /* "b" is recommended for overlay */
            transition: "pop",
            beforeposition: function () {
                $.mobile.pageContainer.pagecontainer("getActivePage")
                    .addClass("blur-filter");
            },
            afterclose: function () {
                $(this).remove();
                $(".blur-filter").removeClass("blur-filter");
            },
            afteropen: function () {
                /* do something */
            }
        }).popup("open");
    });
});
