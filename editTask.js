var theCandidateId, taskId, rdata;
var utype;

function onCallback() {
    console.log("Alert Clicked");
}

function loadCloneContract() {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/get_contracts",
            dataType: "json",
            data: {
                user_id: window.localStorage.getItem("user_id")
            },
            success: function(data) {
                $("#ctaskcontract").html(" ");
                $("#ctaskcontract").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#ctaskcontract").append("<option value='" + value.id + "'>" + value.fullname + "</option>");
                });
                $("#ctaskcontract").selectmenu().selectmenu("refresh");
                //$("#ctaskcontract").val(" ").attr('selected', true).selectmenu("refresh");
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

function fillMatterName() {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/get_matter",
            dataType: "json",
            data: {
                client_id: $("#ctaskcontract").val()
            },
            success: function(data) {
                if (data.msg == "Failure") {
                    $('body').removeClass('ui-loading');
                } else {
                    $("#etaskcontract").val(data[0].matter).attr("disabled", "disabled").parent().addClass("ui-state-disabled");
                    $("body").removeClass("ui-loading");
                }
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadEditTasks() {
    // alert("Got a call");
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_tasks",
            dataType: "json",
            success: function(data) {
                //  alert(JSON.parse(data));
                $("#etasks").html("");
                $("#etasks").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#etasks").append("<option value='" + value.optionvalue + "'>" + value.optiontext + "</option>");
                });
                $("#etasks").selectmenu().selectmenu("refresh");
                $("#etasks").val(rdata.ttaskid || " ").attr('selected', true).selectmenu("refresh");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    //           alert("Error Block");
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call

        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
    $("body").removeClass("ui-loading");
}

function loadCloneCategoryType() {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_category_types",
            dataType: "json",
            success: function(data) {
                $("#ccategorytype").html(" ");
                $("#ccategorytype").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#ccategorytype").append("<option value='" + value.id + "'>" + value.categorytype + "</option>");
                });
                $("#ccategorytype").selectmenu().selectmenu("refresh");
                //$("#ccategorytype").val(rdata.ttaskid||" ").attr('selected', true).selectmenu("refresh");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadCloneCategories() {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/get_categories",
            dataType: "json",
            data: {
                categorytypeid: $("#ccategorytype").val()
            },
            success: function(data) {
                $("#ccategory").html(" ");
                $("#ccategory").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#ccategory").append("<option value='" + value.id + "'>" + value.categories + "</option>");
                });
                $("#ccategory").selectmenu().selectmenu("refresh");
                //$("#ctaskcontract").val(" ").attr('selected', true).selectmenu("refresh");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadCloneJobNumbers() {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_active_jobnumbers",
            dataType: "json",
            success: function(data) {
                $("#cbilltype").html(" ");
                $("#cbilltype").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#cbilltype").append("<option value='" + value.optionvalue + "'>" + value.optiontext + "</option>");
                });
                $("#cbilltype").selectmenu().selectmenu("refresh");
                //$("#ccategorytype").val(rdata.ttaskid||" ").attr('selected', true).selectmenu("refresh");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadCloneItemCode() {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/get_task_codes",
            dataType: "json",
            data: {
                jobcode: $("#cbilltype").val()
            },
            success: function(data) {
                $("#citem").html(" ");
                $("#citem").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#citem").append("<option value='" + value.optionvalue + "'>" + value.optiontext + "</option>");
                });
                $("#citem").selectmenu().selectmenu("refresh");
                //$("#ctaskcontract").val(" ").attr('selected', true).selectmenu("refresh");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}


