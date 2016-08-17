$(document).ready(function() {
    //                  $("input[type='checkbox']").prop("checked").checkboxradio("refresh");
    //                  $("input[type='checkbox']").checkboxradio("refresh");
    $("#searchBill").hide();
    $("#addBill").hide();
    $("#bills").attr("src", "images/" + localStorage.getItem("colortheme") + "bills-32.png");
    $("#reports").attr("src", "images/" + localStorage.getItem("colortheme") + "report-32.png");
    $("#timesheet").attr("src", "images/" + localStorage.getItem("colortheme") + "timesheet-32.png");
    $("#tasks").attr("src", "images/" + localStorage.getItem("colortheme") + "queue-32.png");
    moduleRevealer();


});

$("#bills-page").ready(function() {
    $('#billSearchInput').on('change input', function() {
        if ($(this).val() === '') {
            getbillsList();
        }
    });
    $("#billSearchInput").keyup(function(event) {
        if (event.keyCode == '13') {

            billSearch($(this).val());
        }

    });
});

function billSearch(typedKeyword) {
    /*if (b != 1)
        $('[id="nextmatter"]').removeClass("ui-disabled");
    if (offset == 0)
        $('[id="prevmatter"]').addClass("ui-disabled");*/
    // $("#filterarea").show();
    managebills_array = [];
    if (checkConnection()) {
        //$('body').addClass('ui-loading'); 
        var serviceCall = $.post(window.localStorage.getItem("url") + "/list_all_bills", {
            employee_id: window.localStorage.getItem("user_id"),
            billkey: typedKeyword,
            month: $("#month").val() || "",
            year: $("#year").val() || "",
            status: $("#status").val() || "",
            issubmit: issubmit

        }, "json");
        serviceCall.done(function(data) {
            obj = JSON.parse(data);
            total = obj.totalcount;
            flag = Math.floor(total / limit_p);

            if (total <= limit_p || total === 0) {

                $('[id="nextmatter"]').addClass("ui-disabled");
                $('[id="prevmatter"]').addClass("ui-disabled");
            }
            if (obj.msg == 'Failure') {
                $('[id="nextmatter"]').addClass("ui-disabled");
                $('[id="prevmatter"]').addClass("ui-disabled");
                $("#listul").empty();
                $.mobile.loading('hide');
                $("#filterarea").hide();
                navigator.notification.alert("No bills available.", onSuccessCallback, "Message", "OK");
            } else {
                $.each(obj, function(index, item) {
                    console.log("Data Loaded: " + item.employee);
                    managebills_array.push([item.amount,
                        item.costcenter,
                        item.costcode,
                        item.datecreated,
                        item.description,
                        item.employee,
                        item.hours,
                        item.id,
                        item.isapproved,
                        item.jobnumber,
                        item.matter,
                        item.odccreator,
                        item.poline,
                        item.rate,
                        item.status,
                        item.taskcode,
                        item.theid,
                        item.transactiondate
                    ]);
                });
                var resultLists = '';
                console.log("managebills_array.length" + managebills_array.length);
                for (var limit = 0; limit < managebills_array.length - 1; limit++) {
                    resultLists += '<li class="listItem" id=' + limit + ' ><a href="#"  data-transition="none"><p><font style="font-weight:bold">';
                    resultLists += managebills_array[limit][10] + "&nbsp;&nbsp;&nbsp;&nbsp;$" + managebills_array[limit][0];
                    resultLists += '</font><br />';
                    resultLists += managebills_array[limit][4] + "<br />";
                    resultLists += managebills_array[limit][17];
                    resultLists += '</p></a></li>';
                }
                $("#listul").empty();
                $("#listul").append(resultLists);
                $("#listul").trigger('create');
                $("#listul").listview().listview('refresh');
                if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
                    console.log("Employee");
                    $("#listul").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search");
                } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
                    console.log("Time Keeper");
                    $("#listul").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search");
                }
                $("#listul").listview().listview('refresh');
                /*$('ul.jqm-custom-list-view').prev().find('input').keyup(function(e, d) {
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

                        navigator.notification.alert("No bills available!.", onSuccessCallback, "Message", "OK");
                    }
                });*/
                $.mobile.loading('hide');
                ////$('body').removeClass('ui-loading'); 
            }
        });
        serviceCall.fail(function(textStatus) {
            $('body').removeClass('ui-loading');
            //alert();
            //$.mobile.loading( 'hide');

            //navigator.notification.alert(textStatus+" Couldn't connect to server.",onSuccessCallback,"Message","OK");          
        });

    } else {
        navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
    }
}
var offset = 0;
var offset_submit = 0;
var limit_p = 10;
var issubmit = 0;
var flag = 0;
var total = 0;
var managebills_array = [];
var isList = false;

