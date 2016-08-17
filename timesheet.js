/*$(document).on("pageinit","#timesheet",function(){
 moduleRevealer();
 hourFetcher();
 loadtimesheetlist();
 $("#searchtimesheet").hide();
 });

$(document).on("pageinit","#addtimesheet",function(){
               moduleRevealer();
               hourFetcher();
               
               });*/
var offset = 0;
var offset_submit = 0;
var limit_p = 10;
var issubmit = 0;
var flag = 0;
var total = 0;
var managetimesheet_array = [];
var isList = false;
var allowedHours, editAllowedHours;
var canBeLogged;
$("#timesheet").ready(function() {
    moduleRevealer();
    //hourFetcher();
    //loadtimesheetlist();
    loadSearchTSCategory();
    loadtimesheetlistNew();
    $("#searchtimesheet").hide();
    $("#timesheetlist").on("click", ".listItemview", function() {
        $.mobile.changePage("viewtimesheet.html", {
            transition: "none"
        }); //,false, true
        /*window.localStorage.setItem("dtsid", managetimesheet_array[sheetid][8]);
        window.localStorage.setItem("vtsid", managetimesheet_array[sheetid][9]);*/
        window.localStorage.setItem("dtsid", $(this).attr("data-sheetid"));
        window.localStorage.setItem("vtsid", $(this).attr("data-timesheetdataid"));
        //localStorage.setItem('ctsempid',$(this).attr("data-timesheetdataid"))
        localStorage.setItem('tsempid', $(this).attr("data-empid"));
        localStorage.setItem('tsdate', $(this).attr("data-date"));
        // var sheetid = $(this).attr('id');
    });

    $('#timesheetSearchInput').on('change input', function() {
        if ($(this).val() === '') {
            loadtimesheetlistNew();
        }
    });
    $("#timesheetSearchInput").keyup(function(event) {
        if (event.keyCode == '13') {

            timesheetSearch($(this).val());
        }

    });
});

