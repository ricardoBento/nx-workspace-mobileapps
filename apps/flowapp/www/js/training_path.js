(function( $ ){
    "use strict";

    $.fn.buildTrainingPath = function(path_items) {

        var remoteHost = localStorage.remoteHost;

        var icon_lookup = {
            "Pass": "check",
            "module": "laptop",
            "competence": "file alternate",
            "external training": "users",
            "appraisal": "tasks",
            "workbook": "pencil"
        };

        var status_lookup = {
            "Pass": "passed",
            "In progress": "in-progress",
            "Overdue": "overdue",
            "Fail": "fail",
            "finish": "passed"
        };

        var all_pass = 0;
        $.each(path_items, function(index, value) {
            if (value.status === "Pass") {
                all_pass++;
            }
        });
        if (path_items.length === all_pass) {
            all_pass = "all-pass";
        }
        var lets_go = i18next.t("Lets-Go");
        var well_done = i18next.t("Well-done");
        path_items.unshift({
            id: null,
            title: lets_go,
            due_date: null,
            status: "start",
            type: "start",
            all_pass: all_pass
        });
        path_items.push({
            id: null,
            title: well_done,
            due_date: null,
            status: "finish",
            type: "finish",
            all_pass: all_pass
        });
        var column_count = {};
        if ($(window).width() < 768) {
            column_count = {
                class: "four",
                number: 4
            };
        } else {
            column_count = {
                class: "six",
                number: 6
            };
        }
        var status_counts = path_items.reduce(function(sums,entry){
           sums[entry.status] = (sums[entry.status] || 0) + 1;
           return sums;
        },{});

        var row_counter = 0;
        var top_right = true;
        var first_found = false;

        $.each(path_items, function(index, item) {
            var rendered_item = render_item(index, item, top_right, row_counter, column_count);
            $(rendered_item.append_to).last().append(rendered_item.html);
            if (row_counter == column_count.number) {
                row_counter = 0;
                top_right = !top_right;
            } else {
                row_counter++;
            }
            if (status_counts.Overdue > 0) {
                if (!first_found && item.status == "Overdue") {
                    //get_item_data(item.id, item.type);
                    first_found = true;
                }
            } else {
                if (!first_found && item.status == "Not yet started") {
                    //get_item_data(item.id, item.type);
                    first_found = true;
                }
            }
        });
        $(".column .animate").hide();
        $(".column .animate").transition({
            animation : "scale",
            interval : 150
        });

        function get_append_to(row_counter, column_count) {
            if (row_counter == 0 || row_counter == column_count.number) {
                return ".path-items";
            } else {
                return ".row.path";
            }
        };

        function get_shape_class(item, top_right, row_counter, column_count) {
            if (item.type == "finish") {
                return "rectangle";
            } else if (row_counter == 0) {
                return (top_right) ? "quarter-circle bottom-left" : "quarter-circle bottom-right";
            } else if (row_counter > 0 && row_counter < column_count.number - 1) {
                return (top_right) ? "rectangle top" : "rectangle bottom";
            } else if (row_counter == column_count.number - 1) {
                return (top_right) ? "quarter-circle top-right" : "quarter-circle top-left";
            } else {
                return "rectangle right";
            }
        };

        function get_strip_position(top_right, row_counter, column_count) {
            if (row_counter == 0) {
                return "";
            } else if (row_counter > 0 && row_counter < column_count.number - 1) {
                return  (top_right) ? "top" : "bottom";
            } else if (row_counter == column_count.number - 1) {
                return "";
            } else {
                return "right";
            }
        };

        function get_start_tag(top_right, row_counter, column_count) {
            var empty_columns = "<div class=\"" + column_count.class + " column row path\">" + repeat("<div class=\"column\"></div>", column_count.number - 1);
            if (row_counter == 0) {
                return (top_right) ? "<div class=\"" + column_count.class + " column row path\">" : "<div class=\"mobile reversed computer reversed " + column_count.class + " column row path\">";
            } else if (row_counter > 0 && row_counter < column_count.number) {
                return "";
            } else if (row_counter == column_count.number) {
                return (top_right) ? empty_columns : "<div class=\"" + column_count.class + " column row path\">";
            }
        };

        function get_end_tag(top_right, row_counter, column_count) {
            var empty_columns = repeat("<div class=\"column\"></div>", column_count.number - 1) + "</div>";
            if (row_counter == 0) {
                return "</div>";
            } else if (row_counter > 0 && row_counter < column_count.number) {
                return "";
            } else if (row_counter == column_count.number) {
                return (top_right) ? "</div>" : empty_columns;
            }
        };

        function render_item(index, item, top_right, row_counter, column_count) {
            var append_to = get_append_to(row_counter, column_count);
            var start = get_start_tag(top_right, row_counter, column_count);
            if (item.status == "finish" || index == 0) {
                return {
                    html: start
                            + "<div class=\"column animate\">"
                                + "<div class=\"rectangle " + item.type + " " + item.all_pass + "\">"
                                    + "<p>"
                                        + "<h3>" + item.title + "</h3>"
                                    + "</p>"
                                + "</div>"
                            + "</div>"
                        + "</div>",
                    append_to: append_to
                };
            } else {
                var shape_class = get_shape_class(item, top_right, row_counter, column_count);
                var end = get_end_tag(top_right, row_counter, column_count);
                var strip = get_strip_position(top_right, row_counter, column_count);
                if (item.due_date == "9999-12-31") {
                    var due_date = "No due date";
                } else {
                    var due_date = item.due_date;
                }

                if (item.title.length > 25) {
                    var item_title = item.title.substring(0, 25) + "...";
                } else {
                    var item_title = item.title;
                }

                var column = "<div data-id=\"" + item.id + "\" data-item-type=\"" + item.type + "\" title=\"" + due_date + "\" class=\"column animate training_path_item\">"
                            + "<div class=\"" + shape_class + " " + status_lookup[item.status] + "\">"
                                + "<div class=\"inside " + strip + "\">"
                                    + "<i class=\"circular inverted " + icon_lookup[item.type] + " " + status_lookup[item.status] + " icon\"></i>"
                                + "</div>"
                                + "<p>" + item_title + "</p>"
                            + "</div>"
                        "</div>";
                var html = start + column + end;
                return {
                    html: html,
                    append_to: append_to
                };
            }
        };

        function repeat(string, times) {
            var repeatedString = "";
            while (times > 0) {
                repeatedString += string;
                times--;
            }
            return repeatedString;
        };

    };

})( jQuery );