var d = new Date();
var day = d.getDate();
var month = d.getMonth() + 1;
var year = d.getFullYear();
var monthl;
if (month < 10) {
    monthl = "0" + month;
} else {
    monthl = month;
}
if (day < 10) {
    day = "0" + day;
}

var date = year + "-" + monthl + "-" + day;

var dateVar = new Date();
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

function updatetimesheetNew(status) {
    console.log("Update Timesheet has received a call");
    var obj = JSON.parse(localStorage.getItem('lvtimesheet'));
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/create_timesheet",
            data: {
                /* timesheetid: localStorage.getItem("dtsid"),
                 timesheetdataid: localStorage.getItem("vtsid"),
                 employeeid: localStorage.getItem("tsempid"),
                 hours: $("#timesheetHours").val(),
                 oldhours: obj[0].hours*/
                lastupdatedby: localStorage.getItem("user_id"),
                dayoftheweek: weekday[dateVar.getDay()],
                weekendingdate: date,
                weekendingdate_formatted: date,
                action: localStorage.getItem("option") == "edit" ? "edit" : "create",
                status: status,
                source: "screen",
                employeetype: localStorage.getItem("emptype"),
                employeeid: $("#timesheetEmployee").val() || localStorage.getItem("tsempid"),
                isadmin: localStorage.getItem('AdminorNot'),
                id: $("#timesheetcontract").val(),
                numberofjobs: '1',
                selecteddate: $("#timesheetdate").val(),
                totalhours: $("#timesheetHours").val(),
                jobname: $("#timesheetproject :selected").text(),
                job0: $("#timesheetjobNumber :selected").val(),
                jobcode: $("#timesheetjob :selected").text(),
                taskcode: $("#timesheettaskCode :selected").val(),
                paycode: $("#timesheetpaycode :selected").text(),
                units: $("#timesheetUnits").val(),
                jobcomment: "",
                timesheetid: localStorage.getItem("dtsid"),
                timesheetdataid: localStorage.getItem("vtsid")
            },
            dataType: "json",
            success: function(data) {
                if (data.msg == "Success") {
                    $("body").removeClass("ui-loading");
                    navigator.notification.alert("Timesheet updated successfully.", onCallback, "Message", "OK");
                    $.mobile.changePage("timesheet.html", {
                        transition: "none"
                    });
                } else {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Unable to update Timesheet.", onCallback, "Message", "OK");
                }
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    //navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function fetchHours() {
    //alert($("#timesheetEmployee").val());
    localStorage.setItem('tsdate', $("#timesheetdate").val());
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/hours_validation",
            data: {
                employeeid: $("#timesheetEmployee").val() || localStorage.getItem("user_id"),
                selectdate: localStorage.getItem("tsdate") || $("#timesheetdate").val()
            },
            dataType: "json",
            success: function(data) {
                console.log(data);

                localStorage.setItem('TSPHours', data.max_total_hour_day);
                localStorage.setItem('CTSHours', data.totalhours_perday);
                localStorage.setItem('WEDate', data.weekendingdate);
                localStorage.setItem("TSWPHours", data.max_total_hour_week || 0);
                localStorage.setItem('TSWeekHours', data.totalhours_perweek || 0);

                var approvalStatus = data.status || '';


                tsph = parseFloat(localStorage.getItem('TSPHours')) || 0;
                ctsh = parseFloat(localStorage.getItem('CTSHours')) || 0;
                if (approvalStatus != '') {
                    if (approvalStatus == "Submitted" || approvalStatus == "Saved") {
                        console.log("No Problem");
                    } else {
                        $("#timesheetdate").val('');
                        navigator.notification.alert("Please choose a date from a non-approved week.", onCallBack, "Message", "OK");
                    }

                }
                if ((window.localStorage.getItem("option")) == "edit") {
                    allowedTSHours = tsph - (ctsh - parseFloat($("#timesheetHours").val()));
                } else
                    allowedTSHours = tsph - ctsh;
                $("body").removeClass("ui-loading");

            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    //navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadTSEmployees() {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/get_employees",
            dataType: "json",
            success: function(data) {
                $("#timesheetEmployee").html(" ");
                $("#timesheetEmployee").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#timesheetEmployee").append("<option value='" + value.id + "'>" + value.fullname + "</option>");
                });
                $("#timesheetEmployee").selectmenu().selectmenu("refresh");
                if ((window.localStorage.getItem("option")) == "edit") {
                    var obj = JSON.parse(localStorage.getItem('lvtimesheet'));
                    $.each($("#timesheetEmployee option"), function() {

                        if ($(this).val() == obj[0].employeeid) {
                            $(this).prop('selected', true).change();
                            /*setTimeout(function(){
                                $(this).change();
                            },5000); */

                        }
                    });
                    $("#timesheetEmployee").selectmenu().attr("disabled", "disabled").selectmenu("refresh");
                }
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    //navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadSelectedTSData() {
    // $('body').addClass('ui-loading');

    var obj = JSON.parse(localStorage.getItem('lvtimesheet'));
    /*$.each($("#timesheetcontract option"), function() {
        console.log($(this).text());
        if ($(this).text() == obj[0].contract) {

            $(this).prop('selected', 'true').selectmenu().selectmenu("refresh");
        }
    });*/
    // $("#timesheetcontract option:contains(" + obj[0].contract + ")").attr('selected', 'selected').selectmenu().selectmenu('refresh');
    // $("#timesheetEmployee").val(localStorage.getItem('tsempid')).attr("disabled", "true").selectmenu().selectmenu('refresh');
    //$("#timesheetEmployee").is(':visible') ? $("#timesheetEmployee").val(obj[0].employeeid).attr("disabled", "true").selectmenu().selectmenu('refresh') : console.log("User");
    //Hided for Autofilling
    //$("#timesheetEmployee").empty().html("<option value=" + obj[0].employeeid + ">" + obj[0].employeename || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
    // $("#timesheetcontract").empty().html("<option value=" + obj[0].contract + ">" + obj[0].contract || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
    //$("#timesheetproject").empty().html("<option value=" + obj[0].jobcode + ">" + obj[0].jobcode || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
    //$("#timesheetjob").empty().html("<option value=" + obj[0].jobnumber + ">" + obj[0].jobnumber || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
    //$("#timesheetjobNumber").empty().html("<option value=" + obj[0].id + ">" + obj[0].jobcode || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
    //$("#timesheettaskCode").empty().html("<option value=" + obj[0].ptask + ">" + obj[0].ptask || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
    //$("#timesheetpaycode").empty().html("<option value=" + obj[0].paycode + ">" + obj[0].paycode || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
    $("#timesheetHours").val(obj[0].hours);
    localStorage.minusHours=obj[0].hours;
    $("#timesheetdate").val(obj[0].weekday); //.attr("disabled", "true")
    localStorage.setItem("tsdate", obj[0].weekday);
    $("#timesheetUnits").val(obj[0].units); //.attr("disabled", "true");
    window.localStorage.setItem("jobcodeedit", obj[0].jobcode);
    window.localStorage.setItem("taskcodeedit", obj[0].taskcode);
    $('body').removeClass('ui-loading');
    fetchHours();
    /*if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/Timesheet_detail_view",
            dataType: "json",
            data: {
                timesheetdataid: window.localStorage.getItem("vtsid"),
                employeeid: localStorage.getItem('tsempid')
            },
            success: function(data) {
                //alert(data.msg);
                if (data.msg == 'Failure') {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("No Timesheet data available.", onCallback, "Message", "OK");
                } else if (data.msg == "Success") {
                    //console.log(data); 
                    var obj = JSON.parse(localStorage.getItem('lvtimesheet'));
                    //console.log($("#timesheetEmployee").is(':visible'));
                    console.log(localStorage.getItem('lvtimesheet'));
                    $("#timesheetEmployee").is(':visible') ? $("#timesheetEmployee").val(obj[0].employeeid).attr("disabled", "true").selectmenu().selectmenu('refresh') : console.log("User");
                    $("#timesheetcontract").empty().html("<option value=" + obj[0].contract + ">" + obj[0].contract || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
                    $("#timesheetproject").empty().html("<option value=" + obj[0].jobcode + ">" + obj[0].jobcode || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
                    $("#timesheetjob").empty().html("<option value=" + obj[0].jobnumber + ">" + obj[0].jobnumber || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
                    $("#timesheetjobNumber").empty().html("<option value=" + obj[0].id + ">" + obj[0].jobcode || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
                    $("#timesheettaskCode").empty().html("<option value=" + obj[0].ptask + ">" + obj[0].ptask || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
                    $("#timesheetpaycode").empty().html("<option value=" + obj[0].paycode + ">" + obj[0].paycode || '' + "</option>").attr("disabled", "true").selectmenu().selectmenu('refresh');
                    $("#timesheetHours").val(obj[0].hours);
                    $("#timesheetdate").val(obj[0].weekday).attr("disabled", "true");
                    localStorage.setItem("tsdate", obj[0].weekday);
                    $("#timesheetUnits").val(obj[0].units).attr("disabled", "true");
                    window.localStorage.setItem("jobcodeedit", obj[0].jobcode);
                    window.localStorage.setItem("taskcodeedit", obj[0].taskcode);
                    $('body').removeClass('ui-loading');


                }


            },
            error: function() {
                    $('body').removeClass('ui-loading');
                    //navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");

                }
                //End of AJAX Call
        });

    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");*/
}

function closeWindowMethodtimesheet() {
    console.log("closewindow called");
    navigator.notification.confirm("Are you sure you want to cancel the changes?", onConfirmCancelCallbacktimesheet, "Message", ["Yes", "No"]);
}

function onCallback() {
    console.log("Alert Clicked");
}


function onConfirmCancelCallbacktimesheet(buttonIndex) {
    if (buttonIndex === 1) {
        var value = window.localStorage.getItem("key");
        window.localStorage.setItem("option", "");
        console.log("Session Storage:" + value);
        //$.mobile.changePage("timesheet.html", { transition:"none" });
        $(":mobile-pagecontainer").pagecontainer("change", "timesheet.html");
        console.log("pageNavigated");
    } else if (buttonIndex === 2) {
        console.log("alert cancelled");
    }
}

function loadtimesheetcontract() {
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        /*var tsph=parseInt(localStorage.getItem('TSPHours'));
        var ctsh=parseInt(localStorage.getItem('CTSHours'));
        if(($("#timesheetEmployee").val()==localStorage.setItem("user_id")) && (ctsh>=tsph)){
            navigator.notification.alert("Sorry you have already logged.",false,"Message","OK");
        }
        else{*/

        $.ajax({
            type: "POST",
            //url:window.localStorage.getItem("url")+"/get_contracts",
            url: window.localStorage.getItem("url") + "/Timesheet_category",
            dataType: "json",
            data: {
                user_id: $("#timesheetEmployee").val() || window.localStorage.getItem("user_id")
            },
            success: function(data) {
                if (data.msg !== 'Failure') {
                    $("#timesheetcontract").html(" ");
                    $("#timesheetcontract").append("<option value=''>Select One</option>");
                    $.each(data, function(index, value) {
                        //$("#timesheetcontract").append("<option value='"+value.id+"' data-contract='"+value.contract+"'>"+value.fullname+"</option>").selectmenu("refresh");
                        $("#timesheetcontract").append("<option value='" + value.id + "' data-contract='" + value.contract + "'>" + value.contract + "</option>").selectmenu("refresh");
                    });
                    $("#timesheetcontract option:last").remove().selectmenu().selectmenu("refresh");
                    if ((window.localStorage.getItem("option")) == "edit") {
                        var obj = JSON.parse(localStorage.getItem('lvtimesheet'));
                        $.each($("#timesheetcontract option"), function() {

                            if ($(this).text() == obj[0].contract) {
                                $(this).prop('selected', true).change();
                                //$(this).attr('selected', true).change();
                            }
                        });
                        //$("#timesheetcontract option:last").remove();
                        //$("#timesheetcontract").selectmenu().selectmenu("refresh");
                    }

                    $('body').removeClass('ui-loading');
                } else {
                    $('body').removeClass('ui-loading');
                    if ($("#timesheetEmployee").is(':visible')) {
                        $("#timesheetEmployee").val("").selectmenu("refresh");
                        navigator.notification.alert("Please select another Employee.", false, "Message", "OK");
                    } else
                        navigator.notification.alert("No Contracts available.", false, "Message", "OK");
                    $("#timesheetcontract").html(" ");
                    $("#timesheetcontract").append("<option value=''>Select One</option>").selectmenu("refresh");
                }
            },
            error: function() {
                    $('body').removeClass('ui-loading');
                    // navigator.notification.alert("Couldn't connect to server.",false,"Message","OK");
                }
                //End of AJAX Call
        });
    }
    // }
    else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}
