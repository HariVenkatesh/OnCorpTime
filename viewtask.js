var completeFlag = 1;

function showEditPage() {
    localStorage.setItem("taskeditmode", "true");
    $.mobile.changePage("editTask.html", {
        transition: "none"
    });
    console.log(localStorage.getItem('taskeditmode'));
}

function showListPage() {
    //localStorage.setItem("taskPage","true");
    $.mobile.changePage("tasks.html", {
        transition: "none"
    });
}

function composeMail() {
    //alert("composeMail call started");
    var taskViewData = JSON.parse(localStorage.getItem('viewedData'));
    cordova.plugins.email.open({
        to: taskViewData.email || "",
        cc: taskViewData.ccmail || "",
        subject: taskViewData.Task + " (" + taskViewData.startdate + "to" + taskViewData.enddate + ")" || "",
        body: taskViewData.Task + "(" + taskViewData.startdate + "to" + taskViewData.enddate + ")" || ""
    });
    //console.log("composeMail call ended");
}

function completeTask() {
    if (completeFlag)
        navigator.notification.alert("This task can be completed only in Web.", onCallBack, "Message", "OK");
    else {
        navigator.notification.confirm("Are you sure you want to complete this task? ", function(buttonIndex) {
            if (buttonIndex == 1) {
                if (checkConnection()) {
                    $('body').addClass('ui-loading');
                    $.ajax({
                        type: "POST",
                        url: window.localStorage.getItem("url") + "/completetask",
                        dataType: "json",
                        data: {
                            taskid: localStorage.getItem("selectedtaskid")
                        },
                        success: function(data) {
                            if (data.msg == "Success") {
                                navigator.notification.alert("Task completed successfully.", onCallBack, "Message", "OK");
                                $("#vstatus").text("Completed");
                                $.mobile.changePage("tasks.html", {
                                    transition: "none"
                                });
                            } else
                                navigator.notification.alert("Unable to update Task.", onCallBack, "Message", "OK");
                            $('body').removeClass('ui-loading');
                        },
                        error: function(textStatus) {
                                $('body').removeClass('ui-loading');
                                //navigator.notification.alert(textStatus+" Couldn't connect to server",onCallBack,"Message","OK");
                            }
                            //End of AJAX Call
                    });
                } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
            }
            else console.log("Clicked No ");
        }, "Complete Task", ["Yes", "No"]);
        /*if (checkConnection()) {
            $('body').addClass('ui-loading');
            $.ajax({
                type: "POST",
                url: window.localStorage.getItem("url") + "/completetask",
                dataType: "json",
                data: {
                    taskid: localStorage.getItem("selectedtaskid")
                },
                success: function(data) {
                    if (data.msg == "Success") {
                        navigator.notification.alert("Task completed successfully.", onCallBack, "Message", "OK");
                        $("#vstatus").text("Completed");
                        $.mobile.changePage("tasks.html", {
                            transition: "none"
                        });
                    } else
                        navigator.notification.alert("Unable to update Task.", onCallBack, "Message", "OK");
                    $('body').removeClass('ui-loading');
                },
                error: function(textStatus) {
                        $('body').removeClass('ui-loading');
                        //navigator.notification.alert(textStatus+" Couldn't connect to server",onCallBack,"Message","OK");
                    }
                    //End of AJAX Call
            });
        } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");*/

    }
}

function loadTaskDetails() {
    if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
        $("#viewcontractorlabel").text("Contract");
        $("#vcompanylabel").text("Template");
        $("#vmanagerlabel").text("Manager");
        $("#vassigneelabel").text("Assignee");
    } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
        $("#viewcontractorlabel").text("Client");
        $("#vcompanylabel").text("Template");
        $("#vmanagerlabel").text("Attorney");
        $("#vassigneelabel").text("Assistant");
        $("#viewcontractlabel").text("Matter");
    }
    if (checkConnection()) {
        //       alert(localStorage.getItem("selectedtaskid"));
        $("body").addClass("ui-loading");
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/view_task",
            dataType: "json",
            data: {
                id: localStorage.getItem("selectedtaskid")
            },
            success: function(data) {

                localStorage.setItem("viewedData", JSON.stringify(data));
                //             alert(JSON.stringify(data));
                if (data.IsBillable == "N") completeFlag = 0;
                $("#vcontractorname").text(data.Candidate || " ");
                $("#vtask").text(data.Task || " ");
                $("#vtaskstartdate").text(data.startdate || " ");
                $("#vtaskenddate").text(data.enddate || " ");
                //$("#vtaskcategorytype").text(data.categorytype);
                $("#vcontractname").text(data.mattername || " ");
                //$("#vtaskcode").text(data.taskcode);
                //$("#vcostcode").text(data.costcode);
                $("#vstatus").text(data.Status || " ");
                //$("#vbillable").text(data.IsBillable=='Y'?'Yes':'No');
                $("#vcompany").text(data.CompanyName || " ");
                $("#vlocation").text(data.locationname || " ");
                $("#vmanager").text(data.Manager || " ");
                $("#vassignee").text(data.Assignee || " ");
                //$("#videntifier").text(data.identifierlabel || " ");
                $("#vnotes").text(data.tasknotes || " ");
                //data.phone ? $("#vphone").attr('href', 'tel:' + 9629188509) : $("#vphone").attr('href', '#');
                data.phone ? $("#vphone").attr('href', 'tel:' + data.phone) : $("#vphone").attr('href', '#');
                //data.email ? $("#vmail").attr('href', 'mailto:' + data.email) : $("#vmail").attr('href', '#');
                //$("#vmail").attr('href','mailto:'+data.email);
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");

                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
    //alert("Loaded Task Details");
}

$("#viewtasks_page").ready(function() {
    moduleRevealer();
    loadTaskDetails();
    /*if(localStorage.getItem("editPage")=="true")
    {
    $.mobile.changePage("editTask.html", { transition:"none" });

    }
    else{
        console.log("Staying at ViewPage");
    }
    if(localStorage.getItem("taskPage")=="true")
    {
    $.mobile.changePage("tasks.html", { transition:"none" });

    }
    else{
        console.log("Staying at ViewPage");
    }*/


    //$("#viewjobnumberlabel").text("BillingType");
    //$("#viewtaskcodelabel").text("Item");
});

/*
$(document).on("pagebeforeshow","#viewtasks_page",function(){
    
    loadTaskDetails();



        if((window.localStorage.getItem("user_type")=="hrms_admin") ||(window.localStorage.getItem("user_type")=="hrms_normal")){
       
        $("#viewcontractorlabel").text("Contractor");
        //$("#viewjobnumberlabel").text("Job Number");
        //$("#viewtaskcodelabel").text("Task Code");

}else if((window.localStorage.getItem("user_type")=="legal_admin")||(window.localStorage.getItem("user_type")=="legal_normal")){
        
    
        $("#viewcontractorlabel").text("Matter");
        //$("#viewjobnumberlabel").text("BillingType");
        //$("#viewtaskcodelabel").text("Item");
                          
}

        
    
    });*/