function loadEditCompanies() {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_companies",
            dataType: "json",
            success: function(data) {
                $("#etaskcompany").html(" ");
                $("#etaskcompany").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#etaskcompany").append("<option value='" + value.optionvalue + "'>" + value.optiontext + "</option>");

                });
                $("#etaskcompany").selectmenu().selectmenu("refresh");
                $("#etaskcompany").val(rdata.thecompanyid || " ").selectmenu("refresh"); //.attr("disabled","disabled");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadEditLocations() {

    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_locations",
            dataType: "json",
            success: function(data) {
                $("#etasklocation").html(" ");
                $("#etasklocation").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#etasklocation").append("<option value='" + value.optionvalue + "'>" + value.optiontext + "</option>");

                });
                $("#etasklocation").selectmenu().selectmenu("refresh");
                $("#etasklocation").val(rdata.locationid || " ").selectmenu("refresh"); //.attr("disabled","disabled");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadEditManagers() {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_managers",
            dataType: "json",
            success: function(data) {
                if (data.msg !== 'Failure') {
                    $("#etaskmanager").html(" ");
                    $("#etaskmanager").append("<option value=''>Select One</option>");
                    $.each(data, function(index, value) {
                        $("#etaskmanager").append("<option value='" + value.id + "'>" + value.fullname + "</option>");
                    });
                    $("#etaskmanager option:last").remove();
                    $("#etaskmanager").selectmenu().selectmenu("refresh");
                    $("#etaskmanager").val(rdata.themanagerid || " ").selectmenu("refresh"); //.attr("disabled","disabled");
                    $("body").removeClass("ui-loading");
                } else $("body").removeClass("ui-loading");

            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadEditAssignees() {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_assignees",
            dataType: "json",
            success: function(data) {
                $("#etaskassignee").html(" ");
                $("#etaskassignee").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#etaskassignee").append("<option value='" + value.id + "'>" + value.fullname + "</option>");

                });
                $("#etaskassignee").selectmenu().selectmenu("refresh");
                $("#etaskassignee").val(rdata.theassigneeid || " ").selectmenu("refresh");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadEditIdentifiers() {
    if (checkConnection()) {
        $("body").addClass("ui-loading");
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_identifiers",
            dataType: "json",
            success: function(data) {
                $("#etaskidentifier").html(" ");
                $("#etaskidentifier").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#etaskidentifier").append("<option value='" + value.id + "'>" + value.fullname + "</option>");

                });
                $("#etaskidentifier").selectmenu().selectmenu("refresh");
                $("body").removeClass("ui-loading");
            },
            error: function() {
                    $("body").removeClass("ui-loading");
                    // navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadCloneLocations() {

    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/get_locations",
            dataType: "json",
            data: {
                companyid: $("#etaskcompany").val()
            },
            success: function(data) {
                if (data.msg !== 'Failure') {
                    $("#etasklocation").html(" ");
                    $("#etasklocation").append("<option value=''>Select One</option>");
                    $.each(data, function(index, value) {
                        $("#etasklocation").append("<option value='" + value.optionvalue + "'>" + value.optiontext + "</option>");
                    });
                    $("#etasklocation option:last").remove();
                    $("#etasklocation").selectmenu("refresh");
                    $('body').removeClass('ui-loading');
                }
                //$('body').removeClass('ui-loading');  
                else {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Please Select another Template.", onCallBack, "Message", "OK");
                    $("#etaskcompany").val('').selectmenu("refresh");
                }
            },
            error: function() {
                    $('body').removeClass('ui-loading');
                    //navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");

                }
                //End of AJAX Call
        });
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");

}

function loadCloneManagers() {

    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/get_managers",
            dataType: "json",
            data: {
                locationid: $("#etasklocation").val()
            },
            success: function(data) {
                if (data.msg !== 'Failure') {
                    $("#etaskmanager").html(" ");
                    $("#etaskmanager").append("<option value=''>Select One</option>");
                    $.each(data, function(index, value) {
                        $("#etaskmanager").append("<option value='" + value.id + "'>" + value.fullname + "</option>").selectmenu("refresh");

                    });
                    $("#etaskmanager option:last").remove();
                    $("#etaskmanager").selectmenu("refresh");
                    $('body').removeClass('ui-loading');
                } else {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Please Select another Location.", onCallBack, "Message", "OK");
                    $("#etasklocation").val('').selectmenu("refresh");
                }


            },
            error: function() {
                    $('body').removeClass('ui-loading');
                    //navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");

                }
                //End of AJAX Call
        });

    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}

