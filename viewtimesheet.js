// function checkConnection(){


//     var networkState = navigator.connection.type;
//     var states = {};
//     states[Connection.UNKNOWN]  = 'Unknown connection';
//     states[Connection.ETHERNET] = 'Ethernet connection';
//     states[Connection.WIFI]     = 'WiFi connection';
//     states[Connection.CELL_2G]  = 'Cell 2G connection';
//     states[Connection.CELL_3G]  = 'Cell 3G connection';
//     states[Connection.CELL_4G]  = 'Cell 4G connection';
//     states[Connection.NONE]     = 'No network connection';
//  if(states[networkState]=='No network connection'){ 
//    return false;
//  }else{
//    return true;
//  }
// }

var managetimesheet_array = [];
$("#viewtimesheet_page").ready(function() {
    // moduleRevealer();
    logoChanger();
    $(".home").attr("src", "images/" + localStorage.getItem("colortheme") + "home-1.png");
    $(".bills").attr("src", "images/" + localStorage.getItem("colortheme") + "bills-32.png");
    $(".reports").attr("src", "images/" + localStorage.getItem("colortheme") + "report-32.png");
    $(".timesheet").attr("src", "images/" + localStorage.getItem("colortheme") + "timesheet-32.png");
    $(".tasks").attr("src", "images/" + localStorage.getItem("colortheme") + "queue-32.png");
    /*if((window.localStorage.getItem("user_type")=="hrms_admin") ||(window.localStorage.getItem("user_type")=="hrms_normal")){
           
            //$("#contractlabel1").text("Contract");
            //$("#jobnumberlabel1").text("Job Number");
            //$("#taskcodelabel1").text("Task Code");

    }else if((window.localStorage.getItem("user_type")=="legal_admin")||(window.localStorage.getItem("user_type")=="legal_normal")){
            
        
            //$("#contractlabel1").text("Matter");
           // $("#jobnumberlabel1").text("BillingType");
            //$("#taskcodelabel1").text("Item");
                              // $.mobile.loading( 'hide');
    }*/

    managetimesheet_array = [];

    if (checkConnection()) {
        $('body').addClass('ui-loading');

        //var serviceCall = $.post( window.localStorage.getItem("url")+"/view_timesheet",{sheetid:window.localStorage.getItem("vtsid")},"json");
        var serviceCall = $.post(window.localStorage.getItem("url") + "/Timesheet_detail_view", {
            timesheetdataid: window.localStorage.getItem("vtsid"),
            employeeid: localStorage.getItem('tsempid') || localStorage.getItem("user_id"),
            selectdate: localStorage.getItem('tsdate')
        }, "json");
        serviceCall.done(function(data) {

            obj = JSON.parse(data);
            localStorage.setItem('lvtimesheet', JSON.stringify(data));

            if (obj.msg == 'Failure') {
                // alert("fail");        
                $('body').removeClass('ui-loading');
                navigator.notification.alert("No Timesheet data available.", onCallback, "Message", "OK");
                // $.mobile.loading( 'hide');
            } else {
                //                          alert(JSON.stringify(obj));
                //alert(obj[0].status);
                console.log(obj[0].status);
                var permissions = JSON.parse(localStorage.getItem('Permissions'));
                if (permissions.timesheet.Edit) {
                    console.log("Edit Allowed");
                    if (obj[0].status == "Rejected" || obj[0].status == "Approved") {
                        $("#editTimesheetBtn").addClass('ui-disabled');
                    } else console.log("We can Edit now");
                } else
                    $("#editTimesheetBtn").addClass('ui-disabled');

                localStorage.setItem('lvtimesheet', data);
                window.localStorage.setItem("timesheetdataid", obj[0].timesheetdataid);
                $("#timesheetview_employeename").text(obj[0].employeename || "");
                $("#timesheetview_contract").text(obj[0].contract || "");
                $("#timesheetview_project").text(obj[0].projectid || "");
                $("#timesheetview_jobnumber").text(obj[0].jobnumber);
                $("#timesheetview_taskcode").text(obj[0].ptask);
                $("#timesheetview_costcode").text(obj[0].paycode);
                $("#timesheetview_transactiondate").text(obj[0].weekday);
                $("#timesheetview_totalhrs").text(obj[0].hours);
                $("#timesheetview_units").text(obj[0].units);
                $("#timesheetview_status").text(obj[0].status);
                /*$("#timesheetview_desc").text(obj.comment);*/
                // $("#dataid").val(obj.timesheetdataid);


                $('body').removeClass('ui-loading');
                //$.mobile.loading( 'hide');
            }
        });
        serviceCall.fail(function() {
            $('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            // $.mobile.loading( 'hide');
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        // $.mobile.loading( 'hide');
    }

});


function onCallback() {
    console.log("Alert clicked");
}



function updatetimesheet() {
    var dateVar = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    $('body').addClass('ui-loading');
    // alert($("#timesheetjobNumber option:selected").text());
    var createtimesheetCallupdate = $.post(window.localStorage.getItem("url") + "/create_timesheet", {
        dayoftheweek: weekday[dateVar.getDay()],
        action: "edit",
        status: "Submitted",
        source: "screen",
        employeetype: localStorage.getItem("emptype"),
        employeeid: localStorage.getItem("user_id"),
        id: $("#timesheetcontract").val(),
        numberofjobs: '1',
        weekendingdate: date,
        weekendingdate_formatted: date,
        selecteddate: date, //maxhoursallowedperday:,
        totalhours: $("#timesheetHours").val(),
        job0: $("#timesheetjobNumber :selected").val(),
        jobcode: $("#timesheetjob :selected").text(),
        taskcode: $("#timesheettaskCode :selected").text(),
        paycode: $("#timesheetpaycode :selected").text(),
        units: "1",
        timesheetdataid: window.localStorage.getItem("vtsid"),
        jobcomment: "1"

    }, "json");
    // contract:$("#timesheetcontract").val(),

    createtimesheetCallupdate.done(function(data) {

        obj = JSON.parse(data);
        //alert(JSON.stringify(obj));
        if (obj.msg == 'Success') {


            // $.mobile.loading( 'hide');
            $('body').removeClass('ui-loading');
            navigator.notification.alert("Timesheet updated successfully.", onCallback, "Message", "OK");

            $.mobile.changePage("timesheet.html", {
                transition: "none"
            });
        } else {
            //                                 alert(JSON.stringify(obj));
            $('body').removeClass('ui-loading');
            navigator.notification.alert("Unable to update Timesheet.", onCallback, "Message", "OK");
            // $.mobile.loading( 'hide');

        }

    });

    createtimesheetCallupdate.fail(function() {
        //  $.mobile.hidePageLoadingMsg();

        $('body').removeClass('ui-loading');
        // navigator.notification.alert("Fail to save Timesheet.",onCallback,"Message","OK");
        // $.mobile.loading( 'hide');

    });


}


function onWindowCloseedit() {
    window.localStorage.setItem("key", "viewtimesheet.html");
    window.localStorage.setItem("option", "edit");
    $.mobile.changePage("addtimesheet.html", {
        transition: "none"
    });
    // updatetimesheet(); 
    // edittimesheet();
}



// Delete Timesheet

function removetimesheet() {
    // $.mobile.loading( 'show', {
    //                  text: 'Loading..',
    //                  textVisible: true,
    //                  theme: 'a',
    //                  html: ""
    //                  });
    if (checkConnection()) {
        // alert("chek");
        navigator.notification.confirm("Are you sure you want to delete this Timesheet?", onConfirmCallbackdel, "Message", ["OK", "Cancel"]);
        // onConfirmCallbackdel(1);
        $("body").addClass("ui-loading");
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
        // $("body").removeClass("ui-loading");
    }
}

function onConfirmCallbackdel(buttonIndex) {
    if (buttonIndex == 1) {
        //$('body').addClass('ui-loading');
        var obj = JSON.parse(localStorage.getItem('lvtimesheet'));
        var serviceCall = $.post(window.localStorage.getItem("url") + "/delete_timesheet", {
            timesheetdataid: window.localStorage.getItem("vtsid"),
            timesheetid: window.localStorage.getItem("dtsid"),
            hours: obj[0].hours
        }, "json");
        serviceCall.done(function(data) {
            //obj = JSON.parse(data);
            if (data.msg == 'Failure') {
                //$('body').removeClass('ui-loading');

                navigator.notification.alert("Unable to delete Timesheet.", onCallback, "Message", "OK");
                // $.mobile.loading( 'hide');
                $("body").removeClass("ui-loading");
            } else {
                //$('body').removeClass('ui-loading');
                $("body").removeClass("ui-loading");
                navigator.notification.alert("Deleted Timesheet Successfully.", false, "Message", "OK");
                // $.mobile.loading( 'hide');

                $.mobile.changePage("timesheet.html", {
                    transition: "none"
                });
            }
        });
        serviceCall.fail(function() {
            //$('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            // $.mobile.loading( 'hide');
            $("body").removeClass("ui-loading");
        });
    } else if (buttonIndex == 2) {
        // $.mobile.loading( 'hide');
        $("body").removeClass("ui-loading");
        console.log("alert cancelled");
    }
}
