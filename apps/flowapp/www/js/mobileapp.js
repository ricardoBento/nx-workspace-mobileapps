/* File Info
* MobileApp helper functions for UI and data connection to FlowZone
*
* Requires that the remoteHost value already set in localStorage:
*      localStorage.remoteHost = "https://www.flowmodulemanager.co.uk";
*
*/

/* Start of App Initialisation */
$ = jQuery;
_defaultHome = "#login";
_introAnimationReady = false;

// For quick theme testing
// If removing, please remember to remove all instances of _defaultThemeColours
_defaultThemeColours = false;
_debug = false;

function MobileApp() {
    var self = this;
    var bg_url = self.getStorageValue('brandingBgURL', './img/flow-background.png');
    $('.background-img').attr('src', bg_url);
    var brandingItems = JSON.parse(self.getStorageValue('brandingData', '{}'));
    if (brandingItems.mobile_brand_colour_1){
        $('#pre-loader .loading').css({'color': brandingItems.mobile_brand_colour_1 });
    } else {
         $('#pre-loader .loading').css({'color': '#e45899'});
    }
    self.customJQMObjects();
}

// Add debug handler for console logging
MobileApp.prototype.debug = function (msg) {
    if (_debug) {
        console.log("DEBUG: " + msg);
    }
};

MobileApp.prototype.init = function () {
    window.screen.orientation.lock('portrait');
    var self = this;
    self.debug("Starting init()...");
    window.onerror = function (error, url, line) {
        self.debug(error);
        navigator.notification.alert('error: ' + error + ' line: ' + line);
    };

    // prevent overlay on status bar for ios devices
    if (window.StatusBar) {
        StatusBar.overlaysWebView(false);
    }

    // Should come from settings for live, uat, staging or dev?
    self.remoteHost = localStorage.remoteHost;

    // Resets the commsRadioChoice every time you start the app
    localStorage.commsRadioChoice = "all";

    // Setting the locally stored topics
    localStorage.topics = JSON.stringify({});

    // Fixed url endpoints
    self.settingsURL = '/api/v1/mobile/settings/';
    self.loginURL = '/api/v1/mobile/login/';
    self.brandingURL = '/api/v1/mobile/branding/';
    self.feedURL = '/api/v1/mobile/list_updates/';
    self.trainingURL = '/api/v1/mobile/training_updates/';
    self.trainingPathURL = '/api/v2/mobile/training_path/';
    self.careerURL = '/api/v1/mobile/career_updates/';
    self.commsURL = '/api/v1/mobile/comms_updates/';
    self.libraryURL = '/api/v1/mobile/library_updates/';
    self.newsURL = '/api/v1/mobile/news_updates/';
    self.noticeboardURL = '/api/v1/mobile/noticeboard_updates/';
    self.newsArticleURL = '/api/v1/mobile/news_view/';
    self.appraisalURL = '/api/v1/mobile/appraisal_view/';
    self.workbookURL = '/api/v1/mobile/workbook_view/';
    self.bookingUpdateURL = '/api/v1/mobile/booking/update/';
    self.bookingCreateURL = '/api/v1/mobile/booking/create/';
    self.bookmarkNewsURL = '/api/v1/mobile/news/copy_to_library/';
    self.unbookmarkNewsURL = '/api/v1/mobile/news/remove_from_library/';
    self.bookmarkNoticeboardURL = '/api/v1/mobile/resource/copy_to_library/';
    self.unbookmarkNoticeboardURL = '/api/v1/mobile/resource/remove_from_library/';
    self.moduleDocumentsURL = '/api/v1/mobile/module_documents/';
    self.trainingSessionURL = '/api/v1/mobile/training_session/';
    self.traineeDetailsURL = '/api/v1/mobile/trainee_details/';
    self.nbSignOffURL = '/api/v1/mobile/noticeboard/sign-off/';

    // URL for the Dashboard
    self.dashboardURL = "/api/v1/mobile/dashboard/";

    // URLs for the Forum
    self.forumIndexURL = "/api/v1/mobile/forum/index-view/";
    self.forumSubscriptionURL = "/api/v1/mobile/forum/subscriptions-view/";
    self.forumPostSearchURL = "/api/v1/mobile/forum/post-search/";
    self.forumUnreadTopicsURL = "/api/v1/mobile/forum/unread-topics/";
    self.forumViewTopicsURL = "/api/v1/mobile/forum/topic-view/";
    self.forumPostSubscribeURL = "/api/v1/mobile/forum/topic-subscribe/";
    self.forumPostUnsubscribeURL = "/api/v1/mobile/forum/topic-unsubscribe/";
    self.forumPostLikeURL = "/api/v1/mobile/forum/post-like/";
    self.forumTopicCreateURL = "/api/v1/mobile/forum/topic-create/";
    self.forumPostCreateURL = "/api/v1/mobile/forum/post-create/";

    // FIND THE REAL URL TO CALL TO UNLIKE POSTS
    self.forumPostUnlikeURL = "/api/v1/mobile/forum/post-unlike/";
    self.forumPollVoteURL = "/api/v1/mobile/forum/poll-vote/";
    self.forumRemovePollVoteURL = "/api/v1/mobile/forum/remove-poll-vote/";

    self.newsAddCommentURL = "/api/v1/mobile/news/add-comment/";

    self.recentlyAddedDays = 30;

    self.forceUpdate = false;
    self.noItemsMsg = "No Current Items";
    self.loadingDashboard = false;
    self.loadingForums = false;

    self.mobile_app_client_version = 1;

    // Default Labels for branding
    self.labels = {
        "external_training_label_plural": "Training",
        "noticeboard_label": "Noticeboard",
        "careers_label": "Careers",
        "competence_label_plural": "Competences",
        "external_training_label": "External Training",
        "appraisal_label_plural": "Appraisals",
        "competence_label": "Competence",
        "careers_label_plural": "Careers",
        "noticeboard_label_plural": "Noticeboards",
        "appraisal_label": "Appraisal",
        "feed_label": "Feed",
        "training_label": "Training",
        "comms_label": "Comms",
        "library_label": "Library",
        "my_career_label": "My-Career",
        "training_path_label": "My Training"
    };

    self.typeToLabel = {
        "appraisal": "appraisal_label",
        "competence": "competence_label",
        "external training": "external_training_label",
        "noticeboard": "noticeboard_label"
    };

    self.typeToLabelPlural = {
        "appraisal": "appraisal_label_plural",
        "competence": "competence_label_plural",
        "external training": "external_training_label_plural",
        "noticeboard": "noticeboard_label_plural"
    };

    self.colours = {
        "mobile_warning_colour_a1": "#f54a33",
        "mobile_warning_colour_a2": "#ff9500",
        "mobile_alert_colour_b1": "#deb633",
        "mobile_alert_colour_b2": "#f5e15f",
        "mobile_ok_colour_c1": "#69b4bf",
        "mobile_ok_colour_c2": "#50d9de",
        "mobile_ok_colour_c3": "#9deff2",
        "mobile_ok_colour_c4": "#2299ab",
        "mobile_neutral_colour_d1": "#929292",
        "mobile_neutral_colour_d2": "#bcbcbc",
        "mobile_neutral_colour_d3": "#ececec",
        "mobile_neutral_colour_d4": "#565656",
        "mobile_brand_colour_1": "#E45899",
        "mobile_brand_colour_2": "rgba(255, 255, 255, 0.4)",
        "mobile_gradient_colour_1": "#32497D",
        "mobile_gradient_colour_2": "#0A1430",
    };

    self.mobile_bg_startup_only = true;

    // Default empty categories array for noticeboard items
    // This will be filled during app initiation
    self.categories = [];

    // Default list of feed options. Items will be dynamically added to this later to allow the app to find and open the correct item links
    self.feedOptions = {
        'prof-list': 'feedData',
        'comms-list': 'commsData',
        'news-list': 'newsData',
        'library-list': 'libraryData',
        'training-list': 'trainingData',
        'completed-training-list': 'trainingData',
        'upcoming-training-list': 'trainingData',
        'invited-training-list': 'trainingData',
        'available-training-list': 'trainingData',
        'overdue-training-list': 'trainingData',
        'appraisal-list': 'careerData',
        'competence-list': 'careerData'
    };

    self.debug("feedOptions done");
    var accessCode = self.getStorageValue("accessCode", false);

    if (accessCode) {
        self.getSettings();
        //self.getBranding();
    } else {
        self.setBranding();
    }

    self.setupEvents();

    $('.signout-link').on("click", function () {
        self.logout();
    });

    if (localStorage.token) {
        if (localStorage.token == "undefined" || localStorage.token == undefined) {
            self.debug("Remove token without need for server side response");
            self.forceLogout();
        }
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (settings.url.startsWith(self.remoteHost)) {
                // Only send the token to the app server
                xhr.setRequestHeader("X-ACCESS-CODE", localStorage.accessCode);
                token = localStorage.token;
                if ((typeof (token) != 'undefined')) {
                    xhr.setRequestHeader('Authorization', 'Token ' + token);
                }
            }
        }
    });

    $(document).ajaxError(function (event, xhr, options, exc) {
        if (xhr.status == 401) {
            // If an unauthorized response is returned, force the user to be logged out
            // The server generated tokens are valid for 2 weeks, so this won't be too invasive
            self.forceLogout();
        }
    });
    self.initI18next();
    self.moduelDownloadlHandlerAttached = false;
    self.debug("Completed init() call.");
};

MobileApp.prototype.showApp = function() {
    var self = this;
    $('#background .background-img').css({'opacity': 0});
    // Hide the cordova spalashscreen
    if (navigator.splashscreen) {
        navigator.splashscreen.hide();
    }

    // Remove the preloader
    $('#pre-loader').delay(1000).fadeOut('slow', function() { $(this).remove();});

    // Calculate where to go
    var accessCode = self.getStorageValue("accessCode", false);
    if (accessCode) {
        if (self.mobile_app_client_version == 1) {
            _defaultHome = '#dashboard';
        } else {
            _defaultHome = '#new-dashboard';
        }
    } else {
        _defaultHome = '#login';
    }

    // Set background image stuff
    if (self.mobile_app_client_version == 1) {
        $('#background').css({
            'background-color': '#000000'
        });
        $('.background-img').css({
            'opacity': 1
        });
        if (_defaultHome != '#login') {
            $('.background-img').animate({
                'opacity': 1
            });
        }
    } else {
        $('.background-img').css({
            'opacity': 0.2
        });
        $('#background').css({
            'background-color': '#ffffff'
        });
    }


    // Hide background if we're not logging in and the option is set
    if (accessCode && self.mobile_bg_startup_only) {
        $('#background').hide();
    } 
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    if(activePage[0].id != _defaultHome) {
        self.debug("Switch to default home: " + _defaultHome);
        $.mobile.changePage(_defaultHome, { transition: "fade", allowSamePageTransition: true });
    }
};