function loadSelectedTaskData() {

    rdata = JSON.parse(localStorage.getItem('viewedData'));
    theCandidateId = rdata.thecandidateid || " ";
    taskId = rdata.taskid || " ";
    $("#etaskcontractorname").val(rdata.Candidate || " ").attr("disabled", "disabled");
    $("#etaskstartdate").val(rdata.startdate || " ");
    $("#etaskenddate").val(rdata.enddate || " ");
    $("#etaskcontract").val(rdata.mattername || " ").attr("disabled", "disabled");
    $("#etasknotes").val(rdata.tasknotes || " ");
    //$("#estatus").val(rdata.Status || " ").attr("disabled","disabled");
    $("#etaskcompany").attr("disabled", "disabled");
    $("#etasklocation").attr("disabled", "disabled");
    $("#etaskmanager").attr("disabled", "disabled");
    // $("#etaskcompany").val(rdata.thecompanyid||" ").attr('selected', true).siblings('option').removeAttr('selected').selectmenu().selectmenu("refresh");
    // $("#etasklocation").val(rdata.locationid||" ").attr('selected', true).siblings('option').removeAttr('selected').selectmenu().selectmenu("refresh");
    // $("#etaskmanager").val(rdata.themanagerid||" ").attr('selected', true).siblings('option').removeAttr('selected').selectmenu().selectmenu("refresh");
    // $("#etaskassignee").val(rdata.theassigneeid||" ").attr('selected', true).siblings('option').removeAttr('selected').selectmenu().selectmenu("refresh");
    // $("#etasks").val(rdata.ttaskid||" ").attr('selected', true).siblings('option').removeAttr('selected').selectmenu().selectmenu("refresh");
    //$("#etaskidentifier").val(rdata.identifierlabel || " ").selectmenu("refresh");

    /*if (rdata.IsBillable=="Y") $("#ebillable").prop("checked",true).checkboxradio("refresh");
    else $("#enonbillable").prop("checked",true).checkboxradio("refresh");*/
    /*if (rdata.Status=="Active") $("#eactive").prop("checked",true).checkboxradio("refresh");
    else $("#einactive").prop("checked",true).checkboxradio("refresh");*/
    //$("#edittask-page").trigger("pagecreate");

    /*if(checkConnection()){
    $.ajax({
        type:"POST",
        url:window.localStorage.getItem("url")+"/view_task",
        dataType:"json",
        data:{id:localStorage.getItem("selectedtaskid")},       
        success:function(data){
            fillSelectedTaskData(data);
            
        },
        error:function(){
            navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
        }
    //End of AJAX Call
        });
    }
else navigator.notification.alert("Please check internet connection.",onCallBack,"Message","OK");*/
}

function closeWindowMethod() {
    console.log("closewindow called");
    navigator.notification.confirm("Are you sure you want to cancel the changes?", onConfirmCancelCallback, "Message", ["Yes", "No"]);
}

function onConfirmCancelCallback(buttonIndex) {
    if (buttonIndex == 1) {
        /*var value = window.localStorage.getItem("key");
        window.localStorage.setItem("option","");
        console.log("Session Storage:"+value);*/
        $.mobile.changePage("tasks.html", {
            transition: "none"
        });
    } else if (buttonIndex == 2) {
        console.log("alert cancelled");
    }
}
/*
function fillSelectedTaskData(rdata){
    
    theCandidateId=rdata.thecandidateid || " ";
    taskId=rdata.taskid || " ";
    $("#etaskcontractorname").val(rdata.Candidate || " ").attr("disabled","disabled");
    
    $("#etaskstartdate").val(rdata.startdate || " ");
    $("#etaskenddate").val(rdata.enddate || " ");
    $("#etaskcontract").val(rdata.mattername || " ").attr("disabled","disabled");
    $("#etaskcompany").val(rdata.thecompanyid || " ").selectmenu("refresh");
    $("#etasklocation").val(rdata.locationid || " ").selectmenu("refresh");
    $("#etaskmanager").val(rdata.themanagerid || " ").selectmenu("refresh");
    $("#etaskassignee").val(rdata.theassigneeid || " ").selectmenu("refresh");
    $("#etasks").val(rdata.ttaskid || " ").selectmenu("refresh");
    //$("#etaskidentifier").val(rdata.identifierlabel || " ").selectmenu("refresh");
    $("#etasknotes").val(rdata.tasknotes || " ");
    /*if (rdata.IsBillable=="Y") $("#ebillable").prop("checked",true).checkboxradio("refresh");
    else $("#enonbillable").prop("checked",true).checkboxradio("refresh");*/