// function loadTSContract() {
//     if (checkConnection()) {
//         $('body').addClass('ui-loading');
//         $.ajax({
//             type: "POST",
//             url: window.localStorage.getItem("url") + "/timesheetProject",
//             //url:window.localStorage.getItem("url")+"/get_job_numbers",
//             dataType: "json",
//             data: {
//                 user_id: $("#timesheetEmployee").val() || window.localStorage.getItem("user_id")
//                 //contract: $("#timesheetcontract :selected").text()
//             },
//             //contract:$("#timesheetcontract :selected").attr('data-contract')},
//             success: function(data) {
//                 /*$("#timesheetjobNumber").html(" ");
//                  $("#timesheetjobNumber").append("<option value=''>Select One</option>");
//                  $.each(data,function(index,value){
//                  $("#timesheetjobNumber").append("<option value='"+value.jobid+"'>"+value.jobnumber+"</option>").selectmenu("refresh");
                 
//                  });    */
//                 if (data.msg !== 'Failure') {
//                     $("#timesheetproject").html(" ");
//                     $("#timesheetproject").append("<option value=''>Select One</option>");
//                     $.each(data.project, function(index, value) {
//                         $("#timesheetproject").append("<option value='" + value.title + "'>" + value.title + "</option>").selectmenu("refresh");