function checkConnection() {
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });

    //alert("function checkConnection");
    console.log("Check Connection");
    var networkState = navigator.connection.type;
    console.log("Network State:" + networkState);
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    if (states[networkState] === 'No network connection') {
        // alert("if");
        return false;
    } else {
        // alert("else if");
        return true;
    }
}

function searchBill() {
    //alert("searchBill");
    //$("#addBill").hide();
    //$("#searchBill").show();
    var o = $(".searchBill").is(":visible");
    var c = $(".searchBill").is(":hidden");
    if (o) {
        $("#managebillslist").css("padding-top", "0%");
    } else {
        $("#managebillslist").css("padding-top", "320px");
    }
    $(".searchBill").slideToggle();
}

function addBill() {
    $("#searchBill").hide();
    onWindowClose();

}

function pagination_next() {
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    //$('[data-type ="search"]').val('');
    // $.mobile.silentScroll( $("#mManageBillSearch").offset().top);
    $('[id="prevmatter"]').removeClass("ui-disabled");
    if (issubmit === 1) {
        offset_submit = offset_submit + limit_p;
        var t = flag * limit_p;

        if ((offset_submit === t) || (offset_submit >= total)) {
            $('[id="nextmatter"]').addClass("ui-disabled");
            submit(1);

        } else {
            $('[id="nextmatter"]').removeClass("ui-disabled");
            submit(0);
        }


    } else {
        issubmit = 0;
        offset = offset + limit_p;
        var t = flag * limit_p;
        if ((offset === t) || (offset >= total)) {

            $('[id="nextmatter"]').addClass("ui-disabled");
            getbillsList(1);
        } else {
            $('[id="nextmatter"]').removeClass("ui-disabled");
            getbillsList(0);
        }


    }
}

function pagination_prev() {
    //$('[data-type="search"]').val('');
    // $.mobile.silentScroll( $("#mManageBillSearch").offset().top);
    $('[id="nextmatter"]').removeClass("ui-disabled");

    if (issubmit === 1) {
        if (offset_submit != 0) {
            offset_submit = offset_submit - limit_p;

        } else
            offset_submit = 0;
        if (offset_submit <= 0) {
            $('[id="prevmatter"]').addClass("ui-disabled");
        } else {
            $('[id="prevmatter"]').removeClass("ui-disabled");

        }

        submit();
    } else {

        issubmit = 0;
        if (offset != 0)
            offset = offset - limit_p;
        else
            offset = 0;

        if (offset <= 0) {

            $('[id="prevmatter"]').addClass("ui-disabled");
        } else {
            $('[id="prevmatter"]').removeClass("ui-disabled");
        }

        getbillsList();
    }
}

$("#managebills_page").ready(function() {
    console.log("load list items");
    //To add year 
    $("#year option").remove();
    var today = new Date();
    yyyy = today.getFullYear();
    var listYear = "";
    listYear = "<option value=''>&nbsp;&nbsp;&nbsp;All&nbsp;&nbsp;&nbsp;</option>";
    listYear += "<option value='" + yyyy + "'>" + yyyy + "</option>";
    listYear += "<option value='" + (yyyy - 1) + "'>" + (yyyy - 1) + "</option>";
    $("#year").append(listYear);
    setTimeout(function() {
        getbillsList();

    }, 0);

});

