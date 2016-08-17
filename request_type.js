$("#requesttype_page").ready(function() {
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    moduleRevealer();    
    $("#category_dropdown option").remove();
    $("#request_dropdown option").remove();
    getRequestType();
    var listItemContract = "";
    listItemContract = "<option value='Select One'>Select One</option>";
    //To Modify Labels
    if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
        $("#re_Matter").html("Contract <span class='mandatory'>*</span>");
        listItemContract = listItemContract + "<option value='Contract'>Contract</option>";
        // $.mobile.loading( 'hide');
    } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {
        $("#re_Matter").html("Matter <span class='mandatory'>*</span>");
        listItemContract = listItemContract + "<option value='Matter'>Matter</option>";
    }
    listItemContract = listItemContract + "<option value='YTD'>YTD</option>";
    listItemContract = listItemContract + "<option value='MTD'>MTD</option>";
    $("#category_dropdown").append(listItemContract);
    document.getElementById("matter_dropdown").style.display = "none";
    //$.mobile.loading( 'hide');
});

function checkConnection() {
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
    if (states[networkState] == 'No network connection') {
        return false;
    } else {
        return true;
    }
}

function getRequestType() {
    if (checkConnection()) {
        //$('body').addClass('ui-loading');
        var getMatterRequest = $.post(window.localStorage.getItem("url") + "/report_request_type", "json");
        getMatterRequest.done(function(data) {
            obj = JSON.parse(data);
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $("#request_dropdown").append(listItem);
                $("#request_dropdown").selectmenu('refresh');
            } else {
                console.log(data);
                var listItem = "";
                listItem = "<option value='Select One'>Select One</option>";
                $.each(obj, function(indexid, item) {
                    listItem += "<option value='" + item.id + "'>" + item.Request_name + "</option>";
                });
                console.log(listItem);
                $("#request_dropdown").append(listItem);
                $("#request_dropdown option:last").remove();
                $("#request_dropdown").selectmenu('refresh');
            }
            $.mobile.loading('hide');
            //$('body').removeClass('ui-loading');
        });
        getMatterRequest.fail(function() {
            //$('body').removeClass('ui-loading');
            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }
}



function typeChange() {
    console.log("typeChange");
    var selectedType = $("#category_dropdown").val();
    console.log("Selected Type" + selectedType);
    if (selectedType == 'Matter' || selectedType == 'Contract') {
        document.getElementById("matter_dropdown").style.display = "";
        $("#matter option").remove();
        getMatter();
    } else {
        document.getElementById("matter_dropdown").style.display = "none";
    }
}

function getMatter() {
    if (checkConnection()) {
        //$('body').addClass('ui-loading');
        var getMatterRequest = $.post(window.localStorage.getItem("url") + "/get_contracts", {
            user_id: window.localStorage.getItem("user_id")
        }, "json");
        getMatterRequest.done(function(data) {
            obj = JSON.parse(data);
            if (obj.msg == 'Failure') {
                var listItem = "";
                listItem = "<option value='-1'>All</option>";
                $("#matter").append(listItem);
                $("#matter").selectmenu('refresh');
                $.mobile.loading('hide');
            } else {
                console.log(data);
                var listItem = "";
                listItem = "<option value='-1'>All</option>";
                $.each(obj, function(indexid, item) {
                    listItem += "<option value='" + item.contract + "'>" + item.contract + "</option>";
                });
                console.log(listItem);
                $("#matter").append(listItem);
                $("#matter").selectmenu('refresh');
            }
            //$('body').removeClass('ui-loading');
            $.mobile.loading('hide');
        });
        getMatterRequest.fail(function() {
            //	$('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }
}

function saveRequest() {


    if ($("#request_dropdown").val() == 'Select One') {
        navigator.notification.alert("Please select the Request Type.", onCallback, "Message", "OK");
    } else if ($("#category_dropdown").val() == 'Select One') {
        navigator.notification.alert("Please select the Category.", onCallback, "Message", "OK");
    } else {
        var selectedMatter = '';
        if ($("#matter_dropdown").css('display') == 'block') {
            //navigator.notification.alert("Successfully Saved.",onSuccessCallback,"Message","Ok");			
            selectedMatter = $("#matter").val();
        } else {
            //navigator.notification.alert("Successfully Saved Without Matter.",onSuccessCallback,"Message","Ok");
            selectedMatter = '';
        }
        if (checkConnection()) {
            $.mobile.loading('show', {
                text: 'Loading..',
                textVisible: true,
                theme: 'a',
                html: ""
            });
            //$('body').addClass('ui-loading');
            var serviceCall = $.post(window.localStorage.getItem("url") + "/request_type", {
                employeeid: window.localStorage.getItem("user_id"),
                requesttype: $("#request_dropdown").val(),
                reportname: $('#request_dropdown option:selected').text(),
                category: $("#category_dropdown").val(),
                matterid: selectedMatter
            }, "json");
            serviceCall.done(function(data) {
                obj = JSON.parse(data);
                if (obj.msg == 'Failure') {
                    //$('body').removeClass('ui-loading');
                    $.mobile.loading('hide');
                } else {
                    navigator.notification.alert("Report has been emailed to you.", onSuccessCallback, "Message", "OK");
                    $.mobile.loading('hide');
                    $.mobile.changePage("reports.html", {
                        transition: "reverse"
                    });
                    //$('body').removeClass('ui-loading');
                }
            });
            serviceCall.fail(function() {
                //$('body').removeClass('ui-loading');
                // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
                $.mobile.loading('hide');
            });
        } else {
            navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
            $.mobile.loading('hide');
        }


    }

}

function closeWindowMethod() {
    console.log("closewindow called");
    navigator.notification.confirm("Are you sure you want to cancel the changes?", onConfirmCancelCallback, "Message", ["OK", "Cancel"]);
}

function onConfirmCancelCallback(buttonIndex) {
    if (buttonIndex == 1) {
        $.mobile.changePage("reports.html", {
            transition: "none"
        });
    } else if (buttonIndex == 2) {
        console.log("alert cancelled");
    }
}

function onCallback() {
    console.log("Callback.");
}

function onSuccessCallback() {
    //$.mobile.changePage("TempScreen.html", { transition:"slide" }); 
    document.getElementById("matter_dropdown").style.display = "none";
    $("#request_dropdown").val('Select One').change();
    $("#category_dropdown").val('Select One').change();
}