function timesheetSearch(typedKeyword) {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/Timesheet_list_all",
            dataType: "json",
            data: {
                user_id: localStorage.getItem("user_id"),
                isadmin: localStorage.getItem('AdminorNot'),
                timesheetkey: typedKeyword,
                selectdate: $("#searchTSDate").val() || "",                
                searchcategory: $("#searchTSCategory :selected").text() || "",
                status: $("#searchTSStatus").val() || ""
            },
            success: function(data) {
                total = data.totalcount;
                flag = Math.floor(total / limit_p);
                if (total <= limit_p || total === 0) {
                    $('[id="timesheetnextmatter"]').addClass("ui-disabled");
                    $('[id="timesheetprevmatter"]').addClass("ui-disabled");
                }
                if (data.msg == 'Failure') {
                    $('body').removeClass('ui-loading');
                    $('[id="timesheetnextmatter"]').addClass("ui-disabled");
                    $('[id="timesheetprevmatter"]').addClass("ui-disabled");
                    $("#filterarea").hide();
                    $("#timesheetlist").html("");
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("No Timesheet available.", false, "Message", "OK");
                } else if (data.msg == "Success") {
                    $("#timesheetlist").html("");

                    $.each(data.timesheetresult, function(index, value) {
                        $("#timesheetlist").append('<li class="listItemview" data-sheetid="' + value.sheet_id + '" data-timesheetdataid="' + value.timesheetdataid + '" data-empid="' + value.employeeid + '" data-date="' + value.weekday + '">\
                              <a href="#"  data-transition="none" ><p class="listP"><font style="font-weight:bold">Category:' + value.contract +
                            '</font><br/>Project:' + value.projectid +
                            '<br/>Task Code:' + value.ptask +
                            '<br/>Date:' + value.weekday +
                            '<br/>Hours:' + value.hours +
                            '<br/>Status:' + value.status +
                            '</p></a></li>');
                    });
                    $("#timesheetlist").listview('refresh');
                    $('body').removeClass('ui-loading');
                }

            },
            error: function(textStatus) {
                    $('body').removeClass('ui-loading');
                    //navigator.notification.alert(textStatus+" Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else
        navigator.notification.alert("Please check internet connection.", false, "Message", "OK");
}

/*$("#addtimesheet").ready(function(){
                        moduleRevealer();
                        //hourFetcher();
                        if((window.localStorage.getItem("user_type")=="hrms_admin")){
                          $("#timesheetAdminBlock").css("display","block");
                          loadTSEmployees();
                        }
                        else 
                          $("#timesheetAdminBlock").css("display","none");
                        });*/
function loadSearchTSCategory() {
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            //url:window.localStorage.getItem("url")+"/get_contracts",
            url: window.localStorage.getItem("url") + "/Timesheet_category",
            dataType: "json",
            data: {
                user_id: localStorage.getItem("user_id")
            },
            success: function(data) {
                if (data.msg !== 'Failure') {
                    $("#searchTSCategory").html(" ");
                    $("#searchTSCategory").append("<option value=''>Select One</option>");
                    $.each(data, function(index, value) {
                        //$("#timesheetcontract").append("<option value='"+value.id+"' data-contract='"+value.contract+"'>"+value.fullname+"</option>").selectmenu("refresh");
                        $("#searchTSCategory").append("<option value='" + value.id + "' >" + value.contract + "</option>");
                    });
                    $("#searchTSCategory option:last").remove().selectmenu().selectmenu("refresh");
                    $('body').removeClass('ui-loading');
                } else {
                    $('body').removeClass('ui-loading');
                    $("#searchTSCategory").html(" ");
                    $("#searchTSCategory").append("<option value=''>Select One</option>");
                }
            },
            error: function() {
                    $('body').removeClass('ui-loading');
                    // navigator.notification.alert("Couldn't connect to server.",false,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function validateUpdateHours() {
    if (canBeLogged < $("#hoursWorked").val())
        navigator.notification.alert("Total number of hours worked in a day cannot exceed " + localStorage.getItem('totalTSHours') + " hours.", onCallback, "Message", "OK");

    else {
        if (checkConnection()) {
            $('body').addClass('ui-loading');
            $.ajax({
                type: "POST",
                url: window.localStorage.getItem("url") + "/update_timesheetdata",
                dataType: "json",
                data: {
                    timesheetdataid: localStorage.getItem("vtsid"),
                    hours: $("#hoursWorked").val()
                },
                success: function(data) {
                    if (data.msg == "Success") {
                        $('body').removeClass('ui-loading');
                        $("#hoursPopup").popup("close");
                        navigator.notification.alert("Timesheet updated successfully.", onCallback, "Message", "OK");
                        loadtimesheetlistNew();
                    } else
                        navigator.notification.alert("Unable to update Timesheet.", onCallback, "Message", "OK");
                },
                error: function() {
                        $('body').removeClass('ui-loading');
                        //navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                    }
                    //End of AJAX Call
            });
        } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
    }
}



function clearsel() {

    $('#searchTSCategory').val("").selectmenu("refresh");
    $('#searchTSDate').val("");
    $("#searchTSStatus").val("").selectmenu("refresh");
    // $( "#searchcontract" ).empty();
}


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
if (day < 10) day = "0" + day;

var date = year + "-" + monthl + "-" + day;

/*function hourFetcher() {
    //Method to validate hours
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/dailyview_validate",
            dataType: "json",
            data: {
                employeeid: localStorage.getItem("user_id")
            },
            success: function(data) {

                if (data.status == 0) {
                    $("#addTimesheetBtn").addClass("ui-disabled");
                }

                localStorage.setItem('timehoursallowed', JSON.parse(data.Tot_hours) - JSON.parse(data.hours));

                //allowedHours=data[0].maximumhoursperday-data[0].maximumregularhoursperday;

                $('body').removeClass('ui-loading');
            },
            error: function() {
                    $('body').removeClass('ui-loading');
                    //navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}*/



/*var offset=0;
var offset_submit=0;
var limit_p=10;
var issubmit=0;
var flag=0;
var total=0;
var managetimesheet_array = [];
var isList = false;*/

function timesheetpagination_next() {
    $('body').addClass('ui-loading');
    $('[data-type ="search"]').val('');
    // $.mobile.silentScroll( $("#mManageBillSearch").offset().top);
    $('[id="timesheetprevmatter"]').removeClass("ui-disabled");
    if (issubmit === 1) {
        offset_submit = offset_submit + limit_p;
        var t = flag * limit_p;

        if ((offset_submit === t) || (offset_submit >= total)) {
            $('[id="timesheetnextmatter"]').addClass("ui-disabled");
            //submit(1);
            submittimesheetNew();

        } else {
            $('[id="timesheetnextmatter"]').removeClass("ui-disabled");
            //submit(0);
            submittimesheetNew();
        }


    } else {
        issubmit = 0;
        offset = offset + limit_p;
        var t = flag * limit_p;
        if ((offset === t) || (offset >= total)) {

            $('[id="timesheetnextmatter"]').addClass("ui-disabled");
            loadtimesheetlistNew(1);
        } else {
            $('[id="timesheetnextmatter"]').removeClass("ui-disabled");
            loadtimesheetlistNew(0);
        }


    }
}

function timesheetpagination_prev() {
    $('[data-type="search"]').val('');
    // $.mobile.silentScroll( $("#mManageBillSearch").offset().top);
    $('[id="timesheetnextmatter"]').removeClass("ui-disabled");

    if (issubmit === 1) {
        if (offset_submit != 0) {
            offset_submit = offset_submit - limit_p;

        } else
            offset_submit = 0;
        if (offset_submit <= 0) {
            $('[id="timesheetprevmatter"]').addClass("ui-disabled");
        } else {
            $('[id="timesheetprevmatter"]').removeClass("ui-disabled");

        }

        submittimesheetNew();
    } else {

        issubmit = 0;
        if (offset != 0)
            offset = offset - limit_p;
        else
            offset = 0;

        if (offset <= 0) {

            $('[id="timesheetprevmatter"]').addClass("ui-disabled");
        } else {
            $('[id="timesheetprevmatter"]').removeClass("ui-disabled");
        }

        loadtimesheetlistNew();
    }
}








function onConfirm(buttonIndex) {
    if (buttonIndex == 1) {
        // window.history.back();
        $.mobile.navigate("timesheet.html");
        //wstimesheet();
    } else if (buttonIndex == 2) {
        $.mobile.navigate("addtimesheet.html");
    }
}

function loadtimesheetlistNew(b) {

    if (b != 1)
        $('[id="timesheetnextmatter"]').removeClass("ui-disabled");
    if (offset == 0)
        $('[id="timesheetprevmatter"]').addClass("ui-disabled");
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/Timesheet_list_all",
            dataType: "json",
            data: {
                user_id: localStorage.getItem("user_id"),
                isadmin: localStorage.getItem('AdminorNot'),
                timesheetkey: $("#timesheetSearchInput").val() || "",
                offset: offset,
                limit: limit_p
            },
            success: function(data) {
                total = data.totalcount;
                flag = Math.floor(total / limit_p);
                if (total <= limit_p || total === 0) {
                    $('[id="timesheetnextmatter"]').addClass("ui-disabled");
                    $('[id="timesheetprevmatter"]').addClass("ui-disabled");
                }
                if (data.msg == 'Failure') {
                    $('body').removeClass('ui-loading');
                    $('[id="timesheetnextmatter"]').addClass("ui-disabled");
                    $('[id="timesheetprevmatter"]').addClass("ui-disabled");
                    $("#filterarea").hide();

                    navigator.notification.alert("No Timesheet available.", false, "Message", "OK");
                } else if (data.msg == "Success") {
                    $("#timesheetlist").html("");
                    // localStorage.setItem('TSPHours',data.total_hour);
                    // localStorage.setItem('CTSHours',data.hours_per_day);
                    /*if((parseInt(data.total_hour)<=parseInt(data.hours_per_day)) && (localStorage.getItem('AdminorNot')==='N'))
                        $("#addTimesheetBtn").addClass('ui-disabled');
                    else
                        console.log("You can create Timesheet");*/
                    $.each(data.timesheetresult, function(index, value) {
                        $("#timesheetlist").append('<li class="listItemview" data-sheetid="' + value.sheet_id + '" data-timesheetdataid="' + value.timesheetdataid + '" data-empid="' + value.employeeid + '" data-date="' + value.weekday + '">\
                              <a href="#"  data-transition="none" ><p class="listP"><font style="font-weight:bold">Category:' + value.contract +
                            '</font><br/>Project:' + value.projectid +
                            '<br/>Task Code:' + value.ptask +
                            '<br/>Date:' + value.weekday +                            
                            '<br/>Hours:' + value.hours +
                            '<br/>Status:' + value.status +
                            '</p></a></li>');
                    });
                    $("#timesheetlist").listview('refresh');
                    $('body').removeClass('ui-loading');
                }

            },
            error: function(textStatus) {
                    $('body').removeClass('ui-loading');
                    //navigator.notification.alert(textStatus+" Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else
        navigator.notification.alert("Please check internet connection.", false, "Message", "OK");

}










function loadtimesheetcontract() {
    $('body').addClass('ui-loading');
    $.ajax({
        type: "POST",
        //url:window.localStorage.getItem("url")+"/get_contracts",
        url: window.localStorage.getItem("url") + "/Timesheet_category",
        dataType: "json",
        data: {
            user_id: $("#timesheetEmployee").val() || window.localStorage.getItem("user_id")
        },
        success: function(data) {
            $("#timesheetcontract").html(" ");
            $("#timesheetcontract").append("<option value=''>Select One</option>");
            $.each(data, function(index, value) {
                //$("#timesheetcontract").append("<option value='"+value.id+"' data-contract='"+value.contract+"'>"+value.fullname+"</option>").selectmenu("refresh");
                $("#timesheetcontract").append("<option value='" + value.id + "' data-contract='" + value.contract + "'>" + value.contract + "</option>").selectmenu("refresh");
            });
            $('body').removeClass('ui-loading');
        },
        error: function() {
                $('body').removeClass('ui-loading');
                // navigator.notification.alert("Couldn't connect to server.",false,"Message","OK");
            }
            //End of AJAX Call
    });
}



function loadTSContract() {
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/Timesheet_Project",
            //url:window.localStorage.getItem("url")+"/get_job_numbers",
            dataType: "json",
            data: {
                user_id: window.localStorage.getItem("user_id"),
                contract: $("#timesheetcontract :selected").text()
            },
            //contract:$("#timesheetcontract :selected").attr('data-contract')},
            success: function(data) {
                /*$("#timesheetjobNumber").html(" ");
                 $("#timesheetjobNumber").append("<option value=''>Select One</option>");
                 $.each(data,function(index,value){
                 $("#timesheetjobNumber").append("<option value='"+value.jobid+"'>"+value.jobnumber+"</option>").selectmenu("refresh");
                 
                 });    */
                $("#timesheetproject").html(" ");
                $("#timesheetproject").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#timesheetproject").append("<option value='" + value.title + "'>" + value.title + "</option>").selectmenu("refresh");

                });
                $('body').removeClass('ui-loading');

            },
            error: function() {
                    $('body').removeClass('ui-loading');
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
            dataType: "json",
            data: {
                user_id: window.localStorage.getItem("user_id"),
                title: $("#timesheetproject :selected").val()
            },
            success: function(data) {
                $("#timesheetjob").html(" ");
                $("#timesheetjob").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#timesheetjob").append("<option value='" + value.jobnumber + "'>" + value.jobnumber + "</option>");
                });
                $("#timesheetjob").selectmenu("refresh");
                $('body').removeClass('ui-loading');

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
                user_id: window.localStorage.getItem("user_id"),
                jobnumber: $("#timesheetjob :selected").text()
            },
            success: function(data) {
                //alert(JSON.stringify(data));
                $("#timesheetjobNumber").html(" ");
                $("#timesheetjobNumber").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#timesheetjobNumber").append("<option value='" + value.id + "'>" + value.jobcode + "</option>");
                });
                $("#timesheetjobNumber").selectmenu("refresh");
                $('body').removeClass('ui-loading');

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
                user_id: window.localStorage.getItem("user_id"),
                jobcode: $("#timesheetjobNumber :selected").text()
            },
            success: function(data) {
                //alert(data.ptask);
                //  alert(JSON.stringify(data));
                //  alert(data.msg);
                $("#timesheettaskCode").html(" ");
                $("#timesheettaskCode").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#timesheettaskCode").append("<option value='" + value.ptask + "'>" + value.ptask + "</option>").selectmenu("refresh");
                });
                $('body').removeClass('ui-loading');

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
                $("#timesheetpaycode").html(" ");
                $("#timesheetpaycode").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#timesheetpaycode").append("<option value='" + value.PC + "'>" + value.PC + "</option>").selectmenu("refresh");
                });
                $('body').removeClass('ui-loading');

            },
            error: function() {
                    $('body').removeClass('ui-loading');
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}