/*if (rdata.Status=="Active") $("#eactive").prop("checked",true).checkboxradio("refresh");
else $("#einactive").prop("checked",true).checkboxradio("refresh");*/
//$("#edittask-page").trigger("pagecreate");

//}*/

function prepareForUpdate() {
    if (localStorage.getItem('taskeditmode') === 'true') {
        updateTaskValidator($("#etaskcontractorname").val(), $("#etasks").val());
    } else {

        updateTaskValidator($("#ctaskcontract :selected").text(), $("#ctasks").val());
    }
}

function updateTaskValidator(contract, task) {
    //alert("updateTaskValidator");

    if (checkConnection()) {
        if (localStorage.getItem('taskaction') === 'clone') {
            if ($("#ctaskcontract").val() === "") navigator.notification.alert("Please select a " + utype + ".", onCallback, "Message", "OK");
            else if ($("#ctasks").val() === "") navigator.notification.alert("Please specify a Task.", onCallback, "Message", "OK");
            else if ($("#ccategorytype").val() === "") navigator.notification.alert("Please select a Category Type.", onCallback, "Message", "OK");
            else if ($("#ccategory").val() === "") navigator.notification.alert("Please select a Category.", onCallback, "Message", "OK");
            else if ($("#cbilltype").val() === "") navigator.notification.alert("Please select a Billing Type.", onCallback, "Message", "OK");
            else if ($("#citem").val() === "") navigator.notification.alert("Please select a Item.", onCallback, "Message", "OK");
            else if (!$('input[name=ctaskbillability]:checked').val()) navigator.notification.alert("Please choose a Billability Status.", onCallback, "Message", "OK");
            //else if (task==="") navigator.notification.alert("Please specify a Task.",onCallback,"Message","OK");
            else if ($("#etaskstartdate").val() === "") navigator.notification.alert("Please select a Start Date.", onCallback, "Message", "OK");
            else if ($("#etaskenddate").val() === "") navigator.notification.alert("Please select a End Date.", onCallback, "Message", "OK");
            else if ($("#etaskcompany").val() === "") navigator.notification.alert("Please select a Template.", onCallback, "Message", "OK");
            else if ($("#etaskcontract").val() === "") navigator.notification.alert("Please select a Task Contract.", onCallback, "Message", "OK");
            else if ($("#etasklocation").val() === "") navigator.notification.alert("Please select a Location.", onCallback, "Message", "OK");
            else if ($("#etaskmanager").val() === "") navigator.notification.alert("Please select a " + uman + ".", onCallback, "Message", "OK");
            else updateTask(task);
        } else {
            if (contract === "") navigator.notification.alert("Please specify a " + utype + ".", onCallback, "Message", "OK");
            else if (task === "") navigator.notification.alert("Please specify a Task.", onCallback, "Message", "OK");
            else if ($("#etaskstartdate").val() === "") navigator.notification.alert("Please select a Start Date.", onCallback, "Message", "OK");
            else if ($("#etaskenddate").val() === "") navigator.notification.alert("Please select a End Date.", onCallback, "Message", "OK");
            else if ($("#etaskcompany").val() === "") navigator.notification.alert("Please select a Template.", onCallback, "Message", "OK");
            else if ($("#etaskcontract").val() === "") navigator.notification.alert("Please select a Task Contract.", onCallback, "Message", "OK");
            else if ($("#etasklocation").val() === "") navigator.notification.alert("Please select a Location.", onCallback, "Message", "OK");
            else if ($("#etaskmanager").val() === "") navigator.notification.alert("Please select a " + uman + ".", onCallback, "Message", "OK");
            //else if ($("#etaskassignee").val()==="") navigator.notification.alert("Please select a Assignee.",onCallback,"Message","OK");
            //else if ($("#etaskidentifier").val()==" ") navigator.notification.alert("Please select a Identifier.",onCallback,"Message","OK");
            //else if ($("#etasknotes").val()==" ") navigator.notification.alert("Please Enter Task Notes.",onCallback,"Message","OK");
            else updateTask(task);
        }
    } else {
        navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
    }
}

