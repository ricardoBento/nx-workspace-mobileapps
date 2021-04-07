jQuery(document).ready(function($) {
    function create_filters(filters) {
        $('#calendar_filters').remove();
        $('.reset').remove();
        $('.fc-header-toolbar').append('<div id="calendar_filters" class="row"> \
                <div class="col-md-2 col-pad-5"> \
                    <select class="selectpicker course_name" data-width="100%" data-live-search="true">');

        $('.course_name').append('<option value="">Course name</option>');
        for (var i = 0 ; i < filters['course_names'].length; i++) {
            $('.course_name').append('<option value="' + filters['course_names'][i] + '">' + filters['course_names'][i] + '</option>');
        }
        $('.col-md-2').append('</select> \
                </div>');

        $('.course_name').parent().after('<div class="col-md-2 col-pad-5"> \
            <select class="selectpicker classifications" data-width="100%" data-live-search="true">');
        $('.classifications').append('<option value="">Classification</option>');
        for (var i = 0 ; i < filters['classifications'].length; i++) {
            $('.classifications').append('<option style="background: ' + filters['classifications'][i].split('^')[1] + '; color: #fff;" value="' + filters['classifications'][i].split('^')[0] + '">' + filters['classifications'][i].split('^')[0] + '</option>');
        }

        $('.col-md-2').append('</select> \
                </div>');

        $('.classifications').parent().after('<div class="col-md-2 col-pad-5"> \
            <select class="selectpicker trainer" data-width="100%" data-live-search="true">');
        $('.trainer').append('<option value="">Trainer</option>');
        for (var i = 0 ; i < filters['trainers'].length; i++) {
            $('.trainer').append('<option value="' + filters['trainers'][i] + '">' + filters['trainers'][i] + '</option>');
        }
        $('.col-md-2').append('</select> \
                </div>');

        $('.trainer').parent().after('<div class="col-md-2 col-pad-5"> \
            <select class="selectpicker type" data-width="100%" data-live-search="true">');
        $('.type').append('<option value="">Type</option>');
        for (var i = 0 ; i < filters['types'].length; i++) {
            $('.type').append('<option value="' + filters['types'][i] + '">' + filters['types'][i] + '</option>');
        }
        $('.col-md-2').append('</select> \
                </div>');

        $('.type').parent().after('<div class="col-md-2 col-pad-5"> \
            <select class="selectpicker branches" data-width="100%" data-live-search="true">');
        $('.branches').append('<option value="">Branch</option>');
        for (var i = 0 ; i < filters['branches'].length; i++) {
            $('.branches').append('<option value="' + filters['branches'][i].split(' ').join('-') + '">' + filters['branches'][i] + '</option>');
        }
        $('.col-md-2').append('</select> \
                </div>');

        $('.branches').parent().after('<div class="col-md-2 col-pad-5"> \
            <select class="selectpicker location" data-width="100%" data-live-search="true">');
        $('.location').append('<option value="">Location</option>');
        for (var i = 0 ; i < filters['locations'].length; i++) {
            $('.location').append('<option value="' + filters['locations'][i] + '">' + filters['locations'][i] + '</option>');
        }

        $('#calendar_filters').after('<div class="row reset"><div class="col-md-12"> \
                                    <button id="reset_filters" type="button" class="btn btn-primary btn-block btn-branded">Reset filters</button> \
                               </div> \
                            </div></div>');
        $('.selectpicker').selectpicker('refresh');
        handle_filters();
        handle_reset();
        filt = {
            course_names: [],
            locations: [],
            classifications: [],
            trainers: [],
            types: [],
            branches: []
        };
    }

    function create_trainee_filters(filters) {
        $('#calendar_filters').remove();
        $('.fc-header-toolbar').append('<div id="calendar_filters" class="ui three column grid"> \
            <div class="row"> \
                <div class="column"> \
                    <select class="ui fluid search dropdown trainee type"> \
                <option value="">'+gettext('Type')+'</option> \
                    </select> \
                </div> \
                <div class="column"> \
                    <select class="ui fluid search dropdown trainee classifications"> \
                <option value="">'+gettext('Classification')+'</option> \
                    </select> \
                </div> \
                <div class="column"> \
                <button id="reset_filters" type="button" class="btn btn-primary btn-block btn-branded">'+gettext('Reset filter')+'</button> \
                </div> \
            </div> \
        </div>');
        for (var i = 0 ; i < filters['types'].length; i++) {
            $('.type').append('<option value="' + filters['types'][i] + '">' + filters['types'][i] + '</option>');
        }
        for (var i = 0 ; i < filters['classifications'].length; i++) {
            $('.classifications').append('<option style="background: ' + filters['classifications'][i].split('^')[1] + '; color: #fff;" value="' + filters['classifications'][i].split('^')[0] + '">' + filters['classifications'][i].split('^')[0] + '</option>');
        }
        handle_trainee_filters();
        handle_reset();
        tr_filt = {
            types: [],
            classifications: []
        };
    }

    function handle_filters() {
        $('select:not(.trainee)').change(function() {
            var name = $('select[class*="course_name"]')
            var name_value = name["0"].options[name["0"].selectedIndex].value
            var location = $('select[class*="location"]')
            var location_value = location["0"].options[location["0"].selectedIndex].value
            var trainer = $('select[class*="trainer"]')
            var trainer_value = trainer["0"].options[trainer["0"].selectedIndex].value
            var type = $('select[class*="type"]')
            var type_value = type["0"].options[type["0"].selectedIndex].value
            var branches = $('select[class*="branches"]')
            var branches_value = branches["0"].options[branches["0"].selectedIndex].value
            var classifications = $('select[class*="classifications"]')
            var classifications_value = classifications["0"].options[classifications["0"].selectedIndex].value

            $('.fc-event-container > a').hide()

            $('.fc-event-container > a').each(function () {
                var event = $(this)
                var attrs = []
                var filter = []

                attrs.push($(this).attr('data-course-name'))
                attrs.push($(this).attr('data-location'))
                attrs.push($(this).attr('data-trainer-name'))
                attrs.push($(this).attr('data-training-type'))
                attrs.push($(this).attr('data-classification'))
                br = $(this).attr('data-branches').split(' ')
                for (b in br) {
                    attrs.push(br[b]);
                }

                if (name_value != '') filter.push(name_value)
                if (location_value != '') filter.push(location_value)
                if (trainer_value != '') filter.push(trainer_value)
                if (type_value != '') filter.push(type_value)
                if (branches_value != '') filter.push(branches_value)
                if (classifications_value != '') filter.push(classifications_value)

                if (filter.every(function(elem) { return $.inArray(elem, attrs) > -1 })){
                    $(this).show()
                }
            });
        });
    }

    function handle_trainee_filters () {
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

    function handle_reset () {
        $('#reset_filters').click(function() {
            $('select[class*="course_name"]').val('').change()
            $('select[class*="location"]').val('').change()
            $('select[class*="trainer"]').val('').change()
            $('select[class*="type"]').val('').change()
            $('select[class*="branches"]').val('').change()
            $('select[class*="classifications"]').val('').change()
        });
    }

    var companyKey, brandKey;
    companyKey = $("#calendar").attr("data-companykey");
    readOnly = $("#calendar").attr("data-readonly");
    mmVersion = $("#module_manager_calendar").attr("data-mm-version");
    brandKey = $("#module_manager_calendar").attr("data-brandkey");
    mmReadOnly = $("#module_manager_calendar").attr("data-readonly");

    var filt = {
        course_names: [],
        locations: [],
        trainers: [],
        types: [],
        branches: [],
        classifications: []
    };

    if (readOnly == 'false') {
        $('#calendar').fullCalendar({
            locale: document.documentElement.lang,
            eventSources: [
                {
                    url: "/calendar",
                    type: 'GET',
                    data: {
                        company_key: companyKey,
                        read_only: readOnly
                    },
                    textColor: 'white'
                }
            ],
            eventRender: function(event, element) {
                if (event["end"] == null){
                    event["end"] = event["start"]
                }
                element["0"].setAttribute('data-course-name', event["data-course-name"]);
                element["0"].setAttribute('data-location', event["data-location"]);
                element["0"].setAttribute('data-trainer-name', event["data-trainer-name"]);
                element["0"].setAttribute('data-training-type', event["data-training-type"]);
                element["0"].setAttribute('data-branches', event["data-branches"]);
                element["0"].setAttribute('data-classification', event["data-classification"]);
                element.css('cursor', 'pointer');
                popover_content = $('<div/>').html(
                    $('<p/>')
                        .append(
                            $('<div/>').html(
                                $('<label/>').html(
                                    gettext('Location:&nbsp;')
                                )
                            ).append(event["data-location"])

                        )
                        .append(
                            $('<div/>').html(
                                $('<label/>').html(
                                    gettext('Start Date:&nbsp;')
                                )
                            ).append(event["start"].format("Do MMM YYYY, h:mma"))
                        )
                        .append(
                            $('<div/>').html(
                                $('<label/>').html(
                                    gettext('End Date:&nbsp;')
                                )
                            ).append(event["end"].format("Do MMM YYYY, h:mma"))
                        )
                        .append(
                            $('<div/>').html(
                                $('<label/>').html(
                                    gettext('Available places:&nbsp;')
                                )
                            ).append(event["data-available-places"])
                        )
                    )
                    .append($('<div/>').html($('<a/>').html(gettext('More details')).attr('href', event.data_url)))
                element.popover({
                    html: true,
                    title: '<b>' + event["data-course-name"] + '</b>',
                    content: popover_content,
                    triger: 'click',
                    placement: 'top',
                    container: 'body'
                });

                $('body').on('click', function (e) {
                    if (!element.is(e.target) && element.has(e.target).length === 0 && $('.popover').has(e.target).length === 0)
                        element.popover('hide');
                });

                filt.course_names.push(event["data-course-name"]);
                filt.locations.push(event["data-location"]);
                filt.trainers.push(event["data-trainer-name"]);
                filt.types.push(event["data-training-type"]);
                branches = event["data-branches"].split(' ');
                for (var i = 0; i < branches.length; i++) {
                    filt.branches.push(branches[i].split('-').join(' '));
                }
                filt.classifications.push(event["data-classification"] + '^' + event["color"]);
            },
            timeFormat: 'H:mm',
            header: {
                left: 'prev, next, today',
                center: 'title',
                right: 'month, agendaWeek, agendaDay'
            },
            eventAfterAllRender: function() {
                filt.course_names = ArrNoDupe(filt.course_names).filter(function(n){return n; });
                filt.locations = ArrNoDupe(filt.locations).filter(function(n){return n; });
                filt.trainers = ArrNoDupe(filt.trainers).filter(function(n){return n; });
                filt.types = ArrNoDupe(filt.types).filter(function(n){return n; });
                filt.branches = ArrNoDupe(filt.branches).filter(function(n){return n; });
                filt.classifications = ArrNoDupe(filt.classifications).filter(function(n){return n; });
                create_filters(filt);
                $('.popover').remove()
            }
        });
    } else {
        $('#calendar').fullCalendar({
            locale: document.documentElement.lang,
            defaultView: 'listWeek',
            views: {
                listDay: { buttonText: 'List Day' },
                listWeek: { buttonText: 'List Week' },
                listMonth: { buttonText: 'List Month' }
            },
            eventSources: [
                {
                    url: "/calendar",
                    type: 'GET',
                    data: {
                        company_key: companyKey,
                        read_only: readOnly
                    },
                    textColor: 'white'
                }
            ],
            eventRender: function(event, element) {
                if (event['has_user_trainees']) {
                    element.find('.fc-list-item-title').append(
                        $('<div></div>')
                        .text(event['has_user_trainees'])
                        .css('float', 'right')
                        .prepend(
                            $('<img></img>')
                            .attr('src', '/static/bookings/img/icon-heading-trainees.png')
                            .height(16)
                            .width(16)
                            .css('margin-right', '4px')
                            .css('margin-top', '-3px')
                        )
                    )
                }
            },
            timeFormat: 'H:mm',
            header: {
                left: 'prev, next, today',
                center: 'title',
                right: 'listMonth, listWeek, listDay'
            },
            eventClick: function(calEvent, jsEvent, view) {
                if (calEvent.trainees) {
                    $('#sessionDetailsModal').modal('show')
                    $('#sessionDetailsModal')
                    .find('.modal-title')
                    .html(calEvent.title)
                    var tbody = $('<tbody></tbody>')
                    // reset modal body for next session
                    $('#sessionDetailsModal').find('.modal-body').html('');
                    $('#sessionDetailsModal')
                    .find('.modal-body')
                    .append(
                        $('<table></table')
                        .addClass('standard_table fullwidth')
                        .append(
                            $('<thead></thead>')
                            .append(
                                $('<tr></tr>')
                                .append('<th>Name</th>')
                                .append('<th>Job Title</th>')
                                .append('<th>Location</th>')
                                .append('<th>status</th>')
                            )
                        )
                        .append(tbody)
                    )
                    $.each(calEvent.trainees, function(index, value) {
                        tbody.append(
                            $('<tr></tr>')
                            .append(
                                $('<td></td>')
                                .append(
                                    $('<a></a>')
                                    .text(value.name)
                                    .attr('href', value.data_url)
                                    .attr('target', 'blank')
                                )
                            ).append(
                                $('<td></td>')
                                .text(value.job_title)
                            ).append(
                                $('<td></td>')
                                .text(value.location)
                            ).append(
                                $('<td></td>')
                                .text(value.session_status)
                            )
                        )
                    })
                }
            }
        });
    }

    function ArrNoDupe(a) {
        var temp = {};
        for (var i = 0; i < a.length; i++)
            temp[a[i]] = true;
        var r = [];
        for (var k in temp)
            r.push(k);
        return r;
    }

    var tr_filt = {
        types: [],
        classifications: []
    };

    if (mmReadOnly == 'false') {
        $('#module_manager_calendar').fullCalendar({
            locale: document.documentElement.lang,
            eventSources: [
                {
                    url: "/api/module_manager_calendar",
                    type: 'GET',
                    data: {
                        brand_key: brandKey,
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
                if (mmVersion == "v2") {
                    popup_html = $('<div/>').html(
                    $('<p/>')
                        .append(
                            $('<h4/>').html(event["data-course-name"])
                        )
                        .append(
                            $('<div/>').html(
                                $('<b/>').html(
                                    gettext('Location:&nbsp;')
                                )
                            ).append(event["data-location"])
                        )
                        .append(
                            $('<div/>').html(
                                $('<b/>').html(
                                    gettext('Start Date:&nbsp;')
                                )
                             ).append(
                                event["start"].format("Do MMM YYYY, h:mm a")
                            )
                        )
                        .append(
                            $('<div/>').html(
                                $('<b/>').html(
                                    gettext('End Date:&nbsp;')
                                )
                            ).append(event["end"].format("Do MMM YYYY, h:mm a"))
                        )
                        .append(
                            $('<div/>').html(
                                $('<b/>').html(
                                    gettext('Available places:&nbsp;')
                                )
                            ).append(event["data-available-places"])
                        )
                    )
                    .append(
                        $('<div/>')
                            .html(
                                $('<a/>')
                                    .html('More details')
                                    .attr('href', event.data_url)
                            )
                    )
                    element.popup({
                        html : popup_html,
                        on : 'click'
                    });
                } else {
                    popover_content = $('<div/>').html(
                    $('<p/>')
                        .append(
                            $('<div/>').html(
                                $('<label/>').html(
                                    gettext('Location:&nbsp;')
                                )
                            ).append(event["data-location"])
                        )
                        .append(
                            $('<div/>').html(
                                $('<label/>').html(
                                    gettext('Start Date:&nbsp;')
                                )
                            ).append(event["start"].format("Do MMM YYYY, h:mma"))
                        )
                        .append(
                            $('<div/>').html(
                                $('<label/>').html(
                                    gettext('End Date:&nbsp;')
                                )
                            ).append(event["end"].format("Do MMM YYYY, h:mma"))
                        )
                        .append(
                            $('<div/>').html(
                                $('<label/>').html(
                                    gettext('Available places:&nbsp;')
                                )
                            ).append(event["data-available-places"])
                        )
                    )
                    .append($('<div/>').html($('<a/>').html(gettext('More details')).attr('href', event.data_url)))
                    element.popover({
                        html: true,
                        title: '<b>' + event["data-course-name"] + '</b>',
                        content: popover_content,
                        triger: 'click',
                        placement: 'top',
                        container: 'body'
                    });

                    $('body').on('click', function (e) {
                        if (!element.is(e.target) && element.has(e.target).length === 0 && $('.popover').has(e.target).length === 0)
                            element.popover('hide');
                    });
                }
                tr_filt.types.push(event["data-type"])
                tr_filt.classifications.push(event["data-classification"] + '^' + event["color"])
            },
            timeFormat: 'H:mm',
            header: {
                left: 'prev, next, today',
                center: 'title',
                right: 'month, agendaWeek, agendaDay'
            },
            eventAfterAllRender: function() {
                tr_filt.types = Array.from(new Set(tr_filt.types))
                tr_filt.classifications = Array.from(new Set(tr_filt.classifications))
                create_trainee_filters(tr_filt);
                try {
                    $('#my-bookings .button').html(gettext('Show More'))
                    $('#my-bookings').css('max-height', $('#module_manager_calendar').outerHeight());
                    $.each($('#my-bookings .list').children(), function(index, value){
                        if ($(value).data().counter > 8) {
                            $(value).hide();
                        }
                    })
                    if ($('#my-bookings .list').children().last().data().counter > 8 ) {
                        $('#my-bookings .button').show();
                    } else {
                        $('#my-bookings .button').hide();
                    }
                    $('#my-bookings .button').on('click', function(){
                        $.each($('#my-bookings .list').children(), function(index, value){
                        if ($(value).data().counter > 8) {
                                $(value).toggle();
                            }
                        })
                        if ($(this).html() == gettext('Show More')) {
                            $(this).html(gettext('Show Less'));
                        } else {
                            $(this).html(gettext('Show More'));
                        }
                    });
                } catch (err) {
                    ;
                }
                if (mmVersion == "v1") {
                    $('.popover').remove()
                }
            }
        });
    } else {
        $('#module_manager_calendar').fullCalendar({
            locale: document.documentElement.lang,
            defaultView: 'listWeek',
            views: {
                listDay: { buttonText: gettext('List Day') },
                listWeek: { buttonText: gettext('List Week') },
                listMonth: { buttonText: gettext('List Month') }
            },
            eventSources: [
                {
                    url: "/api/module_manager_calendar",
                    type: 'GET',
                    data: {
                        brand_key: brandKey,
                        read_only: mmReadOnly
                    },
                    textColor: 'white'
                }
            ],
            timeFormat: 'H:mm',
            header: {
                left: 'prev, next, today',
                center: 'title',
                right: 'listMonth, listWeek, listDay'
            },
            eventClick: function(event) {
                return false;
            },
            eventMouseover: function(event) {
                return false;
            }
        });
    }
});


// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}