function searchtimesheet() {

    var o = $(".searchtimesheet").is(":visible");
    var c = $(".searchtimesheet").is(":hidden");
    if (o) {
        $("#managetimesheetlist").css("padding-top", "0%");
    } else {
        $("#managetimesheetlist").css("padding-top", "220px"); //320px instead of 220
    }
    $(".searchtimesheet").slideToggle();
}

function submittimesheetNew(a) {
    searchtimesheet();
    if (a != 1)
        $('[id="timesheetnextmatter"]').removeClass("ui-disabled");
    if (offset_submit === 0)
        $('[id="timesheetprevmatter"]').addClass("ui-disabled");
    $("#filterarea").show();
    issubmit = 1;
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/Timesheet_list_all",
            dataType: "json",
            data: {
                user_id: localStorage.getItem("user_id"),
                isadmin: localStorage.getItem('AdminorNot'),
                timesheetkey: $("#timesheetSearchInput").val() || "",
                selectdate: $("#searchTSDate").val() || "",
                searchcategory: $("#searchTSCategory :selected").text() || "",
                status: $("#searchTSStatus").val() || "",
                offset: offset,
                limit: limit_p
            },
            success: function(data) {
                $("#timesheetlist").empty();
                total = data.totalcount;
                flag = Math.floor(total / limit_p);
                if (total <= limit_p || total === 0) {
                    $('[id="timesheetnextmatter"]').addClass("ui-disabled");
                    $('[id="timesheetprevmatter"]').addClass("ui-disabled");
                }
                if (data.msg == 'Failure') {
                    $('body').removeClass('ui-loading');
                    $('[id="timesheetnextmatter"]').addClass("ui-disabled");
                    $('[id="timesheetprevmatter"]').addClass("ui-disabled");
                    $("#filterarea").hide();
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("No Timesheet available.", false, "Message", "OK");
                } else if (data.msg == "Success") {
                    $("#timesheetlist").html("");
                    /*$.each(data.timesheetresult, function(index, value) {
                        $("#timesheetlist").append('<li class="listItemview" data-sheetid="' + value.sheet_id + '" data-timesheetdataid="' + value.timesheetdataid + '">\
            <a href="#"  data-transition="none" ><p class="listP"><font style="font-weight:bold">Category:' + value.contract +
                            '</font><br/>Project:' + value.jobcode +
                            '<br/>Task Code:' + value.ptask +
                            '<br/>Hours:' + value.hours +
                            '</p></a></li>');
                    });*/
                    $.each(data.timesheetresult, function(index, value) {
                        $("#timesheetlist").append('<li class="listItemview" data-sheetid="' + value.sheet_id + '" data-timesheetdataid="' + value.timesheetdataid + '" data-empid="' + value.employeeid + '" data-date="' + value.weekday + '">\
                              <a href="#"  data-transition="none" ><p class="listP"><font style="font-weight:bold">Category:' + value.contract +
                            '</font><br/>Project:' + value.projectid +
                            '<br/>Task Code:' + value.ptask +
                            '<br/>Date:' + value.weekday +
                            '<br/>Hours:' + value.hours +
                            '<br/>Status:' + value.status +
                            '</p></a></li>');
                    });
                    $("#timesheetlist").listview('refresh');
                    $('body').removeClass('ui-loading');
                }
            },
            error: function() {
                $('body').removeClass('ui-loading');
            }
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $('body').removeClass('ui-loading');
    }
}

