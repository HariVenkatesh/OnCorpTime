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


var mTempField = '';
var a = 0;
var tempIndex;
var flag_taskcode = 0;
var jobTemp = 0,
    taskTemp = 0,
    contractTemp = 0,
    employeeTemp = 0,
    flag, previousSelected;
$("#createbills_page").ready(function() {
    moduleRevealer();
    //Header change based on Option value
    if (window.localStorage.getItem("option") == 'edit') {
        $("#custome_header").empty();
        $(".header-title").empty();
        //		$(".header-title").append("<h3 style='color:#ffffff;'>Edit Bill</h3>");
        // $("#custome_header").append("<p style='color:#ffffff;'>All fields marked * are required.</p>");
        flag = '';
    } else {
        $(".header-title").empty();
        //		$(".header-title").append("<h1 style='color:#ffffff;'>Create New Bill</h1>");
        // $("#custome_header").append("<p style='color:#ffffff;'>All fields marked * are required.</p>");
        //To set default value as current date
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = mm + '/' + dd + '/' + yyyy;
        $("#transactiondate").val(today);
        //alert(today);
        flag = 'NOALERT';
        // alert("today");

    }
    //To set employee selection based on confirmation 

    //To Modify Labels
    if (window.localStorage.getItem("user_type") == "hrms_admin") {
        
        //To show the fileds set display as empty.
        document.getElementById("employee_box").style.display = "";
        $("#employee_label").html("Employee <span class='mandatory'>*</span>");
        getListOfEmployee();
        //$.mobile.loading( 'hide');
    } else if (window.localStorage.getItem("user_type") == "hrms_normal") {
        
        //To hide the fileds set display as empty.
        document.getElementById("employee_box").style.display = "none";
        getContract();
        // $.mobile.loading( 'hide');
    } else if (window.localStorage.getItem("user_type") == "legal_admin") {
        
        //To hide the fileds set display as empty.
        document.getElementById("employee_box").style.display = "";
        $("#employee_label").html("Timekeeper <span class='mandatory'>*</span>");
        $("#contract_label").html("Matter <span class='mandatory'>*</span>");
        $("#jobnumber_label").html("Billing Type <span class='mandatory'>*</span>");
        $("#taskcode_label").html("Item <span class='mandatory'>*</span>");
        getListOfEmployee();
        
    } else if (window.localStorage.getItem("user_type") == "legal_normal") {
        
        //To hide the fileds set display as empty.
        document.getElementById("employee_box").style.display = "none";
        $("#contract_label").html("Matter <span class='mandatory'>*</span>");
        $("#jobnumber_label").html("Billing Type <span class='mandatory'>*</span>");
        $("#taskcode_label").html("Item <span class='mandatory'>*</span>");
        getContract();
        
    }

});

