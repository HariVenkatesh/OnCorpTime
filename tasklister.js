var offset = 0;
var offset_submit = 0;
var limit_p = 10;
var issubmit = 0;
var flag = 0;
var total = 0;
var managetimesheet_array = [];
var isList = false;
var employeeId;
var cdname;
var cdassignee;
$("#tasks-page").ready(function() {
    //To Modify Labels
    if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
        cdname = "Contract";
        cdassignee = "Assignee";
    } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
        cdname = "Client";
        cdassignee = "Assistant";
    }
    moduleRevealer();
    labelChanger();
    if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "legal_admin"))
        employeeId = 0;
    else employeeId = localStorage.getItem("user_id");
    $("#searchTasks").hide();
    //localStorage.setItem('selectedtaskid','');
    loadContractersList();
    loadAssignees();
    loadTasks();
    localStorage.setItem('viewedData', ' ');
    /*$("#taskSearchInput").keyup(function(event) {

        taskSearch($(this).val());
    });*/
    $('#taskSearchInput').on('change input', function() {
        if ($(this).val() === '') {
            loadTasks();
        }
    });
    $("#taskSearchInput").keyup(function(event) {
        if (event.keyCode == '13') {

            taskSearch($(this).val());
        }

    });
});

function taskSearch(typedKeyword) {
    /*$("body").addClass("ui-loading");
    if (b != 1)
    //$('[id="tasknextmatter"]').removeClass("ui-disabled"); 
        $('[id="tasknextmatter"]').removeClass("ui-disabled");
    if (offset == 0)
    //$('[id="taskprevmatter"]').addClass("ui-disabled");
        $('[id="taskprevmatter"]').addClass("ui-disabled");*/

    if (checkConnection()) {
        $("body").addClass("ui-loading");
        var serviceCall = $.post(window.localStorage.getItem("url") + "/list_all_task_queue", {
            employeeid: employeeId,
            taskkey: typedKeyword,
            assigneeid: $("#searchAssignee").val() || "",
            clientid: $("#searchContract").val() || ""
        }, "json");
        serviceCall.done(function(data) {

            obj = JSON.parse(data);
            // alert(JSON.stringify(obj));
            /*total = obj.totalcount;
            flag = Math.floor(total / limit_p);

            if (total <= limit_p || total === 0) {*/
            $('[id="tasknextmatter"]').addClass("ui-disabled");
            $('[id="taskprevmatter"]').addClass("ui-disabled");
            // }
            if (obj.msg == 'Failure') {
                $("#tasklist").html("");
                $('[id="tasknextmatter"]').addClass("ui-disabled");
                $('[id="taskprevmatter"]').addClass("ui-disabled");
                $('body').removeClass('ui-loading');

                navigator.notification.alert("No Tasks available.", onCallBack, "Message", "OK");
            } else {
                // alert("nn");
                $("#tasklist").html("");

                $.each(obj, function(index, value) {
                    $("#tasklist").append("<li class='listItem' id='" + value.id + "'>\
                        <a href='#'><p class='listP'>\
                        <font style='font-weight:bold'>" + cdname + ":" + value.Candidate + "</font><br/>\
                        Task:" + value.Task + "<br/>" + cdassignee + ":" + value.Assignee + "</p></a></li>");

                });

                $("#tasklist").listview().listview("refresh").trigger("create");
                $("#tasklist li:last-child").remove();
                $("#tasklist li:last-child").remove();
                $('body').removeClass('ui-loading');
            }
            $('body').removeClass('ui-loading');
        });
        serviceCall.fail(function() {
            $('body').removeClass('ui-loading');
            //$.mobile.loading( 'hide');
            //navigator.notification.alert("Couldn't connect to server.",onSuccessCallback,"Message","OK");          
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
    }
}

function onSuccessCallback() {
    console.log("Clicked Ok");
}

function taskpagination_next() {

    //$('[data-type ="search"]').val('');
    // $.mobile.silentScroll( $("#mManageBillSearch").offset().top);
    $('[id="taskprevmatter"]').removeClass("ui-disabled");
    if (issubmit === 1) {
        offset_submit = offset_submit + limit_p;
        var t = flag * limit_p;

        if ((offset_submit === t) || (offset_submit >= total)) {
            $('[id="tasknextmatter"]').addClass("ui-disabled");
            tasksubmit(1);

        } else {
            $('[id="tasknextmatter"]').removeClass("ui-disabled");
            tasksubmit(0);
        }


    } else {
        issubmit = 0;
        offset = offset + limit_p;
        var t = flag * limit_p;
        if ((offset === t) || (offset >= total)) {

            $('[id="tasknextmatter"]').addClass("ui-disabled");
            loadTasks(1);
        } else {
            $('[id="tasknextmatter"]').removeClass("ui-disabled");
            loadTasks(0);
        }


    }
}

function taskpagination_prev() {
    //$('[data-type="search"]').val('');
    // $.mobile.silentScroll( $("#mManageBillSearch").offset().top);
    $('[id="tasknextmatter"]').removeClass("ui-disabled");

    if (issubmit === 1) {
        if (offset_submit != 0) {
            offset_submit = offset_submit - limit_p;

        } else
            offset_submit = 0;
        if (offset_submit <= 0) {
            $('[id="taskprevmatter"]').addClass("ui-disabled");
        } else {
            $('[id="taskprevmatter"]').removeClass("ui-disabled");

        }

        tasksubmit();
    } else {

        issubmit = 0;
        if (offset != 0)
            offset = offset - limit_p;
        else
            offset = 0;

        if (offset <= 0) {

            $('[id="taskprevmatter"]').addClass("ui-disabled");
        } else {
            $('[id="taskprevmatter"]').removeClass("ui-disabled");
        }

        loadTasks();
    }
    //$('body').removeClass('ui-loading');
}


function loadTasks(b) {
    $("body").addClass("ui-loading");
    if (b != 1)
    //$('[id="tasknextmatter"]').removeClass("ui-disabled"); 
        $('[id="tasknextmatter"]').removeClass("ui-disabled");
    if (offset == 0)
    //$('[id="taskprevmatter"]').addClass("ui-disabled");
        $('[id="taskprevmatter"]').addClass("ui-disabled");
    if (checkConnection()) {
        var serviceCall = $.post(window.localStorage.getItem("url") + "/list_all_task_queue", {
            offset: offset,
            limit: limit_p,
            employeeid: employeeId,
            taskkey: $("#taskSearchInput").val() || ""
        }, "json");
        serviceCall.done(function(data) {

            obj = JSON.parse(data);
            // alert(JSON.stringify(obj));
            total = obj.totalcount;
            flag = Math.floor(total / limit_p);

            if (total <= limit_p || total === 0) {
                $('[id="tasknextmatter"]').addClass("ui-disabled");
                $('[id="taskprevmatter"]').addClass("ui-disabled");
            }
            if (obj.msg == 'Failure') {
                $('[id="tasknextmatter"]').addClass("ui-disabled");
                $('[id="taskprevmatter"]').addClass("ui-disabled");
                //$.mobile.loading('hide');
                $('body').removeClass('ui-loading');
                navigator.notification.alert("No Tasks available.", onCallBack, "Message", "OK");
            } else {
                // alert("nn");
                $("#tasklist").html("");

                $.each(obj, function(index, value) {
                    $("#tasklist").append("<li class='listItem' id='" + value.id + "'>\
                        <a href='#'><p class='listP'>\
                        <font style='font-weight:bold'>" + cdname + ":" + value.Candidate + "</font><br/>\
                        Task:" + value.Task + "<br/>" + cdassignee + ":" + value.Assignee + "</p></a></li>");
                    /*$("#tasklist").append("<li >\
                        <div class='ui-grid-a'>\
                            <div class='ui-block-a listItem' style='width:70%' id='"+value.id+"'>\
                                <p class='listP'>\
                        <font style='font-weight:bold'>Contract Name:"+value.Candidate+"</font><br/>\
                        Task:"+value.Task+"<br/>Assignee:"+value.Assignee+"</p>\
                            </div>\
                            <div class='ui-block-b' style='width:30%;float:left;'>\
                                <div style='float:left;padding-top:15%'>\
                                <a href='#'  data-role='button' data-icon='calendar' data-iconpos='notext' data-inline='true'>Clone</a>\
                                <a href='#'  data-role='button' data-icon='check' data-iconpos='notext' data-inline='true'>Complete</a>\
                                </div>\
                                </div>\
                        </div>\
                        </li>");*/
                    /*$("#tasklist").append("<li >\
                        <div class='ui-grid-b'>\
                            <div class='ui-block-a listItem' width='95%' id='"+value.id+"'>\
                                <p class='listP'>\
                        <font style='font-weight:bold'>Contract Name:"+value.Candidate+"</font><br/>\
                        Task:"+value.Task+"<br/>Assignee:"+value.Assignee+"</p>\
                            </div>\
                            <div class='ui-block-b' style='padding-top:20%;width:2.5%;'>\
                                <a href='#' data-role='button' data-icon='calendar' data-iconpos='notext'>Clone</a>\
                                </div>\
                            <div class='ui-block-c'  style='padding-top:20%;width:2.5%;'>\
                            <a href='#' data-role='button' data-icon='check' data-iconpos='notext'>Complete</a>\
                            </div>\
                        </div>\
                        </li>");*/
                    /*$("#tasklist").append("<li class='listItem' id='"+value.id+"'>\
                        <a href='#'><p class='listP'>\
                        <font style='font-weight:bold'>Contract Name:"+value.Candidate+"</font><br/>\
                        Task:"+value.Task+"<br/>Assignee:"+value.Assignee+"</p></a>\
                        <a href='#' data-icon='check'>Complete</a></li>");*/
                });

                $("#tasklist").listview().listview("refresh").trigger("create");
                $("#tasklist li:last-child").remove();
                $("#tasklist li:last-child").remove();
                $("#tasklist").listview().listview("refresh").trigger("create");
                $('body').removeClass('ui-loading');
            }
            $('body').removeClass('ui-loading');
        });
        serviceCall.fail(function() {
            $('body').removeClass('ui-loading');
            //$.mobile.loading( 'hide');
            //navigator.notification.alert("Couldn't connect to server.",onSuccessCallback,"Message","OK");          
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
    }
    /*$("body").addClass("ui-loading");
        $("#tasklist").html(" ");
        $.ajax({
        type:"GET",
        url:window.localStorage.getItem("url")+"/list_all_task_queue",
        dataType:"json",        
        success:function(data){
            $("body").addClass("ui-loading");
            
            $.each(data,function(index,value){
                
                $("#tasklist").append("<li class='listItem' id='"+value.id+"'><a href='#'><p><font style='font-weight:bold'>Contractor Name:"+value.Company+"</font><br/>Task:"+value.Task+"<br/>Assignee:"+value.Assignee+"</p></a></li>");    
            });                                 
            $("#tasklist").listview("refresh")
            $("body").removeClass("ui-loading");
        },
        error:function(){
            $("body").removeClass("ui-loading");
            navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
        }
    //End of AJAX Call
}); */

}

function loadContractersList() {
    if (checkConnection()) {
        //$("body").addClass("ui-loading");
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_clients",
            dataType: "json",
            //data:{user_id:window.localStorage.getItem("user_id")},        
            success: function(data) {
                $("#searchContract").html(" ");
                $("#searchContract").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#searchContract").append("<option value='" + value.id + "'>" + value.fullname + "</option>");
                });
                $("#searchContract").selectmenu().selectmenu("refresh");
                //$("body").removeClass("ui-loading");
            },
            error: function() {
                    //$("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
}

function loadAssignees() {
    if (checkConnection()) {
        //$("body").addClass("ui-loading");
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_assignees",
            dataType: "json",
            success: function(data) {
                $("#searchAssignee").html(" ");
                $("#searchAssignee").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#searchAssignee").append("<option value='" + value.id + "'>" + value.fullname + "</option>");

                });
                $("#searchAssignee").selectmenu().selectmenu("refresh");
                //$('body').removeClass('ui-loading');

            },
            error: function() {
                    //$('body').removeClass('ui-loading');
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
}

function searchTasks() {
    //alert("searchBill");
    //$("#addBill").hide();
    //$("#searchBill").show();
    var o = $(".searchTasks").is(":visible");
    var c = $(".searchTasks").is(":hidden");
    if (o) {
        $("#managetaskslist").css("padding-top", "0%");
    } else {
        $("#managetaskslist").css("padding-top", "320px");
    }
    $(".searchTasks").slideToggle();
}

function tasksubmit(a) {

    //searchTasks();
    $(".searchTasks").hide();
    $("#managetaskslist").css("padding-top", "0%");
    $('body').addClass('ui-loading');
    if (a != 1)
        $('[id="tasknextmatter"]').removeClass("ui-disabled");
    if (offset_submit === 0)
        $('[id="taskprevmatter"]').addClass("ui-disabled");
    issubmit = 1;
    $("#tasklist").html(" ");
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/list_all_task_queue",
            dataType: "json",
            data: {
                assigneeid: $("#searchAssignee").val(),
                clientid: $("#searchContract").val(),
                offset: offset,
                limit: limit_p,
                employeeid: employeeId,
                taskkey: $("#taskSearchInput").val() || ""
            },
            success: function(data) {
                // alert(JSON.stringify(data));
                if (data.msg == "Failure") {
                    $('[id="tasknextmatter"]').addClass("ui-disabled");
                    $('[id="taskprevmatter"]').addClass("ui-disabled");
                    $('body').removeClass('ui-loading');

                    navigator.notification.alert("Sorry! No Results found.", onCallBack, "Message", "OK");
                }
                //if (data.msg!=="Failure") {
                else {
                    $.each(data, function(index, value) {
                        $("#tasklist").append("<li class='listItem' id='" + value.id + "'><a href='#'><p class='listP'><font style='font-weight:bold'>" + cdname + ":" + value.Candidate + "</font><br/>Task:" + value.Task + "<br/>" + cdassignee + ":" + value.Assignee + "</p></a></li>");
                    });
                    $("#tasklist li:last-child").remove();
                    $("#tasklist").listview().listview("refresh");
                    $("#tasklist li:last-child").remove();
                    $("#tasklist").listview().listview("refresh");
                    $("body").removeClass("ui-loading");

                }

            },
            error: function() {
                $("body").removeClass("ui-loading");
                // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
            }

            //End of AJAX Call
        });

    } else {
        navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
    }
    /*$("body").addClass("ui-loading");
    searchTasks();
    $("#tasklist").html(" ");
    $.ajax({
        type:"POST",
        url:window.localStorage.getItem("url")+"/list_all_task_queue",
        dataType:"json",
        data:{assigneeid:$("#searchAssignee").val(),
              clientid:$("#searchContract").val()
    },      
        success:function(data){
            if (data.msg!=="Failure") {
            
            $.each(data,function(index,value){
                
                $("#tasklist").append("<li class='listItem' id='"+value.id+"'><a href='#'><p><font style='font-weight:bold'>Contractor Name:"+value.Company+"</font><br/>Task:"+value.Task+"<br/>Assignee:"+value.Assignee+"</p></a></li>");    
            });                                 
            $("#tasklist").listview("refresh");
            }
            else navigator.notification.alert("Sorry! No Results found.",onCallBack,"Message","OK"); 
            $("body").removeClass("ui-loading");
        },
        error:function(){
            $("body").removeClass("ui-loading");
            navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
        }
    //End of AJAX Call
}); */
}

function clearTaskFields() {
    $("#searchAssignee").val($("#searchAssignee option:first").val()).selectmenu("refresh");
    $("#searchContract").val($("#searchContract option:first").val()).selectmenu("refresh");

}


function cloneSettings() {
    localStorage.setItem("taskeditmode", "false");
    $.mobile.changePage("editTask.html", {
        transition: "none"
    });
    console.log(localStorage.getItem('taskeditmode'));
}


// $(document).on("pageshow","#tasks-page",loadTasks);

/*$("#tasklist").on("click"," li",function(){
        console.log("Listitem clicked");
        localStorage.setItem('selectedtaskid',$(this).attr('id'));
        $.mobile.changePage("viewtasks.html", { transition:"none" });
        
    });*/


$("#tasklist").on("click", ".listItem", function() {
    console.log("Listitem clicked");
    localStorage.setItem('selectedtaskid', $(this).attr('id'));
    //                      alert(localStorage.getItem('selectedtaskid'));
    $.mobile.changePage("viewtasks.html", {
        transition: "none"
    });

});