function onCallback() {
    console.log("Alert Clicked");
}



function onWindowCloseadd() {
    window.localStorage.setItem("key", "timesheet.html");
    window.localStorage.setItem("option", "NEW");
    $.mobile.changePage("addtimesheet.html", {
        transition: "none"
    });
}

/*Old Methods*/
/*function loadtaskcodeedit() {

    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    var taskcodeselectededit = obj.jobcode;

    if (checkConnection()) {
        var timesheettaskcodecalledit = $.post(window.localStorage.getItem("url") + "/get_task_codes", {
            jobcode: taskcodeselectededit
        }, "json");
        // var timesheettaskcodecall= $.post(window.localStorage.getItem("url")+"/get_job_numbers",{user_id,contract},"json");
        timesheettaskcodecalledit.done(function(data) {
            obj = JSON.parse(data);
            $("#timesheettaskCode option").remove();
            //                               alert(obj.msg);
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#timesheettaskCode").append(listItem);
                $("#timesheettaskCode").selectmenu('refresh');
                $.mobile.loading('hide');

            } else {

                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>"
                $.each(obj, function(indexid, item) {

                    if (((localStorage.getItem("taskcodeedit")) == (item.optionvalue)) && ((localStorage.getItem("option")) == "edit")) {
                        listItem += "<option value='" + item.optionvalue + "' selected>" + item.optiontext + "</option>";

                    } else {

                        listItem += "<option value='" + item.optionvalue + "'>" + item.optiontext + "</option>";
                    }

                });

                $("#timesheettaskCode").append(listItem);
                $("#timesheettaskCode").selectmenu('refresh');
                $.mobile.loading('hide');
            }
            //$.mobile.hidePageLoadingMsg();
        });
        timesheettaskcodecalledit.fail(function() {
            //$.mobile.hidePageLoadingMsg();

            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            // $.mobile.loading( 'hide');
            $('body').removeClass('ui-loading');
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }
}
*/

/*function taskCodeChange(index) {
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    var costcodeselected = index.options[index.selectedIndex].value;
    if (checkConnection()) {
        var timesheetcostcodecall = $.post(window.localStorage.getItem("url") + "/get_cost_codes", {
            taskcode: costcodeselected
        }, "json");
        timesheetcostcodecall.done(function(data) {
            obj = JSON.parse(data);
            $("#timesheetcostCode option").remove();
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#timesheetcostCode").append(listItem);
                $("#timesheetcostCode").selectmenu('refresh');
                $.mobile.loading('hide');

            } else {

                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>"
                $.each(obj, function(indexid, item) {
                    listItem += "<option value='" + item.id + "'>" + item.costcode + "</option>";
                });

                $("#timesheetcostCode").append(listItem);
                $("#timesheetcostCode").selectmenu('refresh');
                $.mobile.loading('hide');
            }
            //$.mobile.hidePageLoadingMsg();
        });
        timesheetcostCodeCall.fail(function() {
            //$.mobile.hidePageLoadingMsg();

            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            $.mobile.loading('hide');
            $('body').removeClass('ui-loading');
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }
}*/

