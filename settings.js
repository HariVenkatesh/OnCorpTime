$(function() {
    document.addEventListener("deviceready", onDeviceReady, false);


    function onDeviceReady() {
        console.log("index screen");
        document.addEventListener("backbutton", onBackPressed, false);
    }

    function onBackPressed() {
        //navigator.notification.confirm("Are you want to exit?",onExit,"Message.",["Yes","Cancel"]);
    }
    // $("#setting_input").val("www.techsofthr.com/cgvak/dev/bills/webservices");
    if (window.localStorage.getItem("aa") == null) {
        $("#setting_input").val("www.oncorptime.com/BOM/bills/webservices");
    } else {
        $("#setting_input").val(window.localStorage.getItem("aa"));
    }
});

$("#settingspage").ready(function() {
    if (localStorage.getItem("colortheme") !== null) {
        $("#template").val(localStorage.getItem("colortheme")).selectmenu("refresh");
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", "css/" + localStorage.getItem("colortheme") + ".css");
        if (typeof fileref != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }
});
$(document).on("pagebeforeshow", "#addtimesheet,#requesttype_page,#addtask-page,#bills-page,#createbills_page,#clonetask-page,#edittask-page,#login-page,#managereport_page,#tasks-page,#temp-page,#viewbills_page,#viewtasks_page,#viewtimesheet_page,#timesheet", logoChanger);


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

//For Edit Button functionality
function onEditClick() {
    var textInput = document.getElementById("setting_input");
    if (textInput.readOnly) {
        textInput.readOnly = false;
        $("#setting_input").focus();
        $("#setting_input").css({
            'background-color': '#FFFFEE'
        });
    } else {
        textInput.readOnly = true;
        $("#setting_input").css({
            'background-color': ''
        });
    }
}

function labelChanger() {
    var mandatorySpan = "<span class='mandatory'> * </span>:";
    if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
        $(".taskcompany").html("Template" + mandatorySpan);
        $(".taskcontractername").html("Contract Name" + mandatorySpan);
        $(".taskmanager").html("Manager" + mandatorySpan);
        $(".taskassignee").html("Assignee:");
        $("#cbilllabel").text("Job Number");
        $("#citemlabel").text("Task Code");

    } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
        $(".taskcompany").html("Template" + mandatorySpan);
        $(".taskmanager").html("Attorney" + mandatorySpan);
        $(".taskassignee").html("Assistant:");
        $(".taskcontractername").html("Client Name" + mandatorySpan);
        $(".searchAssignee").html("Assistant:");
        $(".searchContract").html("Client");
        $(".taskcontract").html("Matter" + mandatorySpan);
        $("#cbilllabel").text("Billing Type");
        $("#citemlabel").text("Item");
    }
}