MobileApp.prototype.setupEvents = function () {
    var self = this;
    self.debug("Starting setupEvents()...");
    self.swipeInit();
    var companySettings = self.getStorageValue("companySettings", false);
    var accessCode = self.getStorageValue("accessCode", false);
    $('#popupMenu').popup();

    var hideElements = $("*").find("[data-visible='false']");

    hideElements.each(function () {
        self.setVisibility($(this), false);
    });

    $(document).on("pagebeforeshow", "#new-dashboard", function () {
        self.getDashboardDataV2();
    });

    $(document).on("pagebeforeshow", "#news-noticeboard-page", function () {
        self.commsPageV2();
    });

    $(document).on("pagebeforeshow", "#training", function () {
        self.trainingPage();
    });

    // Training Path and Calendar Events 
    $(document).on("pagebeforeshow", "#my-training", function () {
        self.myTrainingV2();
    });

    $(document).on("pagebeforeshow", "#module-launch-V2", function () {
        self.launchModule(JSON.parse(localStorage.currentModule).href);
    });

    $(".tabs a#get-training-path").on("click", function () {
        self.getTrainingPath("#training-path-container");
    });

    $(".tabs a#get-training-calendar").on("click", function () {
        self.getTrainingCalendar("#training-calendar-container");
    });

    // Responsible for the dropdown displaying the legend
    $('#career-path-dropdown').on('click', function () {
        self.dropdown(self.labels.training_path_label, $("#career-path-inner-header"), {
            "colour": "White",
            "key": "multi"
        });
    });

    $(document).on("pagebeforeshow", "#communications", function () {
        self.commsPage();
    });

    $(document).on("pagebeforeshow", "#library", function () {
        self.libraryPage();
    });

    $(document).on("pagebeforeshow", "#career", function () {
        self.careerPage();
    });

    $(document).on("pagebeforeshow", "#dashboard", function () {
        self.feedPage();
    });

    $(document).on("pagebeforeshow", "#forum", function () {
        self.forum();
    });

    $(document).on("pagebeforeshow", "#social-forums-page", function () {
        self.forumV2();
    });

    $(document).on("pagebeforeshow", "#library-page", function () {
        self.library();
    });

    $(document).on("pagebeforeshow", "#news-feed", function () {
        self.newsFeedDashboard();
    });

    $(document).on("pagebeforeshow", "#account-details-page", function () {
        self.getTraineeDetails();
    });

    $(document).on("pagebeforehide", '#itempage', function () {
        $('base').attr('href', self.originalBase);
    });

    $("button#submit").unbind("mouseenter");
    $("button#submit").on("click touchend", function (e) {
        e.preventDefault();
        return self.login();
    });

    // Handles when the radio options on the communications tab are triggered.
    $('#comms-radio-choice input').on('change', function () {
        var value = $('input[name=comms-radio-choice]:checked').attr("id").split("-");
        localStorage.commsRadioChoice = value[value.length - 1];
        self.commsPage();
    });

    $(document).on("click", "#appraisalSubmit", function (e) {
        e.preventDefault();

        var appraisal_id = $(document).find("[data-item-id]");

        if (appraisal_id) {
            appraisal_id = appraisal_id.data("item-id");

            if (Number.isInteger(appraisal_id)) {
                $.ajax({
                    url: self.remoteHost + self.appraisalURL + appraisal_id + '/',
                    type: 'POST',
                    data: $('#appraisalForm').serialize(),
                    dataType: 'json',
                    error: function (error) {
                        self.popupMsg(i18next.t("Oops-Cannot-add-item-Please-try-again-later"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
                    },
                    beforeSend: self.setHeaders
                });
            }
        }

        parent.history.back();
    });

    $("#myTrainingChart, #new-dashboard .overdue, #new-dashboard .all-complete").on("click", function () {
        $.mobile.changePage("#my-training");
    });

    // Takes the ID from individule Noticeboard Item and manually changes the status
    $(document).on('click', '.noticeboard-link', function (e) {
        e.preventDefault();
        var url = this.href;
        var data_id = $(this).data('nb-id');
        $("p#" + data_id).text("Status: read");
        window.open(url, "_system", "location=yes,enableViewportScale=yes,hidden=no");
    });

    $(document).on('click', '.competence-link', function (e) {
        e.preventDefault();
        var url = this.href;
        window.open(url, "_system", "location=yes,enableViewportScale=yes,hidden=no");
    });

    $(document).on("click", "[data-item-type]", function (event) {
        event.preventDefault();

        var id = $(this).data("id");
        var type = $(this).data("item-type");
        var feed, obj;

        // Training session items have their own handler
        if (type == "training session") {
            self.getTrainingSessionObj(id);
            return;
        }

        switch (type) {
            case "news":
                feed = localStorage.newsData;
                if (!feed) {
                    feed = localStorage.savedNewsData;
                }
                break;
            case "noticeboard":
                feed = localStorage.noticeboardData;
                if (!feed) {
                    feed = localStorage.savedNoticeboardData;
                }
                break;
            default:
                feed = localStorage.feedData;
                break;
        }

        if ($(this).hasClass("from-currentRecent")) {
            feed = localStorage.currentRecent;
        }
        if ($(this).hasClass("from-currentOutstanding")) {
            feed = localStorage.currentOutstanding;
        }
        if ($(this).hasClass("from-currentOverdue")) {
            feed = localStorage.currentOverdue;
        }
        if ($(this).hasClass("from-library")) {
            feed = localStorage.libraryData;
        }
        if ($(this).hasClass("training_path_item")) {
            feed = localStorage.trainingPath;
        }

        var obj;

        try {
            obj = self.getObject(id, type, feed);
        } catch (e) {
            console.error(e);
            obj = self.getObject(id, type, localStorage.feedData);
        }


        if (typeof obj === 'object' && Object.keys(obj).length > 0) {
            switch (type) {
                case "news":
                    obj = self.getNewsItemPageObj(obj);
                    break;
                case "noticeboard":
                    obj = self.getNoticeboardItemPageObj(obj);
                    break;
                case "external training":
                    obj = self.getExternalTrainingItemPageObj(obj);
                    break;
                case "module":
                    obj = self.getModuleItemPageObj(obj);
                    break;
                case "training session":
                    obj = self.getTrainingSessionItemPageObj(obj);
                    break;
                case "appraisal":
                    obj = self.getAppraisalItemPageObj(obj);
                    break;
                case "competence":
                    obj = self.getCompetenceItemPageObj(obj);
                    break;
                case "xt":
                    obj = self.getXtItemPageObj(obj);
                    break;
                default:
                    obj = self.getModuleItemPageObj(obj);
                    break;
            };
            if (self.mobile_app_client_version == 1) {
                $.mobile.changePage("#item-page");
                self.itemPage(obj);
            } else {
                $.mobile.changePage("#item-page-V2");
                self.itemPageV2(obj);
            }
        }
    });

    // Items with data-action="library-add" are added to the users library
    $(document).on("click", '[data-action="library-add"]', function (event) {
        var button = $(this)
        var id = $(this).data("id");
        var type = $(this).data("type");
        var version = $(this).data("version");

        if (version == "2") {
            button.text(i18next.t("please-wait"));
            self.postBookmark(id, type, true, function (status, data) {
                if (status === i18next.t("Success")) {
                    button.text(i18next.t("Successfully-added"));
                } else if (status === i18next.t("Error")) {
                    self.popupMsg(i18next.t("Oops-Cannot-add-item-Please-try-again-later"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
                }
            });
        } else {
            var textContainer = $(this).find(".item-button-text");
            var textContainerText = textContainer.text();

            if (textContainerText == i18next.t("Successfully-added"))
                return;
            if (textContainer)
                textContainer.text(i18next.t("please-wait"));
                self.postBookmark(id, type, true, function (status, data) {

                if (status === i18next.t("Success")) {

                    if (textContainer)
                        textContainer.text(i18next.t("Successfully-added"));

                } else if (status === i18next.t("Error")) {
                    if (textContainer)
                        textContainer.text(textContainerText);
                        self.popupMsg(i18next.t("Oops-Cannot-add-item-Please-try-again-later"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
                }
            });
        }
    });
    // Similar for the v2 design
    $(document).on("click", '[data-action="library-add-v2"]', function (event) {
        var id = $(this).data("id");
        var type = $(this).data("type");
        var extra = $(this).parents('.extra');
        self.postBookmark(id, type, true, function (status, data) {

            if (status === "Success") {
                // show the remove button
                var removeBtn = document.getElementById("remove-from-library-button").content.cloneNode(true);
                removeBtn.querySelector('.button-container').setAttribute("data-id", id);
                removeBtn.querySelector('.button-container').setAttribute("data-type", type);
                extra.empty().append(removeBtn);
            } else if (status === "Error") {
                self.popupMsg(i18next.t("Oops-Cannot-add-item-Please-try-again-later"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            }
        });
    });

    // Items with data-action="library-remove" are removed to the users library
    $(document).on("click", '[data-action="library-remove"]', function () {
        var button = $(this);
        var id = $(this).data("id");
        var type = $(this).data("type");
        var version = $(this).data("version");

        if (version == "2") {
            button.text(i18next.t("please-wait"));
            self.postBookmark(id, type, false, function (status, data) {
                if (status === i18next.t("Success")) {
                    button.text(i18next.t("Successfully-removed"));
                } else if (status === i18next.t("Error")) {
                    self.popupMsg(i18next.t("Oops-Cannot-add-item-Please-try-again-later"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
                }
            });
        } else {
            var textContainer = $(this).find(".item-button-text");
            var textContainerText = textContainer.text();

            if (textContainerText == "successfully removed")
                return;

            if (textContainer)
                textContainer.text(i18next.t("please-wait"));

            self.postBookmark(id, type, false, function (status, data) {

                if (status === i18next.t("Success")) {

                    if (textContainer)
                        textContainer.text(i18next.t("Successfully-removed"));

                } else if (status === i18next.t("Error")) {
                    if (textContainer)
                        textContainer.text(textContainerText);
                    self.popupMsg(i18next.t("Oops-Cannot-add-item-Please-try-again-later"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
                }
            });
        }
    });
    //Similar for the v2 design
    $(document).on("click", '[data-action="library-remove-v2"]', function () {
        var button = $(this);
        var id = $(this).data("id");
        var type = $(this).data("type");
        var extra = $(this).parents('.extra');
        self.postBookmark(id, type, false, function (status, data) {
            if (status === "Success") {
                if (button.parents("#saved-news-container").length == 1) {
                    button.parents(".flow-card.news").remove();
                } else {
                    var addBtn = document.getElementById("add-to-library-button").content.cloneNode(true);
                    addBtn.querySelector('.button-container').setAttribute("data-id", id);
                    addBtn.querySelector('.button-container').setAttribute("data-type", type);
                    extra.empty().append(addBtn);
                }
            } else if (status === "Error") {
                self.popupMsg(i18next.t("Oops-Cannot-add-item-Please-try-again-later"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            }
        });
    });
    // Items with data-action="accept-training" are added to the users training cal
    $(document).on("click", '[data-action="accept-training"]', function () {
        var id = $(this).data("id");
        var type = $(this).data("type");
        var textContainer = $(this).find(".item-button-text");
        var textContainerText = textContainer.text();
        var confirmText = i18next.t("You-are-about-to-accept-an-invitation-to-a-trainin");
        var url = self.bookingUpdateURL + id + "/";

        if (textContainerText == "successfully booked")
            return;

        // Create a Popup that makes sure the user wants to submit the request or not
        navigator.notification.confirm(confirmText, function (idx) {

            if (idx == 1) {

                if (textContainer)
                    textContainer.text(i18next.t("please-wait"));

                self.postTrainingSession(url, { "status": "accept" }, function (status, data) {

                    if (status === "Success") {

                        parent.history.back();

                    } else if (status === "Error") {
                        if (textContainer)
                            textContainer.text(textContainerText);
                        self.popupMsg(i18next.t('Oops-Could-not-book-training-at-the-moment-Please'), self.colours.mobile_warning_colour_a1, "fa-exclamation");
                    }
                });
            } else {
                return false;
            }
        },'Confirm Action', ["Confirm", "Cancel"]);
    });

    // Items with data-action="decline-training" are removed to the users training cal
    $(document).on("click", '[data-action="decline-training"]', function () {
        var id = $(this).data("id");
        var type = $(this).data("type");
        var textContainer = $(this).find(".item-button-text");
        var textContainerText = textContainer.text();
        var confirmText = i18next.t('You-are-about-to-decline-an-invitation-to-a-traini');
        var url = self.bookingUpdateURL + id + "/";

        // Create a Popup that makes sure the user wants to submit teh request or not
        navigator.notification.confirm(confirmText, function (idx) {
            if (idx == 1) {

                if (textContainer)
                    textContainer.text("please-wait");

                self.postTrainingSession(url, { "status": "decline" }, function (status, data) {

                    if (status === "Success") {

                        parent.history.back();

                    } else if (status === "Error") {
                        if (textContainer)
                            textContainer.text(textContainerText);

                        self.popupMsg(i18next.t("Oops-Could-not-decline-training-at-the-moment-Plea"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
                    }
                });
            } else {
                return false;
            }
        },  i18next.t('Confirm-Action'), ["Confirm", "Cancel"]);
    });

    // Items with data-action="book-training" are added to the users training cal
    $(document).on("click", '[data-action="book-training"]', function () {
        var id = $(this).data("id");
        var type = $(this).data("type");
        var textContainer = $(this).find(".item-button-text");
        var textContainerText = textContainer.text();
        var confirmText = i18next.t('You-are-about-to-request-to-attend-a-course-that-h"');
        var url = self.bookingCreateURL + id + "/";

        if (textContainerText == "successfully booked")
            return;

        // Create a Popup that makes sure the user wants to submit teh request or not
        navigator.notification.confirm(confirmText, function (idx) {
            if (idx == 1) {

                if (textContainer)
                    textContainer.text(i18next.t("please-wait"));

                self.postTrainingSession(url, { "status": "book" }, function (status, data) {

                    if (status === "Success") {

                        parent.history.back();

                    } else if (status === "Error") {
                        if (textContainer)
                            textContainer.text(textContainerText);
                        self.popupMsg(i18next.t("Oops-Could-not-book-training-at-the-moment-Please"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
                    }
                });
            } else {
                return false;
            }
        },  i18next.t('Confirm-Action'), ["Confirm", "Cancel"]);
    });

    // Items with data-action="cancel-training" are removed to the users training cal
    $(document).on("click", '[data-action="cancel-training"]', function () {
        var id = $(this).data("id");
        var type = $(this).data("type");
        var textContainer = $(this).find(".item-button-text");
        var textContainerText = textContainer.text();
        var confirmText = i18next.t("You-are-about-to-cancel-a-request-to-attend-a-cour");
        var url = self.bookingUpdateURL + id + "/";

        // Create a Popup that makes sure the user wants to submit teh request or not
        navigator.notification.confirm(confirmText, function (idx) {
            if (idx == 1) {

                if (textContainer)
                    textContainer.text("please-wait");

                self.postTrainingSession(url, { "status": "cancel" }, function (status, data) {

                    if (status === "Success") {

                        parent.history.back();

                    } else if (status === "Error") {
                        if (textContainer)
                            textContainer.text(textContainerText);

                        self.popupMsg(i18next.t('Oops-Could-not-cancel-training-at-the-moment-Pleas'), self.colours.mobile_warning_colour_a1, "fa-exclamation");
                    }
                });
            } else {
                return false;
            }
        }, i18next.t('Confirm-Action'), ["Confirm", "Cancel"]);
    });

    // Items with data-action="open-external" are opened in the external browser
    $(document).on('click', '[data-action="open-external"]', function (event) {
        var button = $(this);
        var url;
        event.preventDefault();
        if (button.data('type') == 'module'){
            url = button.data('src');
        } else {
            url = button.attr('href');
        }
        if (device.platform == "Android") {
            window.open(url, '_system', 'location=yes,enableViewportScale=yes,hidden=no');
        }
        if (device.platform == "iOS") {
            cordova.InAppBrowser.open(url, '_blank', 'location=yes,enableViewportScale=yes,hidden=no,footer=yes,toolbar=yes');
        }
        if (button.attr('data-type') == 'noticeboard') {
            var signoff_required = button.attr('data-signoff-required')
            var signoff_datetime = button.attr('data-signoff-datetime')
            if (signoff_required == 'true' && !signoff_datetime) {
                $('.row.nb-sign-off .column').html(
                    $('<div/>').addClass('inverted basic ui button')
                        .text('Sign-off')
                        .attr('data-id', button.attr('data-id'))
                        .attr('data-action', 'nb-sign-off')
                        .attr('data-type', 'resource')
                );
            }
        }
    });

    $(document).on('click', '[data-action="module-download"]', function(event) {
        var button = $(this);
        var url = button.data('href');
        var download_type = button.data('download-type');
        var file_name = button.text();
        if (download_type == "module"){
            $.get(url, function(data){
                var url = data;
                downloadFile(url, file_name);
            });
        } else {
            downloadFile(url, file_name)
        }
        function downloadFile(url, file_name) {
            cordova.plugins.fileOpener2.open(
                cordova.file.dataDirectory + file_name,
                'application/pdf',
                {
                    error : function(){
                        $('.ui.dimmer').addClass('active');
                        var fileTransfer = new FileTransfer();
                        fileTransfer.download(
                            url,
                            cordova.file.dataDirectory + file_name,
                            entry => {
                                $('.ui.dimmer').removeClass('active');
                                cordova.plugins.fileOpener2.open(
                                    cordova.file.dataDirectory + file_name,
                                    'application/pdf'
                                );
                            },
                            error => {
                                alert('download error source ' + error.source);
                                alert('download error target ' + error.target);
                                alert('download error code ' + error.code);
                            },
                            true,
                            {}
                        )
                    }
                }
            )
        };
    });

    // Items with data-action="open-in-app-browser" are opened in the app browser
    $(document).on("click", '[data-action="open-in-app-browser"]', function (event) {
        event.preventDefault();
        var url = $(this).attr("href");
        self.openInAppBrowser(url);
    });

    $(document).on("click", '[data-action="open-in-iframe"]', function (event) {
        event.preventDefault();
        var url = $(this).data("src");
        localStorage.currentModule = JSON.stringify({
            id: $(this).data("id"),
            href: $(this).data("src")
        })
        $.mobile.changePage("#module-launch-V2");
    });

    $(document).on("click", '[data-action="open-scorm-module"]', function (event) {
        event.preventDefault();
        var url = $(this).data("src");
        localStorage.currentModule = JSON.stringify({
            id: $(this).data("id"),
            href: $(this).data("src")
        });
        var browser = cordova.InAppBrowser.open(url, '_blank', 'location=no,clearcache=no,clearsessioncache=no,enableViewportScale=yes,allowInlineMediaPlayback=yes,disallowoverscroll=yes,hardwareback=no,footer=yes,toolbar=yes');
        window.screen.orientation.unlock();
        if (device.platform == "Android") {
            var browser = cordova.InAppBrowser.open(url, '_blank', 'location=no,clearcache=no,clearsessioncache=no,enableViewportScale=yes,allowInlineMediaPlayback=yes,disallowoverscroll=yes,hardwareback=no,footer=no,toolbar=no');
        }
        browser.addEventListener('exit', function() {
            window.screen.orientation.lock('portrait');
        });
    });

    // Items with data-action="open-cordova-browser" are opened in the cordova browser
    $(document).on("click", '[data-action="open-cordova-browser"]', function (event) {
        event.preventDefault();
        var connType = self.checkConnection();
        var url = $(this).attr("href");

        // Mobile device.
        if (!connType) {
            navigator.notification.alert(i18next.t("operation-requires-a-network-connection"), function () { }, 
                i18next.t("No Network Connection"));
        } else if (connType == 'wifi') {
            cordova.InAppBrowser.open(url, '_blank', 'location=no,clearcache=no,clearsessioncache=no,enableViewportScale=yes,toolbar=yes,allowInlineMediaPlayback=yes,disallowoverscroll=yes');
        } else {
            navigator.notification.confirm(i18next.t("operation-may-download-a-large-amount"), function (idx) {
                if (idx == 1) {
                    cordova.InAppBrowser.open(url, '_blank', 'location=no,clearcache=no,clearsessioncache=no,enableViewportScale=yes,toolbar=yes,allowInlineMediaPlayback=yes,disallowoverscroll=yes');
                }
            }, i18next.t("Downloading-on-Mobile-Network"), "Continue, Cancel");
        }
    });

    // data-action="library-list" calls will populate the list screen in the library
    $(document).on("click", '[data-action="library-list"]', function (event) {
        event.preventDefault();
        var list = $(this).data("list");
        var slug = $(this).data("slug");
        self.populateLibraryList(list, slug);
    });

    // Noticeboard item sign off
    $(document).on("click", '[data-action="nb-sign-off"]', function (event) {
        var button = $(this)
        var id = button.data("id");
        $.ajax({
            url: self.remoteHost + self.nbSignOffURL + id + '/',
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                button.parent().html(i18next.t('Signed-off-on') + data.datetime);
            },
            error: function (e) {
                self.popupMsg(i18next.t("Error-Please-try-again-later"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            },
            beforeSend: self.setHeaders
        });
    });

    $(document).on("click", ".library-slug-link", function () {
        self.library();
    });

    // Forum events
    $(document).on('click', '.back-to-forums', function(e) {
        e.preventDefault();
        $(".tabs a#forums-index-button").click();
    });
    $(document).on('click', '.back-to-following', function(e) {
        e.preventDefault();
        $(".tabs a#forums-following-button").click();
    });
    $(document).on('click', '.back-to-unread', function(e) {
        e.preventDefault();
        $(".tabs a#forums-unread-button").click();
    });
    $(document).on('click', '.subscribe', function() {
        self.postSubscribeV2($(this).data("id"));
        $(this).text('').removeClass('subscribe').addClass('unsubscribe');
        $(this).append($("<i/>").addClass("thumbtack icon"));
        $(this).append(i18next.t("Unfollow"));
    });
    $(document).on('click', '.unsubscribe', function() {
        self.postUnsubscribeV2($(this).data("id"));
        $(this).text('').removeClass('unsubscribe').addClass('subscribe');
        $(this).append($("<i/>").addClass("thumbtack icon"));
        $(this).append(i18next.t("Follow"));
    });
    $(document).on('click', '.button.like, .like-post', function() {
        self.postLike($(this).data("id"), self.forumPostLikeURL);
    });
    $(document).on('click', '.button.unlike, .unlike-post', function() {
        self.postUnlike($(this).data("id"), self.forumPostUnlikeURL);
    });

    // Setting up all forum collapse buttons
    $(document).on("click", ".flow-collapse", function () {

        var status = $(this).data("flow-collapsed");
        var parentSibling = $(this).parent().next();
        var child = $(this).children();

        // If true then the topics will need to be shown
        if (status === true) {

            parentSibling.css("display", "block");
            parentSibling.removeClass("hide");

            $(this).data("flow-collapsed", false);
            child.removeClass("fa-chevron-down");
            child.addClass("fa-chevron-up");

            // if false then the topics will need to be hidden
        } else if (status === false) {

            parentSibling.css("display", "none");
            parentSibling.addClass("hide");

            $(this).data("flow-collapsed", true);
            child.removeClass("fa-chevron-up");
            child.addClass("fa-chevron-down");
        }
    });

    // Setting up the event handler for the forum links 
    $(document).on("click", ".topic-link-id", function () {

        if ($(this).hasClass("fromDropdown")) {
            $('#popupMenu').popup('close');
        }

        var container = "#forum-content";
        var topicId = $(this).data("id");

        self.getTopic(container, topicId);
    });

    $(document).on("click", ".topic-post-slug-link", function () {
        self.forum();
    });

    $(document).on("click", ".topic-post-subscribe", function () {
        self.postSubscribe($(this).data("id"));
    });

    $(document).on("click", ".topic-post-unsubscribe", function () {
        self.postUnsubscribe($(this).data("id"));
    });

    $(document).on("click", ".topic-post-like", function () {
        self.postLike($(this).data("id"), self.forumPostLikeURL);
    });

    $(document).on("click", ".topic-post-unlike", function (e) {
        self.postUnlike($(this).data("id"), self.forumPostUnlikeURL);
    });

    $(document).on("click", ".topic-poll-question", function () {
        var button = $(this);

        if ($(this).attr("data-change") == "false" && $(this).attr("data-voted") == "true" && parseInt($(this).attr("data-remaining-votes")) == 0) {
            self.popupMsg(i18next.t("This poll does not allow users to change their votes"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            return;
        }

        if (!$(this).hasClass("user_vote")) {
            self.pollVote($(this).data("id"), $(this).data("poll-id"), self.forumPollVoteURL, $(this).data("max-options"), "vote", function (status, data) {
                if (status == "Error") {
                    self.popupMsg(JSON.parse(data.responseText)['message'], self.colours.mobile_warning_colour_a1, "fa-exclamation");
                } else if (status == "Success") {
                    button.parent().parent().find(".topic-poll-question").attr("data-voted", true);
                }
            });
        } else if ($(this).hasClass("user_vote")) {
            self.pollVote($(this).data("id"), $(this).data("poll-id"), self.forumRemovePollVoteURL, $(this).data("max-options"), "removeVote", function (status, data) {
                if (status == "Error") {
                    self.popupMsg(JSON.parse(data.responseText)['message'], self.colours.mobile_warning_colour_a1, "fa-exclamation");
                }
            });
        }
    });

    $(document).on("click", "#topicSubmitV2", function (event) {
        event.preventDefault();
        var form = $("#newTopicFormV2");
        var title = form.find("#subject");
        var content = form.find("#content");

        // sanitizing the title area message from script tags
        var titleStrip = title.val().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gmi, "");
        title.val(titleStrip);

        // sanitizing the content area message from script tags
        var contentStrip = content.val().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gmi, "");
        content.val(contentStrip);

        if (!form.find("#subject").val() || !form.find("#content").val()) {
            self.popupMsg(i18next.t("need-to-fill-in-all-required-fields"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            return;
        }

        $(this).attr("disabled", "disabled");

        var formElem = document.querySelector("#newTopicFormV2");
        var formData = new FormData(formElem);

        self.postForumForm(form.attr("action"), formData, function (status, data) {
            if (status == "Error") {
                self.popupMsg(data["message"]);
            } else {
                self.getIndexFeed('#forums-index')
            }
        });

        self.forum();
    });

    $(document).on("click", "#topicSubmit", function (event) {
        event.preventDefault();
        var form = $("#newTopicForm");
        var title = form.find("#subject");
        var content = form.find("#content");

        // sanitizing the title area message from script tags
        var titleStrip = title.val().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gmi, "");
        title.val(titleStrip);

        // sanitizing the content area message from script tags
        var contentStrip = content.val().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gmi, "");
        content.val(contentStrip);

        if (!form.find("#subject").val() || !form.find("#content").val()) {
            self.popupMsg(i18next.t("need-to-fill-in-all-required-fields"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            return;
        }

        $(this).attr("disabled", "disabled");

        var formElem = document.querySelector("#newTopicForm");
        var formData = new FormData(formElem);

        self.postForumForm(form.attr("action"), formData, function (status, data) {
            if (status == "Error") {
                self.popupMsg(i18next.t("Error") + data.status + "." + i18next.t("Please try again later"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            }
        });

        self.forum();
    });

    $(document).on("click", ".new-topic", function (event) {
        event.preventDefault();
        self.getNewTopicForm($(this));
    });

    $(document).on("click", "#postSubmitV2", function (event) {
        $('.ui.dimmer').addClass('active');
        var button = $(this)
        event.preventDefault();
        var form = $("#newPostFormV2");
        var subject = form.find("#subject");
        var content = form.find("#content");

        // sanitizing the title area message from script tags
        var subjectStrip = subject.val().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gmi, "");
        subject.val(subjectStrip);

        // sanitizing the content area message from script tags
        var contentStrip = content.val().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gmi, "");
        content.val(contentStrip);

        if (!form.find("#subject").val() || !form.find("#content").val()) {
            self.popupMsg(i18next.t('need-to-fill-in-all-required-fields'), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            return;
        }

        button.attr("disabled", "disabled");

        var formElem = document.querySelector("#newPostFormV2");
        var formData = new FormData(formElem);

        self.postForumForm(form.attr("action"), formData, function (status, data) {
            $('.ui.dimmer').removeClass('active');
            button.removeAttr("disabled");
            if (status == "Error") {
                self.popupMsg(i18next.t("Error") + data.status + "." + i18next.t("Please try again later"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            } else {
                var split_url = form.attr("action").split("/")
                self.getTopic(button.data("container-id"), split_url[split_url.length-2])
            }
        });
    });

    $(document).on("click", "#postSubmit", function (event) {
        event.preventDefault();
        var form = $("#newPostForm");
        var title = form.find("#subject");
        var content = form.find("#content");

        // sanitizing the title area message from script tags
        var titleStrip = title.val().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gmi, "");
        title.val(titleStrip);

        // sanitizing the content area message from script tags
        var contentStrip = content.val().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gmi, "");
        content.val(contentStrip);
        
        if (!form.find("#subject").val() || !form.find("#content").val()) {
            self.popupMsg(i18next.t('need-to-fill-in-all-required-fields'), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            return;
        }

        $(this).attr("disabled", "disabled");

        var formElem = document.querySelector("#newPostForm");
        var formData = new FormData(formElem);

        self.postForumForm(form.attr("action"), formData, function (status, data) {
            if (status == "Error") {
                self.popupMsg(i18next.t("Error") + data.status + "." + i18next.t("Please-try-again-later"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            }
        });

        self.forum();
    });

    $(document).on("click", ".new-post", function (event) {
        event.preventDefault();
        self.getNewPostForm($(this));
    });

    $(document).on("click", ".new-post-v2", function (event) {
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        event.preventDefault();
        if ($("form#newPostFormV2").length) {
            $("form#newPostFormV2").remove();
        } else {
            self.getNewPostFormV2($(this));
        }
    });

    document.addEventListener("backbutton", self.onBackKeyDown, false);

    $(document).on('click', '.ext-link-popup', function (e) {
        e.preventDefault();
        var linktarget = this.href;
        var connType = self.checkConnection();
        if (!connType) {
            navigator.notification.alert(i18next.t("operation-requires-a-network-connection"), function () { },
            i18next.t("No Network Connection"));
            return;
        } else if (connType != 'wifi') {
            navigator.notification.confirm(i18next.t('operation-may-download-a-large-amount'), function (idx) {
                if (idx == 1) {
                    self.openInAppBrowser(linktarget);
                }
            }, i18next.t("Downloading-on-Mobile-Network"), "Continue, Cancel");
        } else {
            self.openInAppBrowser(linktarget);
        }
    });

    $(document).on('click', '.ext-download', function (e) {
        e.preventDefault();
        var url = this.href;
        // Android devices will not open PDF files unless we use the system
        // browser which is a less good user experience, but works cross
        // platform.
        window.open(url, "_system", "location=yes,enableViewportScale=yes,hidden=no");
    });

    $(document).on('click', '.pdf-anchor-tag', function (e) {
        e.preventDefault();
        var url = this.href;
        // Android devices will not open PDF files unless we use the system
        // browser which is a less good user experience, but works cross
        // platform.
        window.open(url, "_system", "location=yes,enableViewportScale=yes,hidden=no");
    });

    $(document).on('click', '.ext-link', function (e) {
        e.preventDefault();
        var linktarget = this.href;
        var connType = self.checkConnection();
        // Mobile device.
        if (!connType) {
            navigator.notification.alert(i18next.t('operation-requires-a-network-connection'), function () { },
            i18next.t("No Network Connection"));
        } else if (connType == 'wifi') {
            cordova.InAppBrowser.open(linktarget, '_blank', 'location=no,clearcache=no,clearsessioncache=no,enableViewportScale=yes,toolbar=yes,allowInlineMediaPlayback=yes,disallowoverscroll=yes');
        } else {
            navigator.notification.confirm(i18next.t("operation-may-download-a-large-amount"), function (idx) {
                if (idx == 1) {
                    cordova.InAppBrowser.open(linktarget, '_blank', 'location=no,clearcache=no,clearsessioncache=no,enableViewportScale=yes,toolbar=yes,allowInlineMediaPlayback=yes,disallowoverscroll=yes');
                }
            }, i18next.t("Downloading-on-Mobile-Network"), "Continue,Cancel");
        }
    });

    $(document).on('pushNotification', function (event, message) {
        // Update the current page
        var page = $('body').pagecontainer("getActivePage");
        $('body').pagecontainer("change", "#" + page.id, { transition: "none", allowSamePageTransition: true });
        return true;
    });
    // Show legend modal in V2
    $(document).on('click', '.info-pop-up .icon', function(e) {
        e.stopPropagation();
        $('.ui.fullscreen.modal.legend.' + $(this).data("legend-type")).modal('show');
    });
    // Forums tabs navigation
    $(document).on('click', '.tabs a#forums-index-button', function () {
        self.getIndexFeed('#forums-index');
    });
    $(document).on('click', '.tabs a#forums-following-button', function () {
        self.getSubscriptionFeed('#forums-following');
    });
    $(document).on('click', '.tabs a#forums-unread-button', function () {
        self.getUnreadTopics('#forums-unread');
    });
    $(document).on('click', '.back-to-forum', function() {
        self.getIndexFeed('#forums-index')
    });
    // Forum topic events
    $(document).on('click', '.topic-row', function(e) {
        if ($(this).parents("#forums-index").length > 0) {
            $("#social-forums-page .navbar-v2 .ui-btn-left.ui-link").addClass("back-to-forums");
        }
        self.getTopic('#forums-index', $(this).attr('id'));
    });
    $(document).on('click', '.new-topic', function (event) {
        self.getNewTopicFormV2($(this));
    });

    $(document).on('click', '#item-page-V2 .navbar-v2 .ui-btn-left.ui-link', function(e) {
        e.preventDefault();
        parent.history.back();
    });

    $(document).on("click", ".button.post-comment", function (e) {
        e.preventDefault();
        article_id = $(this).data('article-id');
        $.ajax({
            url: self.remoteHost + self.newsAddCommentURL + article_id + "/",
            type: 'POST',
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',
            data: {
                'comment': $('textarea#comment').val()
            },
            success: function (data) {
                feed = localStorage.newsData;
                obj = self.getObject(article_id, 'news', feed);
                obj = self.getNewsItemPageObj(obj);
                self.itemPageV2(obj);
            },
            error: function (error) {
                self.popupMsg(i18next.t("could-not-post-comment"), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            },
            beforeSend: self.setHeaders
        });
    });

    $(document).on('click', '#new-dashboard .row.stats .comms', function () {
        $.mobile.changePage("#news-noticeboard-page");
    });

    $(document).on('click', '#new-dashboard .row.stats .forums', function () {
        $.mobile.changePage("#social-forums-page");
    });

    $(window).resize(function (event) {
        //Background image size is 640 x 1216
        var w = 640, h = 1216;
        var iw = window.innerWidth, ih = window.innerHeight;
        var pRatio = window.devicePixelRatio || 1, xRatio = iw / w, yRatio = ih / h, sRatio = 1;

        sRatio = Math.max(xRatio, yRatio);

        $("div#background").css("width", w * sRatio + 'px');
        $("div#background").css("height", h * sRatio + 'px');
    }).resize();

    self.debug("Completed setupEvents().");
};

MobileApp.prototype.setHeaders = function (xhr) {
    xhr.setRequestHeader('X_ACCESS_CODE', localStorage.accessCode);
    xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token);
};

MobileApp.prototype.setBranding = function () {
    var self = this;
    self.debug("Starting setBranding()...");
    var brandingLabels = JSON.parse(self.getStorageValue('brandingLabels', '{}'));

    Object.keys(brandingLabels).forEach(function (key) {
        self.debug("  label: " + key);
        brandingLabels[key] = self.ifNullUseDefault(brandingLabels[key], self.labels[key]);
    });

    $.each(brandingLabels, function (key, value) {
        self.labels[key] = value;
    });

    if (_defaultThemeColours == false) {
        var brandingItems = JSON.parse(self.getStorageValue('brandingData', '{}'));

        Object.keys(brandingItems).forEach(function (key) {
            brandingItems[key] = self.ifNullUseDefault(brandingItems[key], self.colours[key]);
        });

        $.each(brandingItems, function (key, value) {
            if (self.colours[key])
                self.colours[key] = value;
            if (key=="mobile_bg_startup_only")
                self.mobile_bg_startup_only = value;
        });
    }
    self.debug("Completed set labels")
    // Sets the dashboard label for all footer panels
    $('a[href="#dashboard"] > p').each(function () {
        $(this).text(i18next.t(brandingLabels.feed_label));
    });

    // Sets the training label for all footer panels
    $('a[href="#training"] > p').each(function () {
        $(this).text(i18next.t(brandingLabels.training_label));
    });

    // Sets the communications label for all footer panels
    $('a[href="#communications"] > p').each(function () {
        $(this).text(i18next.t(brandingLabels.comms_label));
    });

    // Sets the library label for all footer panels
    $('a[href="#library"] > p').each(function () {
        $(this).text(i18next.t(brandingLabels.library_label));
    });

    // Sets the career label for all footer panels
    $('a[href="#career"] > p').each(function () {
        $(this).text(i18next.t(brandingLabels.my_career_label));
    });
    
    $('[data-label="training_label"]').text(i18next.t(self.labels.training_label));

    $('[data-label="feed_label"]').text(i18next.t(self.labels.feed_label));

    $('[data-label="library_label"]').text(i18next.t(self.labels.library_label));

    $('[data-label="noticeboard_label_plural"]').text(i18next.t(self.labels.noticeboard_label_plural));

    // $('#noticeboard-hdr').text(brandingLabels['noticeboard_label_plural']);
    $('#noticeboard-hdr').text(i18next.t(brandingLabels.noticeboard_label_plural));

    var backgroundImg = self.getStorageValue('brandingBgURL', './img/flow-background.png');
    if ($('.background-img').attr('src') != backgroundImg) {
        $('.background-img').attr('src', backgroundImg);
    }
    self.debug("Replace branding css");
    $('.brandingCSS').remove();
    var brandCss = '';
    if (self.mobile_app_client_version == 1) {
        brandCss = self.getBrandingCSS();
    } else {
        brandCss = self.getBrandingCSSV2();
    }
    $("<style/>").addClass("brandingCSS").text(brandCss).appendTo("head");

    self.debug("Css done, set logo and background");
    var logoURL = self.getStorageValue('brandingLogoURL', './img/flow-logo-white-skinny.png');
    $('.nav-flow-logo').attr('src', logoURL);
    $('.nav-company-logo').attr('src', logoURL);
    //$(window).resize();
    self.debug("Completed setBranding().");
    self.showApp();
};

MobileApp.prototype.getBrandingCSS = function () {
    var self = this;
    self.debug("Set colours in ui");
    var mobileBrandColours = JSON.parse(self.getStorageValue('brandingMobileColours', '{}'));
    self.debug("Got mobile branding colours");
    
    // These are the default colours
    var defaultColours = JSON.stringify({ 'base': '#444444', 'secondary': '#ec0187' });

    var colours = JSON.parse(self.getStorageValue('brandingColours', defaultColours));
    self.debug("Got default colours");
    var heading_background = self.ifNullUseDefault(mobileBrandColours.heading_background, colours.base);
    var heading_icon = self.ifNullUseDefault(mobileBrandColours.heading_icon, colours.secondary);
    var panel_icon = self.ifNullUseDefault(mobileBrandColours.heading_icon, colours.secondary);
    var bottom_nav_background = self.ifNullUseDefault(mobileBrandColours.bottom_nav_background, colours.base);
    var bottom_nav_icon = self.ifNullUseDefault(mobileBrandColours.bottom_nav_icon, colours.secondary);
    var feed_item_icon = self.ifNullUseDefault(mobileBrandColours.feed_item_icon, colours.secondary);
    var feed_item_arrow_inner = self.ifNullUseDefault(mobileBrandColours.feed_item_arrow_inner, colours.base);
    var feed_item_arrow_outer = self.ifNullUseDefault(mobileBrandColours.feed_item_arrow_outer, colours.secondary);
    var feed_item_separator = self.ifNullUseDefault(mobileBrandColours.feed_item_separator, colours.base);
    var button = self.ifNullUseDefault(mobileBrandColours.button, colours.base);
    self.debug("got colours to use");

    var cssOutput = ".custom-navbar {background-color:" + heading_background + ";}" +
    /*"#login {background-image: none; background-color: #000000;}" +*/
    "div[data-role=footer] a.active-tab {background-color: " + bottom_nav_icon + "!important; color: " + bottom_nav_background + "!important;}" +
    "div[data-role=footer] a.active-tab .fa {color: " + bottom_nav_background + "!important;}" +
    "div[data-role=footer] a.active-tab .fa-certificate {text-shadow: 0px 1px 0px " + bottom_nav_icon + "!important;}" +
    "div[data-role=footer] a .fa-certificate {text-shadow: 0px 1px 0px " + bottom_nav_background + "!important;}" +
    "div[data-role=footer] a {background-color:" + bottom_nav_background + "!important; color: " + bottom_nav_icon + "!important;}" +
    "div[data-role=footer] .fa {color: " + bottom_nav_icon + "!important;}" +
    ".fa {color: " + heading_icon + "}" +
    "div[data-role='collapsible'] h4 a {background-color: " + heading_background + "!important; color: " + heading_icon + "!important; text-shadow: none!important;}" +
    "#noticeboard-section h2 {background-color: " + heading_background + "!important; color: " + heading_icon + "!important; text-shadow: none!important;}" +
    "li.item a {border-color: " + feed_item_separator + "!important;}" +
    ".ui-btn-icon-right:after {background-color: " + feed_item_arrow_outer + "; color: " + feed_item_arrow_inner + ";}" +
    ".ui-header-fixed {border-color: " + feed_item_separator + "!important;}" +
    ".ui-page-theme-a .ui-btn, .ui-collapsible-themed-content .ui-collapsible-content {border-color: " + feed_item_separator + "!important;}" +
    ".itemimg .fa {color: " + feed_item_icon + "!important;}" +
    ".panelmenu ul li {background-color: " + heading_background + " !important;}" +
    ".panelmenu a {background-color: " + heading_background + " !important; border-color: " + panel_icon + " !important; border-top:0px !important;}" +
    ".panelmenu h3, .panelmenu h2, .panelmenu i {color: " + panel_icon + " !important;}" +
    ".panelmenu {background-color:" + heading_background + " !important;}" +
    "#itempage .content .ui-btn {background-color: " + button + "!important;}" +
    "#notifications {background-color:" + heading_background + ";}" +
    "#notifications li p {color: " + heading_icon + "; border-top: 2px solid " + heading_icon + "; background-color: " + heading_background + ";}";
    return cssOutput;
};

MobileApp.prototype.getBrandingCSSV2 = function () {
    var self = this;
    self.debug("Set v2 css...");

    // Only use values from self.colours (these will have been updated in the setBranding call)
    // TODO Ensure that the brand colour 1 is a hex value before calling convertHex!
    var cssOutput = "body {font-family:'noto_sans_regular', 'HelveticaNeue-Light', 'HelveticaNeue', Helvetica, Arial, sans-serif;} " +
    ".navbar-v2 {background-color:" + self.colours.mobile_brand_colour_1 + ";}" +
    "#background { background-color: #ffffff; } " +
    "#login {background-image: url(" + self.getStorageValue('brandingBgURL', './img/flow-background.png') + ");}" +
    ".flow-card.ui.card .content.flow-card-header { background-color: " + self.convertHex(self.colours.mobile_brand_colour_1, 80) + ";}" +
    ".ui.inverted.circular.segment.overdue { border-color: " + self.colours.mobile_warning_colour_a1 + ";}" +
    ".ui.inverted.circular.segment.continue { border-color: " + self.colours.mobile_alert_colour_b1 + ";}" +
    ".noticeboard-news.modal .content i.circular.icon.to-sign-off { background-color: " + self.colours.mobile_alert_colour_b2 + " !important;}" +
    ".noticeboard-news.modal .content i.circular.icon.signed-off { background-color: " + self.colours.mobile_ok_colour_c2 + " !important;}" +
    ".legend.modal .content i.circular.icon.to-sign-off { background-color: " + self.colours.mobile_alert_colour_b2 + " !important;}" +
    ".legend.modal .content i.circular.icon.signed-off { background-color: " + self.colours.mobile_ok_colour_c2 + " !important;}" +
    ".white-toolbar .overdue.label { color: #ffffff; background-color: " + self.colours.mobile_warning_colour_a1 + " !important;}" +

    ".ui.label.circular.overdue { background-color: " + self.colours.mobile_warning_colour_a1 + ";}" +
    ".ui.label.circular.outstanding { background-color: " + self.colours.mobile_alert_colour_b1 + ";}" +
    ".ui.label.circular.complete { background-color: " + self.colours.mobile_ok_colour_c1 + ";}" +
    ".ui.label.circular.news-badge { color: #ffffff; background-color: " + self.colours.mobile_ok_colour_c1 + ";}" +
    ".ui.label.circular.noticeboard-badge { color: #ffffff; background-color: " + self.colours.mobile_alert_colour_b1 + ";}" +
    ".ui.label.circular.forums-badge { color: #ffffff; background-color: " + self.colours.mobile_ok_colour_c1 + ";}" +
    // icon in training path
    "#training-path-container i.inverted.circular.icon {background-color :" + self.colours.mobile_neutral_colour_d3 + " !important;}" +
    // border of each segment
    "#training-path-container .inside {background-color :" + self.colours.mobile_neutral_colour_d1 + ";}" +
    "#training-path-container .top-right, #training-path-container .bottom-right {background-color :" + self.colours.mobile_neutral_colour_d1 + ";}" +
    // Start and Finish segments
    "#training-path-container .rectangle.start, #training-path-container .rectangle.finish {background-color :" + self.colours.mobile_neutral_colour_d2 + ";}" +
    // overdue
    "#training-path-container .rectangle.top.overdue {background-color :" + self.colours.mobile_warning_colour_a2 + ";}" +
    "#training-path-container .quarter-circle.top-right.overdue .inside {background-color :" + self.colours.mobile_warning_colour_a2 + ";}" +
    "#training-path-container .rectangle.right.overdue {background-color :" + self.colours.mobile_warning_colour_a2 + ";}" +
    "#training-path-container .quarter-circle.bottom-right.overdue .inside {background-color :" + self.colours.mobile_warning_colour_a2 + ";}" +
    "#training-path-container .rectangle.bottom.overdue {background-color :" + self.colours.mobile_warning_colour_a2 + ";}" +
    "#training-path-container .quarter-circle.top-left.overdue {background-color :" + self.colours.mobile_warning_colour_a2 + ";}" +
    "#training-path-container .quarter-circle.bottom-left.overdue {background-color :" + self.colours.mobile_warning_colour_a2 + ";}" +
    // fail
    "#training-path-container .rectangle.top.fail {background-color :" + self.colours.mobile_alert_colour_b2 + ";}" +
    "#training-path-container .quarter-circle.top-right.fail .inside {background-color :" + self.colours.mobile_alert_colour_b2 + ";}" +
    "#training-path-container .rectangle.right.fail {background-color :" + self.colours.mobile_alert_colour_b2 + ";}" +
    "#training-path-container .quarter-circle.bottom-right.fail .inside {background-color :" + self.colours.mobile_alert_colour_b2 + ";}" +
    "#training-path-container .rectangle.bottom.fail {background-color :" + self.colours.mobile_alert_colour_b2 + ";}" +
    "#training-path-container .quarter-circle.top-left.fail {background-color :" + self.colours.mobile_alert_colour_b2 + ";}" +
    "#training-path-container .quarter-circle.bottom-left.fail {background-color :" + self.colours.mobile_alert_colour_b2 + ";}" +
    // in progress / incomplete mobile_neutral_colour_d2
    "#training-path-container .rectangle.top.in-progress {background-color :" + self.colours.mobile_neutral_colour_d2 + ";}" +
    "#training-path-container .quarter-circle.top-right.in-progress .inside {background-color :" + self.colours.mobile_neutral_colour_d2 + ";}" +
    "#training-path-container .rectangle.right.in-progress {background-color :" + self.colours.mobile_neutral_colour_d2 + ";}" +
    "#training-path-container .quarter-circle.bottom-right.in-progress .inside {background-color :" + self.colours.mobile_neutral_colour_d2 + ";}" +
    "#training-path-container .rectangle.bottom.in-progress {background-color :" + self.colours.mobile_neutral_colour_d2 + ";}" +
    "#training-path-container .quarter-circle.top-left.in-progress {background-color :" + self.colours.mobile_neutral_colour_d2 + ";}" +
    "#training-path-container .quarter-circle.bottom-left.in-progress {background-color :" + self.colours.mobile_neutral_colour_d2 + ";}" +
    // passed / complete
    "#training-path-container .rectangle.top.passed {background-color :" + self.colours.mobile_ok_colour_c1 + ";}" +
    "#training-path-container .quarter-circle.top-right.passed .inside {background-color :" + self.colours.mobile_ok_colour_c1 + ";}" +
    "#training-path-container .rectangle.right.passed {background-color :" + self.colours.mobile_ok_colour_c1 + ";}" +
    "#training-path-container .quarter-circle.bottom-right.passed .inside {background-color :" + self.colours.mobile_ok_colour_c1 + ";}" +
    "#training-path-container .rectangle.bottom.passed {background-color :" + self.colours.mobile_ok_colour_c1 + ";}" +
    "#training-path-container .quarter-circle.top-left.passed {background-color :" + self.colours.mobile_ok_colour_c1 + ";}" +
    "#training-path-container .quarter-circle.bottom-left.passed {background-color :" + self.colours.mobile_ok_colour_c1 + ";}" +
    // not started
    "#training-path-container .rectangle.top.undefined {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d2, -60) + ";}" +
    "#training-path-container .rectangle.top.undefined .inside {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d1, -60) + ";}" +
    "#training-path-container .quarter-circle.top-right.undefined .inside {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d2, -60) + ";}" +
    "#training-path-container .quarter-circle.top-right.undefined {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d1, -60) + ";}" +
    "#training-path-container .quarter-circle.top-left.undefined {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d2, -60) + ";}" +
    "#training-path-container .rectangle.right.undefined {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d2, -60) + ";}" +
    "#training-path-container .rectangle.right.undefined .inside {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d1, -60) + ";}" +
    "#training-path-container .quarter-circle.bottom-right.undefined {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d1, -60) + ";}" +
    "#training-path-container .quarter-circle.bottom-right.undefined .inside {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d2, -60) + ";}" +
    "#training-path-container .quarter-circle.bottom-left.undefined {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d2, -60) + ";}" +
    "#training-path-container .rectangle.bottom.undefined {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d2, -60) + ";}" +
    "#training-path-container .rectangle.bottom.undefined .inside {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d1, -60) + ";}" +
    "#training-path-container .undefined i.inverted.circular.icon {background-color :" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d3, -60) + " !important; color :" + self.lightenDarkenColor("#ffffff", -60) + " !important;}" +
    "#training-path-container .undefined {color :" + self.lightenDarkenColor("#ffffff", -60) + ";}" +
    // legend colours
    ".legend.modal .content.unread .circular.label {background-color:" + self.colours.mobile_alert_colour_b1 + ";}" +
    ".legend.modal .column.overdue .circular.label {background-color:" + self.colours.mobile_warning_colour_a2 + ";}" +
    ".legend.modal .column.failed .circular.label {background-color:" + self.colours.mobile_alert_colour_b2 + ";}" +
    ".legend.modal .column.incomplete .circular.label {background-color:" + self.colours.mobile_neutral_colour_d2 + ";}" +
    ".legend.modal .column.complete .circular.label {background-color:" + self.colours.mobile_ok_colour_c1 + ";}" +
    ".legend.modal .column.not-started .circular.label {background-color:" + self.lightenDarkenColor(self.colours.mobile_neutral_colour_d2, -60) + ";}" +
    ".legend.modal i.circular.icon {background-color :" + self.colours.mobile_neutral_colour_d3 + ";}" +
    // forums colours
    ".ui.accordion.forums .forum-row .title, .accordion.forums .forum-row .active.title {background-color:" + self.colours.mobile_neutral_colour_d2 + ";}" +
    ".ui.accordion.forums .forum-row .content {background-color:" + self.colours.mobile_neutral_colour_d1 + ";}" +
    ".ui.accordion.forums .forum-row .content a {color:" + self.colours.mobile_brand_colour_1 + ";}" +

    ".accordion .accordion.topics .topic-row .title, .accordion .accordion.topics .topic-row .active.title {background-color:" + self.colours.mobile_neutral_colour_d3 + ";}" +
    ".accordion .accordion.topics .topic-row .title .image {background-color:" + self.colours.mobile_brand_colour_1 + ";}" +
    ".accordion .accordion.topics .topic-row .content {background-color:" + self.colours.mobile_neutral_colour_d2 + ";}" +
    ".accordion .accordion.following-topics .topic-row .content {background-color:" + self.colours.mobile_neutral_colour_d2 + ";}" +
    ".accordion.following-topics .topic-row .title, .accordion.following-topics .topic-row .active.title {background-color:" + self.colours.mobile_neutral_colour_d3 + ";}" +
    ".accordion.following-topics .topic-row .title .image {background-color:" + self.colours.mobile_brand_colour_1 + ";}" +
    ".accordion.following-topics .topic-row .content {background-color:" + self.colours.mobile_neutral_colour_d2 + ";}" +

    ".accordion.topic-posts .post-row .title, .accordion.topic-posts .post-row .active.title {background-color:" + self.colours.mobile_neutral_colour_d3 + ";}" +
    ".accordion.topic-posts .post-row .content {background-color:" + self.colours.mobile_neutral_colour_d2 + ";}" +
    ".accordion.topic-posts .actions .button {background-color:" + self.colours.mobile_brand_colour_1 + "; border-color:" + self.colours.mobile_brand_colour_1 + ";}" +
    ".accordion.topic-posts .actions .button.unsubscribe, .accordion.topic-posts .actions .button.unlike {background: transparent; border: 1px solid " + self.colours.mobile_brand_colour_1 + ";}" +
    "#newPostFormV2 .button {background-color:" + self.colours.mobile_brand_colour_1 + "; border-color:" + self.colours.mobile_brand_colour_1 + ";}" +
    
    ".branded-border {border: 1px solid " + self.colours.mobile_brand_colour_1 + " !important;}" +
    ".branded-background {background-color: " + self.colours.mobile_brand_colour_1 + " !important; color: #ffffff !important;}" +
    ".branded-foreground {color: " + self.colours.mobile_brand_colour_1 + " !important; border-color: " + self.colours.mobile_brand_colour_1 + " !important;}" +
    ".brand-gradient {background: linear-gradient(to bottom, " + self.colours.mobile_gradient_colour_1 + ", " + self.colours.mobile_gradient_colour_2 + ");}" +

    ".flow-tabs .arrow-tabs > ul.tabs > li a {background-color: " + self.colours.mobile_brand_colour_1 + " !important; color: #ffffff !important;}" +
    ".flow-tabs .arrow-tabs > ul.tabs > li.ui-tabs-active a {background-color: #ffffff !important; color: " + self.colours.mobile_brand_colour_1 + " !important; border-color: " + self.colours.mobile_brand_colour_1 + " !important;}" +
    ".flow-tabs .tabs > li a .icon {background-color: " + self.colours.mobile_brand_colour_2 + " !important; border-color: " + self.colours.mobile_brand_colour_2 + " !important;}" +
    ".flow-tabs .tabs > li.ui-tabs-active a .icon {background-color: #ffffff !important; border-color: " + self.colours.mobile_brand_colour_1 + " !important;}" +

    ".ui.button {background-color: " + self.colours.mobile_brand_colour_1 + "; border-color: " + self.colours.mobile_brand_colour_1 + ";}" +
    ".ui.button.inverted {background-color: #ffffff; color: " + self.colours.mobile_brand_colour_1 + ";}" +

    "svg g.brand-fill, svg path.brand-fill {fill: " + self.colours.mobile_brand_colour_1 + ";}" +
    "svg g.brand-stroke, svg path.brand-stroke {stroke:" + self.colours.mobile_brand_colour_1 + ";}" +
    "svg g.brand-category-stroke, svg path.brand-category-stroke {stroke:" + self.colours.mobile_neutral_colour_d2 + ";}" +

    ".column.unread svg g.brand-category-stroke,.column.unread svg path.brand-category-stroke {stroke:" + self.colours.mobile_alert_colour_b2 + ";}" +
    ".column.unread .circular.label {background-color: " + self.colours.mobile_alert_colour_b1 + "; color: #ffffff;}" +

    ".ui-tabs-active path.white-fill, .ui-tabs-active g.white-fill {fill: "+ self.colours.mobile_brand_colour_1 + ";}" +
    ".ui-tabs-active path.white-stroke, .ui-tabs-active g.white-stroke {stroke:" + self.colours.mobile_brand_colour_1 + ";}" +
    ".noticeboard-news i.inverted.circular.icon.unread {background-color: " + self.colours.mobile_alert_colour_b1 + " !important;}" +
    ".noticeboard-news i.inverted.circular.icon.read {background-color: " + self.colours.mobile_neutral_colour_d2 + " !important;}" +
    ".panelMenu ul li a {color: " + self.colours.mobile_brand_colour_1 + " !important;}"+

    "#social-forums-page .topic-poll-question {background-color: " + self.colours.mobile_brand_colour_1 + " !important; color: #ffffff !important;}" +
    "#social-forums-page .topic-poll-question.user_vote {background-color: " + self.lightenDarkenColor(self.colours.mobile_brand_colour_1, -60) + " !important; color: #ffffff !important;}" +

    "#social-forums-page .topic-poll-question .icon {background-color: " + self.colours.mobile_brand_colour_2 + " !important; border-color: " + self.colours.mobile_brand_colour_2 + " !important;}" +
    "#social-forums-page .topic-poll-question.user_vote .icon {background-color: " +  self.lightenDarkenColor(self.colours.mobile_brand_colour_2, -60) + " !important; border-color: " + self.colours.mobile_brand_colour_2 + " !important;}" +
    // training calendar
    "#calendar-events .list, #mobile-app-calendar .fc-button {background-color: " + self.colours.mobile_brand_colour_1 + ";}";

    return cssOutput;
};

MobileApp.prototype.getBranding = function () {
    var self = this;
    self.debug("Staring getBranding()...");
    $.ajax({
        url: self.remoteHost + self.brandingURL,
        error: function (jqXHR, textStatus, errorThrown ) { 
            self.debug("Returned: " + textStatus);
            self.debug(jqXHR.responseText);
            self.debug("Failed getBranding().");
        },
        success: function (data) {
            self.debug("Fetched branding");
            localStorage.brandingData = JSON.stringify(data.branding);
            localStorage.brandingColours = data.branding.palette;
            localStorage.brandingMobileColours = data.branding.mobile_palette;

            if (data.branding.labels["noticeboard_label"] == "") {
                data.branding.labels["noticeboard_label"] = "Noticeboard";
            }

            localStorage.brandingLabels = JSON.stringify(data.branding.labels);
            if (data.branding.mobile_logo_url) {
                localStorage.brandingLogoURL = data.branding.mobile_logo_url + '?' + new Date().getTime();
            } else {
                localStorage.brandingLogoURL = data.branding.mobile_logo_url
            }
            if (data.branding.mobile_bg_url) {
                localStorage.brandingBgURL = data.branding.mobile_bg_url + '?' + new Date().getTime();
            } else {
                localStorage.brandingBgURL = data.branding.mobile_bg_url
            }
            self.mobile_bg_startup_only = data.branding.mobile_bg_startup_only;
            self.debug("Completed getBranding().");
        },
        complete: function(jqXHR, textStatus) {
            self.setBranding();
        },
        type: 'GET',
        beforeSend: self.setHeaders
    });
    return false;
};

MobileApp.prototype.disableFeatures = function() {
    var self = this;
    var settings = self.getStorageValue("companySettings", false);
    if (settings) {
        var settingsData = JSON.parse(settings);
        if (!settingsData.mobile_app_enabled) {
            return;
        }
        if (settingsData.mobile_app_client_version == 2) {
            if (!settingsData.forums_enabled) {
                $("#new-dashboard .forums").remove();
                $(".panelMenu a:contains('Social Forums')").parent().remove();
            }
            if (!settingsData.training_calendar_enabled) {
                $('#my-training ul.tabs').remove();
                $(".panelMenu a:contains('Training Calendar')").parent().remove();
            }
            if (!settingsData.news_enabled && ! settingsData.branch_resources_enabled) {
                $("#new-dashboard .comms").remove();
                $(".panelMenu a:contains('Comms')").parent().remove();
            } else {
                if (!settingsData.news_enabled) {
                    $("#new-dashboard .news-badge").remove();
                    $('#news-noticeboard-page ul.tabs').remove();
                    $('#news-cards-container').remove();
                    $('#library-page ul.tabs').remove();
                    $('#saved-news-container').remove();
                }
                if (!settingsData.branch_resources_enabled) {
                    $("#new-dashboard .noticeboard-badge").remove();
                    $('#news-noticeboard-page ul.tabs').remove();
                    $('#noticeboard-categories-container').remove();
                }
            }
        }
    }
};

MobileApp.prototype.getSettings = function () {
    var self = this;
    // Use locally stored values if available
    var companySettings = self.getStorageValue("companySettings", false);
    if (companySettings) {
        var settings = JSON.parse(companySettings);
        self.mobile_app_client_version = settings.mobile_app_client_version;
        self.disableFeatures();
    }
    $.ajax({
        url: self.remoteHost + self.settingsURL,
        //url:'json/companySettings.json',
        error: function (error) {
            $.mobile.changePage("#dashboard");
        },
        success: function (data) {
            var settingsData = data.settings;
            var newData = JSON.stringify(settingsData);
            // Update locally stored values if needed
            if (newData != localStorage.companySettings) {
                localStorage.companySettings = newData;
                //self.setBranding();
                if (!settingsData.mobile_app_enabled) {
                    $.mobile.changePage("#login");
                    navigator.notification.alert(i18next.t("company-currently-doesnot-allow"));
                }
                self.mobile_app_client_version = settingsData.mobile_app_client_version;
                self.disableFeatures();
            }
            self.getBranding();
        },
        type: 'GET',
        beforeSend: self.setHeaders
    });
    return false;
};

MobileApp.prototype.companySettings = function (setting) {
    var self = this;
    var companySettings = self.getStorageValue("companySettings", false);
    if (!companySettings) {
        return false;
    }
    var settings = JSON.parse(companySettings);
    var value = settings[setting];
    if (typeof (value) == 'undefined' || value == false) {
        return false;
    } else {
        return value;
    }
};

MobileApp.prototype.onBackKeyDown = function (e) {

    var currentPage = $.mobile.activePage.attr('id');

    function exitHandler(idx) {
        if (idx == 1) {
            navigator.app.exitApp();
        } else {
            return false;
        }
    }

    if (currentPage != 'itempage') {
        e.preventDefault();
        navigator.notification.confirm(
            i18next.t("Are-you-sure-you-want-to-exit"),
            exitHandler,
            i18next.t("Exit-Application"),
            ["Exit", "Cancel"]
        );
    } else {
        // Go back to the previous page
        parent.history.back();
        return false;
    }
};

MobileApp.prototype.forceLogout = function () {
    this.clearTraineeData()
    $.mobile.changePage('#login');
    location.reload();
};

MobileApp.prototype.logout = function () {
    var self = this;
    var are_you_sure = i18next.t('Are-you-sure-you-want-to-log-out');
    var logout = i18next.t('Log-out');
    var cancel = i18next.t('Cancel');
    navigator.notification.confirm(
        are_you_sure,
        function (idx) {
            if (idx == 1) {
                self.clearTraineeData();
                $.mobile.changePage('#login');
                _defaultHome = '#login';
                location.reload();
            } else {
                return false;
            }
        },
        logout,
        [logout, cancel]
    );
};

MobileApp.prototype.clearTraineeData = function () {
    localStorage.removeItem('accessCode');
    localStorage.removeItem('token');
    // localStorage.removeItem('remoteHost');
    localStorage.removeItem('feedData');
    localStorage.removeItem('commsData');
    localStorage.removeItem('libraryData');
    localStorage.removeItem('newsData');
    localStorage.removeItem('noticeboardData');
    localStorage.removeItem('trainingData');
    localStorage.removeItem('careerData');
    localStorage.removeItem('brandingLabels');
    // localStorage.removeItem('companySettings');
    localStorage.removeItem('notifications');
    localStorage.removeItem('commsRadioChoice');
    localStorage.removeItem('forumData');
    localStorage.removeItem('subscriptionData');
    localStorage.removeItem('unreadTopicData');
    localStorage.removeItem('currentRecent');
    localStorage.removeItem('currentOutstanding');
    localStorage.removeItem('dashboardData');
    localStorage.removeItem('currentOverdue');
    localStorage.removeItem('topics');
    localStorage.removeItem('trainingPath');
    localStorage.removeItem('traineeDetails');

    // localStorage.clear();

    // clear the lists!
    $('#notifications ul').empty();
    $('ul[id$="-list"]').empty();
    $('#noticeboard-section-categories').empty();

    return;
};

MobileApp.prototype.customJQMObjects = function () {

    // initialises JQM on custom navbars/panels/popups
    $("div[data-role='panel']").panel().enhanceWithin();
    $(".custom-navbar").navbar().enhanceWithin();

    $('.panelmenu li a').on('click', function () {
        $('.panelmenu').panel('close');
    });
};

MobileApp.prototype.swipeInit = function () {
    $(window).on("swipeleft", function (event) {
        var page = $('body').pagecontainer("getActivePage");
        var next = page.data("next");
        if (next) {
            $.mobile.changePage("#" + next, { transition: "slide" });
            return true;
        }
    });
    $(window).on("swiperight", function (event) {
        var page = $('body').pagecontainer("getActivePage");
        var prev = page.data("prev");
        if (prev) {
            $.mobile.changePage("#" + prev, { transition: "slide", reverse: true });
            return true;
        }
    });
};

MobileApp.prototype.checkConnection = function () {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'cell';
    states[Connection.ETHERNET] = 'wifi';
    states[Connection.WIFI] = 'wifi';
    states[Connection.CELL_2G] = 'cell';
    states[Connection.CELL_3G] = 'cell';
    states[Connection.CELL_4G] = 'cell';
    states[Connection.CELL] = 'cell';
    states[Connection.NONE] = false;

    return states[networkState];
};

MobileApp.prototype.openInAppBrowser = function (url) {
    // var errorHandler = function(fileName, e) {
    //   var msg = ''
    //   switch (e.code) {
    //     case FileError.QUOTA_EXCEEDED_ERR:
    //       msg = 'Storage quota exceeded'
    //       break
    //     case FileError.NOT_FOUND_ERR:
    //       msg = 'File not found'
    //       break
    //     case FileError.SECURITY_ERR:
    //       msg = 'Security error'
    //       break
    //     case FileError.INVALID_MODIFICATION_ERR:
    //       msg = 'Invalid modification'
    //       break
    //     case FileError.INVALID_STATE_ERR:
    //       msg = 'Invalid state'
    //       break
    //     default:
    //       msg = 'Unknown error'
    //       break
    //   }
    //   alert('Error (' + fileName + '): ' + msg)
    // }
    var self = this;
    self.portrait_module_launch = (window.innerHeight > window.innerWidth);
    var browserSubs = [];
    var browser = cordova.InAppBrowser.open(url, '_blank', 'location=no,clearcache=no,clearsessioncache=no,enableViewportScale=yes,toolbar=no,allowInlineMediaPlayback=yes,disallowoverscroll=yes,hardwareback=no');
    subBrowser(browser);
    
    function messageCallback(event) {
        if (event.data.open_url) {
            var url = event.data.open_url;
            var file_name = event.data.file_name;
            cordova.plugins.fileOpener2.open(
                cordova.file.dataDirectory + file_name,
                'application/pdf',
                {
                    error : function(){
                        browser.executeScript({
                            code: "jQuery('.ui.dimmer').addClass('active');"
                        })
                        var fileTransfer = new FileTransfer()
                        fileTransfer.download(
                            url,
                            cordova.file.dataDirectory + file_name,
                            entry => {
                                browser.executeScript({
                                    code: "jQuery('.ui.dimmer').removeClass('active');"
                                })
                                cordova.plugins.fileOpener2.open(
                                    cordova.file.dataDirectory + file_name,
                                    'application/pdf'
                                );
                            },
                            error => {
                                alert('download error source ' + error.source);
                                alert('download error target ' + error.target);
                                alert('download error code ' + error.code);
                            },
                            true,
                            {}
                        );
                    }
                }
            );
        } else if (event.data.download_certificate) {
            var url = self.remoteHost + event.data.download_certificate;
            var browser2 = cordova.InAppBrowser.open(url, '_system');
            subBrowser(browser2);
            // data = event.data.download_certificate
            // alert(data);
            // var fileName = 'certificate.pdf';
            // window.resolveLocalFileSystemURL(
            //     cordova.file.dataDirectory,
            //     function(directoryEntry) {
            //         directoryEntry.getFile(
            //             fileName, { create: true },
            //             function(fileEntry) {
            //                 fileEntry.createWriter(function(fileWriter) {
            //                     fileWriter.onwriteend = function(e) {
            //                         // for real-world usage, you might consider passing a success callback
            //                         alert('Write of file "' + fileName + '" completed.')
            //                         cordova.plugins.fileOpener2.open(
            //                             cordova.file.dataDirectory + fileName,
            //                             'application/pdf'
            //                         );
            //                     }

            //                     fileWriter.onerror = function(e) {
            //                         // you could hook this up with our global error handler, or pass in an error callback
            //                         alert('Write failed: ' + e.toString())
            //                     }

            //                     var blob = new Blob([data], { type: 'application/pdf' })
            //                     fileWriter.write(blob)
            //                 }, errorHandler.bind(null, fileName))
            //             },
            //             errorHandler.bind(null, fileName)
            //         )
            //     },
            //     errorHandler.bind(null, fileName)
            // )
        } else if (event.data.action == 'close_module') {
            browser.close();
        }
    }

    function subBrowser(iab) {
        $.each(browserSubs, function(index, b) {
            b.removeEventListener('message', messageCallback, false);
        });
        browser = iab;
        iab.addEventListener('message', messageCallback);
        browserSubs = [iab];
    }
};

 MobileApp.prototype.launchModule = function (url) {
    var self = this;
    StatusBar.hide();
    window.screen.orientation.lock('landscape');
    if (!self.moduelDownloadlHandlerAttached) {
        window.addEventListener('message', function(e) {
            self.moduelDownloadlHandlerAttached = true;
            try {
                JSON.parse(e.data);
            } catch (e) {
                return false;
            }
            if (JSON.parse(e.data).action == 'close_module') {
                StatusBar.show();
                parent.history.back();
                window.screen.orientation.lock('portrait');
            }
            if (JSON.parse(e.data).open_url) {
                var file_name =JSON.parse(e.data).file_name; 
                $.get(JSON.parse(e.data).open_url, function(data){
                    var url = data;
                    cordova.plugins.fileOpener2.open(
                        cordova.file.dataDirectory + file_name,
                        'application/pdf',
                        {
                            error : function(){
                                $('.ui.dimmer').addClass('active');
                                var fileTransfer = new FileTransfer();
                                fileTransfer.download(
                                    url,
                                    cordova.file.dataDirectory + file_name,
                                    entry => {
                                        $('.ui.dimmer').removeClass('active');
                                        cordova.plugins.fileOpener2.open(
                                            cordova.file.dataDirectory + file_name,
                                            'application/pdf'
                                        );
                                    },
                                    error => {
                                        alert('download-error-source ' + error.source)
                                        alert('download-error-target ' + error.target)
                                        alert('download-error-code ' + error.code)
                                    },
                                    true,
                                    {}
                                )
                            }
                        }
                    );
                });
            }
        })
    }
    var modulePage = $('#module-launch-V2');
    modulePage.empty();
    modulePage.append(
        $('<iframe/>').css({"width": "100vw", "height": "100vh", "border": "none", "position": "fixed"}).attr('src', url)
    )
};

MobileApp.prototype.getStorageValue = function (key, defaultVal) {
    var storageItem = localStorage.getItem(key);
    if ((!storageItem) || (storageItem == null) || (typeof (storageItem) == 'undefined') || (storageItem == 'null') || (storageItem == 'undefined')) {
        return defaultVal;
    }
    return storageItem;
};

MobileApp.prototype.ifNullUseDefault = function (value, defaultVal) {

    if ((value === null) || (typeof (value) === 'undefined') || (value === 'null') || (value === '')) {
        return defaultVal;
    } else {
        return value;
    }
};

/* End of App Initialisation */

/* Start of Login Screen */
MobileApp.prototype.login = function () {
    var self = this;

    // check for access code
    if (localStorage.accessCode) {
        localStorage.removeItem('accessCode');
    }

    // perform login
    $("#submit").attr("disabled", "disabled");
    $(".error").remove();

    $.ajax({
        url: self.remoteHost + self.loginURL,
        data: $('#loginForm').serialize(),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseJSON != undefined) {
                var errors = jqXHR.responseJSON.errors;
                if (typeof (errors[0]) == 'object') {
                    for (var e in errors) {
                        var errorDict = errors[e];
                        for (var k in errorDict) {
                            if (k == 'email') {
                                $('#email-input').parent().after("<p class='error'>" + errorDict[k]) + "</p>";
                            } else if (k == 'password') {
                                $('#password-input').parent().after("<p class='error'>" + errorDict[k]) + "</p>";
                            } else {
                                $('#loginForm').append("<p class='error'>" + errorDict[k]) + "</p>";
                            }
                        }
                    }
                } else {
                    $('#loginForm').append("<p class='error'>" + errors) + "</p>";
                }
            } else {
                var message = i18next.t('there-was-an-error');
                $('#loginForm').append("<p class='error'>" + message + "</p>");
            }

            $('#submit').removeAttr("disabled");
            $.mobile.changePage("#login");
        },
        success: function (data) {

            localStorage.accessCode = data.access_code;
            if ((typeof (data.token) != 'undefined')) {
                localStorage.token = data.token;
            }

            self.getSettings();
            //self.getBranding();
            $(document).trigger("postLogin", [data.access_code]);
            self.getTraineeDetails();
            self.getTrainingPath();
            $('#submit').removeAttr("disabled");
        },
        type: 'POST'
    });
    return false;
};
/* End of Login Screen */


// Legacy Dashboard Code

/** @function setDonutChart
 * @param {Number} overdue
 * @param {Number} outstanding
 * @param {Number} complete
 * @description Populates the training page with a donut chart 
**/
MobileApp.prototype.setDonutChart = function(overdue, outstanding, complete) {
    var self = this;
    var total = overdue + outstanding + complete

    var ctx = $('#myTrainingChart')[0].getContext('2d');    
    Chart.pluginService.register({
        beforeDraw: function(chart) {
            var width = chart.chart.width
            var height = chart.chart.height
            var ctx = chart.chart.ctx
            ctx.clearRect(0, 0, width, height);
            ctx.restore();
            ctx.textBaseline = "middle";

            var fontSize = (height / 40).toFixed(2);
            ctx.font = fontSize + "em Noto Sans ExtraCondensed SemiBold";
            if (total == 0) {
                var number = "0%";
            } else {
                var number = ((100 * complete) / total).toFixed(0) + "%";
            }
            var numberX = Math.round((width - ctx.measureText(number).width) / 2);
            var numberY = (height / 2) - height/20;
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillText(number, numberX, numberY);


            var fontSize = (height / 110).toFixed(2);
            ctx.font = fontSize + "em noto_sans_regular";
            ctx.textBaseline = "middle";
            var label = i18next.t("complete");
            var labelX = Math.round((width - ctx.measureText(label).width) / 2);
            var labelY = (height / 2) + height/8;
            ctx.fillText(label, labelX, labelY);
            ctx.save();
        }
    });
    var myTrainingChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [overdue, outstanding, complete],
                backgroundColor: [
                    self.colours.mobile_warning_colour_a1,
                    self.colours.mobile_alert_colour_b1,
                    self.colours.mobile_ok_colour_c1,
                ]
            }]
        },
        options: {
            legend: {
                display: false
            },
            cutoutPercentage: 70
        }
    });
};

MobileApp.prototype.dashboardV2 = function () {
    var self = this;
    // GET the data
    dashboardData = JSON.parse(localStorage.dashboardData);
    companySettings = JSON.parse(localStorage.companySettings);
    // Set module chart data
    var overdue = dashboardData.chart_data.overdue;
    var outstanding = dashboardData.chart_data.outstanding;
    var complete = dashboardData.chart_data.complete;
    self.setDonutChart(overdue, outstanding, complete);

    // Set next module name
    if (dashboardData.next_module.name != null) {
        var module_name = dashboardData.next_module.name;
        $("#new-dashboard .segment.continue .sub.header").text(i18next.t('Continue-$1', { $1: module_name}));
        $("#new-dashboard .segment.continue").attr("data-id", dashboardData.next_module.id).attr("data-item-type", "module");
        $("#new-dashboard .segment.continue").addClass("training_path_item");
    } else {
        var total_modules = dashboardData.chart_data.complete + dashboardData.chart_data.outstanding + dashboardData.chart_data.overdue
        $("#new-dashboard .segment.continue").addClass("all-complete");
        if (dashboardData.chart_data.complete == total_modules && total_modules != 0) {
            $("#new-dashboard .segment.continue .sub.header").text(i18next.t('You-have-completed-all-modules'));
        } else {
            $("#new-dashboard .segment.continue .sub.header").text(i18next.t('You-have-no-modules-assigned-to-you'));
        }
    }
    // Indicationif there is overdue training
    if (dashboardData.chart_data.overdue > 0) {
        $("#new-dashboard .segment.overdue .sub.header").text(i18next.t('You-have-Overdue-Modules'));
    } else {
        $("#new-dashboard .segment.overdue .sub.header").text(i18next.t('You-have-no-Overdue-Modules'));
    }

    // Build next appraisal info
    if (companySettings.appraisals_enabled) {
        if (!dashboardData.next_appraisal.id) {
            var labels = i18next.t(self.labels.appraisal_label_plural);
            $("#new-dashboard .next-appraisal h4").text(i18next.t('You-have-no-upcoming-$1', { $1: labels }));
            $("#new-dashboard .next-appraisal h5").text('');
            $("#new-dashboard .next-appraisal p").text('');
        } else {
            $("#new-dashboard .next-appraisal").attr("data-id", dashboardData.next_appraisal.id).attr("data-item-type", "appraisal").addClass('training_path_item');
                var message = i18next.t(dashboardData.next_appraisal.name);
            $("#new-dashboard .next-appraisal h4").text(message); // End of year appraisal
            if (dashboardData.next_appraisal.appraiser != "") {
                $("#new-dashboard .next-appraisal h5").text(i18next.t('with-$1', { $1: dashboardData.next_appraisal.appraiser} ));
            }
            var myLabel = self.labels.appraisal_label;
            $("#new-dashboard .next-appraisal p").text(i18next.t('Your-next-$1', { $1:  myLabel }));
            if (dashboardData.next_appraisal.date) {
                $("#new-dashboard .next-appraisal p").append(' ' + i18next.t('is-on') + ' ' + moment(dashboardData.next_appraisal.date).format("DD MMM YYYY"));
            }
        }
    }
    // Build next training session info
    if (companySettings.training_calendar_enabled) {
        if (!dashboardData.next_training_session.id) {
            $("#new-dashboard .next-training-session h4").text(i18next.t("You-have-no-upcoming-training-sessions"));
            $("#new-dashboard .next-training-session h5").text('');
            $("#new-dashboard .next-training-session p").text('');
        } else {
            $("#new-dashboard .next-training-session").attr("data-id", dashboardData.next_training_session.id).attr("data-item-type", "training session");
            $("#new-dashboard .next-training-session h4").text(i18next.t(ashboardData.next_training_session.name));
            $("#new-dashboard .next-training-session h5").text(i18next.t("at-$1", {$1: dashboardData.next_training_session.location}));
            $("#new-dashboard .next-training-session p").text(i18next.t("Your-next-training-session"));
            if (dashboardData.next_appraisal.date) {
                $("#new-dashboard .next-training-session p").append(i18next.t("is-on") + " " + moment(dashboardData.next_training_session.date).format("DD MMM YYYY") + " " + i18next.t("at") + " " + moment(dashboardData.next_training_session.date).format("HH:mm"));
            }
        }
    }
    // Decide what to show in second row of dashboard
    if (companySettings.appraisals_enabled && companySettings.training_calendar_enabled) {
        if (moment(dashboardData.next_training_session.date).isBefore(dashboardData.next_appraisal.date)) {
            $("#new-dashboard .next-appraisal").hide();
            $("#new-dashboard .next-training-session").show();
        } else {
            $("#new-dashboard .next-appraisal").show();
            $("#new-dashboard .next-training-session").hide();
        }
    } else if (companySettings.appraisals_enabled && !companySettings.training_calendar_enabled) {
        $("#new-dashboard .next-appraisal").show();
        $("#new-dashboard .next-training-session").hide();
    } else if (!companySettings.appraisals_enabled && companySettings.training_calendar_enabled) {
        $("#new-dashboard .next-appraisal").hide();
        $("#new-dashboard .next-training-session").show();
    } else {
        $("#new-dashboard .next-appraisal").show();
        $("#new-dashboard .next-training-session").hide();
        var myLabel = i18next.t(self.labels.appraisal_label_plural);
        $("#new-dashboard .next-appraisal h4").text(i18next.t("You-have-no-upcoming-$1", {$1:myLabel}));
    }

    if (!dashboardData.next_appraisal.id && !dashboardData.next_training_session.id) {
        // FIXME: No calendar or appraisals enabled, show the next training item
        $("#new-dashboard .next-appraisal h4").text(i18next.t('You-have-no-upcoming-training-sessions'));
    }
    // Temp - show message if neither appraisals or training calendar enabled
    if (companySettings.external_training_enabled && !companySettings.appraisals_enabled && !companySettings.training_calendar_enabled) {
        var my_label = self.labels.external_training_label_plural;
        $("#new-dashboard .next-appraisal h4").text(i18next.t("Details-of-your-$1-coming-soon", {$1: my_label}));
        $(document).off("click", "#new-dashboard .next-appraisal h4");
        $(document).on("click", "#new-dashboard .next-appraisal h4", function() {$.mobile.changePage("#my-training")});
    }
    
    // Populate forums stats column
    if (companySettings.forums_enabled) {
        $("#new-dashboard .stats .forums .label").text(dashboardData.unread_topics_count);
        $("#new-dashboard .stats .forums .label").show();
        $("#new-dashboard .stats .forums .forums-message").css("margin-top", "1rem");
        if (dashboardData.unread_topics_count == 0) {
            var message = i18next.t("You-have-no-unread-discussions");
            $("#new-dashboard .stats .forums .label").hide();
            $("#new-dashboard .stats .forums .forums-message").css("margin-top", "-1rem");
        } else if (dashboardData.unread_topics_count == 1) {
            var message = i18next.t("You-have-one-unread-discussion")
        } else {
            var message = i18next.t('You-have-$1-unread-discussions', { $1: dashboardData.unread_topics_count } )  
        }
        $("#new-dashboard .stats .forums .forums-message").text(message);
    }
    // Populate coms column
    var newsMsg = "";
    var noticeboardMsg = "";
    var commsSelector = $("#new-dashboard .stats .comms");
    /* News */
    if (companySettings.news_enabled) {
        var newsCount = dashboardData.available_news_articles;
        commsSelector.find(".news-badge").text(newsCount);
        commsSelector.find(".news-badge").show();
        if (newsCount == 0) {
            newsMsg = i18next.t("no-news-items-available");
            commsSelector.find(".news-badge").hide();
        } else {
            newsMsg = i18next.t("$1-news-items-available", { $1: newsCount });
        }
    } 
    if (companySettings.branch_resources_enabled) {
        var noticeCount = dashboardData.unread_noticeboard_items;
        commsSelector.find(".noticeboard-badge").text(noticeCount);
        commsSelector.find(".noticeboard-badge").show();
        if (noticeCount == 0) {
            var my_label = i18next.t(self.labels.noticeboard_label_plural).toLowerCase();
            noticeboardMsg = i18next.t("no-unread-$1", { $1: my_label});
            commsSelector.find(".noticeboard-badge").hide();
        } else {
            var my_label = i18next.t(self.labels.noticeboard_label_plural).toLowerCase();
            noticeboardMsg = i18next.t("$1-unread-$2", { $1: noticeCount, $2: my_label});
        }
    }
    var combined = "";
    if (companySettings.news_enabled && companySettings.branch_resources_enabled) {
        combined = i18next.t("and");
    }
    if (companySettings.news_enabled || companySettings.branch_resources_enabled) {
        // all values will arrive translated
        var msg = (i18next.t("You-have") + ' ' + noticeboardMsg + ' ' + combined + ' ' + newsMsg);
        commsSelector.find(".comms-message").text(msg);
        commsSelector.find(".comms-message").css("margin-top", "1rem");
    }
    if (newsCount == 0 && noticeCount == 0) {
        commsSelector.find(".comms-message").css("margin-top", "-1rem");
    }
};

// START NOTICEBOARD
MobileApp.prototype.getNoticeboardData = function () {
    var self = this;
    $.ajax({
        url: self.remoteHost + self.noticeboardURL,
        error: function (error) {
            console.log(error);
        },
        success: function (noticeboard) {
            if (noticeboard) {
                localStorage.setItem('noticeboardData', JSON.stringify(noticeboard));
            } else {
                localStorage.getItem('noticeboardData');
                console.log('Failed!');
            }
        },
        type: 'GET',
        beforeSend: self.setHeaders
    });
    return false;
};

MobileApp.prototype.getNoticeboardCountByStatus = function () {
    var messagesRead = 0;
    var messagesUnread = 0;

    // var noticeboardData = localStorage.getItem('noticeboardData');
    // // console.log(myData);
    // var noticeboardData = JSON.parse(noticeboardData);

    let noticeboardData;

    if (localStorage.getItem('noticeboardData')) {
        noticeboardData = JSON.parse(localStorage.getItem('noticeboardData'));
    } else {
        noticeboardData = []
    }

    $.each(noticeboardData, function (index, value) {
        if (value.status == 'read') {
            messagesRead++;
        } else {
            messagesUnread++;
        }
        // console.log(index, value);
    });
    var res = [messagesRead, messagesUnread];
    return res;
};
//  END NOTICEBOARD

// NEWS START
MobileApp.prototype.getNewsData = function () {
    var self = this;
    $.ajax({
        url: self.remoteHost + self.newsURL,
        error: function (error) {
            console.log(error);
        },
        success: function (feeds) {
            if (feeds) {
                localStorage.setItem('feedData', JSON.stringify(feeds));
                // localStorage.dashboardFeedData = JSON.stringify(feeds);
            } else {
                console.log('Failed!');
                JSON.parse(localStorage.getItem('feedData'));
            }
        },
        type: 'GET',
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.getNewsCount = function () {
    // var newsFeedData = localStorage.getItem('feedData');
    // var newsFeedData = JSON.parse(newsFeedData);
    var newsFeedData;

    if (localStorage.getItem('newsData')) {
        newsFeedData = JSON.parse(localStorage.getItem('newsData'));
    } else {
        newsFeedData = []
    }

    return newsFeedData.length;
};
// NEWS END

MobileApp.prototype.getDashboardDataV2 = function () {
    var self = this;
    if (localStorage.dashboardData) {
        try {
            self.dashboardV2();
        } catch (e) {
            // Incorrect dashboardData format?
        }
    }
    $.ajax({
        url: self.remoteHost + self.dashboardURL,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.length == 0) {
                self.popupMsg(i18next.t('error-dashboard-data'), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            } else {
                var newData = JSON.stringify(data);
                if (newData != localStorage.dashboardData) {
                    self.debug("Dashboard data has changed - updating local");
                    localStorage.dashboardData = newData;
                    self.dashboardV2();
                } else {
                    self.debug("Dashboard data unchanged from local");
                }
            }
        },
        error: function (e) {
            self.debug(e);
            if (localStorage.dashboardData) {
                self.dashboardV2();
            } else {
                self.popupMsg(i18next.t('error-dashboard-data'), self.colours.mobile_warning_colour_a1, "fa-exclamation");
            }
        },
        beforeSend: self.setHeaders
    });
};

/* End of Main Dashboard Screen */

/* Start of Training Path Screen */
MobileApp.prototype.getTrainingPath = function (id) {
    var self = this;
    $(".navbar-v2 .ui-btn-left.ui-link").attr("href", "#new-dashboard");
    $('#my-training .white-toolbar').find('h1').text(i18next.t('My-Training'))

    $(id).empty();
    if (localStorage.trainingPath) {
        $(id).empty();
        $(id).buildTrainingPath(JSON.parse(localStorage.trainingPath));
    } else {
        $(id).append($("<div/>").addClass("sixteen wide column"));
        self.appendMsg(id + " .column", i18next.t("Loading-training-path"));
    }

    $.ajax({
        url: self.remoteHost + self.trainingPathURL,
        type: 'GET',
        dataType: 'json',
        success:
            function (data) {
                var newData = JSON.stringify(data);
                if (localStorage.trainingPath != newData) {
                    localStorage.trainingPath = newData;
                    // Only update the page if we are still on the my-training page
                    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
                    if(activePage[0].id == "my-training") {
                        $(id).empty();
                        $(id).buildTrainingPath(data);
                    }
                }
            },
        error: function (e) {
            console.error(e);
            var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
            if(activePage[0].id == "my-training") {
                if (localStorage.trainingPath) {
                    $(id).empty();
                    $(id).buildTrainingPath(JSON.parse(localStorage.trainingPath));
                } else {
                    $(id).empty();
                    self.appendMsg(id, i18next.t('could-not-load-training-path'));
                }
            }
        },
        beforeSend: self.setHeaders
    });
    self.trainingPathIcon();
};
/* End of Training Path Screen */

/* Start of Activity, News Feed, and Noticeboard Screen */
MobileApp.prototype.newsFeedDashboard = function () {
    var self = this;

    var contentArea = $("#news-feed-content");

    // Load the Activity Feed by default
    loadActivityFeed();

    // Checking if the social forum is available, add the icon if this is true.
    var hasNews = self.companySettings('news_enabled');
    var hasNoticeBoard = self.companySettings('branch_resources_enabled');

    // If the user's account does not allow for news then disable this option
    if (!hasNews)
        $("#news-feed-news").remove();

    // If the user's account does not allow for noticeboard then disable this option
    if (!hasNoticeBoard)
        $("#news-feed-noticeboard").remove();

    // Responsible for the dropdown displaying the "recently added" key
    $('#news-feed-dropdown').on('click', function () {
        self.dropdown(self.labels.feed_label, $("#news-feed-header"), {
            "colour": "White",
            "key": "single"
        });
    });

    $("#news-feed-activity").on("click", function () {
        loadActivityFeed();
    });

    $("#news-feed-news").on("click", function () {
        loadNewsFeed();
    });

    $("#news-feed-noticeboard").on("click", function () {
        loadNoticeboardFeed();
    });

    // jQuery trigger("click") and click() workaround
    function loadActivityFeed() {
        contentArea.empty();
        self.setActiveTab("#news-feed-activity");

        // append loading message
        self.appendMsg(contentArea, "Loading Activity Feed");
        self.getActivityFeed(function (status, data) {

            contentArea.empty();

            if (status == "Error") {
                self.appendMsg(contentArea, data);
            } else if (status == "Success") {
                self.populateActivityFeed(contentArea, data);
            }

        });
    }

    function loadNewsFeed() {
        contentArea.empty();
        self.setActiveTab("#news-feed-news");

        // append loading message
        self.appendMsg(contentArea, "Loading News Feed");

        self.getNewsFeed(function (status, data) {

            contentArea.empty();

            if (status == "Error") {
                self.appendMsg(contentArea, data);
            } else if (status == "Success") {
                self.populateNewsFeed(contentArea, data);
            }
        });
    }

    function loadNoticeboardFeed() {
        contentArea.empty();
        self.setActiveTab("#news-feed-noticeboard");

        // append loading message
        self.appendMsg(contentArea, i18next('Loading') + " " + self.labels.noticeboard_label_plural + " " + i18next.t("Feed"));

        self.getNoticeboardFeed(function (status, data) {

            contentArea.empty();

            if (status == i18next.t("Error")) {
                self.appendMsg(contentArea, data);
            } else if (status == i18next.t("Success")) {
                self.populateNoticeboardFeed(contentArea, data);
            }
        });
    }
};

MobileApp.prototype.getActivityFeed = function (callback) {
    var self = this;

    $.ajax({
        url: self.remoteHost + self.feedURL,
        type: 'GET',
        dataType: 'json',
        success:
            function (data) {

                if (data.length == 0) {

                    // Callback with error
                    if (callback && typeof callback == "function") {
                        callback(i18next.t("Error"), i18next.t("There are no feed items at the moment"));
                    }
                } else {
                    localStorage.feedData = JSON.stringify(data);

                    // Callback with success & data
                    if (callback && typeof callback == "function") {
                        callback(i18next.t("Success"), localStorage.feedData);
                    }
                }
            },
        error: function (e) {
            console.error(e);

            if (localStorage.feedData) {

                // Callback with success & data
                if (callback && typeof callback == "function") {
                    callback(i18next.t("Success"), localStorage.feedData);
                }
            } else {

                // Callback with success & data
                if (callback && typeof callback == "function") {
                    callback(i18next.t("Error"), i18next.t('coul-not-load-feed'));
                }
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.getNewsFeed = function (callback) {
    var self = this;

    $.ajax({
        url: self.remoteHost + self.newsURL,
        type: 'GET',
        dataType: 'json',
        success:
            function (data) {

                if (data.length == 0) {

                    // Callback with error
                    if (callback && typeof callback == "function") {
                        callback(i18next.t("Error"), i18next.t("There are no new news articles at the moment"));
                    }
                } else {
                    localStorage.newsData = JSON.stringify(data);

                    // Callback with success & data
                    if (callback && typeof callback == "function") {
                        callback(i18next.t("Success"), localStorage.newsData);
                    }
                }
            },
        error: function (e) {
            console.error(e);

            if (localStorage.newsData) {

                // Callback with success & data
                if (callback && typeof callback == "function") {
                    callback(i18next.t("Success"), localStorage.newsData);
                }
            } else {

                // Callback with success & data
                if (callback && typeof callback == "function") {
                    callback(i18next.t("Error"), i18next.t('could-not-load-news-feed'));
                }
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.populateActivityFeed = function (id, data) {
    var self = this;

    var feed = JSON.parse(data);
    var feedArray = [];

    $(id).append("<ul/>", { "class": "news-feed-list" });

    var colour = self.convertHex(self.colours.mobile_neutral_colour_d1, 25);

    $.each(feed, function (index, value) {

        var feedElem = {};
        value.status = value.status || "item";
        var elemColour = colour;

        feedElem["title"] = value.title;
        feedElem["id"] = value.id;
        feedElem["href"] = "#item-page";
        feedElem["date"] = moment(value.keydate, "YYYY-MM-DD").format("DD-MM-YYYY");
        feedElem["type"] = value.type;
        feedElem["icon"] = self.getIcon(value.type);
        feedElem["subTitle"] = value.type + " | " + value.status;

        // If new
        if (self.isRecent(moment(value.keydate, "YYYY-MM-DD"))) {
            elemColour = self.convertHex(self.colours.mobile_alert_colour_b1, 75);

            feedElem["subTitle"] += " | new";

            if (value.status == "unread") {
                elemColour = self.convertHex(self.colours.mobile_alert_colour_b1, 25);
            }

        } else if (value.status == "unread") {
            elemColour = self.convertHex(self.colours.mobile_neutral_colour_d1, 75);
        }

        feedElem["bgColor"] = elemColour;

        feedArray.push(feedElem);
    });

    self.createItemList(feedArray, $(id).children("ul"), colour);

    $(id).append('<hr style="width:65%">');
};

MobileApp.prototype.populateNewsFeed = function (id, data) {
    var self = this;

    var news = JSON.parse(data);
    var newsArray = [];

    $(id).append("<ul/>", { "class": "news-feed-list" });

    var colour = self.convertHex(self.colours.mobile_neutral_colour_d1, 25);

    $.each(news, function (index, value) {

        var newsElem = {};
        value.status = value.status || "item";
        var elemColour = colour;

        newsElem["title"] = value.title;
        // newsElem["news-id"] = value.id;
        newsElem["id"] = value.id;
        newsElem["href"] = "#item-page";
        newsElem["date"] = moment(value.keydate, "YYYY-MM-DD").format("DD-MM-YYYY");
        newsElem["type"] = value.type;
        newsElem["icon"] = self.getIcon(value.type);
        newsElem["subTitle"] = value.type;

        // If new
        if (self.isRecent(moment(value.keydate, "YYYY-MM-DD"))) {
            elemColour = self.convertHex(self.colours.mobile_alert_colour_b1, 75);

            newsElem["subTitle"] += " | new";

            if (value.status == "unread") {
                elemColour = self.convertHex(self.colours.mobile_alert_colour_b1, 25);
            }

        } else if (value.status == "unread") {
            elemColour = self.convertHex(self.colours.mobile_neutral_colour_d1, 75);
        }

        newsElem["bgColor"] = elemColour;

        newsArray.push(newsElem);
    });

    self.createItemList(newsArray, $(id).children("ul"), colour);

    $(id).append('<hr style="width:65%">');
};

MobileApp.prototype.getNoticeboardFeed = function (callback) {
    var self = this;

    $.ajax({
        url: self.remoteHost + self.noticeboardURL,
        type: 'GET',
        dataType: 'json',
        success:
            function (data) {

                if (data.length == 0) {

                    // Callback with error
                    if (callback && typeof callback == "function") {
                        callback(i18next.t("Error"), i18next.t("There is nothing new on the noticeboard at the moment"));
                    }
                } else {
                    localStorage.noticeboardData = JSON.stringify(data);

                    // Callback with success and data
                    if (callback && typeof callback == "function") {
                        callback(i18next.t("Success"), localStorage.noticeboardData);
                    }
                }
            },
        error: function (e) {
            console.error(e);

            if (localStorage.noticeboardData) {

                // Callback with success and data
                if (callback && typeof callback == "function") {
                    callback(i18next.t("Success"), localStorage.noticeboardData);
                }
            } else {

                // Callback with error
                if (callback && typeof callback == "function") {
                    callback(i18next.t("Error"), i18next.t('could-not-load-news-feed'));
                }
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.populateNoticeboardFeed = function (id, data) {
    var self = this;

    $(id).empty();

    var noticeboardItems = JSON.parse(data);
    var categories = self.getCategoriesArray(data);

    // Creating the collapsible categories
    for (var i in categories) {
        self.createCategories(id, categories[i]);
    }

    var colour = self.convertHex(self.colours.mobile_neutral_colour_d1, 25);

    $.each(noticeboardItems, function (index, value) {
        var item = {};
        value.status = value.status || "item";
        var elemColour = colour;

        item["title"] = value.title;
        item["noticeboard-id"] = value.id;
        item["id"] = value.id;
        item["type"] = "noticeboard";
        item["href"] = "#item-page";
        item["date"] = moment(value.keydate, "YYYY-MM-DD").format("DD-MM-YYYY");
        item["icon"] = self.getIcon(value.type);
        item["subTitle"] = value.type + " | " + value.status;

        // If new
        if (self.isRecent(moment(value.keydate, "YYYY-MM-DD"))) {
            elemColour = self.convertHex(self.colours.mobile_alert_colour_b1, 75);

            item["subTitle"] += " | new";

            if (value.status == "unread") {
                elemColour = self.convertHex(self.colours.mobile_alert_colour_b1, 25);
            }

        } else if (value.status == "unread") {
            elemColour = self.convertHex(self.colours.mobile_neutral_colour_d1, 75);
        }

        item["bgColor"] = elemColour;

        var category = "";

        if (value["extras"]) {
            if (value["extras"]["category"]) {
                category = self.ifNullUseDefault(value["extras"]["category"], "Uncategorised");
            } else {
                category = i18next.t("Uncategorised");
            }
        } else {
            category = i18next.t("Uncategorised");
        }

        category = "#" + self.convertToId(category) + "-list";

        self.createItem(item, $(category), colour);
    });
};

/** @function getCategoriesArray
  * @param { JSONObject } data
  * @return { Array }
  * @description Iterates through the data param,
  finds and returns an array of all the different categories available
**/
MobileApp.prototype.getCategoriesArray = function (data) {
    var self = this;

    //This array is where the sorted objects will go
    var categories = [];
    //This is to keep track of indivitule object categories
    var category;

    data = JSON.parse(data);

    // If there are no items in the data then return null
    if (data.length == 0 || data == undefined) {
        return null;
    }

    $.each(data, function (key, obj) {

        // Checks is the object has a category to begin with
        if (obj["extras"]) {

            if (obj["extras"]["category"]) {

                category = self.ifNullUseDefault(obj["extras"]["category"], "Uncategorised");
            } else {

                category = i18next.t("Uncategorised");
            }
        } else {
            category = i18next.t("Uncategorised");
        }

        // Checking if the category is already in the categories array
        // If not then the category gets added to the categories array
        if ($.inArray(category, categories) == -1) {
            categories.push(category);
        }

    });

    // sort() alphabetizes the array
    return categories.sort();
};

/** @function createCategories
  * @param { Int } id
  * @param { String } category
  * @description Appends a collapsible list container to the id with the name of the category
**/
MobileApp.prototype.createCategories = function (id, category) {
    var self = this;

    var lowerCase = self.convertToId(category);

    var categoryTemp = document.getElementById("noticeboard-category").content.cloneNode(true);

    categoryTemp.querySelector("h3").innerText = category;
    categoryTemp.querySelector("ul").setAttribute("id", lowerCase + "-list");
    categoryTemp.querySelector("ul").setAttribute("class", "noticeboard-item-link");

    $(id).append(categoryTemp);
    // var content = '<div data-role="collapsible" data-collapsed-icon="carat-d" data-corners="false" data-collapsed="false" data-expanded-icon="carat-u" >' +
    // '<h4>' + category + ' <span id="'+ lowerCase +'-count" class="ui-li-count">--</span></h4><ul data-role="listview" id="'+ lowerCase +'-list" data-divider-theme="a"></ul></div>';

    // $(id).append(content).trigger("create");
};
/* End of Activity, News Feed, and Noticeboard Screen */

/* Start of Forum Screen */
MobileApp.prototype.forumV2 = function () {
    var self = this;
    var contentArea = $("#forums-index");
    contentArea.empty();

    self.getIndexFeed("#forums-index");
};

MobileApp.prototype.trainingPathIcon = function() {
    var self = this;
    $("#training-path-container").prepend(
        $("<div/>").addClass("right aligned sixteen wide column info-pop-up").append(
            $("<i/>").addClass("big info circle icon").attr("data-legend-type", "training")
        )
    )
    $(".modal.legend.training").remove();
    var legendModalTemp = document.getElementById("modal-template-V2").content.cloneNode(true);
    legendModalTemp = $(legendModalTemp);
    legendModalTemp.find(".modal").addClass("legend training");
    legendModalTemp.find(".header").text(i18next.t("My-Training"));
    legendModalTemp.find(".content").append(
        $("<div/>").addClass("ui equal width grid")
    );

    var overdue = $("<div/>").addClass("column overdue").append(
        $("<div/>").addClass("ui circular label")
    ).append($("<p/>").text(i18next.t("Overdue")));
    var failed = $("<div/>").addClass("column failed").append(
        $("<div/>").addClass("ui circular label")
    ).append($("<p/>").text(i18next.t("Failed")));
    var incomplete = $("<div/>").addClass("column incomplete").append(
        $("<div/>").addClass("ui circular label")
    ).append($("<p/>").text( i18next.t("In-progress")));
    var complete = $("<div/>").addClass("column complete").append(
        $("<div/>").addClass("ui circular label")
    ).append($("<p/>").text(i18next.t("Complete")));
    var notStarted = $("<div/>").addClass("column not-started").append(
        $("<div/>").addClass("ui circular label")
    ).append($("<p/>").text(i18next.t("Not-started")));

    legendModalTemp.find(".content .grid").append(overdue);
    legendModalTemp.find(".content .grid").append(failed);
    legendModalTemp.find(".content .grid").append(incomplete);
    legendModalTemp.find(".content .grid").append(complete);
    legendModalTemp.find(".content .grid").append(notStarted);

    legendModalTemp.find(".content .grid").append(
        $("<div/>").addClass("centered equal width row")
    );

    legendModalTemp.find(".content .grid .equal.width.row").append(
        $("<div/>").addClass("five wide center aligned column").append(
            $("<i/>").addClass("circular laptop icon")
        ).append($("<p/>").text(i18next.t("Online")))
    );
    if (self.companySettings('external_training_enabled')) {
        legendModalTemp.find(".content .grid .equal.width.row").append(
            $("<div/>").addClass("five wide center aligned column").append(
                $("<i/>").addClass("circular users icon")
            ).append($("<p/>").text(i18next.t(self.labels.external_training_label)))
        );
    }
    if (self.companySettings('appraisals_enabled')) {
        legendModalTemp.find(".content .grid .equal.width.row").append(
            $("<div/>").addClass("five wide center aligned column").append(
                $("<i/>").addClass("circular tasks icon")
            ).append($("<p/>").text(i18next.t(self.labels.appraisal_label)))
        );
    }
    if (self.companySettings('competences_enabled')) {
        legendModalTemp.find(".content .grid .equal.width.row").append(
            $("<div/>").addClass("five wide center aligned column").append(
                $("<i/>").addClass("circular file alternate icon")
            ).append($("<p/>").text(i18next.t(self.labels.competence_label)))
        );
    }
    if (self.companySettings('workbooks_enabled')) {
        legendModalTemp.find(".content .grid .equal.width.row").append(
            $("<div/>").addClass("five wide center aligned column").append(
                $("<i/>").addClass("circular pencil icon")
            ).append($("<p/>").text(i18next.t("Workbook")))
        );
    }

    $("#training-path-container").prepend(legendModalTemp);
}

MobileApp.prototype.myTrainingV2 = function () {
    var self = this;
    self.getTrainingPath("#training-path-container");
};

MobileApp.prototype.forum = function () {
    var self = this;

    var contentArea = $("#forum-content");
    var search = $("#forum-search-bar");
    contentArea.empty();
    // self.getTopic("#forum-content", 7);

    self.getIndexFeed("#forum-content");
    // self.getSubscriptionFeed("#forum-content");
    self.getUnreadTopics("#dropdown-content > ul");

    $("#forum-index").on("click", function () {
        contentArea.empty();
        self.getIndexFeed("#forum-content");
    });

    $("#forum-subscriptions").on("click", function () {
        contentArea.empty();
        self.getSubscriptionFeed("#forum-content");
    });

    $("#forum-search").on("click", function () {

        self.setActiveTab($("#forum-search-bar-container"));

        self.setVisibility($("#forum-search-bar-container"), true);
        self.setVisibility($("#forum-sub-menu"), false);
        search.focus();
    });

    search.keypress(function (event) {

        // which 13 is the return key
        if (event.which == 13) {
            $("#forum-search-start-button").click();
            $(this).blur();
        }
    });

    $("#forum-search-close-button").on("click", function () {

        self.setActiveTab($("#forum-index"));

        self.setVisibility($("#forum-search-bar-container"), false);
        self.setVisibility($("#forum-sub-menu"), true);
        search.val("");
        search.blur();
    });

    $("#forum-search-start-button").on("click", function () {
        var value = search.val();
        self.searchForum("#forum-content", value);
    });

    $('#forum-dropdown').on('click', function () {

        self.dropdown("Forums", $("#forum-header"), {
            "colour": "White",
            "fixed": true,
            "key": "single"
        });
    });
};

MobileApp.prototype.getIndexFeed = function (id) {
    var self = this;
    $(id).empty();
    self.appendMsg(id, i18next.t("Loading-index-feed"));
    self.setActiveTab("#forum-index");
    if (self.loadingForums == true) {
        return;
    }
    self.loadingForums = true;
    $.ajax({
        url: self.remoteHost + self.forumIndexURL,
        type: 'GET',
        dataType: 'json',
        beforeSend: self.setHeaders,
        success: function (data) {
            self.loadingForums = false;
            if (data.forums.length == 0) {
                self.appendMsg(id, i18next.t("There-are-no-Forums-currently-available"));
            } else {
                localStorage.forumData = JSON.stringify(data.forums);
                if (id == "#forums-index") {
                    self.populateForumIndexListV2(id, localStorage.forumData);
                } else {
                    self.populateForumIndexList(id, localStorage.forumData);
                }
            }
        },
        error: function (e) {
            console.error(e);
            self.loadingForums = false;
            if (localStorage.forumData) {
                if (id == "#forums-index") {
                    self.populateForumIndexListV2(id, localStorage.forumData);
                } else {
                    self.populateForumIndexList(id, localStorage.forumData);
                }
            } else {
                $(id).empty();
                self.appendMsg(id, i18next.t('could-not-load-index-feed'));
            }
        }
    });
};

MobileApp.prototype.getSubscriptionFeed = function (id) {
    var self = this;
    $(id).empty();
    $(".navbar-v2 .ui-btn-left.ui-link").removeClass("back-to-forums back-to-following back-to-unread");

    self.appendMsg(id, i18next.t("Loading-subscription-feed"));
    self.setActiveTab("#forum-subscriptions");
    if (self.loadingForums == true) {
        return;
    }
    self.loadingForums = true;
    $.ajax({
        url: self.remoteHost + self.forumSubscriptionURL,
        type: 'GET',
        dataType: 'json',
        success:
            function (data) {

                self.loadingForums = false;

                if (data.topics.length == 0) {
                    $(id).empty();
                    self.appendMsg(id, i18next.t("You-have-no-active-subscriptions"));
                } else {
                    localStorage.subscriptionData = JSON.stringify(data.topics);
                    if (id == "#forums-following") {
                        self.populateForumTopicsListV2(id, localStorage.subscriptionData);
                    } else {
                        self.populateForumSubscriptionList(id, localStorage.subscriptionData);
                    }
                }
            },
        error: function (e) {
            console.error(e);

            self.loadingForums = false;

            if (localStorage.subscriptionData) {
                if (id == "#forums-following") {
                    self.populateForumTopicsListV2(id, localStorage.subscriptionData);
                } else {
                    self.populateForumSubscriptionList(id, localStorage.subscriptionData);
                }
            } else {
                $(id).empty();
                self.appendMsg(id, i18next.t('could-not-load-subscription-feed'));
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.getUnreadTopicsData = function () {
    var self = this;

    $.ajax({
        url: self.remoteHost + self.forumUnreadTopicsURL,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            localStorage.unreadTopicData = JSON.stringify(data.topics);
        },
        error: function (e) {
            self.debug(e);
            self.popupMsg( i18next.t('could-not-fetch-unread-topics'));
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.getUnreadTopics = function (id) {
    var self = this;
    $(id).empty();
    $(".navbar-v2 .ui-btn-left.ui-link").removeClass("back-to-forums back-to-following back-to-unread");

    self.appendMsg(id, i18next.t("Loading-unread-topics-feed"));
    self.setActiveTab("#forum-unread");
    if (self.loadingForums == true) {
        return;
    }
    self.loadingForums = true;
    $.ajax({
        url: self.remoteHost + self.forumUnreadTopicsURL,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            self.loadingForums = false;
            if (data.topics.length == 0) {
                $(id).empty();
                self.appendMsg(id, i18next.t("You-have-no-unread-topics-at-the-moment"));
            } else {
                localStorage.unreadTopicData = JSON.stringify(data.topics);
                if (id == "#forums-unread") {
                    self.populateForumTopicsListV2(id, localStorage.unreadTopicData);
                } else {
                    self.sortUnreadTopicsList(id, localStorage.unreadTopicData);
                }
            }
        },
        error: function (e) {
            self.debug(e);
            self.loadingForums = false;
            if (localStorage.unreadTopicData) {
                if (id == "#forums-unread") {
                    self.populateForumTopicsListV2(id, localStorage.unreadTopicData);
                } else {
                    self.sortUnreadTopicsList(id, localStorage.unreadTopicData);
                }
            } else {
                $(id).empty();
                self.appendMsg(id, i18next.t('could-not-load-unread-topics'));
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.populateForumIndexListV2 = function (id, forums) {
    var self = this;
    $(id).empty();
    $(".navbar-v2 .ui-btn-left.ui-link").removeClass("back-to-forums back-to-following back-to-unread");

    var forumsData = JSON.parse(forums);
    $(id).append(
        $("<div/>").addClass("ui styled fluid accordion forums")
    );

    $.each(forumsData, function (i, forum) {

        if (forum.parent_id == null) {
            var forum_row = $("<div/>").addClass("forum-row")

            var forum_title = $("<div/>")
            forum_title.addClass("ui middle aligned grid title")

            if (forum.image != null) {
                var forum_image = $("<div/>")
                forum_image.addClass("two wide image column")
                forum_image.css("background", 'url(' + forum.image + ') no-repeat')
                forum_image.css("height", "100%")
                forum_image.css("background-size", "cover")
                forum_image.css("background-position" ,"center")
            } else {
                var forum_image = $("<div/>")
                forum_image.addClass("two wide center aligned image column")
                forum_image.append($("<i/>").addClass("big hashtag icon"))
            }

            var forum_name = $("<div/>")
            forum_name.addClass("eleven wide column")
            forum_name.append($("<div/>").addClass("ui small header").text(forum.name))

            var forum_topic_count =$("<div/>")
            forum_topic_count.addClass("two wide column forum_topic_count")
            forum_topic_count.append($("<i/>").addClass("comments icon"))
            forum_topic_count.append(forum.direct_topics_count)

            var dropdown_icon = $("<div/>")
            dropdown_icon.addClass("one wide column")
            dropdown_icon.append($("<i/>").addClass("dropdown icon"))

            var forum_content = $("<div/>")
            forum_content.addClass("content")
            forum_content.append($("<p/>").text(jQuery(forum.description).text()))
            forum_content.append(
                $("<div/>").addClass("ui styled fluid accordion topics")
            );

            var new_topic = $("<a/>")
            new_topic.attr("href", "#")
            new_topic.addClass("forum-button new-topic")
            new_topic.attr("data-forum-id", forum.id)
            new_topic.attr("data-forum-name", encodeURIComponent(forum.name))
            new_topic.css("backgroun-color",  self.convertHex(self.colours.mobile_neutral_colour_d1, 66))
            new_topic.text(i18next.t("Create-new-topic"));
            forum_content.append(new_topic);

            var row = $("<div/>").addClass("row")
            row.append(forum_image);
            row.append(forum_name);
            row.append(forum_topic_count);
            row.append(dropdown_icon);
            forum_title.append(row);
            forum_row.append(forum_title);

            $.each(forum.topics, function (topicIndex, topic) {
                var topic_row = $("<div/>").addClass("topic-row").attr("id", topic.id)
                
                var topic_title = $("<div/>")
                topic_title.addClass("ui middle aligned grid title disabled active")
                var topic_icon = $("<div/>")
                topic_icon.addClass("two wide center aligned image column")
                topic_icon.append($("<i/>").addClass("comments icon"))
                var topic_name = $("<div/>")
                topic_name.addClass("fourteen wide column name")
                topic_name.append($("<div/>").addClass("ui small header").text(topic.subject))

                var topic_content = $("<div/>")
                topic_content.addClass("content disabled active")
                topic_content.append($("<p/>").text(self.getTopicData(id, topic.id)))
                
                var topic_stats = $("<div/>").addClass("ui middle aligned grid stats")

                var topic_posts = $("<div/>").addClass("two wide column")
                topic_posts.append($("<i/>").addClass("comment icon"))
                topic_posts.append(topic.posts_count)
                topic_stats.append(topic_posts)

                var topic_likes = $("<div/>").addClass("two wide column")
                topic_likes.append($("<i/>").addClass("heart icon"))
                topic_likes.append(topic.topic_likes_count)
                topic_stats.append(topic_likes)
                
                var topic_username = $("<div/>").addClass("eight wide right aligned column")
                topic_username.append(topic.poster_username)
                topic_stats.append(topic_username)

                var topic_created = $("<div/>").addClass("four wide right aligned column")
                topic_created.append(moment(topic.created).format("MMM Do YY"))
                topic_stats.append(topic_created)

                topic_content.append(topic_stats)

                topic_title.append(topic_icon);
                topic_title.append(topic_name);

                topic_row.append(topic_title);
                topic_row.append(topic_content);

                $(forum_content).find(".ui.styled.fluid.accordion.topics").append(topic_row);
            });
            forum_row.append(forum_content);
            $(id + " .ui.styled.fluid.accordion.forums").append(forum_row);
        } else {
            self.debug(forum.name + " is a sub-level-forum");
        }
    });
    $('.ui.styled.fluid.accordion.forums').accordion();
};

MobileApp.prototype.populateForumIndexList = function (id, forums) {
    var self = this;
    $(id).empty();

    var forumsArray = [];

    var forumsData = JSON.parse(forums);

    $.each(forumsData, function (i, forum) {

        if (forum.parent_id == null) {

            var forumTemp = document.getElementById("top-level-forum").content.cloneNode(true);

            var header = forumTemp.querySelector(".new-collapse-header");
            header.classList.add("top-level-forum");
            header.style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d2, 40);
            header.setAttribute("data-forum-id", forum.id);

            headerElement = header.querySelector("header");
            headerElement.style.backgroundColor = self.colours.mobile_neutral_colour_d2;

            headerElement.querySelector(".forum-collapse").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d3, 33);

            // Top Level Forum Add "Create New Forum" button by removing the hidden styling
            forumTemp.querySelector(".new-forum").removeAttribute("style");

            if (forum.image != null)
                forumTemp.querySelector("header > img").src = forum.image;

            forumTemp.querySelector("header > span > h4").innerText = forum.name;
            forumTemp.querySelector("header > span > h5").innerText = jQuery(forum.description).text();

            var ul = forumTemp.querySelector("topic > ul");

            $.each(forum.topics, function (topicIndex, topic) {

                // self.getForumPost(topic.first_post_id);

                var topicTemp = document.getElementById("topic-link").content.cloneNode(true);

                topicTemp.querySelector("li").setAttribute("data-id", topic.id);
                topicTemp.querySelector("li").setAttribute("class", "topic-link-id");

                if (topic.poster_avatar)
                    topicTemp.querySelector(".topic-profile-pic").src = topic.poster_avatar;

                if (self.isRecent(moment(topic.updated))) {
                    topicTemp.querySelector(".topic-link-container-title").style.backgroundColor = self.convertHex(self.colours.mobile_alert_colour_b1, 66);
                    topicTemp.querySelector(".topic-link-container-subtitle").style.backgroundColor = self.convertHex(self.colours.mobile_alert_colour_b1, 33);
                } else {
                    topicTemp.querySelector(".topic-link-container-title").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d1, 66);
                    topicTemp.querySelector(".topic-link-container-subtitle").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d2, 33);
                }

                topicTemp.querySelector(".topic-link-header-title").innerText = topic.subject;
                topicTemp.querySelector(".topic-link-subheader-title").innerText = topic.poster_username;
                topicTemp.querySelector(".topic-link-subheader-moment").innerText = moment(topic.updated).fromNow() == i18next.t("a-few-seconds-ago") ? i18next.t("seconds-ago") : moment(topic.updated).fromNow();
                topicTemp.querySelector(".topic-link-subheader-hearts").innerText = topic.topic_likes_count;
                topicTemp.querySelector(".topic-link-subheader-comments").innerText = topic.posts_count > 0 ? topic.posts_count - 1 : 0;

                ul.appendChild(topicTemp);
            });

            forumTemp.querySelector(".new-topic").setAttribute("data-forum-id", forum.id);
            forumTemp.querySelector(".new-topic").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d1, 66);
            forumTemp.querySelector(".new-topic").setAttribute("data-forum-name", encodeURIComponent(forum.name));

            forumsArray.push(forumTemp);

        } else {
            self.debug(forum.name + " " + i18next.t('is a sub-level-forum'));
        }
    });

    $(id).empty();
    $(id).append(forumsArray);
};

MobileApp.prototype.populateForumTopicsListV2 = function (id, topicData) {
    var self = this;

    $(id).empty();

    var topics = JSON.parse(topicData);

    $(id).append(
        $("<div/>").addClass("ui styled fluid accordion following-topics")
    );
    $.each(topics, function (i, topic) {
        var topic_row = $("<div/>").addClass("topic-row").attr("id", topic.id)
        
        var topic_title = $("<div/>")
        topic_title.addClass("ui middle aligned grid title disabled active")
        var topic_icon = $("<div/>")
        topic_icon.addClass("two wide center aligned image column")
        topic_icon.append($("<i/>").addClass("comments icon"))
        var topic_name = $("<div/>")
        topic_name.addClass("fourteen wide column name")
        topic_name.append($("<div/>").addClass("ui small header").text(topic.subject))

        var topic_content = $("<div/>")
        topic_content.addClass("content active")
        topic_content.append($("<p/>").text(topic.created))
        
        var topic_stats = $("<div/>").addClass("ui middle aligned grid stats")

        var topic_posts = $("<div/>").addClass("two wide column")
        topic_posts.append($("<i/>").addClass("comment icon"))
        topic_posts.append(topic.posts_count)
        topic_stats.append(topic_posts)

        var topic_likes = $("<div/>").addClass("two wide column")
        topic_likes.append($("<i/>").addClass("heart icon"))
        topic_likes.append(topic.topic_likes_count)
        topic_stats.append(topic_likes)
        
        var topic_username = $("<div/>").addClass("eight wide right aligned column")
        topic_username.append(topic.poster_username)
        topic_stats.append(topic_username)

        var topic_created = $("<div/>").addClass("four wide right aligned column")
        topic_created.append(moment(topic.created).format("MMM Do YY"))
        topic_stats.append(topic_created)

        topic_content.append(topic_stats)

        topic_title.append(topic_icon);
        topic_title.append(topic_name);

        topic_row.append(topic_title);
        topic_row.append(topic_content);

        $(id + " .ui.styled.fluid.accordion.following-topics").append(topic_row);
    });
    $('.topic-row').on("click", function(e) {
        if ($(this).parents("#forums-following").length > 0) {
            $("#social-forums-page .navbar-v2 .ui-btn-left.ui-link").addClass("back-to-following");
        } else {
            $("#social-forums-page .navbar-v2 .ui-btn-left.ui-link").addClass("back-to-unread");
        }
        self.getTopic(id, $(this).attr('id'));
    });
};

MobileApp.prototype.populateForumSubscriptionList = function (id, topicData) {
    var self = this;

    $(id).empty();

    var topics = JSON.parse(topicData);

    var structure = document.getElementById("subscription-feed-structure").content.cloneNode(true);
    var ul = structure.querySelector("ul");
    ul.style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d2, 40);

    $.each(topics, function (i, topic) {

        var topicTemp = document.getElementById("topic-link").content.cloneNode(true);

        // REPLACE WITH REAL PARENT SLUG FROM SERVER ONCE IT'S READY
        var slug = topic.forum_name + " > " + topic.slug;
        slug = slug.replace(/-/g, " ");

        topicTemp.querySelector(".topic-slug").innerText = self.decapitalizeString(slug);
        topicTemp.querySelector(".topic-slug").removeAttribute("style");
        topicTemp.querySelector(".topic-pin").removeAttribute("style");

        topicTemp.querySelector("li").setAttribute("data-id", topic.id);
        topicTemp.querySelector("li").setAttribute("class", "topic-link-id");

        if (topic.poster_avatar)
            topicTemp.querySelector(".topic-profile-pic").src = topic.poster_avatar;

        if (self.isRecent(moment(topic.updated))) {
            topicTemp.querySelector(".topic-link-container-title").style.backgroundColor = self.convertHex(self.colours.mobile_alert_colour_b1, 66);
            topicTemp.querySelector(".topic-link-container-subtitle").style.backgroundColor = self.convertHex(self.colours.mobile_alert_colour_b1, 33);
        } else {
            topicTemp.querySelector(".topic-link-container-title").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d1, 66);
            topicTemp.querySelector(".topic-link-container-subtitle").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d2, 33);
        }

        topicTemp.querySelector(".topic-link-header-title").innerText = topic.subject;
        topicTemp.querySelector(".topic-link-subheader-title").innerText = topic.poster_username;
        topicTemp.querySelector(".topic-link-subheader-moment").innerText = moment(topic.updated).fromNow() == i18next.t("a-few-seconds-ago") ? i18next.t("seconds-ago") : moment(topic.updated).fromNow();;
        topicTemp.querySelector(".topic-link-subheader-hearts").innerText = topic.topic_likes_count;
        topicTemp.querySelector(".topic-link-subheader-comments").innerText = topic.posts_count > 0 ? topic.posts_count - 1 : 0;;

        ul.appendChild(topicTemp);
    });

    $(id).append(structure);
};

MobileApp.prototype.getTopicData = function (id, topicId) {
    var self = this;
    if (self.loadingForums == true) {
        return;
    }
    self.loadingForums = true;
    var topicsObject = JSON.parse(localStorage.topics);
    $.ajax({
        url: self.remoteHost + self.forumViewTopicsURL + topicId + "/1/",
        type: 'GET',
        dataType: 'json',
        success: function (d) {
            self.loadingForums = false;
            return d;
        },
        error: function (e) {
            self.loadingForums = false;
            console.error(e);
            if (topicsObject[topicId]) {
                return topicsObject[topicId];
            } else {
                $(id).empty();
                self.appendMsg(id, i18next.t('could-not-load-topic'));
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.getTopic = function (id, topicId) {
    var self = this;

    // clear the area
    $(id).empty();

    // append loading message
    self.appendMsg(id, i18next.t("Loading-topic"));

    if (self.loadingForums == true) {
        return;
    }

    self.loadingForums = true;

    var topicsObject = JSON.parse(localStorage.topics);

    $.ajax({
        url: self.remoteHost + self.forumViewTopicsURL + topicId + "/1/",
        type: 'GET',
        dataType: 'json',
        success:
            function (d) {

                self.loadingForums = false;

                topicsObject[topicId] = d;
                // commenting out to avoid memory overflow ini OS
                // refactoring still needed to remove other references
                // localStorage.topics = JSON.stringify(topicsObject);
                if (id == "#forums-index" || id == "#forums-following" || id == "#forums-unread") {
                    self.populateTopicPageV2(id, d);
                } else {
                    self.populateTopicPage(id, d);
                }
            },
        error: function (e) {
            console.error(e);

            self.loadingForums = false;

            if (topicsObject[topicId]) {
                var data = topicsObject[topicId];
                if (id == "#forums-index" || id == "#forums-following" || id == "#forums-unread") {
                    self.populateTopicPageV2(id, d);
                } else {
                    self.populateTopicPage(id, d);
                }
            } else {
                $(id).empty();
                self.appendMsg(id, i18next.t('could-not-load-topic'));
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.populateTopicPageV2 = function (id, data) {
    var self = this;
    $(id).empty();
    
    var breadcrumb = $("<div/>").addClass('ui breadcrumb');
    breadcrumb.append($("<div/>").addClass("section back-to-forums").text(data.topic.forum_name));
    breadcrumb.append($("<div/>").addClass("divider").text("/"));
    breadcrumb.append($("<div/>").addClass("active section").text(data.topic.subject));
    $(id).append(breadcrumb);

    $(id).append(
        $("<div/>").addClass("ui styled fluid accordion topic-posts")
    );

    var post_actions = $("<div/>").addClass("ui middle aligned equal width grid actions");
    post_actions.append($("<div/>").addClass("right aligned column"));
    
    var reply_button = $("<div/>").addClass("compact ui tiny button new-post-v2");
    reply_button.append($("<i/>").addClass("user icon"));
    reply_button.append(i18next.t("Reply"));
    
    if (data.topic.is_subscribed == true) {
        var follow_button = $("<div/>").addClass("compact ui tiny button unsubscribe");
        follow_button.attr("data-id", data.topic.id);
        follow_button.append($("<i/>").addClass("thumbtack icon"));
        follow_button.append(i18next.t("Unfollow"));
    } else{
        var follow_button = $("<div/>").addClass("compact ui tiny button subscribe");
        follow_button.attr("data-id", data.topic.id);
        follow_button.append($("<i/>").addClass("thumbtack icon"));
        follow_button.append(i18next.t("Follow"));
    }
    post_actions.append(follow_button);
    
    if (data.posts[0].is_liked) {
        var like_button = $("<div/>").addClass("compact ui tiny button unlike");
        like_button.attr("data-id", data.posts[0].id);
        like_button.append($("<i/>").addClass("heart icon"));
        like_button.append($("<span/>").text(i18next.t("Unlike")));
        post_actions.append(like_button);
    } else {
        var like_button = $("<div/>").addClass("compact ui tiny button like");
        like_button.attr("data-id", data.posts[0].id);
        like_button.append($("<i/>").addClass("heart icon"));
        like_button.append($("<span/>").text( i18next.t("Like")));
        post_actions.append(like_button);
    }

    if (data["poll"] && data["poll"]["options"].length >= 2) {
        var post_row = $("<div/>").addClass("post-row")

        var pollStructureTemp = document.getElementById("topic-poll-structure-v2").content.cloneNode(true);
        pollStructureTemp = $(pollStructureTemp);
        pollStructureTemp.attr("data-id", data.poll.id);

        var totalVotes = data.poll.total_votes || 0;

        var pollList = pollStructureTemp.find(".grid.vote");
        pollStructureTemp.find(".name .header").text(data.poll.question);
        pollStructureTemp.find(".stats .column").prepend(totalVotes);

        post_row.append(pollStructureTemp);

        // Get and append the poll options
        $.each(data["poll"]["options"], function (index, poll) {
            poll.voted = false;
            var pollOptionTemp = document.getElementById("topic-poll-option-v2").content.cloneNode(true);
            pollOptionTemp = $(pollOptionTemp);

            pollOptionTemp.find(".topic-poll-question").attr("data-poll-id", poll.poll_id);
            pollOptionTemp.find(".topic-poll-question").attr("data-id", poll.id);
            pollOptionTemp.find(".topic-poll-question").attr("data-max-options", data.poll.max_options);
            pollOptionTemp.find(".topic-poll-question").attr("data-remaining-votes", data.poll.max_options - data.poll.user_votes.length);

            if (data.poll.user_changes == true && (data.poll.user_vote == "null" || data.poll.user_vote == null)) {
                pollOptionTemp.find(".topic-poll-question").attr("data-poll-id", poll.poll_id);
                pollOptionTemp.find(".topic-poll-question").attr("data-id", poll.id);
            }

            pollOptionTemp.find(".topic-poll-question").attr("data-change", data.poll.user_changes);
            pollOptionTemp.find("h4").text(poll.text);
            pollOptionTemp.find("span").append(poll.votes_count);
            
            if (poll.votes_count == 1) {
                pollOptionTemp.find("span").append(' ' + i18next.t('vote'));
            } else {
                pollOptionTemp.find("span").append(' ' + i18next.t('votes'));
            }

            if (data.poll.user_votes.indexOf(poll.id) >= 0) {
                pollOptionTemp.find(".topic-poll-question").addClass("user_vote");
                poll.voted = true;
            }

            if (data.poll.user_vote) {
                poll.voted = true;
            }

            pollOptionTemp.find(".topic-poll-question").attr("data-voted", poll.voted);
            var pollPercentage = (poll.votes_count / totalVotes) * 100;
            pollList.append(pollOptionTemp);
        });
        $(id + " .ui.styled.fluid.accordion.topic-posts").append(post_row);
    }

    $.each(data.posts, function (i, post) {
        if (post.is_topic_head) {
            reply_button.attr("data-id", post.id);
            reply_button.attr("data-topic-id", data.topic.id);
            reply_button.attr("data-forum-id", data.topic.forum_id);
            reply_button.attr("data-topic-name", encodeURIComponent(post.subject));
            reply_button.attr("data-container-id", id);
            post_actions.append(reply_button)
        }

        var post_row = $("<div/>").addClass("post-row")
        
        var post_title = $("<div/>")
        post_title.addClass("ui middle aligned grid title disabled active")
        if (data.topic.poster_avatar == null || data.topic.poster_avatar == undefined || data.topic.poster_avatar == "") {
            var post_image = $("<div/>")
            post_image.addClass("two wide center aligned image column")
            post_image.append($("<i/>").addClass("user icon"))
        } else {
            var post_image = $("<div/>")
            post_image.addClass("two wide image column")
            var user_avatar = $("<img/>").addClass("ui circular image")
            user_avatar.attr("src", data.topic.poster_avatar);
            post_image.append(user_avatar)     
        }

        var post_username = $("<div/>")
        post_username.addClass("ten wide column name")
        post_username.append($("<div/>").addClass("ui tiny header").text(post.username))

        var post_created = $("<div/>")
        post_created.addClass("four wide right aligned column updated")
        post_created.append($("<div/>").addClass("ui tiny header").text(moment(post.updated).format("MMM Do YY")))
        
        post_title.append(post_image);
        post_title.append(post_username);
        post_title.append(post_created);

        var post_subtitle = $("<div/>")
        post_subtitle.addClass("ui middle aligned grid subtitle")

        var post_subject = $("<div/>")
        post_subject.addClass("fourteen wide column")
        post_subject.append($("<div/>").addClass("ui small header").text(post.subject))

        var post_likes = $("<div/>")
        if (post.is_liked) {
            post_likes.addClass("two wide right aligned column unlike-post")
        } else {
            post_likes.addClass("two wide right aligned column like-post")
        }
        post_likes.attr("data-id", post.id)
        post_likes.append($("<i/>").addClass("fa fa-heart"))
        post_likes.append($("<span/>").text(post.likes))

        post_subtitle.append(post_subject)
        post_subtitle.append(post_likes)

        var post_content = $("<div/>")
        post_content.addClass("content active")
        post_content.append(post_subtitle);
        post_content.append($("<p/>").html(post.content))

        post_row.append(post_title);
        post_row.append(post_content);

        $(id + " .ui.styled.fluid.accordion.topic-posts").append(post_row);
    });
    $(id + " .ui.styled.fluid.accordion.topic-posts").append(post_actions[0].outerHTML);
};

MobileApp.prototype.populateTopicPage = function (id, data) {
    var self = this;

    $(id).empty();

    var page = document.getElementById("post-page").content.cloneNode(true);
    page.querySelector(".topic-post-slug-link > span ").innerText = data.topic.subject;

    $(id).append(page);

    $.each(data.posts, function (i, post) {

        var postTemp = "";

        // If this is the first post clone post-first as it has some extra elements
        if (post.is_topic_head) {

            postTemp = document.getElementById("post-first").content.cloneNode(true);

            /* If Poll option is enabled then go ahead and add this to this post as well */
            if (data["poll"] && data["poll"]["options"].length >= 2) {

                // Get and append the poll structure template
                var pollStructureTemp = document.getElementById("topic-poll-structure").content.cloneNode(true);
                pollStructureTemp.querySelector(".topic-question-container").setAttribute("data-id", data.poll.id);

                var totalVotes = data.poll.total_votes || 0;

                var pollList = pollStructureTemp.querySelector(".topic-poll-list");
                pollStructureTemp.querySelector(".topic-question-title").innerText = data.poll.question;
                pollStructureTemp.querySelector(".topic-poll-count > span").innerText = totalVotes;

                postTemp.querySelector(".topic-post-container").appendChild(pollStructureTemp);

                // Get and append the poll options
                $.each(data["poll"]["options"], function (index, poll) {

                    poll.voted = false;

                    var pollOptionTemp = document.getElementById("topic-poll-option").content.cloneNode(true);

                    if (data.poll.user_changes == true && (data.poll.user_vote != "null" || data.poll.user_vote != null)) {
                        pollOptionTemp.querySelector(".topic-poll-question").setAttribute("data-poll-id", poll.poll_id);
                        pollOptionTemp.querySelector(".topic-poll-question").setAttribute("data-id", poll.id);
                    }

                    pollOptionTemp.querySelector(".topic-poll-question").setAttribute("data-change", data.poll.user_changes);
                    pollOptionTemp.querySelector(".topic-poll-text").innerText = poll.text;
                    pollOptionTemp.querySelector(".topic-question-votes-small > span").innerText = poll.votes_count;
                    pollOptionTemp.querySelector(".fa-arrow-up").classList.add("icon-no-colour");
                    pollOptionTemp.querySelector(".fa-arrow-up").style.color = "rgba(0,0,0, 0.33) !important";

                    if (poll.id == data.poll.user_vote) {
                        pollOptionTemp.querySelector(".topic-poll-question").classList.add("user_vote");
                        pollOptionTemp.querySelector(".topic-poll-question").style.color = "white !important";
                        pollOptionTemp.querySelector(".fa-arrow-up").style.color = "white !important";
                        pollOptionTemp.querySelector(".fa-arrow-up").classList.remove("icon-no-colour");
                        poll.voted = true;
                    }

                    pollOptionTemp.querySelector(".topic-poll-question").setAttribute("data-voted", poll.voted);

                    var pollPercentage = (poll.votes_count / totalVotes) * 100;

                    pollOptionTemp.querySelector(".topic-question-background-progress").setAttribute("style", "width:" + pollPercentage + "%; background-color:" + self.colours.mobile_ok_colour_c4 + ";");

                    pollList.appendChild(pollOptionTemp);
                });
            }

            if (data.topic.poster_avatar == null || data.topic.poster_avatar == undefined || data.topic.poster_avatar == "") {
                data.topic.poster_avatar = "./img/gravatar.jpg";
            }
            postTemp.querySelector(".topic-profile-pic").src = data.topic.poster_avatar;
            postTemp.querySelector(".topic-link-subheader-hearts").innerText = post.likes;
            postTemp.querySelector(".topic-link-subheader-comments").innerText = data.topic.posts_count - 1;
            postTemp.querySelector(".topic-post-subscribe").setAttribute("data-id", data.topic.id);

            if (data.topic.is_subscribed == true) {
                postTemp.querySelector(".topic-post-subscribe > i ").classList.remove("icon-no-colour");
                postTemp.querySelector(".topic-post-subscribe > span ").innerText = i18next.t("Subscribed");
                postTemp.querySelector(".topic-post-subscribe").classList.add("topic-post-unsubscribe");
                postTemp.querySelector(".topic-post-subscribe").classList.remove("topic-post-subscribe");
            }

            postTemp.querySelector(".new-post").setAttribute("data-id", post.id);
            postTemp.querySelector(".new-post").setAttribute("data-topic-id", data.topic.id);
            postTemp.querySelector(".new-post").setAttribute("data-forum-id", data.topic.forum_id);
            postTemp.querySelector(".new-post").setAttribute("data-topic-name", encodeURIComponent(post.subject));
        } else {
            postTemp = document.getElementById("post-replies").content.cloneNode(true);
        }

        if (post.username == null || post.username == undefined || post.username == "") {
            post.username = i18next.t("Anonymous");
        }

        postTemp.querySelector(".topic-link-container").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d2, 66);
        postTemp.querySelector(".topic-post-footer-links").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d2, 66);

        if (self.isRecent(moment(post.updated))) {
            postTemp.querySelector(".topic-link-container").style.backgroundColor = self.convertHex(self.colours.mobile_alert_colour_b1, 66);

            if (post.is_topic_head)
                postTemp.querySelector(".topic-post-footer-links").style.backgroundColor = self.convertHex(self.colours.mobile_alert_colour_b1, 66);
        }

        postTemp.querySelector(".topic-post-container").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d2, 40);
        postTemp.querySelector(".topic-link-subheader-title").innerText = post.username;
        postTemp.querySelector(".topic-link-subheader-moment").innerText = moment(post.updated).fromNow() == i18next.t("a-few-seconds-ago") ? i18next.t("seconds-ago") : moment(post.updated).fromNow();
        postTemp.querySelector(".topic-link-subheader-hearts").innerText = post.likes;
        postTemp.querySelector(".topic-post-title").innerText = post.subject;
        postTemp.querySelector(".topic-post-content").innerHTML = post.content;
        postTemp.querySelector(".topic-post-like").setAttribute("data-id", post.id);
        postTemp.querySelector(".topic-link-subheader-hearts").setAttribute("data-id", post.id);

        // THIS WILL NEED TO BE UPDATED WHEN THE CORRECT SERVER FLAG ONCE IT'S AVAILABLE
        if (post.is_liked == true) {
            postTemp.querySelector(".topic-post-like > i ").classList.remove("icon-no-colour");
            postTemp.querySelector(".topic-post-like > span ").innerText = i18next.t("Liked");
            postTemp.querySelector(".topic-post-like").classList.add("topic-post-unlike");
            postTemp.querySelector(".topic-post-like").classList.remove("topic-post-like");
        }

        $("#topic-post-list").append(postTemp);
    });
};

MobileApp.prototype.populateSearchResults = function (id, query, data) {
    var self = this;

    var page = document.getElementById("post-page").content.cloneNode(true);
    page.querySelector(".topic-post-slug-link > span ").innerText = query;

    page.getElementById("topic-post-list").setAttribute("id", "topic-search-list");

    $(id).append(page);

    if (data.results.length <= 0) {
        self.appendMsg(id, i18next.t('no-results-found'));
    }

    $.each(data.results, function (index, post) {

        var postTemp = document.getElementById("post-replies").content.cloneNode(true);
        postTemp.querySelector("li").classList.add("topic-link-id");
        postTemp.querySelector("li").setAttribute("data-id", post.topic_id);

        if (post.username == null || post.username == undefined || post.username == "") {
            post.username = i18next.t("Anonymous");
        }

        postTemp.querySelector(".topic-link-container").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d2, 66);

        if (self.isRecent(moment(post.updated))) {
            postTemp.querySelector(".topic-link-container").style.backgroundColor = self.convertHex(self.colours.mobile_alert_colour_b1, 66);
        }

        postTemp.querySelector(".topic-post-container").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d2, 40);
        postTemp.querySelector(".topic-post-footer-links").style.backgroundColor = self.convertHex(self.colours.mobile_neutral_colour_d2, 66);
        postTemp.querySelector(".topic-link-subheader-title").innerText = post.username;
        postTemp.querySelector(".topic-link-subheader-moment").innerText = moment(post.updated).fromNow() == i18next.t("a-few-seconds-ago") ? i18next.t("seconds ago") : moment(post.updated).fromNow();
        postTemp.querySelector(".topic-link-subheader-hearts").innerText = post.likes;
        postTemp.querySelector(".topic-post-title").innerText = post.subject;
        postTemp.querySelector(".topic-post-content").innerHTML = post.content;
        postTemp.querySelector(".topic-post-like").setAttribute("data-id", post.id);
        postTemp.querySelector(".topic-link-subheader-hearts").setAttribute("data-id", post.id);

        // THIS WILL NEED TO BE UPDATED WHEN THE CORRECT SERVER FLAG ONCE IT'S AVAILABLE
        if (post.is_liked == true) {
            postTemp.querySelector(".topic-post-like > i ").classList.remove("icon-no-colour");
            postTemp.querySelector(".topic-post-like > span ").innerText = i18next.t("Liked");
            postTemp.querySelector(".topic-post-like").classList.add("topic-post-unlike");
            postTemp.querySelector(".topic-post-like").classList.remove("topic-post-like");
        }

        $("#topic-search-list").append(postTemp);
    });
};

MobileApp.prototype.sortUnreadTopicsList = function (id, topics) {
    var self = this;

    var topicArray = [];

    topics = JSON.parse(topics);

    // Check if the topics object is empty. We don't want to go further if it is.
    if (Object.keys(topics).length <= 0) {
        $(id).empty();
        self.appendMsg(id, i18next.t("You-have-no-unread-topics"));
        return false;
    }

    $("#forum-dropdown > span.circle-activity").css("display", "inline-block");
    $("#forum-dropdown > span.circle-activity").text(Object.keys(topics).length);

    var colour = self.convertHex(self.colours.mobile_neutral_colour_d2, 66);

    $.each(topics, function (i, topic) {
        var topicElem = {};

        var elemColour = colour;

        topicElem["title"] = topic.subject;


        if (topic.poster_avatar != null) {
            topicElem["image"] = topic.poster_avatar;
        } else {
            topicElem["image"] = "./img/gravatar.jpg";
        }

        topicElem["class"] = "topic-link-id fromDropdown text-color-d3";
        topicElem["id"] = topic.id;
        topicElem["subTitle"] = topic.poster_username;

        if (self.isRecent(moment(topic.updated))) {
            elemColour = self.convertHex(self.colours.mobile_alert_colour_b1, 75);
        }

        topicElem["bgColor"] = elemColour;

        topicElem["date"] = moment(topic.updated).fromNow() == i18next.t("a-few-seconds-ago") ? i18next.t("seconds-ago") : moment(topic.updated).fromNow();

        topicArray.push(topicElem);
    });

    self.createItemList(topicArray, $(id), colour);
};

MobileApp.prototype.searchForum = function (id, searchQuery) {
    var self = this;

    // clear the area
    $(id).empty();

    var query = encodeURIComponent(searchQuery);

    // append loading message
    self.appendMsg(id, "Searching for [" + searchQuery + "].");

    if (self.loadingForums == true) {
        return;
    }

    self.loadingForums = true;

    $.ajax({
        url: self.remoteHost + self.forumPostSearchURL + "?q=" + query + "/",
        type: 'GET',
        dataType: 'json',
        success:
            function (d) {

                self.loadingForums = false;

                $(id).empty();
                $("#forum-search-close-button").click();
                self.populateSearchResults(id, searchQuery, d);
            },
        error: function (e) {
            self.loadingForums = false;

            $(id).empty();
            self.appendMsg(id, i18next.t('could-not-load-search-results'));
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.getNewTopicFormV2 = function (element) {
    var self = this;

    var forumId = element.data("forum-id");
    var forumName = decodeURIComponent(element.data("forum-name"));
    var container = $("#forums-index");

    container.empty();

    var breadcrumb = $("<div/>").addClass('ui breadcrumb')
    breadcrumb.append($("<div/>").addClass("section back-to-forum").text(forumName))
    breadcrumb.append($("<div/>").addClass("divider").text("/"))
    breadcrumb.append($("<div/>").addClass("section active").text(i18next.t("new-discussion")))
    container.append(breadcrumb);

    var heading = $("<h3/>").text(i18next.t("Add-discussion-to-forum"))

    var form = $("<form/>").attr("action", self.remoteHost + self.forumTopicCreateURL + forumId + "/")
    form.attr("method", "post")
    form.attr("id", "newTopicFormV2")
    form.addClass("standard_form")
    form.append(
        $("<div/>").addClass("field_wrapper").append(
            $("<h4/>").addClass("field_name").text(i18next.t("Subject"))
        ).append(
            $("<div/>").addClass("inner_wrapper").append(
                $("<div/>").addClass("field text").append(
                    $("<input/>").attr("placeholder", i18next.t('Enter-your-subject-here')).attr("id", "subject").attr("required", "required").attr("name", "subject")
                )
            )
        )
    )
    form.append(
        $("<div/>").addClass("field_wrapper").append(
            $("<h4/>").addClass("field_name").text("Message")
        ).append(
            $("<div/>").addClass("inner_wrapper").append(
                $("<div/>").addClass("field textarea").append(
                    $("<textarea/>").attr("rows", "10").attr("placeholder", i18next.t("Enter-your-message-here")).attr("id", "content").attr("required", "required").attr("name", "content")
                )
            )
        )
    )
    form.append($("<input/>").attr("type", "hidden").attr("name", "enable_signature").attr("value", "on"))
    form.append($("<input/>").attr("type", "hidden").attr("name", "attachment-TOTAL_FORMS").attr("value", "0"))
    form.append($("<input/>").attr("type", "hidden").attr("name", "attachment-INITIAL_FORMS").attr("value", "0"))
    form.append($("<input/>").attr("type", "hidden").attr("name", "attachment-MIN_NUM_FORMS").attr("value", "0"))
    form.append($("<input/>").attr("type", "hidden").attr("name", "attachment-MAX_NUM_FORMS").attr("value", "15"))
    form.append(
        $("<div/>").addClass("buttons").append(
            $("<button/>").addClass("ui right floated button").attr("type", "submit").attr("name", "topicSubmitV2").attr("id", "topicSubmitV2").text("Post")
        )
    )
    container.append(heading)
    container.append(form)
};

MobileApp.prototype.getNewTopicForm = function (element) {
    var self = this;

    var forumId = element.data("forum-id");
    var forumName = decodeURIComponent(element.data("forum-name"));
    var container = $("#forum-content");

    container.empty();

    var formTemp = document.getElementById("new-topic-form").content.cloneNode(true);
    formTemp.querySelector(".topic-post-slug-link > span ").innerText = forumName;
    formTemp.getElementById("newTopicForm").action = self.remoteHost + self.forumTopicCreateURL + forumId + "/";

    container.append(formTemp);
};

MobileApp.prototype.getNewPostFormV2 = function (element) {
    var self = this;

    var forumId = element.data("forum-id");
    var topicId = element.data("topic-id");
    var id = element.data("id");
    var topicName = decodeURIComponent(element.data("topic-name"));
    var container = $(element.data("container-id"));

    var form = $("<form/>").attr("action", self.remoteHost + self.forumPostCreateURL + forumId + "/" + topicId + "/")
    form.attr("method", "post")
    form.attr("id", "newPostFormV2")
    form.addClass("standard_form")
    form.append(
        $("<div/>").addClass("field_wrapper").append(
            $("<h4/>").addClass("field_name").text("Message")
        ).append(
            $("<div/>").addClass("inner_wrapper").append(
                $("<div/>").addClass("field textarea").append(
                    $("<textarea/>").attr("rows", "8").attr("placeholder", i18next.t("Enter-your-message-here")).attr("id", "content").attr("required", "required").attr("name", "content").addClass('summernote-container')
                )
            )
        )
    )
    form.append($("<input/>").attr("type", "hidden").attr("name", "subject").attr("id", "subject").attr("value", "Re: " + topicName))
    form.append($("<input/>").attr("type", "hidden").attr("name", "enable_signature").attr("value", "on"))
    form.append($("<input/>").attr("type", "hidden").attr("name", "attachment-0-comment").attr("value", ""))
    form.append($("<input/>").attr("type", "hidden").attr("name", "attachment-0-file").attr("value", ""))
    form.append($("<input/>").attr("type", "hidden").attr("name", "attachment-0-id").attr("value", ""))
    form.append($("<input/>").attr("type", "hidden").attr("name", "attachment-TOTAL_FORMS").attr("value", "0"))
    form.append($("<input/>").attr("type", "hidden").attr("name", "attachment-INITIAL_FORMS").attr("value", "0"))
    form.append($("<input/>").attr("type", "hidden").attr("name", "attachment-MIN_NUM_FORMS").attr("value", "0"))
    form.append($("<input/>").attr("type", "hidden").attr("name", "attachment-MAX_NUM_FORMS").attr("value", "15"))
    form.append(
        $("<div/>").addClass("buttons").append(
            $("<button/>").addClass("ui right floated button").attr("type", "submit").attr("name", "postSubmitV2").attr("id", "postSubmitV2").attr("data-container-id", element.data("container-id")).append($("<i/>").addClass("comment icon")).append(i18next.t("Post-reply"))
        )
    )
    container.append(form)
    document.emojiType = 'unicode';
    $('.summernote-container').summernote({
        placeholder: i18next.t("Enter-your-message-here"),
        tabsize: 2,
        minHeight: 100,
        toolbar: [
            ['insert', ['giphy', 'link', 'picture', 'video']],
            ['font', ['bold', 'underline', 'clear']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['view', ['fullscreen']],
        ],
        callbacks: {
            onImageUpload: async function(files) {
                var validImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/bmp"];
                if (validImageTypes.indexOf(files[0].type) > -1) {
                    var fileName = files[0].name;
                    var reader = new FileReader();
                    reader.readAsDataURL(files[0]);
                    reader.onload = event => {
                        var img = new Image();
                        img.src = event.target.result;
                        img.onload = () => {
                            var elem = document.createElement('canvas');
                            if (img.width > 500 ) {
                                var scaleFactor = 500 / img.width;
                                elem.width = 500;
                                elem.height = img.height * scaleFactor;
                                var ctx = elem.getContext('2d');
                                ctx.drawImage(img, 0, 0, 500, img.height * scaleFactor);
                            } else {
                                elem.width = img.width;
                                elem.height = img.height;
                                var ctx = elem.getContext('2d');
                                ctx.drawImage(img, 0, 0, img.width, img.height);
                            }
                            var base64img = elem.toDataURL()
                            var imgNode = $("<img>").attr("src", base64img);
                            $('.summernote-container').summernote('insertNode', imgNode[0]);
                        }
                    }
                } else {
                    navigator.notification.alert(i18next.t('format-of-the-file-youve-submitted'));
                }
            }
         }
    });
};

MobileApp.prototype.getNewPostForm = function (element) {
    var self = this;

    var forumId = element.data("forum-id");
    var topicId = element.data("topic-id");
    var id = element.data("id");
    var topicName = decodeURIComponent(element.data("topic-name"));
    var container = $("#forum-content");

    container.empty();

    var formTemp = document.getElementById("new-post-form").content.cloneNode(true);
    formTemp.querySelector(".topic-post-slug-link > span ").innerText = topicName;
    formTemp.querySelector("#subject").value = "Re: " + topicName;
    formTemp.getElementById("newPostForm").action = self.remoteHost + self.forumPostCreateURL + forumId + "/" + topicId + "/";

    container.append(formTemp);
};

MobileApp.prototype.postSubscribeV2 = function (id) {
    var self = this;

    $.ajax({
        url: self.remoteHost + self.forumPostSubscribeURL + id + "/",
        type: 'POST',
        dataType: 'json',
        success:
            function (d) {
                self.getSubscriptionFeed("#forums-following");
            },
        error: function (e) {
            console.error(e);
            self.popupMsg(i18next.t('cant-subscribe-right-now'), self.colours.mobile_warning_colour_a1, "fa-exclamation");
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.postSubscribe = function (id) {
    var self = this;

    var element = $(".topic-post-subscribe[data-id=" + id + "]");

    // Swap the pin icon out for a spinning loading icon
    element.children("i").removeClass("fa-thumb-tack");
    element.children("i").addClass("fa-circle-o-notch").addClass("fa-spin");

    $.ajax({
        url: self.remoteHost + self.forumPostSubscribeURL + id + "/",
        type: 'POST',
        dataType: 'json',
        success:
            function (d) {

                element.children("i").addClass("fa-thumb-tack");
                element.children("i").removeClass("fa-circle-o-notch").removeClass("fa-spin");
                element.children("i").removeClass("icon-no-colour");
                element.children("span").text("Subscribed");
                element.addClass("topic-post-unsubscribe");
                element.removeClass("topic-post-subscribe");

            },
        error: function (e) {
            console.error(e);
            self.popupMsg(i18next.t('cant-subscribe-right-now'), self.colours.mobile_warning_colour_a1, "fa-exclamation");

            // Set the thumb tack icon back and remove the spinning notch
            element.children("i").addClass("fa-thumb-tack");
            element.children("i").removeClass("fa-circle-o-notch").removeClass("fa-spin");
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.postUnsubscribeV2 = function (id) {
    var self = this;
    
    $.ajax({
        url: self.remoteHost + self.forumPostUnsubscribeURL + id + "/",
        type: 'POST',
        dataType: 'json',
        success: function (d) {
                self.getSubscriptionFeed("#forums-following");
            },
        error: function (e) {
            console.error(e);
            self.popupMsg(i18next.t('cant-unsubscribe-right-now'), self.colours.mobile_warning_colour_a1, "fa-exclamation");
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.postUnsubscribe = function (id) {
    var self = this;

    var element = $(".topic-post-unsubscribe[data-id=" + id + "]");

    // Swap the pin icon out for a spinning loading icon
    element.children("i").removeClass("fa-thumb-tack");
    element.children("i").addClass("fa-circle-o-notch").addClass("fa-spin");

    $.ajax({
        url: self.remoteHost + self.forumPostUnsubscribeURL + id + "/",
        type: 'POST',
        dataType: 'json',
        success:
            function (d) {

                element.children("i").addClass("fa-thumb-tack");
                element.children("i").removeClass("fa-circle-o-notch").removeClass("fa-spin");

                element.children("i").addClass("icon-no-colour");
                element.children("span").text("Subscribe");
                element.addClass("topic-post-subscribe");
                element.removeClass("topic-post-unsubscribe");

            },
        error: function (e) {
            console.error(e);
            self.popupMsg(i18next.t('cant-unsubscribe-right-now'), self.colours.mobile_warning_colour_a1, "fa-exclamation");

            // Set the thumb tack icon back and remove the spinning notch
            element.children("i").addClass("fa-thumb-tack");
            element.children("i").removeClass("fa-circle-o-notch").removeClass("fa-spin");
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.postLike = function (id, url) {
    var self = this;

    var buttonElement = $(".button.like[data-id=" + id + "]");
    var element = $(".like-post[data-id=" + id + "]");
    var icon = element.children("i");
    // Swap the pin icon out for a spinning loading icon
    icon.removeClass("fa-heart");
    icon.addClass("fa-circle-o-notch").addClass("fa-spin");

    $.ajax({
        url: self.remoteHost + url + id + "/",
        type: 'POST',
        dataType: 'json',
        success:
            function (d) {
                
                var val = element.children("span");
                icon.addClass("fa-heart");
                icon.removeClass("fa-circle-o-notch").removeClass("fa-spin");
                icon.removeClass("icon-no-colour");
                element.addClass("unlike-post");
                element.removeClass("like-post");
                var plusOne = parseInt(val.text()) + 1;
                val.text(plusOne);

                buttonElement.addClass("unlike");
                buttonElement.removeClass("like");
                buttonElement.children("span").text("Liked");
            },
        error: function (e) {
            console.error(e);
            self.popupMsg(i18next.t('cant-like-right-now') , self.colours.mobile_warning_colour_a1, "fa-exclamation");

            // Set the thumb tack icon back and remove the spinning notch
            icon.addClass("fa-heart");
            icon.removeClass("fa-circle-o-notch").removeClass("fa-spin");

        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.postUnlike = function (id, url) {
    var self = this;

    var buttonElement = $(".button.unlike[data-id=" + id + "]");
    var element = $(".unlike-post[data-id=" + id + "]");
    var icon = element.children("i");

    // Swap the pin icon out for a spinning loading icon
    icon.removeClass("fa-heart");
    icon.addClass("fa-circle-o-notch").addClass("fa-spin");

    $.ajax({
        url: self.remoteHost + url + id + "/",
        type: 'POST',
        dataType: 'json',
        success:
            function (d) {
                var val = element.children("span");
                icon.addClass("fa-heart");
                icon.removeClass("fa-circle-o-notch").removeClass("fa-spin");
                icon.addClass("icon-no-colour");
                element.addClass("like-post");
                element.removeClass("unlike-post");
                var minusOne = parseInt(val.text()) - 1;
                if (isNaN(minusOne)) {
                    minusOne = 0;
                }
                val.text(minusOne);

                buttonElement.addClass("like");
                buttonElement.removeClass("unlike");
                buttonElement.children("span").text(i18next.t("Like"));
            },
        error: function (e) {
            console.error(e);
            self.popupMsg(i18next.t('cant-unlike-right-now'), self.colours.mobile_warning_colour_a1, "fa-exclamation");

            // Set the thumb tack icon back and remove the spinning notch
            icon.addClass("fa-heart");
            icon.removeClass("fa-circle-o-notch").removeClass("fa-spin");
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.pollVote = function (id, pollId, url, max_options, type = "vote", callback) {
    var self = this;

    var element = $(".topic-poll-question[data-id=" + id + "]");

    // Swap the pin icon out for a spinning loading icon
    element.children("i").removeClass("fa-arrow-up");
    element.children("i").addClass("fa-circle-o-notch");

    function successfullyVoted(id) {

        if (parseInt(max_options) == 1) {
            $(".user_vote").each(function (index) {
                var unvoteId = $(this).data("id");
                successfullyRemovedVote(unvoteId);
            });
        }

        var voteElem = $(".topic-poll-question[data-id=" + id + "]");

        voteElem.addClass("user_vote");
        voteElem.children("i").addClass("fa-arrow-up");
        voteElem.children("i").removeClass("fa-circle-o-notch").removeClass("icon-no-colour");
        voteElem.children("div").css("color", "white");

        var votes_count = parseInt(voteElem.find("span").text().split(" ")[0]) + 1;

        voteElem.find("span").text(votes_count);
        if (votes_count == 1) {
            voteElem.find("span").append(' vote');
        } else {
            voteElem.find("span").append(' votes');
        }

        voteElem.find(".topic-question-votes-small > span").text(votes_count);

        var mainContainer = $(".topic-question-container[data-id=" + pollId + "]");
        var totalVotes = parseInt(mainContainer.find(".topic-poll-count > span").text()) + 1;
        mainContainer.find(".topic-poll-count > span").text(totalVotes);

        self.recalculatePoll(id, pollId);
    }

    function successfullyRemovedVote(id) {

        var voteElem = $(".topic-poll-question[data-id=" + id + "]");

        voteElem.removeClass("user_vote");
        voteElem.children("i").addClass("fa-arrow-up");
        voteElem.children("i").removeClass("fa-circle-o-notch").addClass("icon-no-colour");
        voteElem.children("div").css("color", "rgba(255, 255, 255, 0.66)");

        var votes_count = parseInt(voteElem.find("span").text().split(" ")[0]) - 1;

        voteElem.find("span").text(votes_count);
        if (votes_count == 1) {
            voteElem.find("span").append(' vote');
        } else {
            voteElem.find("span").append(' votes');
        }

        voteElem.find(".topic-question-votes-small > span").text(votes_count);

        var mainContainer = $(".topic-question-container[data-id=" + pollId + "]");
        var totalVotes = parseInt(mainContainer.find(".topic-poll-count > span").text()) - 1;
        mainContainer.find(".topic-poll-count > span").text(totalVotes);

        self.recalculatePoll(id, pollId);
    }

    function unsuccessful() {
        element.children("i").addClass("fa-arrow-up");
        element.children("i").removeClass("fa-circle-o-notch");

        self.recalculatePoll(id, pollId);
    }

    var form = new FormData();
    form.append("options", id);
    var pollUrl = self.remoteHost + url + pollId + "/";

    $.ajax({
        url: pollUrl,
        type: 'POST',
        contentType: false,
        mimeType: "multipart/form-data",
        data: form,
        processData: false,
        success: function (d) {
            if (type === "vote") {
                successfullyVoted(id);
            } else {
                successfullyRemovedVote(id);
            }

            // Callback with success
            if (callback && typeof callback == "function") {
                callback(i18next.t("Success"), d);
            }

        },
        error: function (e) {
            unsuccessful();

            // Callback with success
            if (callback && typeof callback == "function") {
                callback(i18next.t("Error"), e);
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.recalculatePoll = function (voteId, pollId) {

    var mainContainer = $(".topic-question-container[data-id=" + pollId + "]");
    var totalVotes = parseInt(mainContainer.find(".topic-poll-count > span").text());

    $(".topic-poll-question[data-poll-id=" + pollId + "]").each(function (index) {

        var votesContainer = $(this).find(".topic-question-votes-small > span");
        var votes = parseInt(votesContainer.text());

        var backgroundPercentageContainer = $(this).find(".topic-question-background-progress");

        var newPercentage = 0;

        if (votes != 0 && totalVotes != 0)
            newPercentage = (votes / totalVotes) * 100;

        backgroundPercentageContainer.css("width", newPercentage + "%");

    });
};

MobileApp.prototype.postForumForm = function (dataUrl, dataToSend, callback) {
    var self = this;

    $.ajax({
        url: dataUrl,
        type: 'POST',
        contentType: false,
        mimeType: "multipart/form-data",
        data: dataToSend,
        processData: false,
        success: function (data) {
            // Callback with success & data
            if (callback && typeof callback == "function") {
                callback(i18next.t("Success"), data);
            }
        },
        error: function (e) {
            // Callback with success & data
            if (callback && typeof callback == "function") {
                callback(i18next.t("Error"), e);
            }
        },
        beforeSend: self.setHeaders
    });
};
/* End of Forum Screen */

/* Start of Library Screen */
MobileApp.prototype.library = function () {
    var self = this;
    var newsEnabled = self.companySettings('news_enabled');
    var noticeboardEnabled = self.companySettings('branch_resources_enabled');
    // ----------------------- saved news -----------------------------
    if (newsEnabled) {
        $('#saved-news-container').empty();
        $('#saved-news-container').append($("<h2/>").addClass("ui middle center aligned header")
            .text(i18next.t("You-have-no-saved-news-items")));
        var savedNewsData = self.getStorageValue("savedNewsData", false);
        if (savedNewsData) {
            self.populateNewsList(savedNewsData, '#saved-news-container', self.noItemsMsg);
        }
        $.ajax({
            url: self.remoteHost + self.newsURL,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                data = $.grep(data, function(item, index) {
                    return item.extras.bookmarked;
                });
                localStorage.savedNewsData = JSON.stringify(data);
                self.populateNewsList(localStorage.savedNewsData, '#saved-news-container', self.noItemsMsg);
            },
            error: function () { },
            beforeSend: self.setHeaders
        });
    } else {
        listview = $('#saved-news-container');
        listview.empty();
        var your_message = i18next.t('Your-company-does-not-have-this-enabled-contact-yo');
        listview.append("<p>"+ your_message +"</p>");
    }
    // ----------------------- saved noticeboard items -----------------------------
    if (noticeboardEnabled) {
        $("#saved-documents-container").empty();
        var accordionItemTemp = document.getElementById("accordion-item").content.cloneNode(true);
        accordionItemTemp = $(accordionItemTemp);
        var label = i18next.t(self.labels.noticeboard_label_plural);
        var message = i18next.t('You-have-no-saved-$1', { $1: label});
        accordionItemTemp.find(".content")
            .addClass("saved-noticeboard")
            .append($("<h4/>")
            .addClass("ui center aligned header")
            .text(message));
        accordionItemTemp.find(".title .fourteen.wide.column")
            .append($("<h3/>")
            .text(i18next.t(self.labels.noticeboard_label_plural)));
        $("#saved-documents-container").append(
            $("<div/>").addClass("ui accordion").append(accordionItemTemp)
        );
        var savedNoticeboardData = self.getStorageValue("savedNoticeboardData", false);
        if (savedNoticeboardData) {
            self.sortNoticeboardItemsIntoCategories(savedNoticeboardData, function (categories) {
                self.populateNoticeboardCategories(categories, '#saved-documents-container .content.saved-noticeboard');
            });
        }
        $.ajax({
            url: self.remoteHost + self.noticeboardURL,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                data = $.grep(data, function(item, index) {
                    return item.extras.bookmarked;
                });
                localStorage.savedNoticeboardData = JSON.stringify(data);
                self.sortNoticeboardItemsIntoCategories(localStorage.savedNoticeboardData, function (categories) {
                    self.populateNoticeboardCategories(categories, '#saved-documents-container .content.saved-noticeboard');
                });
            },
            error: function () { },
            beforeSend: self.setHeaders
        });
    } else {
        listview = $('#saved-documents-container .content.saved-noticeboard');
        listview.empty();
        listview.append("<p>" + i18next.t('Your-company-does-not-have-this-enabled-contact-yo') + "</p>");
    }
    // ----------------------- module documents -----------------------------
    var accordionItemTemp = document.getElementById("accordion-item").content.cloneNode(true);
    accordionItemTemp = $(accordionItemTemp);
    accordionItemTemp.find(".content").addClass("saved-module-documents");
    accordionItemTemp.find(".title .fourteen.wide.column").append(
        $("<h3/>").text(i18next.t("Certificates-and-Module-PDFs"))
    );
    $("#saved-documents-container").append(
        $("<div/>").addClass("ui accordion").append(accordionItemTemp)
    );
    var savedNoticeboardData = self.getStorageValue("moduleDocumentsData", false);
    if (savedNoticeboardData) {
        self.populateModuleDocuments(
            JSON.parse(localStorage.moduleDocumentsData),
            '#saved-documents-container .content.saved-module-documents'
        );
    }
    $.ajax({
        url: self.remoteHost + self.moduleDocumentsURL,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            localStorage.moduleDocumentsData = JSON.stringify(data);
            self.populateModuleDocuments(data, '#saved-documents-container .content.saved-module-documents');
        },
        error: function () { },
        beforeSend: self.setHeaders
    });

    // initialize accordions
    $('.ui.accordion').accordion({
        "exclusive": false
    });
};

MobileApp.prototype.getLibraryFeed = function (callback) {
    var self = this;

    $.ajax({
        url: self.remoteHost + self.libraryURL,
        type: 'GET',
        dataType: 'json',
        success:
            function (data) {

                if (data.length == 0) {

                    // Callback with error
                    if (callback && typeof callback == "function") {
                        callback(i18next.t("Error"), i18next.t("There-are-no") + self.decapitalizeString(self.labels.library_label) + i18next.t("items-at-the-moment"));
                    }
                } else {
                    localStorage.libraryData = JSON.stringify(data);

                    // Callback with success & data
                    if (callback && typeof callback == "function") {
                        callback(i18next.t("Success"), localStorage.libraryData);
                    }
                }
            },
        error: function (e) {
            console.error(e);

            if (localStorage.libraryData) {

                // Callback with success & data
                if (callback && typeof callback == "function") {
                    callback(i18next.t("Success"), localStorage.libraryData);
                }
            } else {

                // Callback with success & data
                if (callback && typeof callback == "function") {
                    callback(i18next.t("Error"), i18next.t('could-not-load') + self.decapitalizeString(self.labels.library_label) + ". " +  i18next.t('Please-try-again-later'));
                }
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.populateLibraryPage = function (id, categories) {
    var self = this;

    $.each(categories, function (index, value) {

        var buttonTemp = document.getElementById("library-page-button").content.cloneNode(true);
        buttonTemp.querySelector(".button-container").setAttribute("data-action", "library-list");
        buttonTemp.querySelector(".button-container").setAttribute("data-list", value);

        var slug = value;

        if (self.typeToLabelPlural[slug]) {
            slug = self.labels[self.typeToLabelPlural[slug]];
        }

        buttonTemp.querySelector(".button-container").setAttribute("data-slug", slug);
        buttonTemp.querySelector(".button-text").innerText = self.capitalizeFirstLetter(slug);

        id.append(buttonTemp);
    });
};

MobileApp.prototype.populateLibraryList = function (list, slug) {
    var self = this;
    var id = $("#library-feed-content");
    id.empty();

    var listTemp = document.getElementById("library-page-structure").content.cloneNode(true);
    listTemp.querySelector(".library-slug-link > span").innerText = self.capitalizeFirstLetter(slug);
    id.append(listTemp);

    var ul = $("#library-list");

    self.appendMsg(ul, i18next.t("Loading") + self.capitalizeFirstLetter(slug) + i18next.t("Feed"));

    self.getLibraryFeed(function (status, data) {
        if (status == "Error") {
            ul.empty();
            self.appendMsg(ul, i18next.t('could-not-load-list'));
        } else if (status == "Success") {
            ul.empty();
            var data = self.getListByType(data, list);

            var items = [];
            var colour = self.convertHex(self.colours.mobile_neutral_colour_d1, 25);
            $.each(data, function (index, value) {

                var item = {};

                elemColour = colour;

                item["title"] = value.title;
                item["id"] = value.id;
                item["href"] = "#item-page";
                item["date"] = moment(value.keydate, "YYYY-MM-DD").format("DD-MM-YYYY");
                item["type"] = value.type;
                item["icon"] = self.getIcon(value.type);
                item["subTitle"] = value.type;
                item["class"] = "from-library";

                // If new
                if (self.isRecent(moment(value.keydate, "YYYY-MM-DD"))) {
                    elemColour = self.convertHex(self.colours.mobile_alert_colour_b1, 75);
                }

                item["bgColor"] = elemColour;

                items.push(item);
            });

            // Creating the list using the items array that has just been filled from the previous for loop
            self.createItemList(items, ul, colour);
        }
    });
};
/* End of Library Screen */

/* Start of Item Screen */
MobileApp.prototype.itemPageV2 = function (obj) {
    var self = this;
    var myToolbar = $('#item-page-V2 .white-toolbar');    // '.news-toolbar-tag';
    $(myToolbar).find('h1').empty();  // Empty the Toolbar
    $(myToolbar).find('h1').text(obj.type.charAt(0).toUpperCase() + obj.type.substr(1).toLowerCase());
    var itemPageTemp = $('#item-page-V2');
    itemPageTemp.find('.ui.grid.container').remove();

    if (obj.type == 'news') {
        $(".navbar-v2 .ui-btn-left.ui-link").attr("href", "#news-noticeboard-page");
        var newsTemp = $('#news-item-template-V2').html(); 
        var newsTemp = $(newsTemp);
        
        var imageContainer = newsTemp.find('.item-page-image-container');
        if (obj.thumbnail_url != '') {
            imageContainer.append( 
                $('<img/>').attr('src', obj.thumbnail_url).addClass('image medium').addClass('fluid').addClass('ui')
            );
        } else {
            imageContainer.parent().remove();
        }
        
        var blackBox = newsTemp.find('.item-page-card-black-box');
        blackBox.find('#item-card-author').text( i18next.t('Published-by') + ': ' + obj.published_by);
        blackBox.find('#item-card-date').text(obj.keydate);

        newsTemp.find('.item-page-content-title').text(obj.title);
        newsTemp.find('.item-page-content-description').html(i18next.t('Loading-content') + "...");

        self.getItemContent(obj.id, obj.type, function (status, data) {
            if (status == "Success") {
                newsTemp.find('.item-page-content-description').html(
                    data.replace("/media/resources/company/", self.remoteHost + "/media/resources/company/")
                );
                newsTemp.find('.item-page-content-description *').removeAttr("style");
                newsTemp.find('.button.post-comment').attr('data-article-id', obj.id);
                newsTemp.find('.form-container').css('display', 'block');
            } else if (status == "Error") {
                self.popupMsg(data, self.colours.mobile_warning_colour_a1, "fa-exclamation");
            }
        });
        itemPageTemp.append(newsTemp);
    }

    if (obj.type == 'noticeboard') {
        $(".navbar-v2 .ui-btn-left.ui-link").attr("href", "#news-noticeboard-page");
        $(myToolbar).find('h1').text(self.labels.noticeboard_label);
        if (obj.status == "overdue") {
             $(myToolbar).find('h1').append(
                $("<div/>").addClass("ui right aligned large horizontal overdue label").text(i18next.t("Overdue"))
            )
        }
        var noticeboardTemp = $('#noticeboard-item-template-V2').html(); 
        var noticeboardTemp = $(noticeboardTemp);

        noticeboardTemp.find('.item-page-content-title').text(obj.title);
        noticeboardTemp.find('.item-page-content-description').text(obj.description);

        var openButton = obj.buttons[0];
        noticeboardTemp.find(".column.open-attachment").append(
            $("<div/>").addClass("ui button")
            .text(openButton.text.charAt(0).toUpperCase() + openButton.text.substr(1).toLowerCase())
            .attr("data-id", openButton.id)
            .attr("data-action", openButton.action)
            .attr("data-type", openButton.type)
            .attr("data-signoff-required", obj.signoff_required)
            .attr("data-status", obj.status)
            .attr("data-signoff-datetime", obj.signoff_datetime)
            .attr("href", openButton.url)
        );
        var addToLibraryButton = obj.buttons[1];
        noticeboardTemp.find(".column.add-to-library").append(
            $("<div/>").addClass("ui button")
                .text(addToLibraryButton.text.charAt(0)
                .toUpperCase() + addToLibraryButton.text.substr(1)
                .toLowerCase())
                .attr("data-id", addToLibraryButton.id)
                .attr("data-action", addToLibraryButton.action)
                .attr("data-type", addToLibraryButton.type)
                .attr("data-version", 2)
                .attr("href", addToLibraryButton.url)
        );
        if (obj.signoff_required && obj.status == 'read') {
            if (!obj.signoff_datetime){
                var signOffButton = obj.buttons[2];
                noticeboardTemp.find(".row.nb-sign-off .column").html(
                    $("<div/>").addClass("inverted basic ui button")
                        .text(signOffButton.text.charAt(0).toUpperCase() + signOffButton.text.substr(1)
                        .toLowerCase())
                        .attr("data-id", signOffButton.id)
                        .attr("data-action", signOffButton.action)
                        .attr("data-type", signOffButton.type)
                );
            } else {
                noticeboardTemp.find(".row.nb-sign-off .column").html(i18next.t('Signed-off-on') + " " + obj.signoff_datetime);
            }
        }

        itemPageTemp.append(noticeboardTemp);
    }

    if (obj.type == "module") {
        $(myToolbar).find("h1").empty();
        $(myToolbar).find("h1").text(obj.title);
        
        var moduleTemp = $("#module-template-V2").html(); 
        moduleTemp = $(moduleTemp);

        moduleTemp.find(".column.icon .segment").append(
            $("<img/>").addClass("ui image").attr("src", obj.icon_url)            
        );
        moduleTemp.find(".column.status").append(
            $("<h3/>").text(obj.status)
        );
        if (obj.keydate == "due 31-12-9999") {
            var keydate = i18next.t("No-due-date");
        } else {
            var keydate = obj.keydate
        }
        moduleTemp.find(".column.due-date").append(
            $("<h3/>").text(keydate)
        );
        moduleTemp.find(".column.description").append(obj.description);
        if (obj.downloads.length > 0) {
            moduleTemp.find(".column.description").append($("<h4/>").text(i18next.t("Module-Downloads")))
            moduleTemp.find(".column.description").append($("<div/>").addClass("ui list"))
            $.each(obj.downloads, function(index, download) {
                moduleTemp.find(".column.description .ui.list").append(
                    $("<div/>").addClass("item").append(
                        $("<div/>").addClass("inverted basic compact ui button")
                            .attr("data-action", "module-download")
                            .attr("data-download-type", download.type)
                            .attr("data-href", (download.type == "module" ? self.remoteHost : "")  + download.url + "?access_code=" + localStorage.accessCode + "&cookie_consent=1" + (download.type == "module" ? "&mobile=1" : ""))
                            .text(download.name)
                    )
                );
            });
        }
        if (obj.status == "complete" || obj.status == "Pass") {
            moduleTemp.find(".column.description").append(
                $('<p/>').text(i18next.t('Please-note-you-will-not-be-able-to-re-sit-the-exa'))
            );
        }
        if (obj.prereq_satisfied != false) {
            $.each(obj.buttons, function(index, button) {
                moduleTemp.find(".row.actions").append(
                    $("<div/>").addClass("center aligned column").append(
                        $("<div/>").addClass("ui button")
                            .text(button.text.charAt(0).toUpperCase() + button.text.substr(1).toLowerCase())
                            .attr("data-id", button.id).attr("data-action", button.action)
                            .attr("data-type", button.type).attr("href", button.href).attr("data-src", button.url)
                    )
                );
            })
        } else {
            moduleTemp.find(".row.actions").append(
                $("<div/>").addClass("center aligned column").append(
                    $("<p/>")
                        .text(i18next.t('In-order-to-attempt-this-module-you-need-to-comple') + " " + obj.prerequisite_name + i18next.t("first") + ".")
                )
            );
        }

        itemPageTemp.append(moduleTemp);
    }

    if (obj.type == "workbook") {
        $(myToolbar).find("h1").empty();
        $(myToolbar).find("h1").text(obj.title);
        itemPageTemp.append($("<div/>").addClass("ui grid container workbook"));
        itemPageTemp.find(".container").append($("<div/>").addClass("sixteen wide column"));

        self.appendMsg("#item-page-V2 .container .column", i18next.t("Loading-workbook"));
        $.ajax({
            url: self.remoteHost + self.workbookURL + obj.id + '/',
            type: 'GET',
            dataType: 'html',
            success: function (data) {
                itemPageTemp.find(".container").empty();
                itemPageTemp.find(".container").append(data);
                $('#workbookSubmit').on('click', function (e) {
                    e.preventDefault();
                    var formData = new FormData($('#workbookForm')[0])
                    $.ajax({
                        url: self.remoteHost + self.workbookURL + obj.id + '/',
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            navigator.notification.alert(i18next.t('Trainee-notes-successfully-saved'));
                        },
                        error: function (error) {
                            navigator.notification.alert(i18next.t('Error-trainee-notes-not-saved'));
                        },
                        beforeSend: self.setHeaders
                    });
                    parent.history.back();
                });
            },
            error: function (error) {
                itemPageTemp.find('.container .sixteen.wide.column').empty();
                self.appendMsg("#item-page-V2 .container .column", i18next.t("This-workbook-could-not-be-found"));
            },
            beforeSend: self.setHeaders
        });
    }

    if (obj.type == "appraisal") {
        $(myToolbar).find("h1").empty();
        $(myToolbar).find("h1").text(obj.title);
        itemPageTemp.append($("<div/>").addClass("ui grid container appraisal"));
        itemPageTemp.find(".container").append($("<div/>").addClass("sixteen wide column"));
        self.appendMsg("#item-page-V2 .container .column", i18next.t("Loading-appraisal"));
        $.ajax({
            url: self.remoteHost + self.appraisalURL + obj.id + '/',
            type: 'GET',
            dataType: 'html',
            success: function (data) {
                itemPageTemp.find(".container").empty();
                itemPageTemp.find(".container").append(data);

                $('#appraisalSubmit').on('click', function (e) {
                    e.preventDefault();
                    $.ajax({
                        url: self.remoteHost + self.appraisalURL + obj.id + '/',
                        type: 'POST',
                        data: $('#appraisalForm').serialize(),
                        dataType: 'json',
                        success: function (data) {
                            navigator.notification.alert(i18next.t('Trainee-notes-successfully-saved'));
                        },
                        error: function (error) {
                            navigator.notification.alert(i18next.t('Error-trainee-notes-not-saved'));
                        },
                        beforeSend: self.setHeaders
                    });
                });
            },
            error: function (error) {
                $('#itempage .content').empty();
                self.populateItemPage(title, "<p>" +  i18next.t('This-appraisal-could-not-be-found') + "</p>");
            },
            beforeSend: self.setHeaders
        });
    }

    if (obj.type == "external training") {
        $(myToolbar).find("h1").empty();
        $(myToolbar).find("h1").text(obj.title);

        var externalTrainingTemp = $("#external-training-template-V2").html(); 
        externalTrainingTemp = $(externalTrainingTemp);
        externalTrainingTemp.find(".column.status").append(
            $("<h3/>").text(obj.status)
        );
        if (obj.keydate == "due 31-12-9999") {
            var keydate = i18next.t("No-due-date");
        } else {
            var keydate = obj.keydate
        }
        externalTrainingTemp.find(".column.due-date").append(
            $("<h3/>").text(keydate)
        );
        externalTrainingTemp.find(".column.description").append(obj.content);

        $.each(obj.buttons, function(index, button) {
            externalTrainingTemp.find(".row.actions").append(
                $("<div/>").addClass("center aligned column").append(
                    $("<div/>").addClass("ui button").text(button.text.charAt(0).toUpperCase() + button.text.substr(1)
                        .toLowerCase())
                        .attr("data-id", button.id)
                        .attr("data-action", button.action)
                        .attr("data-type", button.type)
                        .attr("href", button.url)
                )            
            );
        })

        if (self.companySettings('training_calendar_enabled') && obj.next_session) {
            var session = obj.next_session
            if (session.attendance == "confirmed") {
                externalTrainingTemp.find(".column.next-session").append($("<h4/>").text(i18next.t("You-are-booked-on-the-following-session")))
            } else if (session.attendance == "invited") {
                externalTrainingTemp.find(".column.next-session").append($("<h4/>").text(i18next.t("You-have-been-invited-to-attend-the-following-sess")));
            } else if (session.attendance == "cancelled") {
                externalTrainingTemp.find(".column.next-session").append($("<h4/>").text(
                    i18next.t("You-have-cancelled-your-attendance-to-the-followin")
                ))
            } else if (session.attendance == "declined") {
                externalTrainingTemp.find(".column.next-session").append($("<h4/>").text(
                    i18next.t("You-have-declined-the-invitation-to-attend-the-fol")
                ))
            } else if (session.attendance == "refused") {
                externalTrainingTemp.find(".column.next-session").append($("<h4/>").text(
                    i18next.t("You-have-been-refused-attendance-to-the-following")
                ))
            } else if (session.attendance == "available") {
                if (session.training_type == "public") {
                    externalTrainingTemp.find(".column.next-session").append($("<h4/>").text(
                        i18next.t("Next-available-session")
                    ))
                } else {
                    externalTrainingTemp.find(".column.next-session").append($("<h4/>").text(
                        i18next.t("There-is-a-private-session-for-this-course-but-you")
                    ))
                }
            }
            if (session.training_type != "private" || (session.training_type == "private" && session.attendance != "available")) {
                externalTrainingTemp.find(".column.next-session").append(
                    $("<div/>").addClass("inverted basic fluid compact ui button")
                        .text(session.training_session_location + " - " + session.training_session_start_date)
                );
            }
        }

        itemPageTemp.append(externalTrainingTemp);
    }

    if (obj.type == "competence") {
        $(myToolbar).find("h1").empty();
        $(myToolbar).find("h1").text(obj.title);

        var competenceTemp = $("#competence-template-V2").html(); 
        competenceTemp = $(competenceTemp);
        competenceTemp.find(".column.status").append(
            $("<h3/>").text(obj.status)
        );
        if (obj.keydate == "due 31-12-9999") {
            var keydate = i18next.t("No-due-date");
        } else {
            var keydate = obj.keydate
        }
        competenceTemp.find(".column.due-date").append(
            $("<h3/>").text(keydate)
        );
        competenceTemp.find(".column.description").append(obj.content);

        if (obj.attachments.length > 0) {
            competenceTemp.find(".column.attachments").append($("<h4/>").text(i18next.t("Supporting-Documents")))
            competenceTemp.find(".column.attachments").append($("<div/>").addClass("ui list"))
            $.each(obj.attachments, function(index, attachment) {
                competenceTemp.find(".column.attachments .ui.list").append(
                    $("<div/>").addClass("item").append(
                        $("<div/>").addClass("inverted basic compact ui button")
                            .attr("data-action", "open-external")
                            .attr("href", self.remoteHost  + attachment.attachment_url + "?access_code=" + localStorage.accessCode).text(attachment.attachment_filename)
                    )
                );
            });
        }

        itemPageTemp.append(competenceTemp);
    }

    if (obj.type == "training session") {
        $(myToolbar).find("h1").empty();
        $(myToolbar).find("h1").text(obj.course);

        var trainingSessionTemp = $("#training-session-template-V2").html(); 
        trainingSessionTemp = $(trainingSessionTemp);

        //trainingSessionTemp.find(".course .nine.column").text(obj.course);
        trainingSessionTemp.find(".course_description").text(obj.description);
        trainingSessionTemp.find(".address").text(obj.address);
        trainingSessionTemp.find(".city").text(obj.city);
        trainingSessionTemp.find(".post-code").text(obj.post_code);
        trainingSessionTemp.find(".start-date").text(moment(obj.start_date, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS).format("DD-MM-YYYY HH:mm"));
        trainingSessionTemp.find(".end-date").text(moment(obj.end_date, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS).format("DD-MM-YYYY HH:mm"));
        trainingSessionTemp.find(".available-places").text(obj.available_places);
        trainingSessionTemp.find(".session-admin").text(obj.session_administrator);
        // 
        trainingSessionTemp.find(".session-administrator").text(i18next.t('session-administrator'));
        trainingSessionTemp.find(".notes-h4").text(i18next.t('Notes'));
        trainingSessionTemp.find(".instructions-h4").text(i18next.t('Instructions'));
        trainingSessionTemp.find(".places-h4").text(i18next.t('Places'));
        trainingSessionTemp.find(".starts-h4").text(i18next.t('Starts'));
        trainingSessionTemp.find(".ends-h4").text(i18next.t('Ends'));
        trainingSessionTemp.find(".location-h4").text(i18next.t('Location'));
        if(obj.online_session_link){
            trainingSessionTemp.find(".location-h4").text(i18next.t('Session Link'));
            trainingSessionTemp.find(".location").append($("<a/>").click(function(){
                window.open(obj.online_session_link, "_system", "location=yes,enableViewportScale=yes,hidden=no");
            }).text(obj.location));
            trainingSessionTemp.find(".map iframe").remove();
        }
        if (obj.notes != "") {
            trainingSessionTemp.find(".notes .details").html(obj.notes);
        } else {
            trainingSessionTemp.find(".notes").remove();
        }
        if (obj.document_url != "") {
            trainingSessionTemp.find(".instructions .details").append(
                $("<div/>").addClass("inverted basic compact ui button")
                    .attr("data-action", "open-external").attr("href", obj.document_url)
                    .text(i18next.t("Open Document"))
            )
        } else {
            trainingSessionTemp.find(".instructions").remove();
        }
        trainingSessionTemp.find(".map iframe").attr("src", "https://maps.google.co.uk/maps?q=" + obj.post_code + "&output=embed");

        if (obj.status == "refused") {
            trainingSessionTemp.find(".action .column").append($("<p/>")
                .text(i18next.t("you-have-been-refused-attendance-to-this-session")))
            trainingSessionTemp.find(".action .column").append($("<p/>").text(obj.refusal_reason))
            trainingSessionTemp.find(".action .column").append($("<p/>")
                .text(i18next.t("Please-contact-your-Training-Manager-for-more-info")))
        } else {
            if (moment([]).diff(moment(obj.start_date, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)) < 0) {
                if (obj.available_places <= 0 && obj.status != "confirmed") {
                    if (obj.status == "reserved") {
                        trainingSessionTemp.find(".action .column")
                            .append(i18next.t("You-are-currently-on-the-wating-list-for-this-sess"));
                    } else {
                        trainingSessionTemp.find(".action .column")
                            .append(i18next.t("There-are-no-more-available-spaces-on-this-session"));
                    }
                } else {
                    if (obj.status == "confirmed" || obj.status == "chosen") {
                        trainingSessionTemp.find(".action .column").append(
                            $("<div/>").attr("data-action", "cancel-training")
                                .attr("data-id", obj.booking_id).addClass("ui button").text(i18next.t('Cancel-Booking'))
                        );
                    } else {
                        if (obj.status == "invited") {
                            trainingSessionTemp.find(".action .column").append(
                                $("<div/>").attr("data-action", "accept-training")
                                    .attr("data-id", obj.booking_id).addClass("ui button").text(i18next.t(""))
                            );
                            trainingSessionTemp.find(".action .column").append(
                                $("<div/>").attr("data-action", "decline-training")
                                    .attr("data-id", obj.booking_id).addClass("ui button").text(i18next.t("Decline-Attendance"))
                            );
                        } else {
                            trainingSessionTemp.find(".action .column").append(
                                $("<div/>")
                                    .attr("data-action", "book-training")
                                    .attr("data-id", obj.id).addClass("ui button").text(i18next.t("Book-Training"))
                            );
                        }
                    }
                }
            } 
        }

        itemPageTemp.append(trainingSessionTemp);
    }

}

MobileApp.prototype.itemPage = function (obj) {
    var self = this;

    var contentArea, contentType, headerTemp, itemTemp;

    pageContainer = ".item-page-container"; // The container this page content will be appended to
    $(pageContainer).empty(); // Empty the container

    $(pageContainer).attr("data-item-id", obj.id);

    itemTemp = document.getElementById("item-page-content-area").content.cloneNode(true);

    var headerTitle = itemTemp.querySelector(".item-header-title");
    headerTemp = document.getElementById("item-header-without-subtitle-template").content.cloneNode(true);
    headerTemp.querySelector(".item-title").innerText = obj.title;
    headerTitle.appendChild(headerTemp);
    /* End of Header Title */

    /** Header Image or Icon
        If the objsct has the img key then the header circle will display the image
        else the header circle will display the object's icon
     **/
    if (obj["img"]) {
        itemTemp.querySelector(".item-header-image").src = obj["img"];
        itemTemp.querySelector(".item-header-icon-large").style.display = "none";
    } else if (obj["icon"]) {
        itemTemp.querySelector(".item-header-icon-large").classList.add(obj["icon"]);
        itemTemp.querySelector(".item-header-image").style.display = "none";
    }
    /* End of Header Icon or Image */

    /** Header Info
        If the info key is set to true then the icon and type are set
        The date is also moved to the right of the parent container
        else the info element is fully removed
     **/
    if (obj["info"] === true) {

        itemTemp.querySelector(".item-header-icon-small").classList.add(obj["icon"]);

        var typeText = obj.type;

        if (self.typeToLabel[typeText])
            typeText = self.decapitalizeString(self.labels[self.typeToLabel[typeText]]);

        itemTemp.querySelector(".item-header-icon-text").innerText = typeText;
        itemTemp.querySelector(".item-header-date").style.float = "right";
    } else {
        var headerInfo = itemTemp.querySelector(".item-header-info");
        headerInfo.parentNode.removeChild(headerInfo);
    }
    /* End of Header Info */

    // The key date is added
    var infoBg = self.convertHex(self.colours.mobile_neutral_colour_d1, 33);
    if (obj.hasOwnProperty("infoBg"))
        infoBg = obj.infoBg;

    var infoTextColor = "white";
    if (obj.hasOwnProperty("infoTextColor"))
        infoTextColor = obj.infoTextColor;

    itemTemp.querySelector(".item-header-date").innerText = obj.keydate;
    itemTemp.querySelector(".item-header-date").style.backgroundColor = infoBg;
    itemTemp.querySelector(".item-header-date").style.color = infoTextColor;

    // If key date is empty then remove it from the DOM
    if (obj.keydate == "" || obj.keydate == "invalid date") {
        var itemHeaderDate = itemTemp.querySelector(".item-header-date");
        itemHeaderDate.parentNode.removeChild(itemHeaderDate);
    }

    /* Content Area Setup
     If there are no buttons for the item then the larger content area will be added
     else the smaller content area will be added to make room for the buttons */
    if (!obj.hasOwnProperty("buttons") || obj["buttons"].length == 0) {
        itemTemp.querySelector("#fixedpage-item-content-area").classList.add("fixedpage-item-content-area-no-footer");
    } else {
        itemTemp.querySelector("#fixedpage-item-content-area").classList.add("fixedpage-item-content-area");
    }

    // Checking if the content needs to be fetched from the server or not. In this case the content is just added automatically    
    if (obj["content"] != "External") {
        itemTemp.querySelector("#fixedpage-item-content-area").innerHTML = obj.content;
    }
    /* End of Content Area Setup */

    // This item has buttons so we'll run through and add them all to the footer
    if (obj["buttons"] && obj["buttons"].length > 0) {

        if (obj["overlay"]) {
            var overlayTemp = document.getElementById("item-footer-overlay").content.cloneNode(true);
            overlayTemp.querySelector(".item-footer-header-box").innerText = obj.keydate;
            itemTemp.querySelector("#item-footer-overlay-container").appendChild(overlayTemp);
        }

        // Loop through all the buttons on the object
        $.each(obj.buttons, function (key, button) {
            var buttonTemp = document.getElementById("item-page-button").content.cloneNode(true);
            buttonTemp.querySelector(".item-button-text").innerText = button.text;
            buttonTemp.querySelector(".item-footer-button-container").setAttribute("data-id", button.id);
            buttonTemp.querySelector(".item-footer-button-container").setAttribute("data-action", button.action);
            buttonTemp.querySelector(".item-footer-button-container").setAttribute("data-type", button.type);

            if (button["url"])
                buttonTemp.querySelector(".item-footer-button-container").setAttribute("href", button.url);

            if (!button["backgroundColor"]) {
                buttonTemp.querySelector(".item-button-background-color").classList.add("default-transparant-background-color");
            } else {
                buttonTemp.querySelector(".item-button-background-color").style.backgroundColor = button.backgroundColor;
            }

            if (!button["overlay"]) {
                itemTemp.querySelector(".fixedpage-item-footer").appendChild(buttonTemp);
            } else {
                itemTemp.querySelector(".fixedpage-item-overlay").appendChild(buttonTemp);
            }
        });

        if (obj["overlay"]) {
            itemTemp.querySelector(".fixedpage-item-footer").classList.add("hide");
        }
    }

    /** Adding the base URL to he beginning of href elements so
        things like images and videos load correctly in the content area
     **/
    self.originalBase = $('base').attr('href');
    $('base').attr('href', self.remoteHost);
    /* End of Adding base URL */

    $(pageContainer).append(itemTemp);

    /* If the content is external then it needs to be fetched from the server */
    if (obj["content"] === "External") {

        var contentArea = "#fixedpage-item-content-area";

        self.appendMsg(contentArea, i18next.t("Loading-Item-Content"));

        self.getItemContent(obj.id, obj.type, function (status, data) {
            $(contentArea).empty();

            if (status == "Success") {
                /** Adding the base URL to he beginning of href elements so
                    things like images and videos load correctly in the content area
                 **/
                self.originalBase = $('base').attr('href');
                $('base').attr('href', self.remoteHost);

                $(contentArea).append(data);
            } else if (status == "Error") {
                self.appendMsg(contentArea, data);
            }

        });
    }
};

MobileApp.prototype.getNewsItemPageObj = function (obj) {
    var self = this;

    var subTitle = obj.type;
    var description = obj.description;

    if (description == "")
        description = i18next.t("No-description-available");

    var buttons = [];
    var bookmarked = obj.extras.bookmarked;

    if (bookmarked) {
        var remove_from_library = i18next.t('remove-from-my-library');
        buttons.push({
            "text": remove_from_library,
            "action": "library-remove",
            "type": obj.type,
            "id": obj.id
        });
    } else {
        var add_from_library = i18next.t('add-to-my-library');
        buttons.push({
            "text": add_from_library,
            "action": "library-add",
            "type": obj.type,
            "id": obj.id
        });
    }

    return {
        "id": obj.id,
        "status": obj.status,
        "url": obj.url,
        "icon": self.getIcon(obj.type),
        "info": false,
        "title": self.capitalizeFirstLetter(obj.title),
        "subTitle": subTitle,
        "type": obj.type,
        "description": description,
        "content": "External",
        "keydate": moment(obj.keydate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        "bookmarked": bookmarked,
        "buttons": buttons,
        "thumbnail_url": obj.extras.thumbnail_url,
        "published_by": obj.extras.published_by,
        "extras_content": obj.extras.content
    };
};

MobileApp.prototype.getNoticeboardItemPageObj = function (obj) {
    var self = this;

    var subTitle = obj.type;
    var description = obj.description;

    if (description == "")
        description = i18next.t("No-description-available");

    var buttons = [];
    var bookmarked = obj.extras.bookmarked;
    var open_attachment = i18next.t("open-attachment");
    buttons.push({
        "text": open_attachment,
        "action": "open-external",
        "url": self.remoteHost + obj.url + "?access_code=" + localStorage.accessCode + "&cookie_consent=1",
        "id": obj.id,
        "type": obj.type
    });

    if (bookmarked) {
        var remove_from_library = i18next.t('remove-from-library');
        buttons.push({
            "text": remove_from_library,
            "action": "library-remove",
            "type": "resource",
            "id": obj.id
        });
    } else {
        var add_from_library = i18next.t('add-to-my-library');
        buttons.push({
            "text": add_from_library,
            "action": "library-add",
            "type": "resource",
            "id": obj.id
        });
    }

    if (obj.extras.signoff_required) {
        var sign_off = i18next.t("sign-off");
        buttons.push({
            "text": sign_off,
            "action": "nb-sign-off",
            "type": "resource",
            "id": obj.id
        });
    }


    return {
        "id": obj.id,
        "status": obj.status,
        "url": obj.url,
        "icon": self.getIcon(obj.type),
        "info": false,
        "title": self.capitalizeFirstLetter(obj.title),
        "subTitle": subTitle,
        "type": obj.type,
        "description": description,
        "content": description,
        "keydate": moment(obj.keydate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        "bookmarked": bookmarked,
        "buttons": buttons,
        "signoff_required": obj.extras.signoff_required,
        "signoff_datetime": obj.extras.signoff_datetime

    };
};

MobileApp.prototype.getExternalTrainingItemPageObj = function (obj) {
    var self = this;

    var description = obj.description;
    if (description == "")
        description = i18next.t("No-description-available");

    var keyDate = "";

    if (obj.keydate != "")
        keyDate = i18next.t("due") + " " + moment(obj.keydate, "YYYY-MM-DD").format("DD-MM-YYYY");

    if (obj.status == "complete")
        keyDate = "complete";

    var buttons = [];
    var handout = obj.extras.document_url;
    var content = description;
    var Provider = i18next.t("Provider");
    var Training = i18next.t("Training");

    if (obj.extras.provider != "" && obj.extras.provider != null)
        content += "<div><b>" + Provider + ":</b> " + obj.extras.provider + "</div>";

    if (obj.extras.training_time != "" && obj.extras.training_time != null)
        content += "<div><b>" + Training + " Time:</b> " + obj.extras.training_time + "</div>";

    if (obj.extras.training_type != "" && obj.extras.training_type != null)
        content += "<div><b>" + Training + " Type:</b> " + obj.extras.training_type + "</div>";

    if (handout != "") {
        var handout_material = i18next.t('handout-material');
        buttons.push({
            "text": handout_material,
            "action": "open-external",
            "url": handout,
            "id": obj.id,
            "type": obj.type

        });
    }

    return {
        "id": obj.id,
        "status": obj.status,
        "url": obj.url,
        "icon": self.getIcon(obj.type),
        "info": true,
        "title": self.capitalizeFirstLetter(obj.title),
        "type": obj.type,
        "description": description,
        "content": content,
        "subTitle": "",
        "keydate": keyDate,
        "buttons": buttons,
        "next_session": obj.extras.next_session
    };
};

MobileApp.prototype.getTrainingSessionItemPageObj = function (obj) {
    var self = this;

    var description = obj.description;

    if (description == "")
        description = i18next.t("No-description-available");

    var buttons = [];
    var handout = obj.extras.document_url;
    var content = description;
    var overlay = false;

    var Location = i18next.t('Location');
    var Address = i18next.t('Address');
    var City = i18next.t('City');
    var Notes = i18next.t('Notes');
    var Post_Code = i18next.t('Post_Code');
    var Start_Date = i18next.t('Start_Date');
    var End_Date = i18next.t('End_Date');
    if (obj.extras.location != "" && obj.extras.location != null)
        content += "<div><b>" + Location + "</b> " + obj.extras.location + "</div>";

    if (obj.extras.address != "" && obj.extras.address != null)
        content += "<div><b>" + Address + "</b> " + obj.extras.address + "</div>";

    if (obj.extras.city != "" && obj.extras.city != null)
        content += "<div><b>" + City + "</b> " + obj.extras.city + "</div>";

    if (obj.extras.post_code != "" && obj.extras.post_code != null)
        content += "<div><b>" + Post_Code + "</b> " + obj.extras.post_code + "</div>";

    if (obj.extras.start_date != "" && obj.extras.start_date != null)
        content += "<div><b>" + Start_Date + "</b> " + moment(obj.extras.start_date, "YYYY-MM-DDThh:mm:ss").format("llll") + "</div>";

    if (obj.extras.end_date != "" && obj.extras.end_date != null)
        content += "<div><b>" + End_Date + "</b> " + moment(obj.extras.end_date, "YYYY-MM-DDThh:mm:ss").format("llll") + "</div>";

    if (obj.extras.notes != "" && obj.extras.location != null)
        content += "<div><b>" + Notes + "</b> " + obj.extras.notes + "</div>";

    if (obj.status == "invited") {
        var accept =  i18next.t('attendance')
        buttons.push({
            "text": accept,
            "action": "accept-training",
            "id": obj.id,
            "type": obj.type,
            "overlay": true,
            "backgroundColor": self.convertHex(self.colours.mobile_ok_colour_c4, 50)
        });
        var decline = i18next.t('decline');
        buttons.push({
            "text": decline,
            "action": "decline-training",
            "id": obj.id,
            "type": obj.type,
            "overlay": true,
            "backgroundColor": self.convertHex(self.colours.mobile_warning_colour_a1, 50)
        });
        var cancel_attendance = i18next.t('cancel-attendance');
        buttons.push({
            "text": cancel_attendance,
            "action": "cancel-training",
            "id": obj.id,
            "type": obj.type,
            "backgroundColor": self.convertHex(self.colours.mobile_warning_colour_a1, 50)
        });

        overlay = true;
    }

    if (obj.status == "available") {
        var request_to_book = i18next.t('request-to-book');
        buttons.push({
            "text": request_to_book,
            "action": "book-training",
            "id": obj.id,
            "type": obj.type,
            "overlay": true,
            "backgroundColor": self.convertHex(self.colours.mobile_ok_colour_c4, 50)
        });
        var cancel_attendance = i18next.t('cancel-attendance');
        buttons.push({
            "text": cancel_attendance,
            "action": "cancel-training",
            "id": obj.id,
            "type": obj.type,
            "backgroundColor": self.convertHex(self.colours.mobile_warning_colour_a1, 50)
        });

        overlay = true;
    }

    if (handout != "") {
        buttons.push({
            "text": "handout material",
            "action": "open-external",
            "url": handout,
            "id": obj.id,
            "type": obj.type
        });
    }

    if (obj.status == "confirmed") {
        var cancel_attendance = i18next.t('cancel-attendance');
        buttons.push({
            "text": cancel_attendance,
            "action": "cancel-training",
            "id": obj.id,
            "type": obj.type,
            "backgroundColor": self.convertHex(self.colours.mobile_warning_colour_a1, 50)
        });
    }

    return {
        "id": obj.id,
        "status": obj.status,
        "url": obj.url,
        "icon": self.getIcon(obj.type),
        "info": true,
        "title": self.capitalizeFirstLetter(obj.title),
        "type": obj.type,
        "description": description,
        "content": content,
        "subTitle": "",
        "keydate": i18next.t("due") + " " + moment(obj.keydate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        "overlay": overlay,
        "buttons": buttons
    };
};

MobileApp.prototype.getAppraisalItemPageObj = function (obj) {
    var self = this;

    var description = obj.description;

    var keyDate = "";

    if (obj.hasOwnProperty("due_date") && obj.due_date != "")
        keyDate = i18next.t("due") + " " + moment(obj.due_date, "YYYY-MM-DD").format("DD-MM-YYYY");

    if (obj.hasOwnProperty("keydate") && obj.keydate != "")
        keyDate = i18next.t("due") + " " + moment(obj.keydate, "YYYY-MM-DD").format("DD-MM-YYYY");

    if (description == "")
        description = i18next.t("No-description-available");

    return {
        "id": obj.id,
        "status": obj.status,
        "url": obj.url,
        "icon": self.getIcon(obj.type),
        "info": true,
        "title": self.capitalizeFirstLetter(obj.title),
        "type": obj.type,
        "description": description,
        "content": "External",
        "keydate": keyDate
    };
};

MobileApp.prototype.getCompetenceItemPageObj = function (obj) {
    var self = this;

    var description = "";

    if (!obj.hasOwnProperty(description) || obj.description == "")
        description = i18next.t("No-description-available");

    var keyDate = "";

    if (obj.hasOwnProperty("due_date") && obj.due_date != "")
        keyDate = i18next.t("due") + " " + moment(obj.due_date, "YYYY-MM-DD").format("DD-MM-YYYY");

    if (obj.hasOwnProperty("keydate") && obj.keydate != "")
        keyDate = i18next.t("due") + " " + moment(obj.keydate, "YYYY-MM-DD").format("DD-MM-YYYY");

    if (obj.status == "achieved" || obj.status == "Pass")
        keyDate = "achieved";

    var buttons = [];
    var handout = "";
    var content = description;

    if (obj.hasOwnProperty("extras")) {
        if (obj.extras.hasOwnProperty("supporting_document_url")) {
            handout = obj.extras.supporting_document_url;
        }
    }

    if (handout != "") {
        var supporting_document = i18next.t('supporting-document')
        buttons.push({
            "text": supporting_document,
            "action": "open-external",
            "url": self.remoteHost + handout + "?accessCode=" + localStorage.accessCode,
            "id": obj.id,
            "type": obj.type
        });
    }

    return {
        "id": obj.id,
        "status": obj.status,
        "url": obj.url,
        "icon": self.getIcon(obj.type),
        "info": true,
        "title": self.capitalizeFirstLetter(obj.title),
        "type": obj.type,
        "description": description,
        "content": content,
        "keydate": keyDate,
        "buttons": buttons,
        "attachments": obj.attachments
    };
};

MobileApp.prototype.getXtItemPageObj = function (obj) {
    var self = this;

    var keyDate = "";

    if (obj.hasOwnProperty("keydate") && obj.keydate != "")
        keyDate = moment(obj.keydate, "YYYY-MM-DD").format("DD-MM-YYYY");

    if (obj.hasOwnProperty("due_date") && obj.due_date != "")
        keyDate = moment(obj.due_date, "YYYY-MM-DD").format("DD-MM-YYYY");

    var description = "";

    if (obj.hasOwnProperty("description") && obj.description == "") {
        description = i18next.t("No-description-available");
    } else {
        description = obj.description;
    }

    var buttons = [];

    if (obj.hasOwnProperty("next_session") && obj.next_session != null) {

        description += "<p></p>";
        description += "<div><h3>" + i18next.t('Next-Session')  + "</h3></div>"

        if (obj.next_session.attendance != "" && obj.next_session.attendance != null)
            description += "<div><b>" + i18next.t('Attendance')  + "</b> " + obj.next_session.attendance + "</div>";

        if (obj.next_session.training_type != "" && obj.next_session.training_type != null)
            description += "<div><b>" + i18next.t('Training-Type')  + "</b> " + obj.next_session.training_type + "</div>";

        if (obj.next_session.external_training_name != "" && obj.next_session.external_training_name != null)
            description += "<div><b>" + i18next.t('Name')  + "</b> " + obj.next_session.external_training_name + "</div>";

        if (obj.next_session.training_session_location != "" && obj.next_session.training_session_location != null)
            description += "<div><b>" + i18next.t('Location')  + "</b> " + obj.next_session.training_session_location + "</div>";

        if (obj.next_session.training_session_start_date != "" && obj.next_session.training_session_start_date != null)
            description += "<div><b>" + i18next.t('Start-Date')  + "</b> " + moment(obj.next_session.training_session_start_date, "YYYY-MM-DD").format("DD-MM-YYYY") + "</div>";

    }


    if (obj.hasOwnProperty("file") && obj.file != "") {
        var external_file = i18next.t("external-file");
        buttons.push({
            "text": external_file,
            "action": "open-external",
            "url": obj.file,
            "id": obj.id,
            "type": obj.type
        });
    }

    return {
        "id": obj.id,
        "status": obj.status,
        "url": obj.url,
        "icon": self.getIcon(obj.type),
        "info": true,
        "title": self.capitalizeFirstLetter(obj.title),
        "type": obj.type,
        "content": description,
        "keydate": keyDate,
        "buttons": buttons
    };
};

MobileApp.prototype.getModuleItemPageObj = function (obj) {
    var self = this;

    var description = obj.description;

    if (description == "")
        description = i18next.t('No-description-available');

    var keyDate = "";

    if (obj.hasOwnProperty("due_date") && obj.due_date != "")
        keyDate = i18next.t("due") + " " + moment(obj.due_date, "YYYY-MM-DD").format("DD-MM-YYYY");

    if (obj.hasOwnProperty("keydate") && obj.keydate != "")
        keyDate = i18next.t("due") + " " + moment(obj.keydate, "YYYY-MM-DD").format("DD-MM-YYYY");

    if (obj.status == "complete" || obj.status == "Pass")
        keyDate = "complete";
        trainingBtnText = i18next.t("revisit-training");

    var infoColours = self.getStatusColours(obj.status);

    var trainingBtnColour = self.convertHex(self.colours.mobile_neutral_colour_d1, 33);

    var trainingBtnText = i18next.t("Start-training");

    if (obj.extras.sitting_status == "In-progress") {
        trainingBtnText = i18next.t("continue-training");
        infoColours = self.getStatusColours(obj.extras.sitting_status);
        trainingBtnColour = infoColours[0];
    }

    if (obj.status == "overdue") {
        trainingBtnColour = self.convertHex(self.colours.mobile_warning_colour_a1, 33);
    }

    var itemUrl = "";

    if (obj.hasOwnProperty("url") && obj.url != "")
        itemUrl = obj.url;

    var buttons = [];
    var button_action = "open-in-iframe";
    if (obj.extras.module_type == "scorm") {
        var button_action = "open-scorm-module";
    }
    buttons.push({
        "text": trainingBtnText,
        "action": button_action,
        "href": "#module-launch-V2",
        "url": self.remoteHost + itemUrl + "?access_code=" + localStorage.accessCode + "&module_id=" + obj.id  + "&cookie_consent=1",
        "id": obj.id,
        "type": obj.type,
        "backgroundColor": trainingBtnColour
    });

    var certificate = obj.extras.certificate_url;
    if (certificate != "" && certificate != undefined) {
        var view_certificate = i18next.t("view-certificate")
        buttons.push({
            "text": view_certificate,
            "action": "open-external",
            "url": self.remoteHost + certificate + "?access_code=" + localStorage.accessCode + "&cookie_consent=1",
            "id": obj.id,
            "type": obj.type

        });
    }

    var handout = obj.extras.document_url;
    if (handout != "" && handout != undefined) {
        var module_notes = i18next.t("module-notes")
        buttons.push({
            "text": module_notes,
            "action": "open-external",
            "url": self.remoteHost + handout + "?access_code=" + localStorage.accessCode + "&cookie_consent=1",
            "id": obj.id,
            "type": obj.type

        });
    }

    var downloads = []
    if (obj.extras.downloads) {
        $.each(obj.extras.downloads, function(index, download) {
            downloads.push(download)
        })
    }

    var dataToReturn = {
        "id": obj.id,
        "status": obj.status,
        "url": obj.url,
        "icon": self.getIcon(obj.type),
        "info": true,
        "infoBg": infoColours[0],
        "infoTextColor": infoColours[1],
        "title": self.capitalizeFirstLetter(obj.title),
        "type": obj.type,
        "description": description,
        "content": description,
        "subTitle": "",
        "keydate": keyDate,
        "buttons": buttons,
        "icon_url": obj.icon_url,
        "downloads": downloads,
        "prereq_satisfied": obj.extras.prereq_satisfied,
        "prerequisite_name": obj.extras.prerequisite
    }

    if (obj["icon_url"]) {
        dataToReturn["img"] = obj.icon_url;
    }

    return dataToReturn;
};

MobileApp.prototype.getTrainingSessionObj = function (id) {
    var self = this;
    var obj = {type: "training session"};
    $.mobile.changePage("#item-page-V2");

    $.ajax({
        url: self.remoteHost + self.trainingSessionURL + id + "/",
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            obj = data;
            $.mobile.changePage("#item-page-V2");
            self.itemPageV2(obj);
        },
        error: function (e) {
            self.debug(e);
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.getItemContent = function (itemId, itemType, callback) {
    var self = this;

    var itemUrl;

    switch (itemType) {

        case "news":
            itemUrl = self.remoteHost + self.newsArticleURL + itemId + '/';
            break;

        case "appraisal":
            itemUrl = self.remoteHost + self.appraisalURL + itemId + '/';
            break;

        default:
            itemUrl = "";
            break;
    }

    $.ajax({
        url: itemUrl,
        type: 'GET',
        dataType: 'html',
        success: function (data) {
            // Callback with success
            if (callback && typeof callback == "function") {
                callback(i18next.t("Success"), data);
            }
        },
        error: function (error) {
            // Callback with error
            if (callback && typeof callback == "function") {
                callback(i18next.t("Error"), i18next.t('This item could not be found'));
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.postBookmark = function (itemId, itemType, addToLibrary, callback) {
    var self = this;

    var itemUrl;

    if (itemType === "news") {
        if (addToLibrary) {
            itemUrl = self.remoteHost + self.bookmarkNewsURL + itemId + "/";
        } else if (!addToLibrary) {
            itemUrl = self.remoteHost + self.unbookmarkNewsURL + itemId + "/";
        }
    }

    if (itemType === "resource") {
        if (addToLibrary) {
            itemUrl = self.remoteHost + self.bookmarkNoticeboardURL + itemId + "/";
        } else if (!addToLibrary) {
            itemUrl = self.remoteHost + self.unbookmarkNoticeboardURL + itemId + "/";
        }
    }

    $.ajax({
        url: itemUrl,
        type: 'POST',
        dataType: 'html',
        success: function (data) {
            // Callback with success
            if (callback && typeof callback == "function") {
                callback(i18next.t("Success"), data);
            }
        },
        error: function (error) {
            // Callback with error
            if (callback && typeof callback == "function") {
                callback(i18next.t("Error"), i18next.t('This-item-could-not-be-found'));
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.postTrainingSession = function (itemUrl, itemData, callback) {
    var self = this;

    $.ajax({
        url: self.remoteHost + itemUrl,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        data: itemData,
        success: function (data) {

            // Callback with success
            if (callback && typeof callback == "function") {
                callback(i18next.t("Success"), data);
            }
        },
        error: function (error) {

            // Callback with error
            if (callback && typeof callback == "function") {
                callback(i18next.t("Error"),  i18next.t("This action could not be completed"));
            }
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.getStatusColours = function (status) {
    var self = this;
    var backgroundColour = self.convertHex(self.colours.mobile_neutral_colour_d1, 33);
    var textColour = "white";

    if (status == "complete" || status == "Complete" || status == "Pass" || status == "achieved" || status == "Achieved") {
        textColour = self.colours.mobile_neutral_colour_d2;
    }

    if (status == "overdue" || status == "Overdue") {
        backgroundColour = self.convertHex(self.colours.mobile_warning_colour_a1, 66);
    }

    if (status == "In progress" || status == "Not yet started") {
        backgroundColour = self.convertHex(self.colours.mobile_ok_colour_c3, 33);
        textColour = self.colours.mobile_ok_colour_c3;
    }

    return [backgroundColour, textColour];
};
/* End of Item Screen */

/* Start of Dropdown Screen */

/** @function createItemList
  *
  *
**/
MobileApp.prototype.createItemList = function (listData, listContainer, itemBGColour = "black") {
    var self = this;

    listContainer.empty();

    $.each(listData, function (index, value) {
        self.createItem(value, listContainer, itemBGColour);
    });
};

MobileApp.prototype.createItem = function (value, container, itemBGColour = "black") {
    var self = this;

    var li, a, headerContainer, img, header, headerTitle, headerSubtitle, date;

    if (value.hasOwnProperty("bgColor")) {
        itemBGColour = value.bgColor;
    }

    if (!value.href) {
        value.href = "#";
    }

    li = $("<li/>");
    a = $("<a/>", { "class": "dropdown-item " + value.class + "", "href": "" + value.href + "", "data-id": value.id, "data-item-type": value.type });
    headerContainer = $("<div/>", { "class": "dropdown-item-header", css: { "background-color": itemBGColour } });
    header = $("<div/>", { "class": "dropdown-item-header-container" });

    if (value.hasOwnProperty("image")) {
        img = $("<img/>", { "src": "" + value.image + "" });
        header.addClass("dhc-has-image");
        headerContainer.append(img);
    }

    if (value.hasOwnProperty("icon")) {
        header.addClass("dhc-has-image");
        headerContainer.append('<span class="feed-list-icon bg-color-d2"><i class="fa fa-2x ' + value.icon + '" aria-hidden="true"></i></span>');
    }

    headerTitle = $("<div/>", { "class": "dropdown-item-header-title", "text": "" + value.title + "" });

    if (value.subTitle) {

        // Loop through the typeToLabels to see if any match the subtitle
        // k = key, v = value of the objects
        $.each(Object.keys(self.typeToLabel), function (k, v) {

            // Checking to see if the subTitle contains the current label
            if (value.subTitle.indexOf(v) != -1) {
                // The subTitle contains the current label

                // Replace the part of the subTitle with the correct label from self.labels
                value.subTitle = value.subTitle.replace(v, self.decapitalizeString(self.labels[self.typeToLabel[v]]));
            }
        })

        headerSubtitle = $("<div/>", { "class": "dropdown-item-header-title sub-title", "text": "" + value.subTitle + "" });
    }

    date = $("<div/>", { "class": "dropdown-item-right " + value.class + "", css: { "background-color": itemBGColour }, "text": "" + value.date + "" });

    header.append(headerTitle);
    header.append(headerSubtitle);
    headerContainer.append(header);
    a.append(headerContainer);
    a.append(date);
    li.append(a);
    container.append(li);
};

/** @function dropdown
  * @param { String } title
  * @param { DOMElement } position
  * @param { JSONObject } options
  * @description Opens a drop down at the position entered.
  options json object param can include
    * colour (Colour of the header text & items)
    * fixed (If the dropdown is to have a fixed height)
    * badge (If the dropdown includes the activity badge)
    * key (If the dropdown includes the single or multi-line key)
**/
MobileApp.prototype.dropdown = function (title, position, options = { "colour": "white", "fixed": false }) {
    var self = this;

    // Setting Variables for the function
    var popupElem = $("#popupMenu");
    var titleElem = $("#dropdown-title");
    var contElem = $('#dropdown-content');
    var badgeElem = $('#dropdown-badge');
    var keySingleElem = $("#keySingle");
    var keyMultiElem = $("#keyMulti");

    // Clearing the popup of any previous options
    if (popupElem.hasClass("dropdown-fixed-height")) {
        popupElem.removeClass("dropdown-fixed-height");
    }

    self.setVisibility(contElem, false);
    self.setVisibility(badgeElem, false);
    self.setVisibility(keySingleElem, false);
    self.setVisibility(keyMultiElem, false);

    // Setting up the current dropdown
    titleElem.css("color", options.colour);

    if (title != "")
        titleElem.text(title);

    if (options.fixed) {
        popupElem.addClass("dropdown-fixed-height");
        self.setVisibility(contElem, true);
    }

    if (options.badge) {
        self.setVisibility(badgeElem, true);
    }

    if (options.key == "multi") {
        self.setVisibility(keyMultiElem, true);
    }

    if (options.key == "single") {
        self.setVisibility(keySingleElem, true);
    }

    // OPEN THE DROPDOWN MENU
    $('#popupMenu').popup('open', {
        "transition": "slidedown",
        "positionTo": position
    });
};
/* End of Dropdown Screen */

/* ---- Start of Utility Methods ----
    A collection of reusable functions used throughout the app
   ---------------------------------------------------------- */

/** @function appendMsg
  * @param { String } id
  * @param { String } msg
  * @description Clones the message class, adds the msg to the message's h3 tag and appends the code to the id.
 **/
MobileApp.prototype.appendMsg = function (id, msg) {
    var msgTemp = document.getElementById("message").content.cloneNode(true);
    msgTemp.querySelector("h3").innerText = msg;
    $(id).append(msgTemp);
};

/** @function popupMsg
  * @param { String } msg
  * @param { String } textColour
  * @param { String } faIcon
  * @description Creates a popup message center screen that fades away after 1.5 seconds.
  the text colour will change if the second param if added and a font awesome icon can be added.
**/
MobileApp.prototype.popupMsg = function (msg, textColour = "black", faIcon = "") {
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3><i class='fa " + faIcon + "' style='color: " + textColour + ";' aria-hidden='true'></i> " + msg + "</h3></div>")
        .css({
            display: "block",
            opacity: 0.90,
            position: "fixed",
            padding: "7px",
            "text-align": "center",
            width: "270px", "background-color": "white",
            color: textColour,
            left: ($(window).width() - 284) / 2,
            top: $(window).height() / 2
        })
        .appendTo($.mobile.pageContainer).delay(1500)
        .fadeOut(400, function () {
            $(this).remove();
        });
};

/** @function checkObjExists
 * @param {JSON Object} obj
 * @param {String} args
 * @return {Boolean}
 * @description Checks the JSON Object for existing keys including nested keys against the args
**/
MobileApp.prototype.checkObjExists = function (obj) {

    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < args.length; i++) {

        if (!obj || !obj.hasOwnProperty(args[i])) {
            return false;
        }

        obj = obj[args[i]];
    }

    return true;
};

/** @function setVisibility
  * @param { DOMElement } elem
  * @param { Boolean } setVisible
  * @description Adds the class "hide" to the element if setVisible is set to false and vice versa if setVisible is set to true
**/
MobileApp.prototype.setVisibility = function (elem, setVisible) {

    if (setVisible) {
        if (elem.hasClass("hide"))
            elem.removeClass("hide");
    } else {
        if (!elem.hasClass("hide")) {
            elem.addClass("hide");
        }
    }
};

/** @function setActiveTab
  * @param {String} id
  * @description Removed all instances of the activeTab class on all relevant elements
  and adds the class the elemt belonging to the id param
**/
MobileApp.prototype.setActiveTab = function (id) {

    $(".activeTab").each(function () {
        $(this).removeClass("activeTab");
    });

    $(id).addClass("activeTab");
};

/** @function getList
 * @param {JSONObjsct} data
 * @param {String} type
 * @returns {Array} output
 * @description Finds all objects in data with type and returns an array containing only those objects.
**/
MobileApp.prototype.getList = function (data, type) {
    var self = this;
    var output = [];
    var jsonData = JSON.parse(data);

    $.each(jsonData, function (key, obj) {
        if (obj["type"] === type) {
            output.push(obj);
        }
    });
    return output;
};

/** @function getIcon
  * @param { String } type
  * @return { String } img
  * @description Simply returns the font awesome 4.7 icon string based on the type param
**/
MobileApp.prototype.getIcon = function (type) {
    var img = '';
    if (type == "external training" || type == "xt") {
        img = 'fa-users';
    } else if (type == "news") {
        img = 'fa-bell-o';
    } else if (type == "noticeboard") {
        img = 'fa-bullhorn';
    } else if (type == "appraisal") {
        img = 'fa-list';
    } else if (type == "competence") {
        img = 'fa-file-text-o';
    } else if (type == "module") {
        img = 'fa-laptop';
    } else if (type == "training session") {
        img = 'fa-calendar';
    } else {
        img = "";
    }

    return img;
};

/** @function convertToId
  * @param { String } string
  * @description Takes the param string and replaces spaces with - then makes lower case
**/
MobileApp.prototype.convertToId = function (string) {
    return string.replace(/\s+|\W/g, '-').toLowerCase();
};

/** @function getListByCategory
 * @param {JSONObjsct} data
 * @param {String} category
 * @param {String} status
 * @returns {Array} output
 * @description Finds all objects in data by category with the option to filter by status then returns an array containing only those objects.
**/
MobileApp.prototype.getListByCategory = function (data, category, status) {
    var self = this;

    var output = [];
    var jsonData = JSON.parse(data);

    if (status === "all" || status === "" || status === null) {

        $.each(jsonData, function (key, obj) {

            // Checks is the object has a category to begin with
            if (obj["extras"]) {

                if (obj["extras"]["category"] === category) {
                    output.push(obj);
                }
            }

        });

    } else {

        $.each(jsonData, function (key, obj) {

            // Checks is the object has a category to begin with
            if (obj["extras"] && obj["status"] === status) {

                if (obj["extras"]["category"] === category) {
                    output.push(obj);
                }
            }

        });
    }

    return output;
};

/** @function getListByType
 * @param {JSONObjsct} data
 * @param {String} type
 * @param {String} status
 * @returns {Array} output
 * @description Finds all objects in data by type with the option to filter by status then returns an array containing only those objects.
**/
MobileApp.prototype.getListByType = function (data, type, status = "") {
    var self = this;

    var output = [];
    var jsonData = JSON.parse(data);

    if (status === "all" || status === "" || status === null) {

        $.each(jsonData, function (key, obj) {

            // Checks is the object has a type to begin with
            if (obj["type"]) {

                if (obj.type === type) {
                    output.push(obj);
                }
            }

        });

    } else {

        $.each(jsonData, function (key, obj) {

            // Checks is the object has a type to begin with
            if (obj["type"] && obj["status"] === status) {

                if (obj.type === type) {
                    output.push(obj);
                }
            }

        });
    }

    return output;
};

/** @function isRecent
  * @param { Moment DateObject } date
  * @description Checks if the param date is inbetween todays date and days ago date 
**/
MobileApp.prototype.isRecent = function (date) {
    var self = this;

    var today = moment().valueOf();
    var daysAgo = moment().subtract(self.recentlyAddedDays, "days").valueOf();

    if (date.valueOf() > daysAgo && date.valueOf() < today) {
        return true;
    }
    return false;
};

MobileApp.prototype.ColourLuminance = function (hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
};

MobileApp.prototype.convertHex = function (hex, opacity = 1) {
    hex = hex.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);

    result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
};

MobileApp.prototype.lightenDarkenColor = function (col, amt) {
        var usePound = false;
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
        var num = parseInt(col,16);
        var r = (num >> 16) + amt;
     
        if (r > 255) r = 255;
        else if  (r < 0) r = 0;
     
        var b = ((num >> 8) & 0x00FF) + amt;
     
        if (b > 255) b = 255;
        else if  (b < 0) b = 0;
     
        var g = (num & 0x0000FF) + amt;
     
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
     
        return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16)
    }

MobileApp.prototype.capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

MobileApp.prototype.decapitalizeString = function (string) {
    return string.toLowerCase();
};

MobileApp.prototype.postAjaxWithCallback = function (dataUrl, dataToSend, dataType, callback) {
    var self = this;

    $.ajax({
        url: dataUrl,
        type: 'POST',
        contentType: dataType,
        dataType: 'json',
        data: dataToSend,
        success:
            function (data) {
                // Callback with success & data
                if (callback && typeof callback == "function") {
                    callback(i18next.t("Success"), data);
                }
            },
        error: function (e) {
            // Callback with success & data
            if (callback && typeof callback == "function") {
                callback(i18next.t("Error"), e);
            }
        },
        beforeSend: self.setHeaders
    });
};
/* ---- End of Utility Methods ------ */

/* Start of Legacy Methods */

MobileApp.prototype.feedPage = function () {
    var self = this;
    var feedData = self.getStorageValue("feedData", false);

    if (feedData) {
        self.populateList(feedData, '#prof-list', self.noItemsMsg);
    }

    $.ajax({
        url: self.remoteHost + self.feedURL,
        type: 'GET',
        dataType: 'json',
        success:
            function (data) {
                localStorage.feedData = JSON.stringify(data);
                self.populateList(localStorage.feedData, '#prof-list', self.noItemsMsg);
            },
        error: function () { },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.trainingPage = function () {
    var self = this;
    var trainingData = self.getStorageValue("trainingData", false);
    if (trainingData) {
        sortModuleByStatus(JSON.parse(trainingData));
    }

    $.ajax({
        url: self.remoteHost + self.trainingURL,
        type: 'GET',
        dataType: 'json',
        success:
            function (data) {
                localStorage.trainingData = JSON.stringify(data);
                sortModuleByStatus(data);
            },
        error: function (e) {
            self.debug(e);
        },
        beforeSend: self.setHeaders
    });

    function sortModuleByStatus(data) {
        var completed = [];
        var available = [];
        var invited = [];
        var upcoming = [];
        var overdue = [];

        for (var d in data) {
            if (data[d].status == 'complete') {
                completed.push(data[d]);
            } else if (data[d].status == 'upcoming' || data[d].status == 'confirmed') {
                upcoming.push(data[d]);
            } else if (data[d].status == 'available') {
                available.push(data[d]);
            } else if (data[d].status == 'invited') {
                invited.push(data[d]);
            } else {
                overdue.push(data[d]);
            }
        }

        self.populateList(completed, "#completed-training-list", self.noItemsMsg);
        self.populateList(upcoming, "#upcoming-training-list", self.noItemsMsg);
        self.populateList(available, "#available-training-list", self.noItemsMsg);
        self.populateList(invited, "#invited-training-list", self.noItemsMsg);
        self.populateList(overdue, "#overdue-training-list", self.noItemsMsg);
    }
};

MobileApp.prototype.commsPage = function () {
    var self = this;

    var news = self.companySettings('news_enabled');
    var noticeboard = self.companySettings('branch_resources_enabled');
    var productKnowledgeData = "";
    var referenceMaterialsData = "";
    var commsRadioChoice = self.getStorageValue("commsRadioChoice", false);
    if (!commsRadioChoice) {
        localStorage.commsRadioChoice = 'all';
    }

    var radioChoice = "#comms-radio-choice-" + localStorage.commsRadioChoice;

    $(radioChoice).prop("checked", true).checkboxradio("refresh");

    if (news) {
        var newsData = self.getStorageValue("newsData", false);
        if (newsData) {
            self.populateList(newsData, '#news-list', self.noItemsMsg);
        }
        $.ajax({
            url: self.remoteHost + self.newsURL,
            type: 'GET',
            dataType: 'json',
            success:
                function (data) {
                    localStorage.newsData = JSON.stringify(data);
                    self.populateList(localStorage.newsData, '#news-list', self.noItemsMsg);
                },
            error: function () { },
            beforeSend: self.setHeaders
        });
    } else {
        listview = $('#news-list');
        listview.empty();
        listview.append("<p>" + i18next.t('your-company-doesnot-have-this-enabled') + "</p>");
    }

    if (noticeboard) {
        var noticeboardData = self.getStorageValue("noticeboardData", false);
        if (noticeboardData && self.forceUpdate === false) {
            self.sortNoticeboardItemsIntoCategories(noticeboardData, function (categories) {
                self.populateNoticeboardLists(categories, localStorage.commsRadioChoice);
            });
        }

        $.ajax({
            url: self.remoteHost + self.noticeboardURL,
            type: 'GET',
            dataType: 'json',
            success:
                function (data) {
                    var newData = JSON.stringify(data);
                    if (localStorage.noticeboardData != newData) {
                        localStorage.noticeboardData = newData;
                        self.sortNoticeboardItemsIntoCategories(localStorage.noticeboardData, function (categories) {
                            self.populateNoticeboardLists(categories, localStorage.commsRadioChoice);
                        });
                    }
                },
            error: function () { },
            beforeSend: self.setHeaders
        });
    } else {
        listview = $('#noticeboard-list');
        listview.empty();
        listview.append("<p>" + i18next.t("your-company-doesnot-have-this-enabled") + "</p>");
    }

    self.forceUpdate = false;
};

MobileApp.prototype.commsPageV2 = function () {
    var self = this;
    var newsEnabled = self.companySettings('news_enabled');
    var noticeboardEnabled = self.companySettings('branch_resources_enabled');
    var radioChoice = "#comms-radio-choice-" + localStorage.commsRadioChoice;
    $(".navbar-v2 .ui-btn-left.ui-link").attr("href", "#new-dashboard");

    if (newsEnabled) {
        var newsData = self.getStorageValue("newsData", false);
        if (newsData) {
            self.populateNewsList(newsData, '#news-cards-container', self.noItemsMsg);
        }
        $.ajax({
            url: self.remoteHost + self.newsURL,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                localStorage.newsData = JSON.stringify(data);
                self.populateNewsList(localStorage.newsData, '#news-cards-container', self.noItemsMsg);
            },
            error: function () { },
            beforeSend: self.setHeaders
        });
    } else {
        listview = $('#news-cards-container');
        listview.empty();
        listview.append("<p>" + i18next.t("your-company-doesnot-have-this-enabled") + "</p>");
    }

    if (noticeboardEnabled) {
        var noticeboardData = self.getStorageValue("noticeboardData", false);
        if (noticeboardData && self.forceUpdate === false) {
            self.sortNoticeboardItemsIntoCategories(noticeboardData, function (categories) {
                self.populateNoticeboardCategories(categories, '#noticeboard-categories-container');
            });             
        }

        $.ajax({
            url: self.remoteHost + self.noticeboardURL,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                localStorage.noticeboardData = JSON.stringify(data);
                self.sortNoticeboardItemsIntoCategories(localStorage.noticeboardData, function (categories) {
                    self.populateNoticeboardCategories(categories, '#noticeboard-categories-container');
                });                
            },
            error: function () { },
            beforeSend: self.setHeaders
        });

    } else {
        listview = $('#noticeboard-categories-container');
        listview.empty();
        listview.append("<p>" + i18next.t("your-company-doesnot-have-this-enabled") + "</p>");
    }
};

MobileApp.prototype.libraryPage = function () {
    var self = this;
    var libraryData = self.getStorageValue("libraryData", false);
    if (libraryData) {
        self.populateList(libraryData, '#library-list', self.noItemsMsg);
    }
    $.ajax({
        url: self.remoteHost + self.libraryURL,
        type: 'GET',
        dataType: 'json',
        success:
            function (data) {
                localStorage.libraryData = JSON.stringify(data);
                self.populateList(localStorage.libraryData, '#library-list', self.noItemsMsg);
            },
        error: function () { },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.careerPage = function () {
    var self = this;

    $('#appraisals_heading > a').text(self.labels.appraisal_label_plural);
    $('#competences_heading > a').text(self.labels.competence_label_plural);
    var competences = self.companySettings('competences_enabled');
    var appraisals = self.companySettings('appraisals_enabled');

    if (competences || appraisals) {
        var careerData = self.getStorageValue("careerData", false);
        if (careerData) {
            self.populateList(self.getList(careerData, 'appraisal'), '#appraisal-list', self.noItemsMsg);
            self.populateList(self.getList(careerData, 'competence'), '#competence-list', self.noItemsMsg);
        }
        $.ajax({
            url: self.remoteHost + self.careerURL,
            type: 'GET',
            dataType: 'json',
            success:
                function (data) {
                    localStorage.careerData = JSON.stringify(data);
                    self.populateList(self.getList(localStorage.careerData, 'appraisal'), '#appraisal-list', self.noItemsMsg);
                    self.populateList(self.getList(localStorage.careerData, 'competence'), '#competence-list', self.noItemsMsg);
                },
            error: function () { },
            beforeSend: self.setHeaders
        });
    } else {
        listview = $('#career-list');
        listview.empty();
        listview.append("<p>" + i18next.t("your-company-doesnot-have-this-enabled") + "</p>");
    }
};

MobileApp.prototype.populateList = function (listData, listId, emptyMessage) {
    var self = this;
    emptyMessage = emptyMessage || "";
    var createdListItems = [];
    var objectList = "";
    var listItem = "";
    var listItemTitle = "";
    var listItemLink = "";

    if (typeof (listData) == 'string') {
        objectList = JSON.parse(listData);
    } else {
        objectList = listData;
    }

    var brandingLabels = JSON.parse(localStorage.brandingLabels);
   
    var noticeboard_label = i18next.t('noticeboard_label');
    var external_training_label = i18next.t('external_training_label');
    var appraisal_label = i18next.t('appraisal_label');
    var competence_label = i18next.t('competence_label');

    var labelRef = {
        'noticeboard': noticeboard_label,
        'external training': external_training_label,
        'appraisal': appraisal_label,
        'competence': competence_label
    };

    if (objectList.length == 0) {
        listItem = $("<li/>", { "class": "emptylist" });
        listItemTitle = $("<h3/>", { "text": emptyMessage });
        listItem.append(listItemTitle);
        createdListItems.push(listItem);
    } else {

        // This first message is to help users understand what items are displayed on the feed page.
        if (listId === "#prof-list") {
            listItem = $("<li/>", { "class": "helplist" });
            listItemTitle = $("<h3/>", { "text": i18next.t("Items-with-Due-Dates-are") + " " });
            listItem.append(listItemTitle);
            createdListItems.push(listItem);
        }

        $.each(objectList, function (index, item) {
            var img = self.getItemImage(item);
            var itemLabel = item.type[0].toUpperCase() + item.type.substr(1);

            if (labelRef[item.type]) {
                var labelType = labelRef[item.type];
                var label = brandingLabels[labelType];
                if (typeof (label) != 'undefined' && label.length != 0) {
                    itemLabel = label;
                }
            }

            var status_display = item.status;
            if (item.extras) {
                if (item.extras.sitting_status) {
                    status_display = item.extras.sitting_status;
                }
            }
            var prevPage = $.mobile.activePage.attr('id');
            listItem = $("<li/>", { "class": "item" });
            if (item.type == "module") {
                listItemLink = $("<a/>", { "class": "ext-link-popup", "href": self.remoteHost + item.url + "?access_code=" + localStorage['accessCode'] + "&module_id=" + item.id + "&cookie_consent=1" }).data({ "itemtype": item.type, "itemid": item.id, "itemtitle": item.title, 'prevPage': prevPage });
            } else {
                listItemLink = $("<a/>", { "class": "listlink", "href": "#itempage" }).data({ "itemtype": item.type, "itemid": item.id, "itemtitle": item.title, 'prevPage': prevPage });
            }
            var listItemImg = $("<div class='itemimg'>" + img + "</div>");
            listItemTitle = $("<h3/>", { "text": item.title });
            var listItemDate = $("<p/>", { "text": item.keydate }).css("font-weight", "bold");
            var listItemStatus = $("<p/>", { "text": itemLabel + ' ' + status_display }).css("font-weight", "bold");

            if (itemLabel === brandingLabels["competence_label"] && item.status == "not achieved") {
                listItemStatus = $("<p/>", { "text": i18next.t("Your-supervisor-manager-has-not-marked-this-as-ach") }).css("font-weight", "bold");
            }

            var listItemDescription = $("<p/>");

            if (item.status == "due" || item.status == "overdue" || item.status == "not achieved") {
                listItemStatus.css('color', 'red');
            }

            var combinedItem = listItem.append(listItemLink.append(listItemImg)
                .append(listItemTitle).append(listItemDate).append(listItemStatus).append(listItemDescription));
            createdListItems.push(combinedItem);
        });
    }

    listview = $(listId);

    listview.empty();
    listview.append(createdListItems);

    if (listview.hasClass('ui-listview')) {
        listview.listview('refresh');
    } else {
        listview.trigger('create');
    }

    // apply branding changes to individual items
    // self.setBranding();

    $('li.item a.listlink').on('click', function () {
        self.itemLink(this);
    });
};

MobileApp.prototype.getItemImage = function (item) {
    var img = '';
    if (item.type == "external training") {
        img = '<i class="fa fa-edit fa-external-link fa-3x"></i>';
    } else if (item.type == "news") {
        img = '<i class="fa fa-newspaper-o fa-3x"></i>';
    } else if (item.type == "noticeboard") {
        img = '<i class="fa fa-calendar-plus-o fa-3x"></i>';
    } else if (item.type == "appraisal") {
        img = '<i class="fa fa-balance-scale fa-3x"></i>';
    } else if (item.type == "competence") {
        img = '<i class="fa fa-thumbs-up fa-3x"></i>';
    } else if (item.type == "module") {
        img = '<i class="fa fa-desktop fa-3x"></i>';
    } else if (item.type == "training session") {
        img = '<i class="fa fa-calendar fa-3x"></i>';
    } else {
        img = "";
    }

    return img;
};

MobileApp.prototype.populateItemPage = function (title, content) {
    var self = this;
    self.originalBase = $('base').attr('href');
    $('base').attr('href', self.remoteHost);
    $('#itempage .content').empty();
    $('#itempage .content').append($('<h2/>', { 'text': title })).append(content);
    $('#itempage').trigger('pagecreate');
};

MobileApp.prototype.getNoticeboardCountForStatus = function (data, status) {

    var count = 0;

    $.each(data, function (key, obj) {
        if (obj["status"] === status) {
            count++;
        }
    });
    return count;
};

MobileApp.prototype.getItemCountByStatus = function (elementId, data, status) {

    var count = 0;

    $.each(data, function (key, obj) {
        if (obj["status"] === status) {
            count++;
        }
    });

    if (count <= 0) {
        $(elementId).hide();
    } else {
        $(elementId).text(count + " " + status);
        $(elementId).show();
    }
};

MobileApp.prototype.createCategory = function (selector, category) {
    var self = this;

    var lowerCase = category.replace(/\s+|\W/g, '-').toLowerCase();

    var content = '<div data-role="collapsible" data-collapsed-icon="carat-d" data-corners="false" data-collapsed="false" data-expanded-icon="carat-u" >' +
        '<h4>' + category + ' <span id="' + lowerCase + '-count" class="ui-li-count">--</span></h4><ul data-role="listview" id="' + lowerCase + '-list" data-divider-theme="a"></ul></div>';

    $(selector).append(content).trigger("create");
};

MobileApp.prototype.getObjectOld = function (id, type, feed) {
    var dataItem;
    var objectList = JSON.parse(localStorage[feed]);
    for (var i in objectList) {
        if (objectList[i].type == type && objectList[i].id == parseInt(id)) {
            dataItem = objectList[i];
            break;
        }
    }
    return dataItem;
};

MobileApp.prototype.getObject = function (id, type, feed) {
    var dataItem;
    var objectList = JSON.parse(feed);

    for (var i in objectList) {
        if (objectList[i].type == type && objectList[i].id == parseInt(id)) {
            dataItem = objectList[i];
            break;
        }
    }
    return dataItem;
};

MobileApp.prototype.getNewsArticle = function (article_id, title, dataItem) {
    var self = this;

    var bookmark = false;

    if (self.checkObjExists(dataItem, "extras", "bookmarked") == true) {
        bookmark = dataItem.extras.bookmarked;
    }

    $.ajax({
        url: self.remoteHost + self.newsArticleURL + article_id + '/',
        type: 'GET',
        dataType: 'html',
        success: function (data) {
            self.populateItemPageWithBookmark(title, data, article_id, bookmark, "news");
        },
        error: function (error) {
            self.populateItemPage(title, i18next.t("This-news-article-could-not-be-found"));
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.getAppraisal = function (appraisal_id, title) {
    var self = this;
    $('#itempage .content').append("<p>" + i18next.t('Loading') + "..." + "</p>");
    $.ajax({
        url: self.remoteHost + self.appraisalURL + appraisal_id + '/',
        type: 'GET',
        dataType: 'html',
        success: function (data) {
            $('#itempage .content').empty();
            self.populateItemPage(title, data);

            $('#appraisalSubmit').on('click', function (e) {
                e.preventDefault();
                $.ajax({
                    url: self.remoteHost + self.appraisalURL + appraisal_id + '/',
                    type: 'POST',
                    data: $('#appraisalForm').serialize(),
                    dataType: 'json',
                    success: function (data) {
                        navigator.notification.alert(i18next.t('Trainee-notes-successfully-saved'));
                    },
                    error: function (error) {
                        navigator.notification.alert(i18next.t('Error-trainee-notes-not-saved'));
                    },
                    beforeSend: self.setHeaders
                });
            });
        },
        error: function (error) {
            $('#itempage .content').empty();
            self.populateItemPage(title, "<p>" +  i18next.t('This-appraisal-could-not-be-found') + "</p>");
        },
        beforeSend: self.setHeaders
    });
};

MobileApp.prototype.getNoticeboardItem = function (data, title) {

    var self = this;

    var brandingLabels = JSON.parse(self.getStorageValue('brandingLabels', '{"noticeboard_label":' + i18next.t("Noticeboard") + '}'));

    var content = "<p><b>Date Due: " + data.keydate +
        "</b></p><p id='" + data.id + "'>Status: " + data.status +
        "</p><p>" + data.description +
        "</p> <p><a data-nb-id='" + data.id + "' class='ui-btn ui-btn-b ui-corner-all noticeboard-link' href='" + self.remoteHost + data.url +
        "?access_code=" + localStorage['accessCode'] +
        "&cookie_consent=1' >Open " + brandingLabels["noticeboard_label"] + " item</a></p>";

    var bookmark = false;

    if (self.checkObjExists(data, "extras", "bookmarked") == true) {
        bookmark = data.extras.bookmarked;
    }

    self.populateItemPageWithBookmark(title, content, data.id, bookmark, "resource");
};

MobileApp.prototype.itemLink = function (item) {
    var self = this;
    self.prevPage = $(item).data("prevPage");
    var hash = $(item).closest('ul').attr('id');

    var feed = self.feedOptions[hash];

    $('#itempage .content').empty();
    var title = $(item).data('itemtitle');
    var content = '';
    var id = "";
    var dataItem = "";
    var confirmText = "";

    if ($(item).data("itemtype") == "module") {
        // if online training - show downloads, add url to 'launch training' button (also include wifi warning if appropriate)
        id = $(item).data("itemid");
        dataItem = self.getObjectOld(id, "module", feed);
        if (dataItem) {
            content = "<p><b>" + i18next.t('Due') + "</b> " + dataItem.keydate + "</p><p>" + dataItem.description + "</p>";
            if (dataItem.extras.exam_result != '') {
                content += "<p><b>" + i18next.t('Latest-exam-result') + "</b> " + dataItem.extras.exam_result + "</p>";
            }
            if (dataItem.status == 'complete') {
                if (dataItem.extras.certificate_url != '') {
                    content += "<p><a class='ext-link ui-btn ui-btn-b ui-corner-all' href='" + dataItem.extras.certificate_url + "'>" + i18next.t('View-certificate') + "</a></p>";
                }
            } else {
                content += "<p><a class='ext-link-popup ui-btn ui-btn-b ui-corner-all' href='" + self.remoteHost + dataItem.url + "?access_code=" +
                    localStorage['accessCode'] + "&module_id=" + dataItem.id + "&cookie_consent=1" + "'>" + i18next.t('Open-module') + "</a></p>";
            }
            self.forceUpdate = true;
        }
    } else if ($(item).data("itemtype") == "news") {
        // if news article go get the content from the view_news view
        id = $(item).data("itemid");
        dataItem = self.getObjectOld(id, "news", feed);
        if (dataItem) {
            self.forceUpdate = true;
            return self.getNewsArticle(id, title, dataItem);
        }
    } else if ($(item).data("itemtype") == "appraisal") {
        // if news article go get the content from the view_news view
        id = $(item).data("itemid");
        dataItem = self.getObjectOld(id, "appraisal", feed);
        if (dataItem) {
            return self.getAppraisal(id, title);
        }
    } else if ($(item).data("itemtype") == "noticeboard") {
        // if news article go get the content from the view_news view
        id = $(item).data("itemid");
        dataItem = self.getObjectOld(id, "noticeboard", feed);
        if (dataItem) {
            self.forceUpdate = true;
            self.getNoticeboardItem(dataItem, title);
            return false;
        }
    } else if ($(item).data("itemtype") == "external training") {
        // if news article go get the content from the view_news view
        id = $(item).data("itemid");
        dataItem = self.getObjectOld(id, "external training", feed);

        if (dataItem) {
            content = "<p><b>" + " " + i18next.t("Date-Due") + " " + dataItem.keydate + "</b></p><p>" + " " + i18next.t("Status") + " " + dataItem.status + "</p><p>" + dataItem.description + "</p>";
            if (dataItem.extras.provider != null) {
                content += "<p><b>" + i18next.t('Provider') + " " + "</b> " + dataItem.extras.provider + "</p>";
            }
            if (dataItem.extras.training_time != null) {
                content += "<p><b>" + i18next.t('Training-Time') + " " + "</b> " + dataItem.extras.training_time + "</p>";
            }
            if (dataItem.extras.training_type != null) {
                content += "<p><b>" + i18next.t('Training-Type') + " " + "</b> " + dataItem.extras.training_type + "</p>";
            }
            if (dataItem.extras.document_url != '') {
                dataItem.extras.document_url = dataItem.extras.document_url.replace("'", "%27");
                content += "<p><a class='ext-download ui-btn ui-btn-b ui-corner-all' href='" + dataItem.extras.document_url + "' >" + i18next.t('Open-supporting-documents') + "</a></p>";
            }
            self.forceUpdate = true;

        }
    } else if ($(item).data("itemtype") == "training session") {
        id = $(item).data("itemid");
        dataItem = self.getObjectOld(id, "training session", feed);

        if (dataItem) {
            content = "<p><b>" + i18next.t("Date-Due") + ": " + " " + dataItem.keydate + "</b></p><p>" +  i18next.t("Status") + ":" + dataItem.status + "</p><p>" + dataItem.description + "</p>";
            if (dataItem.extras.location != null) {
                content += "<p><b>" + i18next.t('Location') + ": " + "</b> " + dataItem.extras.location + "</p>";
            }
            if (dataItem.extras.address != null) {
                content += "<p><b>" + i18next.t('Address') + ": " + "</b> " + dataItem.extras.address + "</p>";
            }
            if (dataItem.extras.city != null) {
                content += "<p><b>" + i18next.t('City') + ": " + "</b> " + dataItem.extras.city + "</p>";
            }
            if (dataItem.extras.post_code != null) {
                content += "<p><b>" + i18next.t('Post-Code') + ": " + "</b> " + dataItem.extras.post_code + "</p>";
            }
            if (dataItem.extras.start_date != null) {
                content += "<p><b>" + i18next.t('Start-Date') + ": " + "</b> " + dataItem.extras.start_date + "</p>";
            }
            if (dataItem.extras.end_date != null) {
                content += "<p><b>" + i18next.t('End-Date') + ": " + "</b> " + dataItem.extras.end_date + "</p>";
            }
            if (dataItem.extras.trainer != null) {
                content += "<p><b>" + i18next.t('Session-administrator') + ": " + "</b> " + dataItem.extras.trainer + "</p>";
            }
            if (dataItem.extras.notes != null) {
                content += "<p><b>" + i18next.t('Notes') + ": " + "</b> " + dataItem.extras.notes + "</p>";
            }
            if (dataItem.extras.document_url != '') {
                dataItem.extras.document_url = dataItem.extras.document_url.replace("'", "%27");
                content += "<p><a class='ext-download ui-btn ui-btn-b ui-corner-all' href='" + dataItem.extras.document_url + "' >" + i18next.t("Open-Supporting-Documents") + "</a></p>";
            }

            if (dataItem.status == "invited") {
                confirmText = i18next.t("You-are-about-to-accept-an-invitation-to-a-trainin");
                var declineText = i18next.t("You-are-about-to-decline-an-invitation-to-a-traini");
                content += "<div class='ui-grid-a'><div class='ui-block-a'><a class='ui-btn ui-btn-b ui-corner-all' data-training-id='" + dataItem.id + "' data-training-answer='accept' data-training-confirm-required='" + confirmText + "' href='#'>" + i18next.t('Accept') + "</a></div><div class='ui-block-b'><a class='ui-btn ui-btn-b ui-corner-all' data-training-id='" + dataItem.id + "' data-training-answer='decline' data-training-confirm-required='" + declineText + "' href='#'>" + i18next.t('Decline') + "</a></div></div>";

            } else if (dataItem.status == "available") {
                confirmText = i18next.t( "You-are-about-to-request-to-attend-a-course-that-h");
                var request_to_book = i18next.t('Request-to-Book');
                content += "<p><a class='ui-btn ui-btn-b ui-corner-all' data-training-id='" + dataItem.id + "' data-training-answer='book' data-training-confirm-required='" + confirmText + "' href='#'>" + request_to_book + "</a></p>";
            } else if (dataItem.status == "confirmed") {
                confirmText = i18next.t("You-are-about-to-cancel-a-request-to-attend-a-cour");
                var cancel_attendance = i18next.t('Cancel-Attendance');
                content += "<p><a class='ui-btn ui-btn-b ui-corner-all' data-training-id='" + dataItem.id + "' data-training-answer='cancel' data-training-confirm-required='" + confirmText + "' href='#'>" + cancel_attendance + "</a></p>";
            }

            self.forceUpdate = true;

            self.populateItemPage(title, content);

            $("a[data-training-id]").on("click", function () {

                var id = $(this).data("training-id");
                var answer = $(this).data("training-answer");
                var url = self.remoteHost + self.bookingUpdateURL + id + "/";

                if (answer == "book") {
                    url = self.remoteHost + self.bookingCreateURL + id + "/";
                }

                var data = {
                    "status": answer
                };

                var confirm = $(this).attr("data-training-confirm-required");

                if (typeof confirm !== typeof undefined && confirm !== false) {
                    navigator.notification.confirm(confirm, function (idx) {
                        if (idx == 1) {
                            self.postAjax(url, data, "application/x-www-form-urlencoded");
                            parent.history.back();

                        } else {
                            return false;
                        }
                    },  i18next.t('Confirm-Action'), ["Confirm", "Cancel"]
                    );

                } else {
                    self.postAjax(url, data, "application/x-www-form-urlencoded");
                    parent.history.back();
                }

            });

            return false;
        }
    } else if ($(item).data("itemtype") == "competence") {
        // if news article go get the content from the view_news view
        id = $(item).data("itemid");
        dataItem = self.getObjectOld(id, "competence", feed);
        if (dataItem) {

            if (dataItem.status == "not achieved") {
                content += "<p><b>" + i18next.t("Status") + "</b>" + i18next.t("Your-supervisor-manager-has-not-marked-this-as-ach") + "</p>";
            }

            if (dataItem.status == "achieved") {
                content += "<p><b>" + i18next.t("Achieved-date") + "</b> " + dataItem.keydate + "</p>";
            }
            if (dataItem.extras.supporting_document_filename != '') {
                content += "<p><b>" + i18next.t("Supporting-document-available") + "</b> " + dataItem.extras.supporting_document_filename + "</p>";
            }
            if (dataItem.extras.supporting_document_url != '') {
                content += "<p><a class='competence-link ui-btn ui-btn-b ui-corner-all' href='" + self.remoteHost + dataItem.extras.supporting_document_url + "?access_code=" + localStorage['accessCode'] + "&cookie_consent=1" + "' >" + i18next.t("View-supporting-document") + "</a></p>";
            }
        }
    } else {
        content = "<p>" + i18next.t('There-was-a-problem-loading-this-item-please-try-a')  + "</p>";
    }

    self.populateItemPage(title, content);
};

MobileApp.prototype.postAjax = function (url, dataToSend, dataType) {

    var data = {
        url: url,
        type: 'POST',
        contentType: dataType,
        dataType: 'json',
        data: dataToSend,
        beforeSend: self.setHeaders
    };

    $.ajax(data).error(function (response) {

        if (response.status != 200) {

            console.error(response);
            var alert_message = i18next.t('There-was-a-problem-loading-this-item-please-try-a');
            navigator.notification.alert(
                alert_message,
                function () {
                    return false;
                },
                'Error',
                "OK"
            );
        }
    });
};

/** @function populateItmePageWithBookmark
 * @param {String} title
 * @param {JSON Object} content
 * @param {Int} id
 * @param {Boolean} bookmarked
 * @param {String} type
 * @description Populates the item page including a bookmark to the top right of the page. This function also handles the eventListener on each bookmarked button
**/
MobileApp.prototype.populateItemPageWithBookmark = function (title, content, id, bookmarked, type) {
    var self = this;
    self.originalBase = $('base').attr('href');
    $('base').attr('href', self.remoteHost);
    $('#itempage .content').empty();

    // Defaults to "non-bookmarked" icon
    var bookmarkedIcon = "fa-bookmark-o";

    if (bookmarked === "true" || bookmarked === true) {
        bookmarkedIcon = "fa-bookmark";
    }
    $('#itempage .content').append('<div style="text-align:right; z-index:100;"><a style="padding:10px;" data-bookmark="' + id + '" href="#"><i class="fa fa-lg ' + bookmarkedIcon + '" style="z-index:-100;" aria-hidden="true"></i></a></div>');
    $('#itempage .content').append($('<h2/>', { 'text': title })).append(content);
    $('#itempage').trigger('pagecreate');

    $("a[data-bookmark]").on("click", function () {

        // Switch to "bookmarked"
        if ($(this).children().hasClass("fa-bookmark-o")) {
            $(this).children().removeClass("fa-bookmark-o");
            $(this).children().addClass("fa-bookmark");

            if (type === "resource") {
                self.postAjax(self.remoteHost + self.bookmarkNoticeboardURL + id + "/", {}, "json");
            } else if (type === "news") {
                self.postAjax(self.remoteHost + self.bookmarkNewsURL + id + "/", {}, "json");
            } else {
                console.error("TYPE in populateItemPageWithBookmark can only be 'resource' or 'news'");
            }

            // Switch to "non-bookmarked"
        } else if ($(this).children().hasClass("fa-bookmark")) {
            $(this).children().removeClass("fa-bookmark");
            $(this).children().addClass("fa-bookmark-o");

            if (type === "resource") {
                self.postAjax(self.remoteHost + self.unbookmarkNoticeboardURL + id + "/", {}, "json");
            } else if (type == "news") {
                self.postAjax(self.remoteHost + self.unbookmarkNewsURL + id + "/", {}, "json");
            } else {
                console.error("TYPE in populateItemPageWithBookmark can only be 'resource' or 'news'");
            }
        }
    });
};

/** @function populateNoticeboardLists
 * @param {JSONObjsct} listData
 * @param {String} radioChoise
 * @description Gets and sets the noticeboard lists based on the radioChoice then adds the unread counter if nessesarry
**/
MobileApp.prototype.populateNoticeboardLists = function (listData, radioChoice) {
    var self = this;

    // initiate the lowercase category var here to avoid having to do it multiple times later on
    var lowerCase;
    var itemData;

    $.each(listData, function (category, items) {
        lowerCase = category.replace(/\s+|\W/g, '-').toLowerCase();

        self.feedOptions[lowerCase + "-list"] = "noticeboardData";

        itemData = self.getListByCategory(JSON.stringify(items), category, radioChoice);
        self.populateList(itemData, '#' + lowerCase + '-list', self.noItemsMsg);
        self.getItemCountByStatus('#' + lowerCase + '-count', itemData, "unread");
    });
};


/** @function sortNoticeboardItemsIntoCategories
 * @param {JSONObjsct} data
 * @param {Function} callback
 * @description Finds all objects of the same category and sorts the data into a new JSON Object based on those by categories
   The function will also save a list of categories it finds and dynamically create the HTML list elements to later be filled from the callback
**/
MobileApp.prototype.sortNoticeboardItemsIntoCategories = function (data, callback) {
    var self = this;

    //This array is where the sorted objects will go
    var categories = {};
    //This is to keep track of individual object categories
    var category;

    data = JSON.parse(data);

    // If there are no items in the data then the app will display the self.noItemsMsg in place of the categories
    if (data.length == 0 || data == undefined) {
        var brandingLabels = JSON.parse(self.getStorageValue('brandingLabels', '{}'));
        $('#noticeboard-section').empty();
        var content = '<h2 id="noticeboard-hdr">' + brandingLabels['noticeboard_label_plural'] + '</h2><ul data-role="listview" id="noticeboard-empty" data-divider-theme="a"><li class="emptyList"><h3>' + self.noItemsMsg + '</h3></li></ul>';
        $('#noticeboard-section').append(content).trigger("create");
        return null;
    }

    $.each(data, function (key, obj) {

        // Checks is the object has a category to begin with
        if (obj["extras"]) {
            if (obj["extras"]["category"]) {
                category = self.ifNullUseDefault(obj["extras"]["category"], "Uncategorised");
            } else {
                obj["extras"]["category"] = i18next.t("Uncategorised");
                category = obj["extras"]["category"];
            }
        } else {
            obj["extras"] = {};
            obj["extras"]["category"] = i18next.t("Uncategorised");
            category = obj["extras"]["category"];
        }

        // Sorting the noticeboard data by category so it's easier to deal with later
        if (!categories[category]) {
            categories[category] = [];

            // Checking if the category has already been dynamically created in index.html
            // This is to stop duplicates if commsPage is called again
            if (jQuery.inArray(category, self.categories) == -1) {

                self.createCategory('#noticeboard-section-categories', category);
                self.categories.push(category);
            }

            categories[category].push(obj);
        } else {
            categories[category].push(obj);
        }

    });

    if (callback && typeof callback == "function") {
        callback(categories);
    }
};

MobileApp.prototype.populateNoticeboardCategories = function (listData, id) {
    var self = this;
    var createdItems = [];
    $(".ui.modal").remove();
    $(".info-container").remove()

    var noticeboardCategoryTemplate = $(id);
    noticeboardCategoryTemplate.empty();   
    noticeboardCategoryTemplate.append($("<div/>").addClass("ui three column grid category container"));

    $.each(listData, function (category, items) {
        var cardStructureTemp = document.getElementById("noticeboard-category-card").content.cloneNode(true);
        cardStructureTemp = $(cardStructureTemp);
        cardStructureTemp.find(".column")
            .attr("data-category-name", category.replace(/[^a-z0-9\s]/gi, '')
            .replace(/[_\s]/g, '-')
            .toLowerCase());
        cardStructureTemp.find(".name").text(i18next.t(category));
        if (items[0].extras.category_icon != "") {
            cardStructureTemp.find(".name").append($("<img/>").attr("src", items[0].extras.category_icon));
        } else {
            cardStructureTemp.find(".name").append($("<i/>").addClass("clipboard list icon"));
        }
        var unreadCount = self.getNoticeboardCountForStatus(items, "unread") + self.getNoticeboardCountForStatus(items, "overdue");
        if (unreadCount > 0) {
            cardStructureTemp.find(".column").append($("<div/>").addClass("ui circular label").text(unreadCount));
            cardStructureTemp.find(".column").addClass("unread");
        }
        noticeboardCategoryTemplate.find(".category.container").append(cardStructureTemp);
        
        var noticeboardModalTemp = document.getElementById("modal-template-V2").content.cloneNode(true);
        noticeboardModalTemp = $(noticeboardModalTemp);
        noticeboardModalTemp.find(".modal").addClass(category.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase());
        noticeboardModalTemp.find(".modal").addClass("noticeboard-news");
        noticeboardModalTemp.find(".header").text(i18next.t(category));
        noticeboardModalTemp.find(".content").append($("<div/>").addClass("ui three column grid items container"));
        $.each(items, function (id, item) {
            var icon = $("<i/>").addClass("big circular inverted icon")
            if (item.extras.category_icon != "") {
                icon.append($("<img/>").attr("src", item.extras.category_icon));
            } else {
                 icon.addClass("clipboard list");
            }
            if (item.status == "unread" || item.status == "overdue") {
                icon.addClass("unread");
            } else {
                icon.addClass("read");
            }
            noticeboardItem = $("<div/>")
                .addClass("center aligned column")
                .attr("data-id", item.id)
                .attr("data-item-type", "noticeboard")
                .append(icon).append($("<h5/>").text(item.title));
            noticeboardModalTemp.find(".items.container").append(noticeboardItem);
            if (item.extras.signoff_required) {
                if(item.extras.signoff_datetime == null) {
                    noticeboardItem.append(
                        $("<i/>").addClass("circular inverted exclamation icon to-sign-off")
                    )
                } else {
                    noticeboardItem.append(
                        $("<i/>").addClass("circular inverted check icon signed-off")
                    )
                }
            }
        });
        noticeboardCategoryTemplate.find(".category.container").append(noticeboardModalTemp);
    });

    if (id == '#saved-documents-container .content.saved-noticeboard') {
        $("#saved-documents-container").prepend(
            $("<div/>").addClass("ui grid info-container").append(
                $("<div/>").addClass("left aligned fourteen wide column info-pop-up").append(
                    $("<h3/>").text(i18next.t("Saved-Items"))
                )
            ).append(
                $("<div/>").addClass("right aligned two wide column info-pop-up")
                    .append($("<i/>").addClass("big info circle icon").attr("data-legend-type", "noticeboard")))
        )
    } else {
        $(id + " .category.container").prepend(
            $("<div/>").addClass("right aligned sixteen wide column info-pop-up").append(
                $("<i/>").addClass("big info circle icon").attr("data-legend-type", "noticeboard")
            )
        )
    }
    var legendModalTemp = document.getElementById("modal-template-V2").content.cloneNode(true);
    legendModalTemp = $(legendModalTemp);
    legendModalTemp.find(".modal").addClass("legend noticeboard");
    legendModalTemp.find(".header")
        .text(i18next.t("Noticeboard"));
    legendModalTemp.find(".content").addClass("ui grid").append(
        $("<div/>").addClass("row").append(
            $("<div/>").addClass("column unread").append(
                $("<div/>").addClass("ui circular label")
            ).append($("<p/>").text(i18next.t("Unread-Items")))
        )
    ).append(
        $("<div/>").addClass("equal width row").append(
            $("<div/>").addClass("column").append(
                $("<i/>").addClass("circular inverted exclamation icon to-sign-off")
            ).append($("<p/>").text(i18next.t('Sign-Off-Required')))
        ).append(
            $("<div/>").addClass("column").append($("<i/>").addClass("circular inverted check icon signed-off"))
                .append($("<p/>")
                .text(i18next.t('Sign-Off-Completed'))),
        )
    );
    noticeboardCategoryTemplate.find(".category.container").append(legendModalTemp);

    noticeboardCategoryTemplate.find(".column[data-category-name]").on("click", function(e) {
        e.stopPropagation();
        $('.ui.fullscreen.modal.' + $(this).data("category-name")).modal('show');
    });
    noticeboardCategoryTemplate.find(".column[data-item-type]").on("click", function(e) {
        $(".ui.modal").modal('hide');
    });
};

MobileApp.prototype.populateModuleDocuments = function (items, id) {
    var self = this;

    var documentCategoryTemplate = $(id);
    documentCategoryTemplate.empty();
    documentCategoryTemplate.append($("<div/>").addClass("ui three column grid category container"));

    var moduleDocumentsTemp = document.getElementById("noticeboard-category-card").content.cloneNode(true);
    moduleDocumentsTemp = $(moduleDocumentsTemp);
    moduleDocumentsTemp.find(".column").attr("data-category-name", "documents");
    moduleDocumentsTemp.find(".name")
        .text(i18next.t("Documents"))
        .append($("<i/>")
        .addClass("copy icon"));

    var moduleCertificatesTemp = document.getElementById("noticeboard-category-card").content.cloneNode(true);
    moduleCertificatesTemp = $(moduleCertificatesTemp);
    moduleCertificatesTemp.find(".column").attr("data-category-name", "certificates");;
    moduleCertificatesTemp.find(".name")
        .text(i18next.t("Certificates"))
        .append($("<i/>")
        .addClass("certificate icon"));

    documentCategoryTemplate.find(".category.container").append(moduleDocumentsTemp);
    documentCategoryTemplate.find(".category.container").append(moduleCertificatesTemp);
  
    var documentModalTemp = document.getElementById("modal-template-V2").content.cloneNode(true);
    documentModalTemp = $(documentModalTemp);
    documentModalTemp.find(".modal").addClass("documents");
    documentModalTemp.find(".modal").addClass("noticeboard-news");
    documentModalTemp.find(".header").text("Documents");
    documentModalTemp.find(".content").append($("<div/>").addClass("ui three column grid items container"));
    documentModalTemp.find(".content .container").append(
        $("<div/>").addClass("sixteen wide center aligned column")
            .append($("<h3/>")
            .text(i18next.t("You-have-no-saved-documents")))
    );

    var certificateModalTemp = document.getElementById("modal-template-V2").content.cloneNode(true);
    certificateModalTemp = $(certificateModalTemp);
    certificateModalTemp.find(".modal").addClass("certificates");
    certificateModalTemp.find(".modal").addClass("noticeboard-news");
    certificateModalTemp.find(".header")
        .text(i18next.t("Certificates"));
    certificateModalTemp.find(".content").append($("<div/>").addClass("ui three column grid items container"));
    certificateModalTemp.find(".content .container").append($("<div/>").addClass("sixteen wide center aligned column")
            .append($("<h3/>")
            .text(i18next.t("You-have-no-saved-certificates")))
    );

    $.each(items, function (id, item) {
        if (item.type == "download") {
            documentModalTemp.find(".content .container .sixteen.column").remove();
            var icon = $("<i/>").addClass("big circular inverted read file icon")
            documentModalTemp.find(".items.container")
                .append($("<div/>")
                .addClass("center aligned column")
                .attr("data-id", item.id)
                .attr("data-action", "open-external")
                .attr("href", self.remoteHost + item.url)
                .append(icon)
                .append($("<h5/>")
                .text(item.name)));
        } else {
            certificateModalTemp.find(".content .container .sixteen.column").remove();
            var icon = $("<i/>").addClass("big circular inverted read certificate icon")
            certificateModalTemp.find(".items.container").append(
                $("<div/>").addClass("center aligned column").attr("data-id", item.id)
                    .attr("data-action", "open-external").attr("href", self.remoteHost + item.url)
                    .append(icon).append(
                    $("<h5/>").text(item.name)
                )
            );
        }
    });
    documentCategoryTemplate.find(".category.container").append(documentModalTemp);
    documentCategoryTemplate.find(".category.container").append(certificateModalTemp);
    documentCategoryTemplate.find(".column[data-category-name]").on("click", function(e) {
        e.stopPropagation();
        $(".ui.fullscreen.modal." + $(this).data("category-name")).modal("show");
    });
};

MobileApp.prototype.populateNewsList = function(listData, listId, emptyMessage) {    
    var self = this;
    emptyMessage = emptyMessage || "";
    var createdListItems = [];
    var objectList = "";
    var listItem = "";
    var listItemTitle = "";
    var listItemLink = "";

    if (typeof (listData) == 'string') {
        objectList = JSON.parse(listData);
    } else {
        objectList = listData;
    }

    if (objectList.length == 0) {
        listItem = $("<li/>", { "class": "emptylist" });
        listItemTitle = $("<h3/>", { "text": emptyMessage });
        listItem.append(listItemTitle);
        createdListItems.push(listItem);
    } else {
         $.each(objectList, function (index, item) {
            var cardStructureTemp = document.getElementById("news-item-card").content.cloneNode(true);
            if (item.extras.thumbnail_url) {
                $(cardStructureTemp).find('.flow-card').attr("style","background-image: url('" + item.extras.thumbnail_url + "');");
            } else {
                $(cardStructureTemp).find('.flow-card').attr("style","background-image: url('img/news_image_placeholder.png');");
            }
            cardStructureTemp.querySelector('.item-header-left').innerText = item.title;
            cardStructureTemp.querySelector('.item-header-right').innerText = item.keydate;
            cardStructureTemp.querySelector('.published-by').innerText = i18next.t('Published-by') + " : " + item.extras.published_by;
            $(cardStructureTemp).find('.item-link').attr("data-id", item.id);
            var bookmarked = item.extras.bookmarked;

            if (bookmarked) {
                var removeBtn = document.getElementById("remove-from-library-button").content.cloneNode(true);
                removeBtn.querySelector('.button-container').setAttribute("data-id", item.id);
                removeBtn.querySelector('.button-container').setAttribute("data-type", item.type);
                cardStructureTemp.querySelector('.extra').append(removeBtn);
            } else {
                var addBtn = document.getElementById("add-to-library-button").content.cloneNode(true);
                addBtn.querySelector('.button-container').setAttribute("data-id", item.id);
                addBtn.querySelector('.button-container').setAttribute("data-type", item.type);
                cardStructureTemp.querySelector('.extra').append(addBtn);
            }

            createdListItems.push(cardStructureTemp);
        });

        listview = $(listId);

        listview.empty();
        listview.append(createdListItems);

        if (listview.hasClass('ui-listview')) {
            listview.listview('refresh');
        } else {
            listview.trigger('create');
        }
    }
}

MobileApp.prototype.create_trainee_filters = function(filters) {
    var self = this;
    $('#calendar_filters').remove();
    $('.fc-header-toolbar').append(
    '<div id="calendar_filters" class="ui grid"> \
        <div class="two column row"> \
            <div class="column"> \
                <select class="ui fluid search dropdown trainee type"> \
                    <option value="">' + i18next.t('Type') + '</option> \
                </select> \
            </div> \
            <div class="column"> \
                <select class="ui fluid search dropdown trainee classifications"> \
                    <option value="">' + i18next.t('Classification') + '</option> \
                </select> \
            </div> \
        </div> \
        <div class="one column row"> \
            <div class="column"> \
                <button id="reset_filters" type="button" class="fc-button fc-state-default">' + i18next.t('Reset-filter') + '</button> \
            </div> \
        </div> \
    </div>');
    //$('.fc-header-toolbar').append('<div id="calendar_filters" class="ui three column grid"> \
    //    <div class="row"> \
    //        <div class="column"> \
    //            <select class="ui fluid search dropdown trainee type"> \
    //        <option value="">'+gettext('Type')+'</option> \
    //            </select> \
    //        </div> \
    //        <div class="column"> \
    //            <select class="ui fluid search dropdown trainee classifications"> \
    //        <option value="">'+gettext('Classification')+'</option> \
    //            </select> \
    //        </div> \
    //        <div class="column"> \
    //        <button id="reset_filters" type="button" class="btn btn-primary btn-block btn-branded">'+gettext('Reset filter')+'</button> \
    //        </div> \
    //    </div> \
    //</div>');
    for (var i = 0 ; i < filters['types'].length; i++) {
        $('.type').append('<option value="' + filters['types'][i] + '">' + filters['types'][i] + '</option>');
    }
    for (var i = 0 ; i < filters['classifications'].length; i++) {
        $('.classifications').append('<option style="background: ' + filters['classifications'][i]
            .split('^')[1] + '; color: #fff;" value="' + filters['classifications'][i].split('^')[0] + '">' + filters['classifications'][i].split('^')[0] + '</option>');
    }
    self.handle_trainee_filters();
    self.handle_reset();
}

MobileApp.prototype.handle_trainee_filters = function() {
        $('select[class*="trainee"]').change(function() {
            var type = $('select[class*="type"]')
            var type_value = type["0"].options[type["0"].selectedIndex].value
            var classifications = $('select[class*="classifications"]')
            var classifications_value = classifications["0"].options[classifications["0"].selectedIndex].value

            $('.fc-event-container > a').hide()

            $('.fc-event-container > a').each(function () {
                var attrs = []
                var filter = []

                attrs.push($(this).attr('data-type'))
                attrs.push($(this).attr('data-classification'))

                if (type_value != '') filter.push(type_value)
                if (classifications_value != '') filter.push(classifications_value)

                if (filter.every(function(elem) { return $.inArray(elem, attrs) > -1 })){
                    $(this).show()
                }
            })
        });
}

MobileApp.prototype.handle_reset = function() {
        $('#reset_filters').click(function() {
            $('select[class*="course_name"]').val('').change()
            $('select[class*="location"]').val('').change()
            $('select[class*="trainer"]').val('').change()
            $('select[class*="type"]').val('').change()
            $('select[class*="branches"]').val('').change()
            $('select[class*="classifications"]').val('').change()
        });
    }

MobileApp.prototype.getTrainingCalendar = function(id) {
    var self = this;
    var brandingItems = JSON.parse(self.getStorageValue('brandingData', '{}'));
    var brand_key = self.ifNullUseDefault(brandingItems['brand_key'], "celest");
    var tr_filt = {
        types: [],
        classifications: []
    };
    function shortDeviceLanguage(language) {
        var short = language.split('-');
        var short_language = short[0];
        return short_language;
    }
    $('#my-training .white-toolbar').find('h1')
        .text(i18next.t('Training-Calendar'));
    var saved_locale = localStorage.locale;
    var short_language = shortDeviceLanguage(saved_locale);
    $(id + " #mobile-app-calendar").fullCalendar({
        locale: short_language,
        eventSources: [
            {
                url: self.remoteHost + "/api/module_manager_calendar/",
                type: 'GET',
                data: {
                    brand_key: brand_key,
                },
                textColor: 'white'
            }
        ],
        eventRender: function(event, element) {
            if (event["end"] == null){
                event["end"] = event["start"]
            }
            element["0"].setAttribute('data-type', event["data-type"])
            element["0"].setAttribute('data-classification', event["data-classification"])
            element.css('cursor', 'pointer');
            tr_filt.types.push(event["data-type"])
            tr_filt.classifications.push(event["data-classification"] + '^' + event["color"])
        },
        eventAfterAllRender: function() {
            tr_filt.types = Array.from(new Set(tr_filt.types))
            tr_filt.classifications = Array.from(new Set(tr_filt.classifications))
            self.create_trainee_filters(tr_filt);
            tr_filt = {
                types: [],
                classifications: []
            };

        },
        viewRender: function(info) {
            // clear any existing details panel values
            $(id + " #calendar-events").empty();
        },
        eventClick: function(calEvent, jsEvent, view) {
            // change the border color just for fun
            // $(this).css('border-color', 'red');

            $(id + " #calendar-events").empty();
            $(id + " #calendar-events").append(
                $("<div/>").addClass("ui relaxed divided list")
            )
            var event = calEvent;
            var session_dates = event.start.format("YYYY-MM-DD HH:mm");
            if (event.end) {
                session_dates = session_dates + " - " + event.end.format("YYYY-MM-DD HH:mm");
            }
            $(id + " #calendar-events .list").append(
                $("<div/>").addClass("item").append(
                    $("<i/>").addClass("large users middle aligned icon")
                ).append(
                    $("<div/>").addClass("content").append(
                        $("<div/>").addClass("header").text(event.title),
                        $("<div/>").addClass("description").text(session_dates)
                    )
                ).attr("data-id", event.id).attr("data-item-type", "training session")
            )
        },
        dayClick: function(date, jsEvent, view) {
            $(id + " #calendar-events").empty();
            var events = $(id + " #mobile-app-calendar").fullCalendar('clientEvents', function(event) {                
                var clickedDate = date;                
                if(clickedDate.format() == event.start.format("YYYY-MM-DD")) {
                    return event;
                }
            });
            if (events.length > 0) {
                $(id + " #calendar-events").append(
                    $("<div/>").addClass("ui relaxed divided list")
                )
                $.each(events, function(index, event) {
                    var session_dates = event.start.format("YYYY-MM-DD HH:mm");
                    if (event.end) {
                        session_dates = session_dates + " - " + event.end.format("YYYY-MM-DD HH:mm");
                    }
                    $(id + " #calendar-events .list").append(
                        $("<div/>").addClass("item").append(
                            $("<i/>").addClass("large users middle aligned icon")
                        ).append(
                            $("<div/>").addClass("content").append(
                                $("<div/>").addClass("header").text(event.title),
                                $("<div/>").addClass("description").text(session_dates)
                            )
                        ).attr("data-id", event.id).attr("data-item-type", "training session")
                    )
                })
            }
        },
        timeFormat: 'H:mm',
        header: {
            left: 'prev, next, today',
            center: 'title',
            right: 'month, agendaWeek, agendaDay'
        },
    });
}

MobileApp.prototype.getTraineeDetails = function() {
    var self = this;

    if (localStorage.traineeDetails) {
        self.populateTraineeDetails(localStorage.traineeDetails);
    } else {
        $('#account-details-page').prepend($("<div/>").addClass("sixteen wide column loading"));
        $('#account-details-page .column.error').remove();
        self.appendMsg("#account-details-page .column.loading", i18next.t("Loading-account-details"));
    }

    $.ajax({
        url: self.remoteHost + self.traineeDetailsURL,
        type: 'GET',
        dataType: 'json',   
        success: function (data) {
            var newData = JSON.stringify(data);
            if (localStorage.traineeDetails != newData) {
                localStorage.traineeDetails = newData;
                $('#account-details-page .column.loading').remove();
                $('#account-details-page .column.error').remove();
                self.populateTraineeDetails(localStorage.traineeDetails);
            }
        },
        error: function (e) {
            var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
            if(activePage[0].id == "account-details-page") {
                if (localStorage.traineeDetails) {
                    self.populateTraineeDetails(localStorage.traineeDetails);
                } else {
                    $('#account-details-page .column.loading').remove();
                    $('#account-details-page').prepend($("<div/>").addClass("sixteen wide column error"));
                    self.appendMsg("#account-details-page .column.error", i18next.t("Could-not-load-account-details"));
                }
            }

        },
        beforeSend: self.setHeaders
    });
}

MobileApp.prototype.populateTraineeDetails = function(trainee_data) {
    var self = this;
    var trainee_data = JSON.parse(trainee_data);

    if (trainee_data.avatar) {
        $('#panelmenu').find('img.profile').attr('src', trainee_data.avatar);
        $('#account-details-page').find('.small.centered.circular.image').attr('src', trainee_data.avatar);
    }
    $('#account-details-page').find('.column.name span').text(trainee_data.name);
    $('#account-details-page').find('.column.email span').text(trainee_data.email);
    $('#account-details-page').find('.column.job-title span').text(trainee_data.job_title);
    $('#account-details-page').find('.column.branch span').text(trainee_data.branch);
    if (trainee_data.dob) {
        $('#account-details-page').find('.column.dob').show();
        $('#account-details-page').find('.column.dob span').text(trainee_data.dob);
    } else {
        $('#account-details-page').find('.column.dob').hide();
    }
}