//Manual list filtering
/*function submittimesheet(a) {

    searchtimesheet();


    $('body').addClass('ui-loading');
    // alert("submit");
    if (a != 1)
    //  alert("1");
        $('[id="timesheetnextmatter"]').removeClass("ui-disabled");
    //alert("2");
    if (offset_submit === 0)
    //alert("3");
        $('[id="timesheetprevmatter"]').addClass("ui-disabled");
    //alert("4");
    $("#filterarea").show();
    //alert("5");
    //  $.mobile.silentScroll( $("#mManageBillSearch").offset().top);
    //alert("6");
    issubmit = 1;
    //alert("7");
    //$('body').addClass('ui-loading');
    //alert("8");
    $("#timesheetlist").empty();
    // var contrac = document.getElementById("contrac");

    // var emp = contrac.options[contrac.selectedIndex].value;
    // document.getElementById("searchcontract").value;

    // var frmdate = document.getElementById("frmdate");

    var fromdate = document.getElementById("searchfromdate").value;

    // var toodate = document.getElementById("toodate");

    var todate = document.getElementById("searchtodate").value;

    // alert(selectedStatus);
    var result_submitLists = '';
    //alert(result_submitLists);
    managetimesheet_array = [];
    //alert(managebills_array);

    if (checkConnection()) {

        // alert("check connection");
        //$('body').addClass('ui-loading');
        // console.log("values",window.localStorage.getItem('user_id'),selectedMonth,selectedYear,selectedStatus,issubmit,offset_submit,limit_p);
        //var serviceCall = $.post( window.localStorage.getItem("url")+"/list_all_timesheet",{employeeid:window.localStorage.getItem("user_id"),offset:offset_submit,limit:limit_p,from_date:fromdate,to_date:todate},"json");
        var serviceCall = $.post(window.localStorage.getItem("url") + "/Timesheet_list", {
            user_id: window.localStorage.getItem("user_id"),
            offset: offset_submit,
            limit: limit_p,
            from_date: fromdate,
            to_date: todate
        }, "json");
        serviceCall.done(function(data) {

            console.log("Timesheet Data" + data);
            obj = data;
            //  alert(JSON.stringify(data));
            total = obj.totalcount;
            flag = Math.floor(total / limit_p);
            if (total <= limit_p || total === 0) {
                $('[id="timesheetnextmatter"]').addClass("ui-disabled");
                $('[id="timesheetprevmatter"]').addClass("ui-disabled");
            }
            if (obj.msg === 'Failure') {
                $('[id="timesheetnextmatter"]').addClass("ui-disabled");
                $('[id="timesheetprevmatter"]').addClass("ui-disabled");
                $("#filterarea").hide();
                $('body').removeClass('ui-loading');
                navigator.notification.alert("No Timesheet available.", false, "Message", "OK");
                //$.mobile.loading( 'hide');
            } else {
                isList = true;
                managetimesheet_array.length = 0;
                editAllowedHours = 0;
                localStorage.setItem("totalTSHours", obj.total_hour);
                localStorage.setItem('tsStatus', obj.status);
                localStorage.setItem('tsDataId', obj.timesheetid);
                $.each(obj, function(index, item) {

                    // managetimesheet_array.push([item.weekday,
                    //  item.periodending,
                    //  item.sheet_id,
                    //  item.badge,
                    //  item.employee,
                    //  item.period,
                    //  item.status,
                    //  item.totalhours,
                    //  item.regularhours,
                    //  item.overtimehours,
                    //  item.comment,
                    //  item.jobcode,
                    //  item.units,
                    //  item.timesheetdataid]);
                    //  });   
                    //alert(parseInt(item.hours));
                    //editAllowedHours=parseInt(editAllowedHours)+parseInt(item.hours);
                    managetimesheet_array.push([
                        item.ptask,
                        item.id,
                        item.title,
                        item.jobcode,
                        item.taskcode,
                        item.jobnumber,
                        item.contract,
                        item.hours,
                        item.sheet_id,
                        item.timesheetdataid,
                        item.status
                    ]);
                });

                var result_submitLists = '';
                // alert("managebills_array.length-1\n"+managebills_array.length)
                //      alert(managetimesheet_array.length);
                for (var limit = 0; limit < managetimesheet_array.length - 3; limit++) {
                    //alert(managetimesheet_array[limit][7]);
                    editAllowedHours = parseInt(editAllowedHours) + parseInt(managetimesheet_array[limit][7]);
                    if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal"))

                    {
                        result_submitLists += '<li class="listItemview" data-icon="carat-r" id=' + limit + ' data-stat="' + managetimesheet_array[limit][10] + '" data-hours="' + managetimesheet_array[limit][7] + '"><a href="#"  data-transition="none"><p><font style="font-weight:bold">Category :';
                        result_submitLists += managetimesheet_array[limit][6];
                        result_submitLists += '</font><br />Project :' + managetimesheet_array[limit][3];
                        result_submitLists += "<br />Task Code :";
                        result_submitLists += managetimesheet_array[limit][4] + "<br />";
                        result_submitLists += "Hours:" + managetimesheet_array[limit][7];
                        result_submitLists += '</p></a></li>';
                    } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
                        result_submitLists += '<li class="listItemview" data-icon="carat-r" id=' + limit + ' ><a href="#"  data-transition="none"><p><font style="font-weight:bold">Category :';
                        result_submitLists += managetimesheet_array[limit][6];
                        result_submitLists += '</font><br />Project :' + managetimesheet_array[limit][3];
                        result_submitLists += "<br />Task Code :";
                        result_submitLists += managetimesheet_array[limit][4] + "<br />";
                        result_submitLists += "Hours:" + managetimesheet_array[limit][7];
                        result_submitLists += '</p></a></li>';


                    }


                }
                //alert(editAllowedHours);
                localStorage.setItem('editableHours', parseInt(editAllowedHours));
                $("#timesheetlist").empty();
                $("#timesheetlist").append(result_submitLists);
                $("#timesheetlist").trigger('create');
                $("#timesheetlist").listview().listview('refresh');

                $('body').removeClass('ui-loading');
                if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
                    console.log("Employee");
                    $("#timesheetlist").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search Contract");
                } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
                    console.log("Time Keeper");
                    $("#timesheetlist").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search Matter");
                }
                $("#timesheetlist").listview().listview('refresh');
                $('ul.jqm-custom-list-view').prev().find('input').keyup(function(e, d) {
                    console.log("Test input" + $(this).val());
                    var eltExistssearch = false;
                    var elt_countsearch = 0;
                    $('ul.jqm-custom-list-view li').each(function() {
                        if ($(this).css('display') != 'none') {
                            elt_countsearch++;
                        }
                    });
                    console.log("Count value:" + elt_countsearch);
                    if (elt_countsearch == 0) {
                        $('body').removeClass('ui-loading');
                        // $("#filterarea").hide();
                        navigator.notification.alert("No Timesheet available!.", false, "Message", "OK");

                    }
                });
                ////$('body').removeClass('ui-loading'); 
            }
        });
        serviceCall.fail(function() {
            //$('body').removeClass('ui-loading');            
            // navigator.notification.alert("Couldn't connect to server.",false,"Message","OK");
            $('body').removeClass('ui-loading');
            //  $.mobile.loading( 'hide');
        });


    } else {
        navigator.notification.alert("Please check internet connection.", false, "Message", "OK");
    }
    $("#timesheetlist").empty();
    $("#timesheetlist").append(result_submitLists);
    $("#timesheetlist").trigger('create');
    $("#timesheetlist").listview().listview('refresh');
    //$('body').removeClass('ui-loading');
    //  if(isList == false){  
    //                alert("test");
    //    navigator.notification.alert("Requested bill is not available.",onSuccessCallback,"Message","OK");  
    //  } 

}*/



// Field validation
// var hrsfieldcheck="^[0-9]+([;-][0-9]+)?$";
// var amtfieldcheck="[0-9][0-9.]*[0-9]";    
// var hoursfield=form.timesheetHours.value;
// var amountfield=form.timesheetAmount.value;


/*function validate() {
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        if ($("#timesheetEmployee").is(':visible') && $("#timesheetEmployee option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select an Employee.", onCallback, "Message", "OK");
            $('body').removeClass('ui-loading');
        } else if ($("#timesheetcontract option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Category.", onCallback, "Message", "OK");
            $('body').removeClass('ui-loading');
            /*if((window.localStorage.getItem("user_type")=="hrms_admin") || (window.localStorage.getItem("user_type")=="hrms_normal")) {
             navigator.notification.alert("Please select the contract.",onCallback,"Message","OK");
             $('body').removeClass('ui-loading');    
             }else{
             navigator.notification.alert("Please select the matter.",onCallback,"Message","OK");
             $('body').removeClass('ui-loading');
             } 
        } else if ($("#timesheetproject option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Project.", onCallback, "Message", "OK");
            $('body').removeClass('ui-loading');
        } else if ($("#timesheetjob option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Job.", onCallback, "Message", "OK");
            $('body').removeClass('ui-loading');
        } else if ($("#timesheetjobNumber option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Job Code.", onCallback, "Message", "OK");
            $('body').removeClass('ui-loading');
            /* if((window.localStorage.getItem("user_type")=="hrms_admin") || (window.localStorage.getItem("user_type")=="hrms_normal")){ 
             navigator.notification.alert("Please select the Job Number.",onCallback,"Message","OK");
             $('body').removeClass('ui-loading');
             }else{
             navigator.notification.alert("Please select the BillingType.",onCallback,"Message","OK");
             $('body').removeClass('ui-loading');
             } 
        } else if ($("#timesheettaskCode option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Task Code.", onCallback, "Message", "OK");
            $('body').removeClass('ui-loading');
            /* if((window.localStorage.getItem("user_type")=="hrms_admin") ||(window.localStorage.getItem("user_type")=="hrms_normal")){
             navigator.notification.alert("Please select the Task Code.",onCallback,"Message","OK");
             $('body').removeClass('ui-loading');
             }else{
             navigator.notification.alert("Please select the Item.",onCallback,"Message","OK");
             $('body').removeClass('ui-loading');
             } 
        } else if ($("#timesheetpaycode option:selected").text() == 'Select One') {
            navigator.notification.alert("Please select the Pay Code.", onCallback, "Message", "OK");
            $('body').removeClass('ui-loading');
        }
        /*else if($.trim($("#timesheettransactiondate").val()).length == 0){
         navigator.notification.alert("Please add Transaction date.",onCallback,"Message","OK");
         $('body').removeClass('ui-loading');
         }
        else if ($.trim($("#timesheetHours").val()) == 0) {
            navigator.notification.alert("Please enter Hours.", onCallback, "Message", "OK");
            $('body').removeClass('ui-loading');
        } else if (parseInt(allowedHours) < parseInt($("#timesheetHours").val())) {
            navigator.notification.alert("Only " + allowedHours + " hours can be logged for a day!", false, "Message", "OK");
            $('body').removeClass('ui-loading');
        }
        /*else if($.trim($("#timesheetAmount").val()) == 0){
         navigator.notification.alert("Please enter Units.",onCallback,"Message","OK");
         $('body').removeClass('ui-loading');
         }
        /*else if($.trim($("#timesheetdesc").val()).length == 0){
                     navigator.notification.alert("Please enter description.",onCallback,"Message","OK");
                     $('body').removeClass('ui-loading');
                     }
        else if ((window.localStorage.getItem("option")) == "NEW") {
            // alert("new");
            createtimesheet();
            // $.mobile.changePage("timesheet.html", {transition:"none"});
        } else if ((window.localStorage.getItem("option")) == "edit") {
            // alert("edit");

            updatetimesheet();
            // $.mobile.changePage("timesheet.html", {transition:"none"});
        }
    } else {
        $('body').removeClass('ui-loading');
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");

    }

}*/