function getbillsList(b) {

    if (b != 1)
        $('[id="nextmatter"]').removeClass("ui-disabled");
    if (offset == 0)
        $('[id="prevmatter"]').addClass("ui-disabled");
    // $("#filterarea").show();
    managebills_array = [];
    if (checkConnection()) {
        //$('body').addClass('ui-loading'); 
        var serviceCall = $.post(window.localStorage.getItem("url") + "/list_all_bills", {
            employee_id: window.localStorage.getItem("user_id"),
            offset: offset,
            limit: limit_p,
             billkey:$('#billSearchInput').val() || ""
        }, "json");
        serviceCall.done(function(data) {
            obj = JSON.parse(data);
            total = obj.totalcount;
            flag = Math.floor(total / limit_p);

            if (total <= limit_p || total === 0) {

                $('[id="nextmatter"]').addClass("ui-disabled");
                $('[id="prevmatter"]').addClass("ui-disabled");
            }
            if (obj.msg == 'Failure') {
                $('[id="nextmatter"]').addClass("ui-disabled");
                $('[id="prevmatter"]').addClass("ui-disabled");
                $.mobile.loading('hide');
                $("#filterarea").hide();
                navigator.notification.alert("No bills available.", onSuccessCallback, "Message", "OK");
            } else {
                $.each(obj, function(index, item) {
                    console.log("Data Loaded: " + item.employee);
                    managebills_array.push([item.amount,
                        item.costcenter,
                        item.costcode,
                        item.datecreated,
                        item.description,
                        item.employee,
                        item.hours,
                        item.id,
                        item.isapproved,
                        item.jobnumber,
                        item.matter,
                        item.odccreator,
                        item.poline,
                        item.rate,
                        item.status,
                        item.taskcode,
                        item.theid,
                        item.transactiondate
                    ]);
                });
                var resultLists = '';
                console.log("managebills_array.length" + managebills_array.length);
                for (var limit = 0; limit < managebills_array.length - 1; limit++) {
                    resultLists += '<li class="listItem" id=' + limit + ' ><a href="#"  data-transition="none"><p><font style="font-weight:bold">';
                    resultLists += managebills_array[limit][10] + "&nbsp;&nbsp;&nbsp;&nbsp;$" + managebills_array[limit][0];
                    resultLists += '</font><br />';
                    resultLists += managebills_array[limit][4] + "<br />";
                    resultLists += managebills_array[limit][17];
                    resultLists += '</p></a></li>';
                }
                $("#listul").empty();
                $("#listul").append(resultLists);
                $("#listul").trigger('create');
                $("#listul").listview().listview('refresh');
                if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
                    console.log("Employee");
                    $("#listul").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search");
                } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
                    console.log("Time Keeper");
                    $("#listul").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search");
                }
                $("#listul").listview().listview('refresh');
                /*$('ul.jqm-custom-list-view').prev().find('input').keyup(function(e, d) {
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

                        navigator.notification.alert("No bills available!.", onSuccessCallback, "Message", "OK");
                    }
                });*/
                $.mobile.loading('hide');
                ////$('body').removeClass('ui-loading'); 
            }
        });
        serviceCall.fail(function(textStatus) {
            $('body').removeClass('ui-loading');
            //alert();
            //$.mobile.loading( 'hide');

            //navigator.notification.alert(textStatus+" Couldn't connect to server.",onSuccessCallback,"Message","OK");          
        });

    } else {
        navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
    }

}

//List item click
$("#listul").on("click", ".listItem", function() {
    //alert("click\n");
    console.log("item clicked");
    // alert("click 1\n"+$(this).attr('id'));
    var customer_id = $(this).attr('id');
    //alert("click 2\n");
    console.log("selected Item Position:" + customer_id);
    // alert("click 3\n"+customer_id);
    $.mobile.changePage("viewbills.html", {
        transition: "none"
    }); //,false, true
    // alert("click 4\n");
    window.localStorage.setItem("odcid", managebills_array[customer_id][7]);
    // alert("click 5\n"+managebills_array[customer_id][7]);
});

