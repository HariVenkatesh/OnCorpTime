/**Global declarations**/
//var contracterName,taskType,taskName,taskDescription,startDate,endDate,categoryType,category,taskCode,costCode,billability,contract,assignee,identifier,notes;

function loadContractersList() {
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/get_clients",
            dataType: "json",
            data: {
                user_id: window.localStorage.getItem("user_id")
            },
            success: function(data) {
                $("#taskcontractername").html(" ");
                $("#taskcontractername").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#taskcontractername").append("<option value='" + value.id + "'>" + value.fullname + "</option>").selectmenu("refresh");

                });
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



function loadCompanies() {

    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "GET",
            url: window.localStorage.getItem("url") + "/get_companies",
            dataType: "json",
            success: function(data) {
                $("#taskcompany").html(" ");
                $("#taskcompany").append("<option value=''>Select One</option>");
                $.each(data, function(index, value) {
                    $("#taskcompany").append("<option value='" + value.optionvalue + "'>" + value.optiontext + "</option>");

                });
                $("#taskcompany").selectmenu("refresh");
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

function loadLocations() {

    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/get_locations",
            dataType: "json",
            data: {
                companyid: $("#taskcompany").val()
            },
            success: function(data) {
                if (data.msg !== 'Failure') {
                    $("#tasklocation").html(" ");
                    $("#tasklocation").append("<option value=''>Select One</option>");
                    $.each(data, function(index, value) {
                        $("#tasklocation").append("<option value='" + value.optionvalue + "'>" + value.optiontext + "</option>");
                    });
                    $("#tasklocation option:last").remove();
                    $("#tasklocation").selectmenu("refresh");
                    $('body').removeClass('ui-loading');
                }
                //$('body').removeClass('ui-loading');  
                else {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Please Select another Template.", onCallBack, "Message", "OK");
                    $("#taskcompany").val('').selectmenu("refresh");
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

function loadManagers() {

    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/get_managers",
            dataType: "json",
            data: {
                locationid: $("#tasklocation").val()
            },
            success: function(data) {
                if (data.msg !== 'Failure') {
                    $("#taskmanager").html(" ");
                    $("#taskmanager").append("<option value=''>Select One</option>");
                    $.each(data, function(index, value) {
                        $("#taskmanager").append("<option value='" + value.id + "'>" + value.fullname + "</option>").selectmenu("refresh");

                    });
                    $("#taskmanager option:last").remove();
                    $("#taskmanager").selectmenu("refresh");
                    $('body').removeClass('ui-loading');
                } else {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Please Select another Location.", onCallBack, "Message", "OK");
                    $("#tasklocation").val('').selectmenu("refresh");
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

function populateAll() {

    if (checkConnection()) {
        $('body').addClass('ui-loading');
        $.ajax({
            type: "POST",
            url: window.localStorage.getItem("url") + "/get_matter",
            dataType: "json",
            data: {
                client_id: $("#taskcontractername :selected").val()
            },
            success: function(data) {
                /*var companyid=data[0].companyid || '';
                var company=data[0].company || 'Select One';
                var locationid=data[0].locationid || '';
                var location=data[0].location || 'Select One';
                var managerid=data[0].managerid || '';
                var manager=data[0].manager || 'Select One';
                $("#taskmanager,#taskcompany,#tasklocation").html(" ").attr("disabled","disabled"); 
                $("#taskcompany").html("<option value='"+companyid+"'>"+company+"</option>").selectmenu("refresh");
                $("#tasklocation").html("<option value='"+locationid+"'>"+location+"</option>").selectmenu("refresh");
                $("#taskmanager").html("<option value='"+managerid+"'>"+manager+"</option>").selectmenu("refresh");*/
                if (data.msg == "Failure") {
                    $('body').removeClass('ui-loading');
                } else {
                    $("#taskcontract").val(data[0].matter).attr("disabled", "disabled");
                    $('body').removeClass('ui-loading');
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




function saveNewTask() {
    $('body').addClass('ui-loading');
    $.ajax({
        type: "POST",
        url: window.localStorage.getItem("url") + "/create_task",
        dataType: "json",
        data: {
            action: 'create',
            companyid: $("#taskcompany").val(),
            locationid: $("#tasklocation").val(),
            managerid: $("#taskmanager").val(),
            clientid: $("#taskcontractername").val()
        },
        success: function(data) {
            if (data.msg == "Success") {
                $('body').removeClass('ui-loading');
                navigator.notification.alert("Task Added successfully.", false, "Message", "OK");
                $.mobile.changePage("tasks.html", {
                    transition: "none"
                });
            } else {
                $('body').removeClass('ui-loading');
                navigator.notification.alert("Unable to Add Task.", onCallback, "Message", "OK");
            }
            //          obj = JSON.parse(data);
            //
            //      if(obj.msg == 'Success'){
            //                             
            //
            //          navigator.notification.alert("Task created successfully.",onCallback,"Message","OK");
            //            $.mobile.changePage("tasks.html", { transition:"none" });               
            //          
            //      }else{                           
            //
            //          navigator.notification.alert("Unable to Add Task.",onCallback,"Message","OK");
            //                              
            //      }



        },
        error: function() {
                $('body').removeClass('ui-loading');
                //navigator.notification.alert("Unable to Add Task.",onCallback,"Message","OK");
            }
            //End of AJAX Call
    });

}







/*$(document).on("pageshow","#addtask-page",function(){ 
        
                        
        }
        else navigator.notification.alert("Please check internet connection.",onCallBack,"Message","OK");
    
    
    });*/
//$(document).ready(function(){});

/*function onBackConfirmSuccess(buttonIndex) {
    if (buttonIndex==1) {   
        window.history.back();      
        
    }
    else {
        console.log("Clicked No");
    }

}
function changer(){
    
            navigator.notification.confirm(
    'Are you sure you want to cancel the changes?', 
     onBackConfirmSuccess,            
    'Navigating Back',           
    ['Yes','Cancel']     
);
}

$(".backer").tap(changer);*/

/*$('input[type=radio][name=tasktype]').change(function() {
    
    var et="<label for='taskname'>Tasks*:</label><select id='taskname'><option value=''>Select One</option></select><br/>";
    var nt="<label for='newtaskname'>Tasks*:</label><input type='text' id='newtaskname'/><br/>";
        if (this.value == 'existingtask') {
            loadTaskNameList();
            $("#tasktypediv").html(et).enhanceWithin();

        }
        else if (this.value == 'newtask') {
            $("#tasktypediv").html(nt).enhanceWithin();
        }
    });*/

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


/**Validations**/
function onCallback() {
    console.log("Alert Clicked");
}

function addTaskValidator() {
    var alcname;
    //To Modify Labels
    if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
        alcname = "Contract";
        alcmanager = "Manager";
    } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
        alcname = "Client";
        alcmanager = "Attorney";
    }

    if (checkConnection()) {
        if ($("#taskcontractername").val() == "") navigator.notification.alert("Please select a " + alcname + ".", onCallback, "Message", "OK");
        else if ($("#taskcontract").val() == "") navigator.notification.alert("Please enter a Task Contract.", onCallback, "Message", "OK");
        else if ($("#taskcompany").val() == "") navigator.notification.alert("Please select a Template.", onCallback, "Message", "OK");
        else if ($("#tasklocation").val() == "") navigator.notification.alert("Please select a Location.", onCallback, "Message", "OK");
        else if ($("#taskmanager").val() == "") navigator.notification.alert("Please select a " + alcmanager + ".", onCallback, "Message", "OK");
        else saveNewTask();
    } else navigator.notification.alert("Please check internet connection.", onCallBack, "Message", "OK");
}


$("#addtaskbtn").tap(function() {
    /*if ($("#taskname").length) saveNewTask($("#taskname :selected").val());
    else if ($("#newtaskname").length) saveNewTask($("#newtaskname").val());*/
    addTaskValidator();
});

$(document).ready(function() {
    labelChanger();
    moduleRevealer();
    loadContractersList();
    loadCompanies();
});




/**Deprecated**/
/*function loadCategoryTypes(){
    $.ajax({
        type:"GET",
        url:window.localStorage.getItem("url")+"/get_category_types",
        dataType:"json",        
        success:function(data){
            $("#taskcategorytype").html(" ");
            $("#taskcategorytype").append("<option value=''>Select One</option>");
            $.each(data,function(index,value){
                $("#taskcategorytype").append("<option value='"+value.id+"'>"+value.categorytype+"</option>").selectmenu("refresh");
                    
            });                                 
            
            
        },
        error:function(){
            navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
        }
    //End of AJAX Call
}); 
}


function loadCategories(){
    $('body').addClass('ui-loading');
    $.ajax({
        type:"POST",
        url:window.localStorage.getItem("url")+"/get_categories",
        dataType:"json",
        data:{categorytypeid:$("#taskcategorytype :selected").val()},       
        success:function(data){
            $("#taskcategory").html(" ");
            $("#taskcategory").append("<option value=''>Select One</option>");
            $.each(data,function(index,value){
                //alert(value.text);
                $("#taskcategory").append("<option value='"+value.id+"'>"+value.categories+"</option>").selectmenu("refresh");
                    
            });

            $('body').removeClass('ui-loading');                                    
            
            
        },
        error:function(){
            $('body').removeClass('ui-loading');
            navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
        }
    //End of AJAX Call
}); 
}

function loadActiveJobNumbers(){
    $.ajax({
        type:"GET",
        url:window.localStorage.getItem("url")+"/get_active_jobnumbers",
        dataType:"json",
        //data:{user_id:localStorage.getItem("user_id"),contract:$("#taskcontractername :selected").val()},     
        success:function(data){
            $("#jobnumber").html(" ");
            $("#jobnumber").append("<option value=''>Select One</option>");
            $.each(data,function(index,value){
                $("#jobnumber").append("<option value='"+value.optionvalue+"'>"+value.optiontext+"</option>").selectmenu("refresh");
                    
            });                                 
            
            
        },
        error:function(){
            navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
        }
    //End of AJAX Call
}); 
    
}

function loadTaskCodes(){
    $('body').addClass('ui-loading');
    $.ajax({
        type:"POST",
        url:window.localStorage.getItem("url")+"/get_task_codes",
        dataType:"json",
        data:{jobcode:$("#jobnumber :selected").val()},     
        success:function(data){

            $("#taskcode").html(" ");
            $("#taskcode").append("<option value=''>Select One</option>");
            $.each(data,function(index,value){
                $("#taskcode").append("<option value='"+value.optionvalue+"'>"+value.optiontext+"</option>").selectmenu("refresh");
                    
            });                                 
    $('body').removeClass('ui-loading');    
            
        },
        error:function(){
            $('body').removeClass('ui-loading');
            navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
        }
    //End of AJAX Call
}); 
}

function loadCostCodes(){
    $('body').addClass('ui-loading');
    $.ajax({
        type:"POST",
        url:window.localStorage.getItem("url")+"/get_cost_codes",
        dataType:"json",
        data:{taskcode:$("#taskcode :selected").val()},     
        success:function(data){
            $("#costcode").html(" ");
            $("#costcode").append("<option value=''>Select One</option>");
            $.each(data,function(index,value){
                $("#costcode").append("<option value='"+value.id+"'>"+value.costcode+"</option>").selectmenu("refresh");
                    
            });                                 
            $('body').removeClass('ui-loading');
            
        },
        error:function(){
            $('body').removeClass('ui-loading');
            navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
        }
    //End of AJAX Call
}); 
} 



function loadAssignees(){
    $.ajax({
        type:"GET",
        url:window.localStorage.getItem("url")+"/get_assignees",
        dataType:"json",        
        success:function(data){
            $("#taskassignee").html(" ");
            $("#taskassignee").append("<option value=''>Select One</option>");
            $.each(data,function(index,value){
                $("#taskassignee").append("<option value='"+value.id+"'>"+value.fullname+"</option>").selectmenu("refresh");
                    
            });                                 
            
            
        },
        error:function(){
            navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
        }
    //End of AJAX Call
}); 
}

function loadIdentifiers(){
    $.ajax({
        type:"GET",
        url:window.localStorage.getItem("url")+"/get_identifiers",
        dataType:"json",        
        success:function(data){
            $("#taskidentifier").html(" ");
            $("#taskidentifier").append("<option value=''>Select One</option>");
            $.each(data,function(index,value){
                $("#taskidentifier").append("<option value='"+value.id+"'>"+value.fullname+"</option>").selectmenu("refresh");
                    
            });                                 
            
            
        },
        error:function(){
            navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
        }
    //End of AJAX Call
}); 
}

function loadTaskNameList(){
    $.ajax({
        type:"GET",
        url:window.localStorage.getItem("url")+"/get_tasks",
        dataType:"json",        
        success:function(data){
            $("#taskname").html(" ");
            $("#taskname").append("<option value=''>Select One</option>");
            $.each(data,function(index,value){
                $("#taskname").append("<option value='"+value.optionvalue+"'>"+value.optiontext+"</option>").selectmenu("refresh");
                    
            });                                 
            
            
        },
        error:function(){
            navigator.notification.alert("Couldn't connect to server",onCallBack,"Message","OK");
        }
    //End of AJAX Call
}); 
}

function saveNewTask(taskName){
    $.ajax({
        type:"POST",
        url:window.localStorage.getItem("url")+"/create_task",
        dataType:"json",
        data:{
              //addedby:window.localStorage.getItem("user_id"),
              clientid:$("#taskcontractername :selected").val(),
              radiobutton:$("input[name=tasktype]:checked").val(),
              clientname:$("#taskcontractername :selected").text(),
              locationid:$("#tasklocation").val(),
              taskname:taskName,
              startdate:$("#taskstartdate").val(),
              enddate:$("#taskenddate").val(),
              type:$("#taskcategorytype :selected").val(),
              category:$("#taskcategory :selected").val(),
              taskcode:$("#taskcode :selected").val(),
              costcode:$("#costcode :selected").val(),
              jobnumber:$("#jobnumber :selected").val(),
              isbillable:$("input[name=taskbillability]:checked").val(),
              matter:$("#taskcontract").val(),
              assigneeid:$("#taskassignee :selected").val(),
              identifier:$("#taskidentifier :selected").val(),
              notes:$("#tasknotes").val(),
              companyid:$("#taskcompany").val(),
              managerid:$("#taskmanager").val()
                },      
        success:function(data){
            obj = JSON.parse(data);
        
        if(obj.msg == 'Success'){
                             $.mobile.loading( 'hide');

            navigator.notification.alert("New Task created successfully.",onCallback,"Message","OK");
                             
            
        }else{                           

            navigator.notification.alert("Unable to Add Task.",onCallback,"Message","OK");
                              $.mobile.loading( 'hide');
        }
                                            
            
            
        },
        error:function(){
            navigator.notification.alert("Unable to Add Task.",onCallback,"Message","OK");
        }
    //End of AJAX Call
}); 
alert("Saved new task successfully");
}
(hided)*/
