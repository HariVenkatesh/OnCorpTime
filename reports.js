var managereport_array = [];
var manage_submit_array = [];
var offset = 0;
var offset_submit = 0;
var limit_p = 10;
var issubmit = 0;
var total = 0;
var flag = 0;
/*$(document).ready(function(){
$("#searchreport").hide();
$("#addreport").hide();
});*/
function searchreport() {
    $("#addreport").hide();
    //$("#searchreport").show();
    var o = $(".searchreport").is(":visible");
    var c = $("#searchreport").is(":hidden");
    if (o) {
        $("#managereportslist").css("padding-top", "0%");
    } else {
        $("#managereportslist").css("padding-top", "250px");
    }
    $(".searchreport").slideToggle();

}

function addreport() {
    $("#searchreport").hide();
    $.mobile.changePage("addReport.html", {
        transition: "slide"
    });

}

function onSuccessCallback() {
    console.log("Alert Clicked");
}

function pagination_next() {
    $("body").addClass('ui-loading');
    //$('[data-type ="search"]').val('');
    // $.mobile.silentScroll( $("#mManageBillSearch").offset().top);
    $('[id="prevmatter"]').removeClass("ui-state-disabled");
    if (issubmit === 1) {
        offset_submit = offset_submit + limit_p;
        var t = flag * limit_p;

        if ((offset_submit === t) || (offset_submit >= total)) {
            $('[id="nextmatter"]').addClass("ui-state-disabled");
            submitReportFilter(1);

        } else {
            $('[id="nextmatter"]').removeClass("ui-state-disabled");
            submitReportFilter(0);
        }


    } else {

        issubmit = 0;
        offset = offset + limit_p;
        var t = flag * limit_p;
        if ((offset === t) || (offset >= total)) {
            $('[id="nextmatter"]').addClass("ui-state-disabled");
            getReportList(1);
        } else {
            $('[id="nextmatter"]').removeClass("ui-state-disabled");
            getReportList(0);
        }


    }
}

function pagination_prev() {
    $("body").addClass('ui-loading');
    //$('[data-type="search"]').val('');
    // $.mobile.silentScroll( $("#mManageBillSearch").offset().top);
    $('[id="nextmatter"]').removeClass("ui-state-disabled");

    if (issubmit === 1) {
        if (offset_submit != 0) {
            offset_submit = offset_submit - limit_p;

        } else
            offset_submit = 0;
        if (offset_submit <= 0) {
            $('[id="prevmatter"]').addClass("ui-state-disabled");
        } else {
            $('[id="prevmatter"]').removeClass("ui-state-disabled");

        }

        submitReportFilter();
    } else {

        issubmit = 0;
        if (offset != 0)
            offset = offset - limit_p;
        else
            offset = 0;

        if (offset <= 0) {

            $('[id="prevmatter"]').addClass("ui-state-disabled");
        } else {
            $('[id="prevmatter"]').removeClass("ui-state-disabled");
        }

        getReportList();
    }
}


$("#managereport_page").ready(function() {
    moduleRevealer();
    $("#searchreport").hide();
    $("#addreport").hide();
    $("#category_item_dropdown option").remove();
    $("#request_type_dropdown option").remove();
    getRequestType();
    var listItemContract = "";
    listItemContract = "<option value=''>Select One</option>";
    if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
        $("#matter_text").text("Contract");
        listItemContract = listItemContract + "<option value='Contract'>Contract</option>";
    } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
        $("#matter_text").text("Matter");
        listItemContract = listItemContract + "<option value='Matter'>Matter</option>";
    }
    listItemContract = listItemContract + "<option value='YTD'>YTD</option>";
    listItemContract = listItemContract + "<option value='MTD'>MTD</option>";
    $("#category_item_dropdown").append(listItemContract);
    document.getElementById("matter_div").style.display = "none";
    /*$("#reportSearchInput").keyup(function(event) {

        reportSearch($(this).val());
    });*/
    $('#reportSearchInput').on('change input', function() {
        if ($(this).val() === '') {
            getReportList();
        }
    });
    $("#reportSearchInput").keyup(function(event) {
        if (event.keyCode == '13') {

            reportSearch($(this).val());
        }

    });
});