//                     });
//                     $("#timesheetproject").selectmenu("refresh");
//                     if ((window.localStorage.getItem("option")) == "edit") {
//                         var obj = JSON.parse(localStorage.getItem('lvtimesheet'));
//                         $.each($("#timesheetproject option"), function() {

//                             if ($(this).val() == obj[0].title) {
//                                 console.log("Selected Project" + $(this).val());
//                                 $(this).prop('selected', true).change();
//                             }
//                         });
//                         $("#timesheetproject").selectmenu().selectmenu("refresh");
//                     }
//                     /*else {
//                                            //$("#timesheetdate").val(date);
//                                            //fetchHours();
//                                        }*/
//                     $('body').removeClass('ui-loading');
//                 } else {
//                     navigator.notification.alert("Please select another Contract.", false, "Message", "OK");
//                     $("#timesheetcontract").val('').selectmenu("refresh");
//                     $("#timesheetproject").html(" ");
//                     $("#timesheetproject").append("<option value=''>Select One</option>").selectmenu("refresh");
//                     $('body').removeClass('ui-loading');
//                 }

//             },
//             error: function() {
//                     $('body').addClass('ui-loading');
//                     // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
//                 }
//                 //End of AJAX Call
//         });
//     } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
// }

function loadTSContract() {
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/Timesheet_Project",
            //url:window.localStorage.getItem("url")+"/get_job_numbers",
            dataType: "json",
            data: {
                user_id: $("#timesheetEmployee").val() || window.localStorage.getItem("user_id"),
                contract: $("#timesheetcontract :selected").text()
            },
            //contract:$("#timesheetcontract :selected").attr('data-contract')},
            success: function(data) {
                /*$("#timesheetjobNumber").html(" ");
                 $("#timesheetjobNumber").append("<option value=''>Select One</option>");
                 $.each(data,function(index,value){
                 $("#timesheetjobNumber").append("<option value='"+value.jobid+"'>"+value.jobnumber+"</option>").selectmenu("refresh");
                 
                 });    */
                if (data.msg !== 'Failure') {
                    $("#timesheetproject").html(" ");
                    $("#timesheetproject").append("<option value=''>Select One</option>");
                    $.each(data.project, function(index, value) {
                        // $("#timesheetproject").append("<option value='" + value.title + "'>" + value.title + "</option>").selectmenu("refresh");
                        $("#timesheetproject").append("<option value='" + value.projectid + "'>" + value.projectid + "</option>").selectmenu("refresh");

                    });
                    $("#timesheetproject").selectmenu("refresh");
                    if ((window.localStorage.getItem("option")) == "edit") {
                        var obj = JSON.parse(localStorage.getItem('lvtimesheet'));
                        $.each($("#timesheetproject option"), function() {

                            if ($(this).val() == obj[0].projectid) {
                                //console.log("Selected Project" + $(this).val());
                                $(this).prop('selected', true).change();
                            }
                        });
                        $("#timesheetproject").selectmenu().selectmenu("refresh");
                    }
                    /*else {
                                           //$("#timesheetdate").val(date);
                                           //fetchHours();
                                       }*/
                    $('body').removeClass('ui-loading');
                } else {
                    navigator.notification.alert("Please select another Contract.", false, "Message", "OK");
                    $("#timesheetcontract").val('').selectmenu("refresh");
                    $("#timesheetproject").html(" ");
                    $("#timesheetproject").append("<option value=''>Select One</option>").selectmenu("refresh");
                    $('body').removeClass('ui-loading');
                }

            },
            error: function() {
                    $('body').addClass('ui-loading');
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadTSJob() {
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/Timesheet_Job",
            // url: window.localStorage.getItem("url") + "/timesheetJob",
            dataType: "json",
            data: {
                user_id: $("#timesheetEmployee").val() || window.localStorage.getItem("user_id"),
                title: $("#timesheetproject :selected").val()
                // contract: $("#timesheetcontract :selected").text()
            },
            success: function(data) {
                if (data.msg !== 'Failure') {
                    //alert(JSON.stringify(data));
                    $("#timesheetjob").html(" ");
                    $("#timesheetjob").append("<option value=''>Select One</option>");
                    $.each(data.job, function(index, value) {
                        // $("#timesheetjob").append("<option value='" + value.jobnumber + "'>" + value.jobnumber + "</option>");
                        $("#timesheetjob").append("<option value='" + value.title + "'>" + value.title + "</option>");
                    });
                    $("#timesheetjob").selectmenu("refresh");
                    if ((window.localStorage.getItem("option")) == "edit") {
                       
                        var obj = JSON.parse(localStorage.getItem('lvtimesheet'));
                        //alert(obj[0].jobnumber);
                        $.each($("#timesheetjob option"), function() {
                            console.log(obj[0].title);                            
                            if ($(this).val() == obj[0].title) {
                                //console.log("Selected Project"+$(this).val());
                                //$(this).attr('selected', true).change();
                                 //debugger;                                
                                $(this).prop('selected', true).change();
                            }
                        });
                        $("#timesheetjob").selectmenu().selectmenu("refresh");
                    }
                    $('body').removeClass('ui-loading');
                } else {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Please Select another Project.", onCallBack, "Message", "OK");
                    $("#timesheetproject").val('').selectmenu("refresh");
                }
            },
            error: function() {
                    $('body').removeClass('ui-loading');
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadTSJobNumber() {
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        //  alert(window.localStorage.getItem("user_id"));
        // alert($("#timesheetjob").val());
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/Timesheet_Jobcodes",
            dataType: "json",
            data: {
                user_id: $("#timesheetEmployee").val() || window.localStorage.getItem("user_id"),
                //jobnumber: $("#timesheetjob :selected").text()
                // jobnumber: $("#timesheetproject :selected").text()
                project: $("#timesheetproject :selected").text(),
                contract:$("#timesheetcontract :selected").text()
            },
            success: function(data) {
                //alert(JSON.stringify(data));
                if (data.msg !== 'Failure') {
                    // alert(JSON.stringify(data));
                    $("#timesheetjobNumber").html(" ");
                    $("#timesheetjobNumber").append("<option value=''>Select One</option>");
                    $.each(data.jobcode, function(index, value) {
                        $("#timesheetjobNumber").append("<option value='" + value.id + "'>" + value.jobcode + "</option>");
                    });
                    $("#timesheetjobNumber").selectmenu("refresh");
                    if ((window.localStorage.getItem("option")) == "edit") {
                        var obj = JSON.parse(localStorage.getItem('lvtimesheet'));

                        $.each($("#timesheetjobNumber option"), function() {
                            // if ($(this).text() == obj[0].jobcode) {
                                if ($(this).text() == obj[0].jobnumber) {
                                console.log("Selected timesheetjobNumber"+$(this).val());
                                //$(this).attr('selected', true).change();                                
                                $(this).prop('selected', true).change();
                            }
                        });
                        $("#timesheetjobNumber").selectmenu().selectmenu("refresh");
                        $('body').removeClass('ui-loading');
                    }
                    $('body').removeClass('ui-loading');
                } else {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Please Select another Job.", onCallBack, "Message", "OK");
                    $("#timesheetjob").val('').selectmenu("refresh");
                }
            },
            error: function() {
                    $('body').removeClass('ui-loading');
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadTSJTaskCode() {
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        //  alert($("#timesheetjobNumber :selected").val());
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/Timesheet_Taskcode",
            dataType: "json",
            data: {
                user_id: $("#timesheetEmployee").val() || window.localStorage.getItem("user_id"),
                // jobcode: $("#timesheetjobNumber :selected").text()
                title: $("#timesheetproject :selected").text(),
                contract:$("#timesheetcontract :selected").text()
            },
            success: function(data) {
                //alert(data.ptask);
                //  alert(JSON.stringify(data));
                //  alert(data.msg);
                if (data.msg !== 'Failure') {
                    //alert(JSON.stringify(data));
                    $("#timesheettaskCode").html(" ");
                    $("#timesheettaskCode").append("<option value=''>Select One</option>");
                    $.each(data.taskcode, function(index, value) {
                        $("#timesheettaskCode").append("<option value='" + value.pid + "'>" + value.ptask + "</option>");
                    });
                    $("#timesheettaskCode").selectmenu("refresh");
                    if ((window.localStorage.getItem("option")) == "edit") {
                        var obj = JSON.parse(localStorage.getItem('lvtimesheet'));
                        $.each($("#timesheettaskCode option"), function() {

                            if ($(this).text() == obj[0].ptask) {
                                $(this).prop('selected', true).change();
                                //$(this).attr('selected', true).change();
                            }
                        });
                        $("#timesheettaskCode").selectmenu().selectmenu("refresh");
                    }
                    $('body').removeClass('ui-loading');
                } else {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Please Select another Jobcode.", onCallBack, "Message", "OK");
                    $("#timesheetjobNumber").val('').selectmenu("refresh");
                }
            },
            error: function() {
                    $('body').removeClass('ui-loading');
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadTSPayCode() {

    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/Timesheet_Paycode",
            dataType: "json",
            data: {
                "jobtitle": $("#timesheetproject :selected").text()
            },
            success: function(data) {
                //if (data.msg == 'Success') {
                //alert(JSON.stringify(data.paycode));
                $("#timesheetpaycode").html(" ");
                $("#timesheetpaycode").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#timesheetpaycode").append("<option value='" + value.PC + "'>" + value.PC + "</option>").selectmenu("refresh");
                });
                if ((window.localStorage.getItem("option")) == "edit") {
                    var obj = JSON.parse(localStorage.getItem('lvtimesheet'));
                    $.each($("#timesheetpaycode option"), function() {

                        if ($(this).text() == obj[0].paycode) {

                            $(this).prop('selected', true).change();
                        }
                    });
                    $("#timesheetpaycode").selectmenu().selectmenu("refresh");
                }
                $('body').removeClass('ui-loading');
                /*} else
                    $('body').removeClass('ui-loading');*/
                /*else{
                $('body').removeClass('ui-loading');
                navigator.notification.alert("Please Select another Taskcode.",onCallBack,"Message","OK");
        $("#timesheetjobNumber").val('').selectmenu("refresh");
               }*/
            },
            error: function() {
                    $('body').removeClass('ui-loading');
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function validate(status) {
    if (checkConnection()) {
        // $('body').addClass('ui-loading');
        if ($("#timesheetEmployee").is(':visible') && $("#timesheetEmployee option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select an Employee.", onCallback, "Message", "OK");
            // $('body').removeClass('ui-loading');
        } else if ($("#timesheetcontract option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Category.", onCallback, "Message", "OK");
            // $('body').removeClass('ui-loading');            
        } else if ($("#timesheetproject option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Project.", onCallback, "Message", "OK");
            // $('body').removeClass('ui-loading');
        } else if ($("#timesheetjob option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Job.", onCallback, "Message", "OK");
            // $('body').removeClass('ui-loading');
        } else if ($("#timesheetjobNumber option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Job Code.", onCallback, "Message", "OK");
            // $('body').removeClass('ui-loading');

        } else if ($("#timesheettaskCode option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Task Code.", onCallback, "Message", "OK");
            // $('body').removeClass('ui-loading');            
        } else if ($("#timesheetpaycode option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Pay Code.", onCallback, "Message", "OK");
            // $('body').removeClass('ui-loading');
        } else if ($.trim($("#timesheetdate").val().length) == 0) {
            navigator.notification.alert("Please choose a date.", onCallback, "Message", "OK");
            // $('body').removeClass('ui-loading');
        } else if (Date.parse($("#timesheetdate").val()) > new Date()) {
            navigator.notification.alert("You cannot create Timesheet for future.", onCallback, "Message", "OK");
            // $('body').removeClass('ui-loading');
            $("#timesheetdate").val('');
        } else if ($.trim($("#timesheetHours").val()) == 0) {
            navigator.notification.alert("Please enter Hours.", onCallback, "Message", "OK");
            // $('body').removeClass('ui-loading');
        } else if (parseFloat(allowedTSHours) < parseFloat($("#timesheetHours").val())) {
            navigator.notification.alert("Only " + tsph + " hours can be logged for a day!", function() {

                $("#timesheetHours").focus();
            }, "Message", "OK");
            // $('body').removeClass('ui-loading');
        } else if ((parseFloat(localStorage.TSWPHours) - parseFloat(localStorage.TSWeekHours)) < parseFloat($("#timesheetHours").val())) {
            navigator.notification.alert("Only " + localStorage.TSWPHours + " hours can be logged for a week!", function() {

                $("#timesheetHours").focus();
            }, "Message", "OK");
        }
        /*else if ($.trim($("#timesheetUnits").val()) == 0) {
    navigator.notification.alert("Please enter Units.", onCallback, "Message", "OK");
    // $('body').removeClass('ui-loading');
}
*/
        //else if((window.localStorage.getItem("option"))=="NEW"){ 
        else if ((window.localStorage.getItem("option")) == "NEW") {
            if (status == "Submitted") {
                var enteringHours = parseFloat(localStorage.TSWeekHours) + parseFloat($("#timesheetHours").val());
                navigator.notification.confirm("You are submitting " + enteringHours + " hours for week ending date " + localStorage.WEDate, function(buttonIndex) {
                    if (buttonIndex == 1)
                        createtimesheetNew(status);
                }, "Message", ["Yes", "No"]);
            } else {
                createtimesheetNew(status);
            }
            // $.mobile.changePage("timesheet.html", {transition:"none"});
        } else if ((window.localStorage.getItem("option")) == "edit") {
            if (status == "Submitted") {
                var enteringHours = (parseFloat(localStorage.TSWeekHours)-parseFloat(localStorage.minusHours)) + parseFloat($("#timesheetHours").val());
                navigator.notification.confirm("You are submitting " + enteringHours + " hours for week ending date " + localStorage.WEDate, function(buttonIndex) {
                    if (buttonIndex == 1)
                        updatetimesheetNew(status);
                }, "Message", ["Yes", "No"]);
            } else {
                updatetimesheetNew(status);
            }
            // $.mobile.changePage("timesheet.html", {transition:"none"});
        }
        // $('body').removeClass('ui-loading');
    } else {
        $('body').removeClass('ui-loading');
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
}

function createtimesheetNew(status) {

    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/create_timesheet",
            dataType: "json",
            data: {
                lastupdatedby: localStorage.getItem("user_id"),
                dayoftheweek: weekday[dateVar.getDay()],
                weekendingdate: date,
                weekendingdate_formatted: date,
                action: localStorage.getItem("option") == "edit" ? "edit" : "create",
                status: status,
                source: "screen",
                employeetype: localStorage.getItem("emptype"),
                employeeid: $("#timesheetEmployee").val() || localStorage.getItem("user_id"),
                isadmin: localStorage.getItem('AdminorNot'),
                id: $("#timesheetcontract").val(),
                numberofjobs: '1',
                selecteddate: $("#timesheetdate").val(),
                totalhours: $("#timesheetHours").val(),
                jobname: $("#timesheetproject :selected").text(),
                job0: $("#timesheetjobNumber :selected").text(),
                jobcode: $("#timesheetjob :selected").text(),
                taskcode: $("#timesheettaskCode :selected").val(),
                paycode: $("#timesheetpaycode :selected").text(),
                units: $("#timesheetUnits").val(),
                jobcomment: " "
            },
            success: function(data) {
                //var obj = JSON.parse(data); 

                //console.log(obj.msg);                            
                if (data.msg == 'Success') {
                    $('body').removeClass('ui-loading');
                    //$.mobile.loading( 'hide');                 
                    navigator.notification.alert("Timesheet created successfully.", onCallback, "Message", "OK");
                    $.mobile.changePage("timesheet.html", {
                        transition: "none"
                    });
                } else if (data.msg == 'Duplicate entry') {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Timesheet for this date has been already created.", onCallback, "Message", "OK");
                    $.mobile.loading('hide');
                } else if (data.msg == 'Failure') {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Unable to create Timesheet.", onCallback, "Message", "OK");
                    $.mobile.loading('hide');
                }


            },
            error: function() {
                    $('body').addClass('ui-loading');
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}


$("#addtimesheet").ready(function() {
    moduleRevealer();
    //hourFetcher();
    tsph = parseFloat(localStorage.getItem('TSPHours')) || 0;
    ctsh = parseFloat(localStorage.getItem('CTSHours')) || 0;
    allowedTSHours = tsph - ctsh;
    $("#timesheetdate").on('focusout', fetchHours);
    console.log(window.localStorage.getItem("user_type")); //&& ((window.localStorage.getItem("option")) !== "edit")
    if ((window.localStorage.getItem("user_type") == "hrms_admin")) {

        $("#timesheetAdminBlock").css("display", "block");
        // if ((window.localStorage.getItem("option")) !== "edit") 
        loadTSEmployees();

    }
    /*else {
           $("#timesheetAdminBlock").css("display", "none");
       }*/
    //alert($("#timesheetEmployee").css("visibility"));
    if ((window.localStorage.getItem("user_type") == "hrms_normal") && (window.localStorage.getItem("option")) == "NEW") {
        //$("#timesheettransactiondate").val(date);
        loadtimesheetcontract();
        $("#timesheetAdminBlock").css("display", "none");
        //loadtimesheetjobnumber();                    
        //loadtimesheettaskcode();
        //loadtimesheetcostcode();
    } else if ((window.localStorage.getItem("option")) == "edit") {
        loadtimesheetcontract();
        loadSelectedTSData();

    }
});