/*function onCallback() {
    console.log("Alert Clicked");
}*/


/*function createtimesheet() {
    var dateVar = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    $.mobile.loading('hide');

    var createtimesheetCall = $.post(window.localStorage.getItem("url") + "/create_timesheet", {
        // employeeid:localStorage.getItem("user_id"),//$("#timesheetcontract").val(),
        //  action:"create",
        //  employeetype:localStorage.getItem("emptype"),
        //  job0:$("#timesheetjobNumber option:selected").val(),
        //  jobcode:$("#timesheetjobNumber option:selected").text(),
        //  taskcode:$("#timesheettaskCode").val(),
        //  // paycode+selectedjobid:$("#timesheetcostCode").val(),
        //  selecteddate:$("#timesheettransactiondate").val(),
        //  units:$("#timesheetAmount").val(),
        //  totalhours:$("#timesheetHours").val(),
        //  jobcomment:$("#timesheetdesc").val()
        dayoftheweek: weekday[dateVar.getDay()],
        action: "create",
        status: "Submitted",
        source: "screen",
        employeetype: localStorage.getItem("emptype"),
        employeeid: $("#timesheetEmployee").val() || localStorage.getItem("user_id"),
        id: $("#timesheetcontract").val(),
        numberofjobs: '1',
        weekendingdate: date,
        weekendingdate_formatted: date,
        selecteddate: $("#timesheetdate").val(),
        //selecteddate:date,
        //maxhoursallowedperday:,
        //maximumregularhoursperday:,
        //overtimeallowed:,
        //maxovertimehoursperday:,
        // maxovertimehoursallowed:,
        //maximumworkinghours:,
        //workinghoursperweek:,
        //totalhoursplusbenefits:,
        // paidholidayhoursleft:,
        //vacationhoursleft:,
        //sickhoursleft:,
        //personalhoursleft:,
        //rateperhour:,
        //invoicecategory:,
        //overtimehours:,
        //regularhours:,
        totalhours: $("#timesheetHours").val(),
        job0: $("#timesheetjobNumber :selected").val(),
        jobcode: $("#timesheetjob :selected").text(),
        taskcode: $("#timesheettaskCode :selected").text(),
        paycode: $("#timesheetpaycode :selected").text(),
        units: $("#timesheetUnits").val(),
        jobcomment: " "
    }, "json");
    // contract:$("#timesheetcontract").val(),

    createtimesheetCall.done(function(data) {

        obj = JSON.parse(data);

        if (obj.msg == 'Success') {

            $('body').removeClass('ui-loading');
            $.mobile.loading('hide');

            navigator.notification.alert("Timesheet created successfully.", onCallback, "Message", "OK");
            $.mobile.changePage("timesheet.html", {
                transition: "none"
            });
        } else if (obj.msg == 'Duplicate entry') {
            $('body').removeClass('ui-loading');
            navigator.notification.alert("Timesheet for this date has been already created.", onCallback, "Message", "OK");
            $.mobile.loading('hide');
        }

    });

    createtimesheetCall.fail(function() {
        //  $.mobile.hidePageLoadingMsg();
        $('body').removeClass('ui-loading');
        // navigator.notification.alert("Fail to save Timesheet.",onCallback,"Message","OK");
        // $.mobile.loading( 'hide');
    });

}*/