//Get the Employee List
function getListOfEmployee() {
    var selectedEmp;
    if (checkConnection()) {
        // //$('body').addClass('ui-loading');
        var serviceCall = $.post(window.localStorage.getItem("url") + "/get_employees", "json");
        serviceCall.done(function(data) {
            obj = JSON.parse(data);
            if (obj.msg == 'Failure') {
                //$('body').removeClass('ui-loading');
                navigator.notification.alert("No Employees available.", onCallback, "Message", "OK");
            } else {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $.each(obj, function(index, item) {
                    listItem += "<option value='" + item.id + "'>" + item.fullname + "</option>";
                });
                //	console.log(listItem);
                $("#emplyee").append(listItem);
                $("#emplyee").selectmenu('refresh');

                previousSelected = $('#emplyee').val();

                onEditAction();
            }
        });
        serviceCall.fail(function() {
            // $.mobile.loading( 'hide');

            $('body').removeClass('ui-loading');
            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
}

//Check the navigation for Create or Edit Bill


function onEditAction() {


    if (window.localStorage.getItem("option") == 'edit') {
        $.mobile.loading('show', {
            text: 'Loading..',
            textVisible: true,
            theme: 'a',
            html: ""
        });

        if (checkConnection()) {
            var serviceCall = $.post(window.localStorage.getItem("url") + "/view_bill", {
                odcid: window.localStorage.getItem("odcid")
            }, "json");
            serviceCall.done(function(data) {
                obj = JSON.parse(data);
                if (obj.msg == 'Failure') {
                    //$('body').removeClass('ui-loading');
                    $.mobile.loading('hide');

                    navigator.notification.alert("No bills available.", onCallback, "Message", "OK");
                } else {

                    console.log("Data Loaded: " + "Amount" + obj.amount + "Date" + obj.transactiondate + "hours" + obj.hours + "rate" + obj.rate + "Desc" + obj.description);
                    mTempField = 'EDIT';

                    a = obj.employeeid;
                    var tem = obj.transactiondate;
                    var datesplit = tem.split("/");
                    var newdate = datesplit[2] + "-" + datesplit[0] + "-" + datesplit[1];
                    $("#transactiondate").val(newdate);
                    if ((obj.rate == '0.00' || obj.rate == '0') || (obj.hours == '0.00' || obj.hours == '0')) {
                        document.getElementById("hours_row").style.display = "none";
                        document.getElementById("rate_row").style.display = "none";
                        $("#amount").val(obj.amount);
                        $('#radio1').prop('checked', false);
                        $('#radio2').prop('checked', true).checkboxradio("refresh");
                        document.getElementById("amount").readOnly = false;
                        //$.mobile.loading( 'hide');
                    } else {

                        document.getElementById("hours_row").style.display = "";
                        document.getElementById("rate_row").style.display = "";
                        $("#hours").val(obj.hours);
                        $("#rate").val(obj.rate);
                        $("#amount").val(obj.amount);
                        $('#radio2').prop('checked', false);
                        $('#radio1').prop('checked', true).checkboxradio("refresh");
                        document.getElementById("amount").readOnly = true;

                        //$.mobile.loading( 'hide');
                    }

                    window.localStorage.setItem("tasktext", obj.description);
                    $("#description").val(obj.description);

                    contractTemp = 0;
                    //Other than hrms admin user the employee field is hidden
                    if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "legal_admin")) {

                        $("#emplyee").val(obj.employeeid).change();
                        previousSelected = $('#emplyee').val();

                        $("#contract option").remove();
                        //					var listItem ="<option value='"+obj.contract+"'>"+obj.contract+"</option>"+"<option value='Select One'>Select One</option>";
                        //					$("#contract").append(listItem);
                        //					$("#contract").val(obj.contract).change();	
                        loadContract(previousSelected, obj.contract, obj.jobnumber, obj.taskcode);
                        $.mobile.loading('hide');
                    }
                    if ((window.localStorage.getItem("user_type") == "hrms_normal") || (window.localStorage.getItem("user_type") == "legal_normal")) {
                        //					$("#contract").val(obj.contract).change();

                        previousSelected = $('#contract').val();
                        loadContract(window.localStorage.getItem("user_id"), obj.contract, obj.jobnumber, obj.taskcode);
                        $.mobile.loading('hide');

                    }
                    //To avoid requesting jobcode and taskcode web services
                    jobTemp = 0;
                    taskTemp = 0;
                    // $("#jobNumber option").remove();
                    var listItemJob = "<option value='" + obj.jobnumber + "' selected>" + obj.jobnumber + "</option>" + "<option value='Select One'>Select One</option>";
                    $("#jobNumber").append(listItemJob);
                    $("#jobNumber").selectmenu("refresh");
                    // $("#jobNumber").val(obj.jobnumber).change();

                    $("#taskCode option").remove();
                    var listItemTask = "<option value='" + obj.taskcode + "' selected>" + obj.optiontext + "</option>" + "<option value='Select One'>Select One</option>";
                    $("#taskCode").append(listItemTask);
                    $("#taskCode").selectmenu("refresh");
                    // $("#taskCode").val(obj.taskcode).change();
                    // $("#costCode option").remove();
                    window.localStorage.setItem("cc", obj.costcode);
                    var listItemCost = "<option value='1'>Direct</option>" + "<option value='Select One'>Select One</option>";
                    $("#costCode").append(listItemCost);
                    $("#costCode").val(obj.costcode).change();
                    $.mobile.loading('hide');
                    //  $.mobile.loading( 'hide');
                    //$('body').removeClass('ui-loading');
                }
            });
            serviceCall.fail(function() {
                $('body').removeClass('ui-loading');
                //$.mobile.loading( 'hide');

                //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            });
        } else {
            //$('body').removeClass('ui-loading');
            $.mobile.loading('hide');

            navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        }
    } else {
        $('#radio1').prop('checked', true).checkboxradio("refresh");
        document.getElementById("amount").readOnly = true;
        $('#radio2').prop('checked', false);
        $('body').removeClass('ui-loading');

        if ($("#employee_box").css('display') == 'block') {
            $("#contract").append("<option value='Select One'>Select One</option>");
            $("#contract").selectmenu('refresh');
        }
        $("#jobNumber").append("<option value='Select One'>Select One</option>");
        $("#jobNumber").selectmenu('refresh');
        $("#taskCode").append("<option value='Select One'>Select One</option>");
        $("#taskCode").selectmenu('refresh');
        $("#costCode").append("<option value='1'>Direct</option>" + "<option value='Select One'>Select One</option>");
        $("#costCode").selectmenu('refresh');
    }
}

//If the user hrms admin type when the user changes the employee the alert will show notification
function employeeChange(index) {
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });

    var selectedEmployeeID = index.options[index.selectedIndex].value;

    tempIndex = index;
    selectedEmp = selectedEmployeeID;
    console.log("Previous Selected Value:" + previousSelected);
    if (employeeTemp == 0 && (window.localStorage.getItem("option") == 'edit')) {
        employeeTemp++;

    } else {
        console.log("TO ADD" + "--FLAG" + flag);
        if (flag == 'NOALERT') {

            flag = '';
            if (employeeTemp == 0 && (window.localStorage.getItem("option") != 'edit')) {
                employeeTemp++;
                onConfirmCallback(1);
            }
        } else {
            editContract($("#emplyee").val());
            //}
            //	        navigator.notification.confirm("Some information that you may have entered shall be lost.",onConfirmCallback,"Message",["OK","Cancel"]);

        }
    }
    //if(window.localStorage.getItem("option") == 'edit'){
    //    editContract($("#emplyee").val());
    //}
}

function loadContractvalues() {
    if (checkConnection()) {
        previousSelected = $("employee").val();
        mTempField = '';
        $("#jobNumber option").remove();
        $("#taskCode option").remove();
        $("#costCode option").remove();
        $("#rate").val("0.00");
        $("#jobNumber").append("<option value='Select One'>Select One</option>");
        $("#jobNumber").selectmenu('refresh');
        $("#taskCode").append("<option value='Select One'>Select One</option>");
        $("#taskCode").selectmenu('refresh');
        $("#costCode").append("<option value='1'>Direct</option>" + "<option value='Select One'>Select One</option>");
        //$("#costCode").selectmenu('refresh');
        //$('body').addClass('ui-loading');
        var getEmployeeTestCall = $.post(window.localStorage.getItem("url") + "/get_contracts", {
            user_id: $("employee").val()
        }, "json");
        getEmployeeTestCall.done(function(data) {
            obj = JSON.parse(data);
            $("#contract option").remove();
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#contract").append(listItem);
                $("#contract").selectmenu('refresh');
            } else {

                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $.each(obj, function(indexid, item) {
                    listItem += "<option value='" + item.contract + "'>" + item.contract + "</option>";
                });

                $("#contract").append(listItem);
                $("#contract").selectmenu('refresh');
            }
            $.mobile.loading('hide');

            //$('body').removeClass('ui-loading');
        });
        getEmployeeTestCall.fail(function() {
            $('body').removeClass('ui-loading');
            //$.mobile.loading( 'hide');

            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
}

//Based on the alert confirmation the fields will change
function onConfirmCallback(buttonIndex) {
    if (buttonIndex == 1) {

        if (checkConnection()) {
            previousSelected = $(tempIndex).val();
            mTempField = '';
            $("#jobNumber option").remove();
            $("#taskCode option").remove();
            $("#costCode option").remove();
            $("#rate").val("0.00");
            $("#jobNumber").append("<option value='Select One'>Select One</option>");
            $("#jobNumber").selectmenu('refresh');
            $("#taskCode").append("<option value='Select One'>Select One</option>");
            $("#taskCode").selectmenu('refresh');
            $("#costCode").append("<option value='1'>Direct</option>" + "<option value='Select One'>Select One</option>");
            //$("#costCode").selectmenu('refresh');
            //$('body').addClass('ui-loading');
            var getEmployeeTestCall = $.post(window.localStorage.getItem("url") + "/get_contracts", {
                user_id: selectedEmp
            }, "json");
            getEmployeeTestCall.done(function(data) {
                obj = JSON.parse(data);
                $("#contract option").remove();
                if (obj.msg == 'Failure') {
                    navigator.notification.alert("Please Select another Employee.", onCallBack, "Message", "OK");
                    var listItem = "";
                    listItem = "<option value='Select One'>Select One</option>";
                    $("#contract").append(listItem);
                    $("#contract").selectmenu('refresh');
                } else {
                    var listItem = "";
                    listItem = "<option value='Select One'>Select One</option>";
                    $.each(obj, function(indexid, item) {
                        listItem += "<option value='" + item.contract + "'>" + item.contract + "</option>";
                    });

                    $("#contract").append(listItem);
                    $("#contract").selectmenu('refresh');
                }
                $.mobile.loading('hide');

                //$('body').removeClass('ui-loading');
            });
            getEmployeeTestCall.fail(function() {
                $.mobile.loading('hide');

                //$('body').removeClass('ui-loading');
                //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            });
        } else {
            navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        }
    } else if (buttonIndex == 2) {
        console.log("Rejected");
        mTempField = '';
        flag = 'NOALERT';
        $(tempIndex).val(previousSelected).change();
    }
}

//Other than hrms admin user the contract or matter is the first field the user_id ==Employee_id
function getContract() {
    if (checkConnection()) {
        //$('body').addClass('ui-loading');
        var getEmployeeTestCall = $.post(window.localStorage.getItem("url") + "/get_contracts", {
            user_id: window.localStorage.getItem("user_id")
        }, "json");
        getEmployeeTestCall.done(function(data) {
            obj = JSON.parse(data);
            $("#contract option").remove();
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#contract").append(listItem);
                $("#contract").selectmenu('refresh');
            } else {

                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $.each(obj, function(indexid, item) {
                    listItem += "<option value='" + item.contract + "'>" + item.contract + "</option>";
                });
                $("#contract").append(listItem);
                $("#contract").selectmenu('refresh');
            }
            onEditAction();
            $.mobile.loading('hide');

            //$('body').removeClass('ui-loading');
        });
        getEmployeeTestCall.fail(function() {
            //$('body').removeClass('ui-loading');
            $.mobile.loading('hide');

            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
}

//Method will get triggered when the user changes the contract or matter field
function contractChange(index) {
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });

    var selectedEmployeeID = $("#emplyee").val();
    var selectedContract = index.options[index.selectedIndex].value;

    jobNumbers(selectedEmployeeID, selectedContract);

}

function jobNumberChange(index) {

    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    var selected = index.options[index.selectedIndex].value;
    var rateInput = document.getElementById("rate");
    //	if(jobTemp ==0 && (window.localStorage.getItem("option") == 'edit')){
    //	   jobTemp++;
    //	}

    if (selected == 'Select One') {
        rateInput.value = "";
    } else {
        getRateMethod();
    }
    CalculateAmount();

    if (checkConnection()) {
        //$.mobile.showPageLoadingMsg();
        var taskCodeCall = $.post(window.localStorage.getItem("url") + "/get_task_codes", {
            jobcode: selected
        }, "json");
        taskCodeCall.done(function(data) {
            //alert(JSON.stringify(data));
            obj = JSON.parse(data);
            $("#taskCode option").remove();
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#taskCode").append(listItem);
                $("#taskCode").selectmenu('refresh');
                $.mobile.loading('hide');
            } else {

                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $.each(obj, function(indexid, item) {
                    listItem += "<option value='" + item.optionvalue + "'>" + item.optiontext + "</option>";
                });

                $("#taskCode").append(listItem);
                $("#taskCode").selectmenu('refresh');
                $.mobile.loading('hide');
            }
            //$.mobile.hidePageLoadingMsg();
        });
        taskCodeCall.fail(function() {
            //$.mobile.hidePageLoadingMsg();

            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }

}

function getTaskCode(selectedJob) {
    var selected = index.options[index.selectedIndex].value;
    var rateInput = document.getElementById("rate");
    if (selected == 'Select One') {
        rateInput.value = "";
    } else {
        getRateMethod();
    }
    CalculateAmount();
    console.log("Selected Item:" + selected);
    if (checkConnection()) {
        //$.mobile.showPageLoadingMsg();
        var taskCodeCall = $.post(window.localStorage.getItem("url") + "/get_task_codes", {
            jobcode: selected
        }, "json");
        taskCodeCall.done(function(data) {
            obj = JSON.parse(data);
            $("#taskCode option").remove();
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#taskCode").append(listItem);
                $("#taskCode").selectmenu('refresh');
            } else {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $.each(obj, function(indexid, item) {
                    listItem += "<option value='" + item.optionvalue + "'>" + item.optiontext + "</option>";
                });
                $("#taskCode").append(listItem);
                $("#taskCode").selectmenu('refresh');
            }
            //$.mobile.hidePageLoadingMsg();
        });
        taskCodeCall.fail(function() {
            //$.mobile.hidePageLoadingMsg();
            $('body').removeClass('ui-loading');
            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
}

function taskCodeChange(index) {
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    window.localStorage.setItem("cc", "");
    var selectedTask = index.options[index.selectedIndex].value;
    //    if(flag_taskcode==0 && (window.localStorage.getItem("option") == 'edit')){
    //   
    //   flag_taskcode=1;
    //        
    //        
    // }
    // else{90
    //alert(index);
    if (window.localStorage.getItem("option") == 'edit') {
        var a = $('#taskCode').find("option:selected").text();
        var n = a.length;
        var occur = a.search('-');
        var resultstring = a.substr(occur + 1, n);
        if (resultstring == "Select One") {
            $('#description').val("");
        } else if (window.localStorage.getItem("tasktext") == resultstring) {
            $('#description').val(window.localStorage.getItem("tasktext"));
        } else {
            $('#description').val(resultstring);
        }
    }

    if (window.localStorage.getItem("option") == 'NEW') {
        var a = $('#taskCode').find("option:selected").text();
        var n = a.length;
        var occur = a.search('-');
        var resultstring = a.substr(occur + 1, n);
        if (resultstring == "Select One")
            $('#description').val("");

        else {
            $('#description').val(resultstring);
        }
    }
    // }
    //	if(taskTemp ==0 && (window.localStorage.getItem("option") == 'edit')){ 
    //	  taskTemp++;
    //	}
    //	else{
    if (checkConnection()) {
        //$.mobile.showPageLoadingMsg();
        var getCostCodeCall = $.post(window.localStorage.getItem("url") + "/get_cost_codes", {
            taskcode: selectedTask
        }, "json");
        getCostCodeCall.done(function(data) {
            obj = JSON.parse(data);
            $("#costCode option").remove();
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#costCode").append(listItem);
                $("#costCode").selectmenu('refresh');
                $.mobile.loading('hide');
            } else {

                var listItem = "";
                var selected = "selected='selected'";
                listItem += "<option value='Select One'>Select One</option>";
                listItem += "<option value='1' " + selected + ">Direct</option>";
                $.each(obj, function(indexid, item) {


                    if (item.costcode == window.localStorage.getItem("cc")) {
                        // selected="selected='selected'";
                    }
                    //listItem +="<option value='"+item.id+"' "+selected+">"+item.costcode+"</option>";
                });

                //console.log(listItem);
                $("#costCode").append(listItem);
                $("#costCode").selectmenu('refresh');
                $.mobile.loading('hide');
            }
            //$.mobile.hidePageLoadingMsg();
        });
        getCostCodeCall.fail(function() {
            // $.mobile.hidePageLoadingMsg();
            $('body').removeClass('ui-loading');
            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
    //	}
}

function getRateMethod() {
    //alert("rate");
    if (checkConnection()) {
        //$.mobile.showPageLoadingMsg();	
        if ((window.localStorage.getItem("user_type") == "hrms_admin") || window.localStorage.getItem("user_type") == "legal_admin") {
            var getRateCall = $.post(window.localStorage.getItem("url") + "/get_rate", {
                employee_id: $("#emplyee").val(),
                jobnumber: $("#jobNumber").val()
            }, "json");
            //            alert("if\n"+$("#emplyee").val());
            //              alert("if\n"+$("#jobNumber").val());
        } else {

            var getRateCall = $.post(window.localStorage.getItem("url") + "/get_rate", {
                employee_id: window.localStorage.getItem("user_id"),
                jobnumber: $("#jobNumber").val()
            }, "json");
            // alert("else\n"+ JSON.stringify(getRateCall));
        }
        getRateCall.done(function(data) {

            obj = JSON.parse(data);
            if (obj.msg == 'Failure') {
                //alert("faliure")
                $("#rate").val("0.00");
                $.mobile.loading('hide');
            } else {
                console.log("Rate:" + obj.rate);
                //  alert("Rate:"+obj.rate);
                $("#rate").val(obj.rate);
                $.mobile.loading('hide');
            }
            //$.mobile.hidePageLoadingMsg();
            CalculateAmount();
        });
        getRateCall.fail(function() {
            //$.mobile.hidePageLoadingMsg();
            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }
}

function radioClicked(buttonIndex) {
    //    alert(buttonIndex);
    //    alert("1\n"+$('#radio1').attr("checked"));
    //    alert("2\n"+$('#radio2').attr("checked"));
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    if (buttonIndex == 'hours') {
        //alert("hours radio 1\n"+$('#radio1').attr("checked"));
        // alert("hours radio 2\n"+$('#radio2').attr("checked"));

        //To hidden the fileds set display as empty.
        document.getElementById("hours_row").style.display = "";
        document.getElementById("rate_row").style.display = "";
        $("#amount").val("0.00");
        var index = $("#jobNumber").val();
        if (index == 'Select One') {
            // alert("if");
            $("#rate").val("0.00");
        } else {
            //alert("else");
            getRateMethod();
        }
        $("#hours").val("0.00");
        $('#radio1').prop('checked', true);
        $('#radio2').prop('checked', false);
        //    $('#radio1').attr("checked","checked");
        //  $('#radio2').attr("checked","false");

        $("input[type='radio']").checkboxradio("refresh");
        //alert("after hours radio 1\n"+$('#radio1').attr("checked")+"\nradio 2\n"+$('#radio2').attr("checked"));
        //alert("after hoursradio 2\n"+$('#radio2').attr("checked"));

        document.getElementById("amount").readOnly = true;
        $.mobile.loading('hide');
    } else if (buttonIndex == 'amount') {

        //To hidden the fileds set display as none.
        document.getElementById("hours_row").style.display = "none";
        document.getElementById("rate_row").style.display = "none";
        $("#rate").val("0.00");
        $("#amount").val("0.00");
        $('#radio1').prop('checked', false);
        $('#radio2').prop('checked', true);
        //    $('#radio1').attr("checked","false");
        //    $('#radio2').attr("checked","checked");
        $("input[type='radio']").checkboxradio("refresh");
        //    alert("after amount radio 1\n"+$('#radio1').attr("checked")+"\nradio 2\n"+$('#radio2').attr("checked"));
        //alert("after amount radio 2\n"+$('#radio2').attr("checked"));
        document.getElementById("amount").readOnly = false;
        $.mobile.loading('hide');
    }
}

function createBIlls() {
    //alert("createBIlls");
    if (checkConnection()) {
        if ($("#employee_box").css('display') == 'block') {
            if ($("#emplyee").val() == 'Select One') {
                if (window.localStorage.getItem("user_type") == "legal_admin") {
                    navigator.notification.alert("Please select a Timekeeper.", onCallback, "Message", "OK");
                } else {
                    navigator.notification.alert("Please select an Employee.", onCallback, "Message", "OK");
                }
            } else {
                // alert("createBIlls else");

                SaveBills();
            }
        } else {
            //  alert("createBIlls else 1");
            SaveBills();
        }
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
}

function SaveBills() {
    //alert("SaveBills");
    var value = window.localStorage.getItem("key");
    var receivedRate = '0.00',
        receivedHours = '0.00';
    console.log("Session Storage:" + value);
    if ($("#contract").val() == 'Select One') {
        if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
            navigator.notification.alert("Please select the contract.", onCallback, "Message", "OK");
        } else {
            navigator.notification.alert("Please select the matter.", onCallback, "Message", "OK");
        }
    } else if ($("#jobNumber").val() == 'Select One') {
        if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
            navigator.notification.alert("Please select the Job Number.", onCallback, "Message", "OK");
        } else {
            navigator.notification.alert("Please select the BillingType.", onCallback, "Message", "OK");
        }
    } else if ($("#taskCode").val() == 'Select One') {
        if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
            navigator.notification.alert("Please select the Task Code.", onCallback, "Message", "OK");
        } else {
            navigator.notification.alert("Please select the Item.", onCallback, "Message", "OK");
        }
    } else if ($("#costCode").val() == 'Select One') {
        navigator.notification.alert("Please select the Cost Code.", onCallback, "Message", "OK");
    } else if ($.trim($("#transactiondate").val()).length == 0) {
        navigator.notification.alert("Please add Transaction date.", onCallback, "Message", "OK");
    } else if ($.trim($("#hours").val()) == 0 && $('#radio1').prop("checked")) {
        navigator.notification.alert("Please enter Hours.", onCallback, "Message", "OK");
    } else if ($.trim($("#amount").val()) == 0) {
        navigator.notification.alert("Please enter Amount.", onCallback, "Message", "OK");
    } else if ($.trim($("#description").val()).length == 0) {
        navigator.notification.alert("Please enter description.", onCallback, "Message", "OK");
    } else {
        mAddUpdateBill();
    }
}

function mAddUpdateBill() {
    // alert("mAddUpdateBill");
    var value = window.localStorage.getItem("key");
    //alert("value\n"+value);
    //alert("window.localStorage.getItem\n"+window.localStorage.getItem("key"));
    var receivedRate = '0.00',
        receivedHours = '0.00';
    if ($('#radio1').prop("checked")) { //hours checked
        receivedRate = $("#rate").val();
        receivedHours = $("#hours").val();
    } else {
        receivedRate = '0.00';
        receivedHours = '0.00';
    }
    if (window.localStorage.getItem("option") == 'edit') {
        //alert("edit");
        //$.mobile.loadingMessage = 'Please wait...';
        //$.mobile.loadingMessageTextVisible = true;
        //$.mobile.showPageLoadingMsg();
        var employeeIdField;
        if ($("#employee_box").css('display') == 'block') {
            employeeIdField = $("#emplyee").val();
        } else {
            employeeIdField = window.localStorage.getItem("user_id");
        }


        var updateBillsCall = $.post(window.localStorage.getItem("url") + "/update_bill", {
            odcid: window.localStorage.getItem("odcid"),
            employeeid: employeeIdField,
            jobnumber: $("#jobNumber").val(),
            costcentercode: $("#costCode").val(),
            poline: "",
            activity: "",
            transactiondate: $("#transactiondate").val(),
            amount: $("#amount").val(),
            hours: receivedHours,
            rate: receivedRate,
            description: $("#description").val(),
            createdby: window.localStorage.getItem("user_id"),
            costcode: $("#costCode").val(),
            taskcode: $("#taskCode").val(),
            category: $("#contract").val()
        }, "json");
        updateBillsCall.done(function(data) {
            obj = JSON.parse(data);
            $.mobile.loading('hide');
            //$.mobile.hidePageLoadingMsg();
            if (obj.msg == 'Success') {
                //alert("success");
                navigator.notification.alert("Bill updated successfully.", onCallback, "Message", "OK");
                window.localStorage.setItem("option", "");
                $.mobile.loading('hide');
                $.mobile.changePage(value, {
                    transition: "none"
                });


            } else {
                // alert("success else");
                navigator.notification.alert("Failed to update bill.", onCallback, "Message", "OK");
                $.mobile.loading('hide');
            }
        });
        updateBillsCall.fail(function() {
            //$.mobile.hidePageLoadingMsg();
            //navigator.notification.alert("Failed to update bill.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    } else {
        //$.mobile.loadingMessage = 'Please wait...';
        //$.mobile.loadingMessageTextVisible = true;
        //$.mobile.showPageLoadingMsg();
        var employeeIdField;
        if ($("#employee_box").css('display') == 'block') {
            employeeIdField = $("#emplyee").val();
        } else {
            employeeIdField = window.localStorage.getItem("user_id");
        }
        var createBillsCall = $.post(window.localStorage.getItem("url") + "/create_bill", {
            employeeid: employeeIdField,
            jobnumber: $("#jobNumber").val(),
            costcentercode: $("#costCode").val(),
            poline: "",
            activity: "LEGAL",
            transactiondate: $("#transactiondate").val(),
            amount: $("#amount").val(),
            hours: receivedHours,
            rate: receivedRate,
            description: $("#description").val(),
            createdby: window.localStorage.getItem("user_id"),
            costcode: $("#costCode").val(),
            taskcode: $("#taskCode").val(),
            category: $("#contract").val()
        }, "json");
        createBillsCall.done(function(data) {
            obj = JSON.parse(data);

            //$.mobile.hidePageLoadingMsg();
            if (obj.msg == 'Success') {
                $.mobile.loading('hide');

                navigator.notification.alert("New bill created successfully.", onCallback, "Message", "OK");

                $.mobile.changePage(value, {
                    transition: "none"
                });
            } else {


                navigator.notification.alert("Unable to save bill.", onCallback, "Message", "OK");
                $.mobile.loading('hide');
            }
        });
        createBillsCall.fail(function() {
            //	$.mobile.hidePageLoadingMsg();
            //navigator.notification.alert("Unable to save bill.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    }
}

function onCallback() {
    console.log("Alert Clicked");
}

function closeWindowMethod() {
    console.log("closewindow called");
    navigator.notification.confirm("Are you sure you want to cancel the changes?", onConfirmCancelCallback, "Message", ["OK", "Cancel"]);
}

function onConfirmCancelCallback(buttonIndex) {
    if (buttonIndex == 1) {
        var value = window.localStorage.getItem("key");
        window.localStorage.setItem("option", "");
        console.log("Session Storage:" + value);
        $.mobile.changePage("bills.html", {
            transition: "none"
        });
    } else if (buttonIndex == 2) {
        console.log("alert cancelled");
    }
}

function datePickerOption() {
    $("#transactiondate").datepicker({
        altField: "#" + $(this).attr("id"),
        showOtherMonths: true,
        dateFormat: "mm/dd/yy"
    });
}

function CalculateAmount() {
    //alert("CalculateAmount");
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    // alert("CalculateAmount\n"+rate);
    console.log("CacluateAmount Method:" + rate);
    if ($('#radio1').prop("checked")) {
        // alert("in");
        rate = $("#rate").val();
        hours = $("#hours").val();
        console.log("Rate:" + rate + "\n" + "Hours:" + hours);
        calculatedValue = rate * hours;
        console.log("Calculated value:" + calculatedValue);
        amount.value = calculatedValue.toFixed(2);
        //alert(amount.value);
        $.mobile.loading('hide');
    }
    $.mobile.loading('hide');
}

function isDate(txtDate) {
    var currVal = txtDate;
    if (currVal == '')
        return false;

    var rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
        return false;

    dtMonth = dtArray[3];
    dtDay = dtArray[5];
    dtYear = dtArray[1];

    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }
    return true;
}

function loadContract(eid, contractid, job, taskcode) {
    if (checkConnection()) {
        //$('body').addClass('ui-loading');
        var getEmployeeTestCall = $.post(window.localStorage.getItem("url") + "/get_contracts", {
            user_id: eid
        }, "json");
        getEmployeeTestCall.done(function(data) {
            obj = JSON.parse(data);
            $("#contract option").remove();

            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#contract").append(listItem);
                $("#contract").selectmenu('refresh');
            } else {
                var listItem = "";

                var selected = "";
                listItem = "<option value='Select One'>Select One</option>";
                $.each(obj, function(index, item) {
                    selected = "";
                    if (item.contract == contractid) {

                        selected = "selected='selected'";
                    }
                    listItem += "<option value='" + item.contract + "' " + selected + ">" + item.contract + "</option>";


                });

                //console.log(listItem);
                $("#contract").append(listItem);
                $("#contract").selectmenu('refresh');
                if ((window.localStorage.getItem("user_type") == "hrms_normal") || (window.localStorage.getItem("user_type") == "legal_normal"))

                    loadJobs(window.localStorage.getItem("user_id"), $('#contract').val(), job, taskcode);
                else
                    loadJobs($('#emplyee').val(), $('#contract').val(), job, taskcode);
            }
            //			onEditAction();		
            //			$('body').removeClass('ui-loading');

        });
        getEmployeeTestCall.fail(function() {
            $('body').removeClass('ui-loading');
            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");			
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
}

function loadJobs(eid, matter, jobid, taskcode) {
    var selectedEmployeeID = eid;
    var selectedContract = matter;
    console.log("selectedEmployeeID" + selectedEmployeeID + "selectedContract" + selectedContract);
    //	if(contractTemp ==0 && (window.localStorage.getItem("option") == 'edit')){
    //		contractTemp++;
    //	}

    if (checkConnection()) {
        //$.mobile.showPageLoadingMsg();
        if ((window.localStorage.getItem("user_type") == "hrms_admin") || window.localStorage.getItem("user_type") == "legal_admin") {

            var getJobNumberCall = $.post(window.localStorage.getItem("url") + "/get_job_numbers", {
                user_id: selectedEmployeeID,
                contract: selectedContract
            }, "json");
        } else {

            var getJobNumberCall = $.post(window.localStorage.getItem("url") + "/get_job_numbers", {
                user_id: selectedEmployeeID,
                contract: selectedContract
            }, "json");
        }
        getJobNumberCall.done(function(data) {
            obj = JSON.parse(data);
            $("#jobNumber option").remove();
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#jobNumber").append(listItem);
                $("#jobNumber").selectmenu('refresh');
            } else {
                var listItem = "";

                var selected = "";
                listItem = "<option value='Select One'>Select One</option>";
                $.each(obj, function(indexid, item) {
                    selected = "";
                    if (item.jobnumber == jobid) {

                        selected = "selected='selected'";
                    }
                    listItem += "<option value='" + item.jobnumber + "' " + selected + ">" + item.jobnumber + "</option>";
                });

                $("#jobNumber").append(listItem);
                $("#jobNumber option:last").remove();
                $("#jobNumber").selectmenu('refresh');
                loadCode(jobid, taskcode)
            }

            //$.mobile.hidePageLoadingMsg();
        });
        getJobNumberCall.fail(function() {
            //	$.mobile.hidePageLoadingMsg();
            $('body').removeClass('ui-loading');
            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }

}

function loadCode(jcode, taskcode) {
    //    var selected = index.options[index.selectedIndex].value;
    //	var rateInput = document.getElementById("rate");
    //	if(selected == 'Select One'){	    
    //		rateInput.value="";	   
    //	}else{    
    //		getRateMethod();		
    //	}
    //CalculateAmount();
    //console.log("Selected Item:"+selected);
    if (checkConnection()) {
        //$.mobile.showPageLoadingMsg();
        var taskCodeCall = $.post(window.localStorage.getItem("url") + "/get_task_codes", {
            jobcode: jcode
        }, "json");
        taskCodeCall.done(function(data) {
            //alert(JSON.stringify(data));
            obj = JSON.parse(data);
            $("#taskCode option").remove();
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#taskCode").append(listItem);
                $("#taskCode").selectmenu('refresh');
            } else {
                //console.log(data);
                var listItem = "";
                var selected = "";

                listItem = "<option value='Select One'>Select One</option>";
                $.each(obj, function(indexid, item) {

                    selected = "";
                    if (item.optionvalue == taskcode) {
                        selected = "selected='selected'";
                    }
                    listItem += "<option value='" + item.optionvalue + "' " + selected + ">" + item.optiontext + "</option>";
                });
                $("#taskCode").append(listItem);
                $("#taskCode").selectmenu('refresh');
            }
            //$.mobile.hidePageLoadingMsg();
        });
        taskCodeCall.fail(function() {
            //	$.mobile.hidePageLoadingMsg();
            $('body').removeClass('ui-loading');
            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
}

function editContract(eid) {

    if (checkConnection()) {
        //		//$('body').addClass('ui-loading');
        var getEmployeeTestCall = $.post(window.localStorage.getItem("url") + "/get_contracts", {
            user_id: eid
        }, "json");
        getEmployeeTestCall.done(function(data) {
            obj = JSON.parse(data);
            $("#contract option").remove();
            console.log("test", obj);
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#contract").append(listItem);
                $("#contract").selectmenu('refresh');
                $.mobile.loading('hide');

            } else {
                console.log(data);

                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $.each(obj, function(indexid, item) {
                    listItem += "<option value='" + item.contract + "'>" + item.contract + "</option>";
                });
                //console.log(listItem);
                $("#contract").append(listItem);
                $("#contract").selectmenu('refresh');
                $.mobile.loading('hide');

            }
            //			onEditAction();		
            //			$('body').removeClass('ui-loading');
        });
        getEmployeeTestCall.fail(function() {
            //$('body').removeClass('ui-loading');


            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    } else {

        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }
}

function jobNumbers(selectedEmployeeID, selectedContract) {

    if (checkConnection()) {
        //$.mobile.showPageLoadingMsg();
        if ((window.localStorage.getItem("user_type") == "hrms_admin") || window.localStorage.getItem("user_type") == "legal_admin") {
            var getJobNumberCall = $.post(window.localStorage.getItem("url") + "/get_job_numbers", {
                user_id: selectedEmployeeID,
                contract: selectedContract
            }, "json");
        } else {
            var getJobNumberCall = $.post(window.localStorage.getItem("url") + "/get_job_numbers", {
                user_id: window.localStorage.getItem("user_id"),
                contract: selectedContract
            }, "json");

        }
        getJobNumberCall.done(function(data) {
            obj = JSON.parse(data);
            $("#jobNumber option").remove();
            if (obj.msg == 'Failure') {

                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#jobNumber").append(listItem);
                $("#jobNumber").selectmenu('refresh');
                $.mobile.loading('hide');
            } else {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $.each(obj, function(indexid, item) {
                    listItem += "<option value='" + item.jobnumber + "'>" + item.jobnumber + "</option>";
                });

                $("#jobNumber").append(listItem);
                $("#jobNumber option:last").remove();
                $("#jobNumber").selectmenu('refresh');
                $.mobile.loading('hide');
            }
            //$.mobile.hidePageLoadingMsg();
        });
        getJobNumberCall.fail(function() {
            //$.mobile.hidePageLoadingMsg();

            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    } else {

        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }
}