//Manual list filtering
function submit(a) {
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    // alert("submit");
    $("#searchBill").hide();
    $("#managebillslist").css("padding-top", "0%");

    if (a != 1)
    //  alert("1");
        $('[id="nextmatter"]').removeClass("ui-disabled");
    //alert("2");
    if (offset_submit === 0)
    //alert("3");
        $('[id="prevmatter"]').addClass("ui-disabled");
    //alert("4");
    $("#filterarea").show();
    //alert("5");
    //  $.mobile.silentScroll( $("#mManageBillSearch").offset().top);
    //alert("6");
    issubmit = 1;
    //alert("7");
    //$('body').addClass('ui-loading');
    //alert("8");
    $("#listul").empty();
    // alert("9");
    var month = document.getElementById("month");
    //alert(month);
    var selectedMonth = month.options[month.selectedIndex].value;
    // alert(selectedMonth);

    var year = document.getElementById("year");
    //alert(year);
    var selectedYear = year.options[year.selectedIndex].value;
    // alert(selectedYear);
    var status = document.getElementById("status");
    // alert(status);
    var selectedStatus = status.options[status.selectedIndex].value;
    // alert(selectedStatus);
    var result_submitLists = '';
    //alert(result_submitLists);
    managebills_array = [];
    //alert(managebills_array);

    if (checkConnection()) {
        // alert("check connection")
        //$('body').addClass('ui-loading');
        console.log("values", window.localStorage.getItem('user_id'), selectedMonth, selectedYear, selectedStatus, issubmit, offset_submit, limit_p);
        var serviceCall = $.post(window.localStorage.getItem("url") + "/list_all_bills", {
            employee_id: window.localStorage.getItem("user_id"),
            offset: offset_submit,
            limit: limit_p,
            month: selectedMonth,
            year: selectedYear,
            status: selectedStatus,
            issubmit: issubmit,
            billkey:$('#billSearchInput').val() || ""
        }, "json");
        serviceCall.done(function(data) {
            console.log("testts", data);
            obj = JSON.parse(data);
            total = obj.totalcount;
            flag = Math.floor(total / limit_p);
            if (total <= limit_p || total === 0) {
                $('[id="nextmatter"]').addClass("ui-disabled");
                $('[id="prevmatter"]').addClass("ui-disabled");
            }
            if (obj.msg === 'Failure') {
                //$('body').removeClass('ui-loading');
                $("#filterarea").hide();

                navigator.notification.alert("No bills available.", onSuccessCallback, "Message", "OK");
                $.mobile.loading('hide');
            } else {
                isList = true;

                $.each(obj, function(index, item) {
                    console.log("Data Loaded: " + item.employee);
                    managebills_array.push([item.amount,
                        item.costcenter,
                        item.costcode,
                        item.datecreated,
                        item.description,
                        item.employee,
                        item.hours,
                        item.id,
                        item.isapproved,
                        item.jobnumber,
                        item.matter,
                        item.odccreator,
                        item.poline,
                        item.rate,
                        item.status,
                        item.taskcode,
                        item.theid,
                        item.transactiondate
                    ]);
                });
                var result_submitLists = '';
                console.log("managebills_array.length" + managebills_array.length);
                // alert("managebills_array.length-1\n"+managebills_array.length)

                for (var limit = 0; limit < managebills_array.length - 1; limit++) {
                    result_submitLists += '<li class="listItem" id=' + limit + '  data-theme="d"><a href="#"  data-transition="none"><p><font style="font-weight:bold;">';
                    result_submitLists += managebills_array[limit][10] + "&nbsp;&nbsp;&nbsp;&nbsp;$" + managebills_array[limit][0];
                    result_submitLists += '</font><br />';
                    result_submitLists += managebills_array[limit][4] + "<br />";
                    result_submitLists += managebills_array[limit][17];
                    result_submitLists += '</p></a></li>';
                }
                $("#listul").empty();
                $("#listul").append(result_submitLists);
                $("#listul").trigger('create');
                $("#listul").listview().listview('refresh');
                $.mobile.loading('hide');
                if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
                    console.log("Employee");
                    $("#listul").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search Contract");
                } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
                    console.log("Time Keeper");
                    $("#listul").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search Matter");
                }
                $("#listul").listview().listview('refresh');
                /* $('ul.jqm-custom-list-view').prev().find('input').keyup(function(e, d) {
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

                         $("#filterarea").hide();
                         navigator.notification.alert("No bills available!.", onSuccessCallback, "Message", "OK");
                         $.mobile.loading('hide');
                     }
                 });*/
                ////$('body').removeClass('ui-loading'); 
            }
        });
        serviceCall.fail(function() {
            $('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onSuccessCallback,"Message","OK");
            //  $.mobile.loading( 'hide');
        });


    } else {
        navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
    }
    $("#listul").append(result_submitLists);
    $("#listul").trigger('create');
    $("#listul").listview().listview('refresh');
    //$('body').removeClass('ui-loading');
    //  if(isList == false){    
    //                alert("test");
    //      navigator.notification.alert("Requested bill is not available.",onSuccessCallback,"Message","OK");  
    //  } 

}

function onWindowClose() {
    window.localStorage.setItem("key", "bills.html");
    window.localStorage.setItem("option", "NEW");
    $.mobile.changePage("createbills_employee.html", {
        transition: "none"
    });
}

function onSuccessCallback() {
    console.log("alert cancellled.");
}
//Change the button color based on the dropdown changes
$(document).ready(function() {
    $('.managebills').change(function() {
        var isSelected = false;
        $('.managebills').each(function() {
            console.log($(this).val());
            if (($(this).val() != '') && ($(this).val() != 'All')) {
                isSelected = isSelected || true;
            }
        });
        console.log(isSelected);
        //console.log($('.managebillsyear').val());
        if (isSelected) {
            $("#submitButton").addClass("ui-btn-up-e").removeClass("ui-btn-up-c");
        } else {
            $("#submitButton").removeClass("ui-btn-up-e").addClass("ui-btn-up-c");
        }
    });
});

/*function test(){
    alert("test");
}
*/