/*function loadtimesheetjobnumber(){
 
 
 
 if(checkConnection()){
 //$.mobile.showPageLoadingMsg();
 $('body').addClass('ui-loading');
 
 if((window.localStorage.getItem("user_type")=="hrms_admin")||window.localStorage.getItem("user_type")=="legal_admin"){
 var loadJobNumberCall = $.post(window.localStorage.getItem("url")+"/get_job_numbers",{user_id:window.localStorage.getItem("user_id")},"json");
 }else{
 var loadJobNumberCall = $.post(window.localStorage.getItem("url")+"/get_job_numbers",{user_id:window.localStorage.getItem("user_id")},"json");
 
 }
 loadJobNumberCall.done(function(data){
 obj = JSON.parse(data);
 $("#timesheetjobNumber option").remove();
 if(obj.msg=='Failure'){
 
 var listItemone = "";
 listItemone = "<option value='Select One'>Select One</option>";
 $("#timesheetjobNumber").append(listItem);
 $("#timesheetjobNumber").selectmenu('refresh');
 
 $('body').removeClass('ui-loading');
 }else{
 
 var listItemone = "";
 listItemone = "<option value='Select One'>Select One</option>";
 $.each(obj,function(indexid,item){
 if(((localStorage.getItem("jobcodeedit"))==(item.jobnumber))&&((localStorage.getItem("option"))=="edit")){
 listItemone +="<option value='"+item.jobid+"' selected>"+item.jobnumber+"</option>";
 // jobNumberChange(this);
 
 }
 
 else
 {
 
 listItemone +="<option value='"+item.jobid+"'>"+item.jobnumber+"</option>";
 }
 // alert(item.jobid);
 
 });
 $('body').removeClass('ui-loading');
 $("#timesheetjobNumber").append(listItemone);
 $("#timesheetjobNumber").selectmenu('refresh');
 
 
 
 }
 //$.mobile.hidePageLoadingMsg();
 });
 loadJobNumberCall.fail(function(){
 //$.mobile.hidePageLoadingMsg();
 $('body').removeClass('ui-loading');
 // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
 
 
 });
 }else{
 
 navigator.notification.alert("Please check internet connection.",onCallback,"Message","OK");
 
 $('body').removeClass('ui-loading');
 }
 
 }
 
 
 function jobNumberChange(index){
 $('body').addClass('ui-loading');
 var taskcodeselected = index.options[index.selectedIndex].text;
 if(checkConnection()){
 var timesheettaskcodecall= $.post(window.localStorage.getItem("url")+"/get_task_codes",{jobcode:taskcodeselected},"json");
 // var timesheettaskcodecall= $.post(window.localStorage.getItem("url")+"/get_job_numbers",{user_id,contract},"json");
 timesheettaskcodecall.done(function(data){
 obj = JSON.parse(data);
 $("#timesheettaskCode option").remove();
 if(obj.msg=='Failure'){
 var listItem = "";
 listItem = "<option value='Select One'>Select One</option>";
 $("#timesheettaskCode").append(listItem);
 $("#timesheettaskCode").selectmenu('refresh');
 $('body').removeClass('ui-loading');
 
 }else{
 
 var listItem = "";
 listItem = "<option value='Select One'>Select One</option>"
 $.each(obj,function(indexid,item){
 
 if(((localStorage.getItem("taskcodeedit"))==(item.optionvalue))&&((localStorage.getItem("option"))=="edit")){
 listItem +="<option value='"+item.optionvalue+"' selected>"+item.optiontext+"</option>";
 $.mobile.loading( 'hide');
 }
 
 else
 {
 $.mobile.loading( 'hide');
 listItem +="<option value='"+item.optionvalue+"'>"+item.optiontext+"</option>";
 }
 
 });
 
 $("#timesheettaskCode").append(listItem);
 $("#timesheettaskCode").selectmenu('refresh');
 $('body').removeClass('ui-loading');
 }
 //$.mobile.hidePageLoadingMsg();
 });
 timesheettaskCodeCall.fail(function(){
 //$.mobile.hidePageLoadingMsg();
 $('body').removeClass('ui-loading');
 // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
 //$.mobile.loading( 'hide');
 });
 }else{
 $('body').removeClass('ui-loading');
 navigator.notification.alert("Please check internet connection.",onCallback,"Message","OK");
 
 }
 
 }
 */


/*function contractChange(index){
    $.mobile.loading( 'show', {
                     text: 'Loading..',
                     textVisible: true,
                       theme: 'a',
                       html: ""
                     });
// alert($("#timesheetcontract").val());
    var selectedEmployeeID = $("#timesheetcontract").val();
    var selectedContract = index.options[index.selectedIndex].value;

loadtimesheetjobnumber(selectedEmployeeID,selectedContract);

}*/

/*function closeWindowMethodtimesheet() {
    console.log("closewindow called");
    navigator.notification.confirm("Are you sure you want to cancel the changes?", onConfirmCancelCallbacktimesheet, "Message", ["Yes", "No"]);
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
*/