function reportSearch(typedKeyword) {
    $("#filterarea").show();

    //To load list of reports
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        var serviceCall = $.post(window.localStorage.getItem("url") + "/list_all_request_types", {
            employeeid: window.localStorage.getItem("user_id"),
            usertype: window.localStorage.getItem("user_type"),
            reportskey: typedKeyword

        }, "json");
        serviceCall.done(function(data) {
            obj = JSON.parse(data);
            total = obj.totalcount;
            console.log(total);
            console.log(limit_p);
            /*flag = Math.floor(total / limit_p);
            if (total <= limit_p || total === 0) {

                $('[id="nextmatter"]').addClass("ui-state-disabled");
                $('[id="prevmatter"]').addClass("ui-state-disabled");
            }*/
            $('[id="nextmatter"]').addClass("ui-state-disabled");
            $('[id="prevmatter"]').addClass("ui-state-disabled");
            if (obj.msg == 'Failure') {

                navigator.notification.alert("No Reports available.", onSuccessCallback, "Message", "OK");
                $('[id="nextmatter"]').addClass("ui-state-disabled");
                $('[id="prevmatter"]').addClass("ui-state-disabled");
                $("#listulreport").empty();
                $('body').removeClass('ui-loading');
                $("#filterarea").hide();

            } else {
                managereport_array.length = 0;
                $.each(obj, function(index, item) {

                    managereport_array.push([item.id,
                        item.requesttype,
                        item.category,
                        item.matterid,
                        item.status,
                        item.userid,
                        item.createddate,
                    ]);
                });
                var resultLists = '';
                console.log("managereport_array.length" + managereport_array.length);
                for (var limit = 0; limit < managereport_array.length - 1; limit++) {
                    console.log(limit);
                    resultLists += '<li class="listItem" data-theme="d" id=' + limit + '><a href="#"  data-transition="none"><p>';
                    resultLists += "<font style='font-weight:bold;'>Request Type :</font>" + managereport_array[limit][1] + "&nbsp;&nbsp;&nbsp;<br>";
                    resultLists += "<font style='font-weight:bold;'>Category :</font>" + managereport_array[limit][2];
                    resultLists += '<br />';
                    if (managereport_array[limit][2] == 'YTD' || managereport_array[limit][2] == 'MTD') {
                        console.log("matter will not be avilable for YTD and MTD");
                    } else {
                        if (window.localStorage.getItem("user_type") == "hrms_admin" || window.localStorage.getItem("user_type") == "hrms_normal") {
                            if (managereport_array[limit][3] != '-1') {
                                resultLists += "<font style='font-weight:bold;'>Contract :</font>" + managereport_array[limit][3] + "&nbsp;&nbsp;&nbsp;<br>";
                            } else {
                                resultLists += "<font style='font-weight:bold;'>Contract :</font>" + "All" + "&nbsp;&nbsp;&nbsp;<br>";
                            }
                        } else if (window.localStorage.getItem("user_type") == "legal_admin" || window.localStorage.getItem("user_type") == "legal_normal") {
                            if (managereport_array[limit][3] != '-1') {
                                resultLists += "<font style='font-weight:bold;'>Matter :</font>" + managereport_array[limit][3] + "&nbsp;&nbsp;&nbsp;<br>";
                            } else {
                                resultLists += "<font style='font-weight:bold;'>Matter :</font>" + "All" + "&nbsp;&nbsp;&nbsp;<br>";
                            }
                        }
                    }
                    resultLists += "<font style='font-weight:bold;'>Status :</font>" + managereport_array[limit][4] + "&nbsp;&nbsp;&nbsp;";
                    resultLists += "<br /><font style='font-weight:bold;'>Date :</font>" + managereport_array[limit][6];
                    resultLists += '</p></a></li>';
                }
                $("#listulreport").empty();
                $("#listulreport").append(resultLists);
                $("#listulreport").trigger('create');

                $('#listulreport').listview().listview('refresh');
                $('body').removeClass('ui-loading');
                $('ul.jqm-custom-list-view').prev().find('input').keyup(function(e, d) {
                    console.log("Test input" + $(this).val());
                    var eltExists = false;
                    var elt_count = 0;
                    $('ul.jqm-custom-list-view li').each(function() {
                        if ($(this).css('display') != 'none') {
                            elt_count++;
                        }
                    });
                    console.log("Count value:" + elt_count);
                    if (elt_count == 0) {
                        $('body').removeClass('ui-loading');
                        navigator.notification.alert("No Reports available!.", onSuccessCallback, "Message", "OK");
                        $('[id="nextmatter"]').addClass("ui-state-disabled");
                        $('[id="prevmatter"]').addClass("ui-state-disabled");

                    }
                });
                //$.mobile.loading( 'hide');
                $('body').removeClass('ui-loading');
            }
        });
        serviceCall.fail(function() {
            //$('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onSuccessCallback,"Message","OK");
            //$.mobile.loading( 'hide');
            $('body').removeClass('ui-loading');

        });

    } else {
        navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
        $.mobile.loading('hide');

    }
}

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    if (states[networkState] == 'No network connection') {
        return false;
    } else {
        return true;
    }
}
//Get request type from web service
function getRequestType() {
    if (checkConnection()) {
        //$('body').addClass('ui-loading');
        var getMatterRequest = $.post(window.localStorage.getItem("url") + "/report_request_type", "json");
        getMatterRequest.done(function(data) {
            obj = JSON.parse(data);
            if (obj.msg == 'Failure') {
                /*$('[id="nextmatter"]').addClass("ui-state-disabled");
                $('[id="prevmatter"]').addClass("ui-state-disabled");
                navigator.notification.alert("No Reports available!.", onSuccessCallback, "Message", "OK");*/
                $('body').removeClass('ui-loading');
                var listItem = "";
                listItem = "<option value=''>Select One</option>";
                $("#request_type_dropdown").append(listItem);
                $("#request_type_dropdown").selectmenu('refresh');
            } else {
                console.log(data);
                var listItem = "";
                listItem = "<option value=''>Select One</option>";
                $.each(obj, function(indexid, item) {
                    listItem += "<option value='" + item.id + "'>" + item.Request_name + "</option>";
                });

                $("#request_type_dropdown").append(listItem);
                $("#request_type_dropdown option:last").remove();
                $("#request_type_dropdown").selectmenu('refresh');
                getReportList();
            }

        });
        getMatterRequest.fail(function() {
            $('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");           
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
}
//List all the request types from web service
function getReportList(a) {
    if (a != 1)
        $('[id="nextmatter"]').removeClass("ui-state-disabled");
    if (offset == 0)
        $('[id="prevmatter"]').addClass("ui-state-disabled");
    $("#filterarea").show();
    managereport_array = [];
    //To load list of reports
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        var serviceCall = $.post(window.localStorage.getItem("url") + "/list_all_request_types", {
            employeeid: window.localStorage.getItem("user_id"),
            usertype: window.localStorage.getItem("user_type"),
            offset: offset,
            limit: limit_p,
            reportskey: $("#reportSearchInput").val() || ""
        }, "json");
        serviceCall.done(function(data) {
            obj = JSON.parse(data);
            total = obj.totalcount;
            console.log(total);
            console.log(limit_p);
            flag = Math.floor(total / limit_p);
            if (total <= limit_p || total === 0) {

                $('[id="nextmatter"]').addClass("ui-state-disabled");
                $('[id="prevmatter"]').addClass("ui-state-disabled");
            }
            if (obj.msg == 'Failure') {

                navigator.notification.alert("No Reports available.", onSuccessCallback, "Message", "OK");
                $('[id="nextmatter"]').addClass("ui-state-disabled");
                $('[id="prevmatter"]').addClass("ui-state-disabled");
                $('body').removeClass('ui-loading');
                $("#filterarea").hide();

            } else {
                $.each(obj, function(index, item) {

                    managereport_array.push([item.id,
                        item.requesttype,
                        item.category,
                        item.matterid,
                        item.status,
                        item.userid,
                        item.createddate,
                    ]);
                });
                var resultLists = '';
                console.log("managereport_array.length" + managereport_array.length);
                for (var limit = 0; limit < managereport_array.length - 1; limit++) {
                    console.log(limit);
                    resultLists += '<li class="listItem" data-theme="d" id=' + limit + '><a href="#"  data-transition="none"><p>';
                    resultLists += "<font style='font-weight:bold;'>Request Type :</font>" + managereport_array[limit][1] + "&nbsp;&nbsp;&nbsp;<br>";
                    resultLists += "<font style='font-weight:bold;'>Category :</font>" + managereport_array[limit][2];
                    resultLists += '<br />';
                    if (managereport_array[limit][2] == 'YTD' || managereport_array[limit][2] == 'MTD') {
                        console.log("matter will not be avilable for YTD and MTD");
                    } else {
                        if (window.localStorage.getItem("user_type") == "hrms_admin" || window.localStorage.getItem("user_type") == "hrms_normal") {
                            if (managereport_array[limit][3] != '-1') {
                                resultLists += "<font style='font-weight:bold;'>Contract :</font>" + managereport_array[limit][3] + "&nbsp;&nbsp;&nbsp;<br>";
                            } else {
                                resultLists += "<font style='font-weight:bold;'>Contract :</font>" + "All" + "&nbsp;&nbsp;&nbsp;<br>";
                            }
                        } else if (window.localStorage.getItem("user_type") == "legal_admin" || window.localStorage.getItem("user_type") == "legal_normal") {
                            if (managereport_array[limit][3] != '-1') {
                                resultLists += "<font style='font-weight:bold;'>Matter :</font>" + managereport_array[limit][3] + "&nbsp;&nbsp;&nbsp;<br>";
                            } else {
                                resultLists += "<font style='font-weight:bold;'>Matter :</font>" + "All" + "&nbsp;&nbsp;&nbsp;<br>";
                            }
                        }
                    }
                    resultLists += "<font style='font-weight:bold;'>Status :</font>" + managereport_array[limit][4] + "&nbsp;&nbsp;&nbsp;";
                    resultLists += "<br /><font style='font-weight:bold;'>Date :</font>" + managereport_array[limit][6];
                    resultLists += '</p></a></li>';
                }
                $("#listulreport").empty();
                $("#listulreport").append(resultLists);
                $("#listulreport").trigger('create');

                $('#listulreport').listview().listview('refresh');
                $('body').removeClass('ui-loading');
                $('ul.jqm-custom-list-view').prev().find('input').keyup(function(e, d) {
                    console.log("Test input" + $(this).val());
                    var eltExists = false;
                    var elt_count = 0;
                    $('ul.jqm-custom-list-view li').each(function() {
                        if ($(this).css('display') != 'none') {
                            elt_count++;
                        }
                    });
                    console.log("Count value:" + elt_count);
                    if (elt_count == 0) {
                        $('body').removeClass('ui-loading');
                        navigator.notification.alert("No Reports available!.", onSuccessCallback, "Message", "OK");
                        $('[id="nextmatter"]').addClass("ui-state-disabled");
                        $('[id="prevmatter"]').addClass("ui-state-disabled");

                    }
                });
                //$.mobile.loading( 'hide');
                $('body').removeClass('ui-loading');
            }
        });
        serviceCall.fail(function() {
            //$('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onSuccessCallback,"Message","OK");
            //$.mobile.loading( 'hide');
            $('body').removeClass('ui-loading');

        });

    } else {
        navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
        $.mobile.loading('hide');

    }
}

//On Type change get the matter/contract from web service
function typeChange() {
    console.log("typeChange");
    var selectedType = $("#category_item_dropdown").val();
    console.log("Selected Type" + selectedType);
    if (selectedType == 'Matter' || selectedType == 'Contract') {
        document.getElementById("matter_div").style.display = "";
        $("#matter_item_dropdown option").remove();
        getMatter();
    } else {
        document.getElementById("matter_div").style.display = "none";
    }
}

//Get matters from web service to add the dropdown
function getMatter() {
    if (checkConnection()) {
        //$('body').addClass('ui-loading');
        var getMatterRequest = $.post(window.localStorage.getItem("url") + "/get_contracts", {
            user_id: window.localStorage.getItem("user_id")
        }, "json");
        getMatterRequest.done(function(data) {
            obj = JSON.parse(data);
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='-1'>All</option>";
                $("#matter_item_dropdown").append(listItem);
                $("#matter_item_dropdown").selectmenu('refresh');
            } else {
                console.log(data);
                var listItem = "";
                listItem = "<option value='-1'>All</option>";
                $.each(obj, function(indexid, item) {
                    listItem += "<option value='" + item.contract + "'>" + item.contract + "</option>";
                });
                console.log(listItem);
                $("#matter_item_dropdown").append(listItem);
                $("#matter_item_dropdown").selectmenu('refresh');
            }
            $('body').removeClass('ui-loading');
        });
        getMatterRequest.fail(function() {
            $('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");           
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
}

//Button color changes based on the dropdown value changes
$(document).ready(function() {
    $('.managereport').change(function() {
        var isSelected = false;
        $('.managereport').each(function() {
            console.log($(this).val());
            if (($(this).val() != '') && ($(this).val() != '')) {
                isSelected = isSelected || true;
            }
        });
        console.log(isSelected);
        //console.log($('.managebillsyear').val());
        if (isSelected) {
            $("#submitButton_reports").addClass("ui-btn-up-e").removeClass("ui-btn-up-c");
        } else {
            $("#submitButton_reports").removeClass("ui-btn-up-e").addClass("ui-btn-up-c");
        }
    });
});

//Manual filtering for the report list
function submitReportFilter(b) {
    $("#searchreport").hide();
    $("#managereportslist").css("padding-top", "0%");
    /*$.mobile.loading( 'show', {
                     text: 'Loading..',
                     textVisible: true,
                       theme: 'a',
                     html: ""
                     });*/
    $('body').addClass('ui-loading');
    if (b != 1) {
        $('[id="nextmatter"]').removeClass("ui-state-disabled");
    }
    if (offset_submit === 0)
        $('[id="prevmatter"]').addClass("ui-state-disabled");
    // $.mobile.silentScroll( $("#mManageBillSearch").offset().top);
    $("#filterarea").show();
    // $(window).scrollTop() + $(window).height();
    if (offset_submit === 0) {
        $('[id="nextmatter"]').removeClass("ui-state-disabled");
    }

    issubmit = 1;
    manage_submit_array = [];
    //$('body').addClass('ui-loading');
    $("#listulreport").empty();
    var selectedMatter = '';
    var selectedRequest_Type = $("#request_type_dropdown").val();
    var selectedCategory = $("#category_item_dropdown").val();
    if (selectedCategory != '') {
        selectedMatter = $("#matter_item_dropdown").val();
    }
    console.log("Request Type:" + selectedRequest_Type);
    console.log("Category Type:" + selectedCategory);
    console.log("Matter Type:" + selectedMatter);

    if (checkConnection()) {
        $('body').addClass('ui-loading');
        var submitCall = $.post(window.localStorage.getItem("url") + "/list_all_request_types", {
            employeeid: window.localStorage.getItem("user_id"),
            usertype: window.localStorage.getItem("user_type"),
            limit: limit_p,
            offset: offset_submit,
            requesttype: selectedRequest_Type,
            category: selectedCategory,
            matterid: selectedMatter,
            issubmit: issubmit,
            reportskey: $("#reportSearchInput").val() || ""
        }, "json");
        submitCall.done(function(data) {
            obj = JSON.parse(data);
            total = obj.totalcount;
            flag = Math.floor(total / limit_p);
            if (total <= limit_p || total === 0) {

                $('[id="nextmatter"]').addClass("ui-state-disabled");
                $('[id="prevmatter"]').addClass("ui-state-disabled");
            }
            if (obj.msg === 'Failure') {
                //$('body').removeClass('ui-loading');

                $("#filterarea").hide();
                $('body').removeClass('ui-loading');
                $('[id="nextmatter"]').addClass("ui-state-disabled");
                $('[id="prevmatter"]').addClass("ui-state-disabled");
                navigator.notification.alert("No Reports available.", onSuccessCallback, "Message", "OK");
                $.mobile.loading('hide');
            } else {
                $.each(obj, function(index, item) {
                    console.log("Data Loaded: " + item.id);
                    manage_submit_array.push([item.id,
                        item.requesttype,
                        item.category,
                        item.matterid,
                        item.status,
                        item.userid,
                        item.createddate,
                    ]);
                });
                var result_submit_Lists = '';
                console.log("manage_submit_array.length" + manage_submit_array.length);
                for (var limit = 0; limit < manage_submit_array.length - 1; limit++) {

                    result_submit_Lists += '<li class="listItem" data-theme="d" id=' + limit + '><a href="#"  data-transition="none"><p>';
                    result_submit_Lists += "<font style='font-weight:bold;'>Request Type :</font>" + manage_submit_array[limit][1] + "&nbsp;&nbsp;&nbsp;<br>";
                    result_submit_Lists += "<font style='font-weight:bold;'>Category :</font>" + manage_submit_array[limit][2];
                    result_submit_Lists += '<br />';
                    if (manage_submit_array[limit][2] == 'YTD' || manage_submit_array[limit][2] == 'MTD') {
                        console.log("matter will not be avilable for YTD and MTD");
                    } else {
                        if (window.localStorage.getItem("user_type") == "hrms_admin" || window.localStorage.getItem("user_type") == "hrms_normal") {
                            if (manage_submit_array[limit][3] != '-1') {
                                result_submit_Lists += "<font style='font-weight:bold;'>Contract :</font>" + manage_submit_array[limit][3] + "&nbsp;&nbsp;&nbsp;<br>";
                            } else {
                                result_submit_Lists += "<font style='font-weight:bold;'>Contract :</font>" + "All" + "&nbsp;&nbsp;&nbsp;<br>";
                            }
                        } else if (window.localStorage.getItem("user_type") == "legal_admin" || window.localStorage.getItem("user_type") == "legal_normal") {
                            if (manage_submit_array[limit][3] != '-1') {
                                result_submit_Lists += "<font style='font-weight:bold;'>Matter :</font>" + manage_submit_array[limit][3] + "&nbsp;&nbsp;&nbsp;<br>";
                            } else {
                                result_submit_Lists += "<font style='font-weight:bold;'>Matter :</font>" + "All" + "&nbsp;&nbsp;&nbsp;<br>";
                            }
                        }
                    }
                    result_submit_Lists += "<font style='font-weight:bold;'>Status :</font>" + manage_submit_array[limit][4] + "&nbsp;&nbsp;&nbsp;";
                    result_submit_Lists += "<br /><font style='font-weight:bold;'>Date :</font>" + manage_submit_array[limit][6];
                    result_submit_Lists += '</p></a></li>';
                }
                $("#listulreport").empty();
                $("#listulreport").append(result_submit_Lists);
                $("#listulreport").trigger('create');

                $('#listulreport').listview().listview('refresh');
                $('body').removeClass('ui-loading');
                $('ul.jqm-custom-list-view').prev().find('input').keyup(function(e, d) {
                    console.log("Test input" + $(this).val());
                    var eltExists = false;
                    var elt_count = 0;
                    $('ul.jqm-custom-list-view li').each(function() {
                        if ($(this).css('display') != 'none') {
                            elt_count++;
                        }
                    });
                    console.log("Count value:" + elt_count);
                    if (elt_count === 0) {
                        $('body').removeClass('ui-loading');
                        navigator.notification.alert("No Reports available!.", onSuccessCallback, "Message", "OK");
                        $('[id="nextmatter"]').addClass("ui-state-disabled");
                        $('[id="prevmatter"]').addClass("ui-state-disabled");
                        $("#filterarea").hide();


                    }
                });
                //$.mobile.loading( 'hide');
                //  $('body').removeClass('ui-loading');

            }
        });
        submitCall.fail(function() {
            $('body').removeClass('ui-loading');
            //navigator.notification.alert("Couldn't connect to server.",onSuccessCallback,"Message","OK");          
        });

    } else {
        navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
    }


}