function updateTask(task) {
    //alert("updateTask");
    $('body').addClass('ui-loading');
    //alert($("#etasknotes").val()+","+$("#etaskidentifier :selected").text()+","+$("#etasks").val());
    $.ajax({
        type: "POST",
        url: window.localStorage.getItem("url") + "/create_task",
        dataType: "json",
        data: {
            edit_id: localStorage.getItem('selectedtaskid'),
            action: localStorage.getItem('taskaction'),
            companyid: $("#etaskcompany").val(),
            locationid: $("#etasklocation").val(),
            managerid: $("#etaskmanager").val(),
            clientid: theCandidateId || $("#ctaskcontract").val(),
            assigneeid: $("#etaskassignee").val(),
            // identifier:$("#etaskidentifier :selected").text(),
            type: $("#ccategorytype :selected").val(),
            category: $("#ccategory").val(),
            isbillable: $('input[name=ctaskbillability]:checked').val(),
            jobnumber: $("#cbilltype").val(),
            taskcode: $("#citem").val(),
            //            costcode:1,
            matter: $("#etaskcontract").val(),
            notes: $("#etasknotes").val(),
            startdate: $("#etaskstartdate").val(),
            enddate: $("#etaskenddate").val(),
            taskid: taskId,
            clientname: $("#etaskcontractorname").val() || $("#ctaskcontract :selected").text(),
            //ttaskid:$("#etasks").val(),
            ttaskid: $("#etasks :selected").val(),
            //taskname:$("#etasks :selected").text()
            taskname: task
        },
        success: function(data) {
            if (data.msg == "Success") {
                $('body').removeClass('ui-loading');
                navigator.notification.alert("Task Updated successfully.", false, "Message", "OK");
                $.mobile.changePage("tasks.html", {
                    transition: "none"
                });
            } else {

                navigator.notification.alert("Unable to Update Task.", onCallback, "Message", "OK");
                $.mobile.loading('hide');
            }
        },
        error: function() {
                $.mobile.loading('hide');
                // navigator.notification.alert("Unable to Add Task.",onCallback,"Message","OK");
            }
            //End of AJAX Call
    });
}

$("#edittask-page").ready(function() {
    //localStorage.setItem("editPage","false"); 
    /*$("body").addClass("ui-loading");*/
    labelChanger();
    moduleRevealer();
    if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
        utype = "Contract";
        uman = "Manager";
    } else {
        utype = "Matter";
        uman = "Attorney";
    }
    loadEditCompanies();
    //loadEditLocations();
    //loadEditManagers();
    loadEditAssignees();
    loadEditIdentifiers();
    if (localStorage.getItem('taskeditmode') === 'true') {
        loadEditTasks();
        loadEditLocations();
        loadEditManagers();
        loadSelectedTaskData();
        localStorage.setItem('taskaction', 'edit');
    } else {
        $('body').removeClass('ui-loading');
        rdata = '';
        $("#ccontractblock,#ctasksblock").css('display', 'block');
        $("#econtractorblock,#etasksblock").css('display', 'none');
        localStorage.setItem('taskaction', 'clone');
        loadCloneContract();
        loadCloneCategoryType();
        loadCloneJobNumbers();
    }
    $('body').removeClass('ui-loading');
});
/*$(document).on("pagebeforeshow","#edittask-page",function(){
    $('body').addClass('ui-loading');
    //if (checkConnection()) {
    
    loadTasks();
    loadCompanies();
    loadLocations();
    loadManagers();
    loadAssignees();
    loadIdentifiers();  
    loadSelectedTaskData(); 
    $('body').removeClass('ui-loading');
/*}
else navigator.notification.alert("Please check internet connection.",onCallBack,"Message","OK");*/