function fetchLogo() {
    //    alert("dd");
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_logo",
            //data:{user_id:window.localStorage.getItem("user_id")},
            success: function(data) {

                var logoSrc = JSON.parse(data);
                localStorage.setItem('logoURL', logoSrc.logo);
                $(".headerImg").attr('src', logoSrc.logo).css({
                    'height': '35px',
                    'width': '175px'
                });
                $(".panelHeaderImg").attr('src', logoSrc.logo).css({
                    'height': '35px',
                    'width': '175px'
                });
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
    //$("#headerImg").html("<img src='"+window.localStorage.getItem("url")+"get_logo'>");
}

function logoChanger() {
    var logoURL = localStorage.getItem('logoURL');
    $(".headerImg").attr('src', logoURL).css({
        'height': '35px',
        'width': '175px'
    });
    $(".panelHeaderImg").attr('src', logoURL).css({
        'height': '35px',
        'width': '175px'
    });
}



function moduleRevealer() {
    //logoChanger();
    console.warn("moduleRevealer");
    $(".home").attr("src", "images/" + localStorage.getItem("colortheme") + "home-1.png");
    $(".bills").attr("src", "images/" + localStorage.getItem("colortheme") + "bills-32.png");
    $(".reports").attr("src", "images/" + localStorage.getItem("colortheme") + "report-32.png");
    $(".timesheet").attr("src", "images/" + localStorage.getItem("colortheme") + "timesheet-32.png");
    $(".tasks").attr("src", "images/" + localStorage.getItem("colortheme") + "queue-32.png");
    if (checkConnection()) {
        var serviceCall = $.post(window.localStorage.getItem("url") + "/signin", {
            username: localStorage.getItem('suname'),
            password: localStorage.getItem('supass')
        }, "json");
        serviceCall.done(function(data) {
            obj = JSON.parse(data);
            if (obj.user_id == undefined) {
                $.mobile.loading('hide');
                navigator.notification.alert("Invalid credentials.", onCallback, "Message", "OK");
            } else {
                localStorage.setItem('AdminorNot', obj.isadmin);
                localStorage.setItem('Modules', JSON.stringify(obj.Modules));
                localStorage.setItem('Permissions', JSON.stringify(obj.permissions));

                window.localStorage.setItem("emptype", obj.employeetype);
                window.localStorage.setItem("user_id", obj.user_id);
                //Check the user type
                if (obj.isadmin == 'Y' && obj.categoryuser == 'HRMS') {
                    window.localStorage.setItem("user_type", "hrms_admin");
                } else if (obj.isadmin == 'N' && obj.categoryuser == 'HRMS') {
                    window.localStorage.setItem("user_type", "hrms_normal");
                } else if (obj.isadmin == 'Y' && obj.categoryuser == 'Legal') {
                    window.localStorage.setItem("user_type", "legal_admin");
                } else if (obj.isadmin == 'N' && obj.categoryuser == 'Legal') {
                    window.localStorage.setItem("user_type", "legal_normal");
                    console.log(window.localStorage.getItem("user_type"));
                }
                // $.mobile.loading( 'hide');                           
            }
        });
        serviceCall.fail(function() {
            // $.mobile.hidePageLoadingMsg();
            $.mobile.loading('hide');
            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");

        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }
    var modules = JSON.parse(localStorage.getItem('Modules'));
    var permissions = JSON.parse(localStorage.getItem('Permissions'));
    //alert(modules.Bill);  
    if (modules.Bill == 0) {
        $(".billsli").css("display", "none");
    } else {
        $(".billsli").css("display", "block");
        permissions.Bill.Add ? $("#addBillBtn").removeClass('ui-disabled') : $("#addBillBtn").addClass('ui-disabled');
        permissions.Bill.Edit ? $("#editBillBtn").removeClass('ui-disabled') : $("#editBillBtn").addClass('ui-disabled');
        //permissions.Bill.Delete?$("#deleteBillBtn").removeClass('ui-disabled'):$("#deleteBillBtn").addClass('ui-disabled');
    }
    if (modules.Timesheet == 0) {
        $(".timesheetli").css("display", "none");
    } else {
        $(".timesheetli").css("display", "block");
        //permissions.timesheet.Add?$("#addTimesheetBtn").removeClass('ui-disabled'):$("#addTimesheetBtn").addClass('ui-disabled');
        permissions.timesheet.Edit ? $("#editTimesheetBtn").removeClass('ui-disabled') : $("#editTimesheetBtn").addClass('ui-disabled');
        permissions.timesheet.Delete ? $("#deleteTimesheetBtn").removeClass('ui-disabled') : $("#deleteTimesheetBtn").addClass('ui-disabled');
    }
    if (modules.Workflow == 0) {
        $(".taskli").css("display", "none");
    } else {
        if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal"))
        //$("li.taskli a").html('<img src="images/queue-32.png" alt="Queue" class="ui-li-icon">Tasks');
            $(".taskli").css("display", "block");
        else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal"))
        //          $("li.taskli a").html('<img src="images/queue-32.png" alt="Queue" class="ui-li-icon">Tasks');
            $(".taskli").css("display", "block");
        permissions.Workflow.Add ? $("#addTaskBtn").removeClass('ui-disabled') : $("#addTaskBtn").addClass('ui-disabled');
        permissions.Workflow.Edit ? $("#editTaskBtn").removeClass('ui-disabled') : $("#editTaskBtn").addClass('ui-disabled');
        //permissions.Workflow.Delete?$("#deleteTimesheetBtn").removeClass('ui-disabled'):$("#deleteTimesheetBtn").addClass('ui-disabled');
    }
    if (modules.Documents == 0) {
        $(".reportli").css("display", "none");
    } else {
        if (permissions.Documents.View == 0)
            $(".reportli").css("display", "none");
        else {
            $(".reportli").css("display", "block");
            permissions.Documents.Add ? $("#addReportBtn").removeClass('ui-disabled') : $("#addReportBtn").addClass('ui-disabled');
            /*permissions.Documents.Edit ? $("#editTimesheetBtn").removeClass('ui-disabled') : $("#editTimesheetBtn").addClass('ui-disabled');
            permissions.Documents.Delete ? $("#deleteTimesheetBtn").removeClass('ui-disabled') : $("#deleteTimesheetBtn").addClass('ui-disabled');*/
        }
    }


    //$(".billsli,.reportli,.timesheetli,.taskli").css("display","block")

}

//onClick 'OK' button
function gotoLogin() {
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    if (checkConnection()) {

        var server_id = $("#setting_input").val();
        localStorage.setItem("colortheme", $("#template").val());
        server_id = jQuery.trim(server_id);
        window.localStorage.setItem("aa", server_id);
        if (server_id == '') {
            navigator.notification.alert("Server ID should not be empty.", onCallBack, "Message", "OK");
        } else {

            var serviceCall = $.post("http://" + server_id + "/check_url", "json");
            serviceCall.done(function(data) {
                obj = JSON.parse(data);
                if (obj.msg == 'Success') {
                    //fetchLogo();
                    var textInput = document.getElementById("setting_input");
                    textInput.style.borderStyle = "none";
                    textInput.readOnly = true;
                    console.log("TempUrl:" + localStorage.getItem('tempUrl') + "server_id" + $("#setting_input").val());
                    if (localStorage.getItem('tempUrl') != null) {
                        if (localStorage.getItem('tempUrl') == $("#setting_input").val())
                            console.log("sAME Server");
                        else {
                            localStorage.setItem('sname', '');
                        }

                    }
                    if (localStorage.getItem('sname') != null && localStorage.getItem('spass') != null && localStorage.getItem('tempUrl') != null) {
                        console.log("We have stored name");
                        if ((localStorage.getItem('sname').length > 0) && (localStorage.getItem('spass').length > 0)) {
                            console.log("Inner if");
                            $.mobile.changePage("TempScreen.html", {
                                transition: "slide"
                            });
                        } else {
                            console.log("Inner Else");
                            $.mobile.changePage("login.html", {
                                transition: "slide"
                            });
                        }
                    } else {
                        console.log("No Username password available");
                        $.mobile.changePage("login.html", {
                            transition: "slide"
                        });
                    }

                    $("#setting_input").css({
                        'background-color': ''
                    });
                    localStorage.setItem("tempUrl", server_id);
                    window.localStorage.setItem("url", "http://" + server_id);
                    fetchLogo();
                    $.mobile.loading('hide');
                } else {
                    navigator.notification.alert("Server ID is not Connected.", onCallBack, "Message", "OK");
                }
            });
            serviceCall.fail(function() {
                // $.mobile.hidePageLoadingMsg();
                navigator.notification.alert("Server ID is not Connected.", onCallBack, "Message", "OK");
                $.mobile.loading('hide');
            });

        }
    } else {
        navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
        $.mobile.loading('hide');
    }
}

function onCallBack() {
    console.log("call back method calling");
}


function logout() {
    navigator.notification.confirm("Are you sure you want to logout?", logs, "Message", ["Yes", "No"]);

}


function logs(buttonIndex) {
    if (buttonIndex == 1) {
        localStorage.setItem('sname', '');
        localStorage.setItem('spass', '');
        $.mobile.changePage("login.html", {
            transition: "none"
        });
    } else if (buttonIndex == 2) {
        console.log("alert cancelled");
    }
}