/*function loadtimesheetlist(b) {
    $("body").addClass("ui-loading");
    if (b != 1)
        $('[id="timesheetnextmatter"]').removeClass("ui-disabled");
    if (offset == 0)
        $('[id="timesheetprevmatter"]').addClass("ui-disabled");
    managetimesheet_array = [];
    if (checkConnection()) {
        //$('body').addClass('ui-loading');

        // var serviceCall = $.post( window.localStorage.getItem("url")+"/list_all_timesheet",{employeeid:window.localStorage.getItem("user_id"),offset:offset,limit:limit_p},"json");
        var serviceCall = $.post(window.localStorage.getItem("url") + "/Timesheet_list", {
            user_id: window.localStorage.getItem("user_id"),
            offset: offset,
            limit: limit_p
        }, "json");
        serviceCall.done(function(data) {
            //alert(data);
            // obj = JSON.parse(data);
            // alert(obj);
            obj = data;
            total = obj.totalcount;
            //                     alert(JSON.stringify(obj));
            flag = Math.floor(total / limit_p);

            if (total <= limit_p || total === 0) {

                $('[id="timesheetnextmatter"]').addClass("ui-disabled");
                $('[id="timesheetprevmatter"]').addClass("ui-disabled");
            }
            if (obj.msg == 'Failure') {
                $('body').removeClass('ui-loading');
                $('[id="timesheetnextmatter"]').addClass("ui-disabled");
                $('[id="timesheetprevmatter"]').addClass("ui-disabled");
                $("#filterarea").hide();

                navigator.notification.alert("No Timesheet available.", false, "Message", "OK");
            } else {
                managetimesheet_array.length = 0;
                editAllowedHours = 0;
                localStorage.setItem("totalTSHours", obj.total_hour);
                localStorage.setItem('tsStatus', obj.status);
                localStorage.setItem('tsDataId', obj.timesheetid);
                $.each(obj, function(index, item) {

                    // managetimesheet_array.push([item.weekendingdate,
                    //  item.periodending,
                    //  item.sheet_id,
                    //  item.badge,
                    //  item.contractname ||" ",
                    //  item.period,
                    //  item.status,
                    //  item.totalhours,
                    //  item.regularhours,
                    //  item.overtimehours,
                    //  item.comment,
                    //  item.jobcode,

                    //  // item.costcode,
                    //  item.units,
                    //  item.timesheetdataid,
                    //  item.taskcode]);


                    managetimesheet_array.push([item.ptask,
                        item.id,
                        item.title,
                        item.jobcode,
                        item.taskcode,
                        item.jobnumber,
                        item.contract,
                        item.hours,
                        item.sheet_id,
                        item.timesheetdataid,
                        item.status
                    ]);
                });
                //localStorage.setItem('editableHours',editAllowedHours);



                var resultLists = '';
                // alert("managetimesheet_array.length"+managetimesheet_array.length);
                if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {

                    console.log("Length" + managetimesheet_array.length);
                    for (var limit = 0; limit < managetimesheet_array.length - 3; limit++) {
                        // resultLists += '<li class="listItemview" data-icon="carat-r" id='+limit+' ><a href="#"  data-transition="none"><p><font style="font-weight:bold">Contract: ';
                        // resultLists += managetimesheet_array[limit][4];
                        // resultLists += '</font><br />Job Number: ';
                        // resultLists += managetimesheet_array[limit][11]+"<br />Units: ";

                        editAllowedHours = parseInt(editAllowedHours) + parseInt(managetimesheet_array[limit][7]);
                        resultLists += '<li class="listItemview" data-icon="carat-r" id=' + limit + ' data-stat="' + managetimesheet_array[limit][10] + '" data-hours="' + managetimesheet_array[limit][7] + '">\
                         <a href="#"  data-transition="none" ><p><font style="font-weight:bold">Category: ';
                        resultLists += managetimesheet_array[limit][6] + '</font>';
                        resultLists += '<br/>Project:' + managetimesheet_array[limit][3];
                        //resultLists += '<br/>Job: '+managetimesheet_array[limit][11];
                        //resultLists += '</font><br />Job Number: ';
                        resultLists += '<br/>Task Code:' + managetimesheet_array[limit][4];
                        //resultLists +='<br/>Pay Code:';

                        resultLists += "<br />Hours:" + managetimesheet_array[limit][7];

                        // if((managetimesheet_array[limit][12])==null)
                        //  {

                        //  resultLists += " <br />";
                        //  }
                        //  else
                        //  {
                        //  resultLists += managetimesheet_array[limit][12]+"<br />";
                        //  }

                        resultLists += '</p></a></li>';
                        $("#timesheetlist").empty();
                        $("#timesheetlist").append(resultLists);
                        $("#timesheetlist").trigger('create');
                        $("#timesheetlist").listview().listview('refresh');

                        if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
                            // alert("Employee");
                            $("#timesheetlist").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search");
                        } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
                            // alert("Time Keeper");

                            $("#timesheetlist").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search");
                        }
                        $("#timesheetlist").listview().listview('refresh');
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
                                $("body").removeClass("ui-loading");
                                navigator.notification.alert("No Timesheet available!", false, "Message", "OK");
                            }
                        });
                        $("body").removeClass("ui-loading");
                        $.mobile.loading('hide');
                        ////$('body').removeClass('ui-loading');

                    }
                    localStorage.setItem('editableHours', parseInt(editAllowedHours));
                } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {

                    for (var limit = 0; limit < managetimesheet_array.length - 3; limit++) {
                        // resultLists += '<li class="listItemview" data-icon="carat-r" id='+limit+' ><a href="#"  data-transition="none"><p><font style="font-weight:bold">Matter: ';
                        //  resultLists += managetimesheet_array[limit][4];
                        //  resultLists += '</font><br />Billingtype: ';
                        //  resultLists += managetimesheet_array[limit][11]+"<br />Units: ";
                        editAllowedHours = parseInt(editAllowedHours) + parseInt(managetimesheet_array[limit][7]);
                        resultLists += '<li class="listItemview" data-icon="carat-r" id=' + limit + ' data-stat="' + managetimesheet_array[limit][10] + '" data-hours="' + managetimesheet_array[limit][7] + '">\
                         <a href="#"  data-transition="none" ><p><font style="font-weight:bold">Category: </font>';
                        resultLists += managetimesheet_array[limit][6];
                        resultLists += '<br/>Project:' + managetimesheet_array[limit][3];
                        //resultLists += '</font><br />Billingtype: '+managetimesheet_array[limit][11];
                        resultLists += '<br/>Task Code:' + managetimesheet_array[limit][4];
                        // resultLists +='<br/>Pay Code:';
                        // resultLists +='<br/>Day:';
                        resultLists += "<br />Hours:" + managetimesheet_array[limit][7];
                        //resultLists += +"<br />Units: ";

                        // if((managetimesheet_array[limit][12])==null)
                        //  {

                        //  resultLists += " <br />";
                        //  }
                        //  else
                        //  {
                        //  resultLists += managetimesheet_array[limit][12]+"<br />";
                        //  }
                        resultLists += '</p></a></li>';
                        $("#timesheetlist").empty();
                        $("#timesheetlist").append(resultLists);
                        $("#timesheetlist").trigger('create');
                        $("#timesheetlist").listview().listview('refresh');

                        if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
                            // alert("Employee");
                            $("#timesheetlist").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search Contract");
                        } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
                            // alert("Time Keeper");

                            $("#timesheetlist").prev().find(".ui-input-search .ui-input-text").attr("placeholder", "Search Matter");
                        }
                        $("#timesheetlist").listview().listview('refresh');
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
                                $("body").removeClass("ui-loading");
                                navigator.notification.alert("No Timesheet available!", false, "Message", "OK");
                            }
                        });
                        $("body").removeClass("ui-loading");
                        $.mobile.loading('hide');
                        ////$('body').removeClass('ui-loading');

                    }
                    localStorage.setItem('editableHours', parseInt(editAllowedHours));


                }
            }
        });
        serviceCall.fail(function() {
            $('body').removeClass('ui-loading');
            // $.mobile.loading( 'hide');
            // navigator.notification.alert("Couldn't connect to server.",false,"Message","OK");
        });

    } else {
        navigator.notification.alert("Please check internet connection.", false, "Message", "OK");
    }


    //List item click
    $("#timesheetlist").on("click", ".listItemview", function() {
        $.mobile.changePage("viewtimesheet.html", {
            transition: "none"
        }); //,false, true
        // window.localStorage.setItem("dtsid", managetimesheet_array[sheetid][8]);
        // window.localStorage.setItem("vtsid", managetimesheet_array[sheetid][9]);
        window.localStorage.setItem("dtsid", $(this).attr("data-sheetid"));
        window.localStorage.setItem("vtsid", $(this).attr("data-timesheetdataid"));
        var sheetid = $(this).attr('id');
        // if($(this).attr('data-stat')==="Submitted" || $(this).attr('data-stat')==="Saved"){
        //                     var permissions=JSON.parse(localStorage.getItem('Permissions'));
        //                     if(permissions.timesheet.Save!=0){
        //                           $("#hoursPopup").popup( "open" );
        //                           $("#hoursWorked").val($(this).attr('data-hours'));
        //                          // allowedHours=parseInt(obj[0].hours)+parseInt(obj.total_hour)-parseInt(localStorage.getItem("editableHours"));
        //                       canBeLogged=parseInt($(this).attr('data-hours'))+parseInt(localStorage.getItem('totalTSHours'))-parseInt(localStorage.getItem("editableHours"));
        //                       $("#hoursMessage").html("Maximum of "+localStorage.getItem('totalTSHours')+" hours per day.");
                             
        //                   }
        //                     else 
        //                       navigator.notification.alert("You are not having permissions to Edit.",false,"Message","OK");
        //                       //alert(localStorage.getItem('editableHours'));

        //                    }
        //                    else
        //                     navigator.notification.alert("This Timesheet cannot be edited.",false,"Message","OK");
        // // console.log("selected Item Position:"+customer_id);
        // // alert("click 3\n"+customer_id);
        // window.localStorage.setItem("vtsid", managetimesheet_array[sheetid][13]);
        //  window.localStorage.setItem("dtsid", managetimesheet_array[sheetid][2]);





    });



}
*/
