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

var managebills_array = [];
$("#viewbills_page").ready(function() {
    moduleRevealer();
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    if ((window.localStorage.getItem("user_type") == "hrms_admin") || (window.localStorage.getItem("user_type") == "hrms_normal")) {
        $("#employee").text("Employee");
        $("#contract_label1").text("Contract");
        $("#jobnumber_label1").text("Job Number");
        $("#taskcode_label1").text("Task Code");
        //  $.mobile.loading( 'hide');
    } else if ((window.localStorage.getItem("user_type") == "legal_admin") || (window.localStorage.getItem("user_type") == "legal_normal")) {

        $("#employee").text("Timekeeper");
        $("#contract_label1").text("Matter");
        $("#jobnumber_label1").text("BillingType");
        $("#taskcode_label1").text("Item");
        // $.mobile.loading( 'hide');
    }

    managebills_array = [];

    if (checkConnection()) {
        //$('body').addClass('ui-loading');
        var serviceCall = $.post(window.localStorage.getItem("url") + "/view_bill", {
            odcid: window.localStorage.getItem("odcid")
        }, "json");
        serviceCall.done(function(data) {
            obj = JSON.parse(data);
            if (obj.msg == 'Failure') {
                //$('body').removeClass('ui-loading');
                navigator.notification.alert("No bills available.", onCallback, "Message", "OK");
                $.mobile.loading('hide');
            } else {
                var permissions = JSON.parse(localStorage.getItem('Permissions'));
                if (permissions.Bill.Edit) {
                    console.log("Edit Allowed");
                    if (obj.status == "Rejected" || obj.status == "Approved") {
                        $("#editBillBtn,#deleteBillBtn").addClass('ui-disabled');
                    } else console.log("We can Edit now");
                } else
                    $("#editBillBtn,#deleteBillBtn").addClass('ui-disabled');
                /*console.log(data);
                if (obj.status == "Rejected" || obj.status == "Approved") {
                    $("#editBillBtn,#deleteBillBtn").addClass("ui-disabled");
                } else
                    $("#editBillBtn,#deleteBillBtn").removeClass("ui-disabled");*/
                $("#statusvalue").text(obj.status);
                $("#timekeeper").text(obj.employee);
                $("#matter").text(obj.category);
                $("#billingtype").text(obj.jobnumber);

                $("#taskcode").text(obj.optiontext);
                $("#costcode").text(obj.costcode);
                $("#costcenter").text(obj.costcenter);
                $("#activity").text(obj.activity);
                $("#transactiondate").text(obj.transactiondate);
                $("#hours").text(obj.hours);
                $("#rate").text(obj.rate);
                $("#amount").text(obj.amount);
                $("#description").text(obj.description);
                //$('body').removeClass('ui-loading');
                //$.mobile.loading( 'hide');
            }
        });
        serviceCall.fail(function(textStatus) {
            //$('body').removeClass('ui-loading');
            //navigator.notification.alert(textStatus+" Couldn't connect to server.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }

});

function removeBill() {
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
    if (checkConnection()) {
        navigator.notification.confirm("Are you sure you want to delete this bill?.", onConfirmCallback, "Message", ["OK", "Cancel"]);

    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }
}

function onConfirmCallback(buttonIndex) {
    if (buttonIndex == 1) {
        //$('body').addClass('ui-loading');
        var serviceCall = $.post(window.localStorage.getItem("url") + "/delete_bill", {
            odcid: window.localStorage.getItem("odcid")
        }, "json");
        serviceCall.done(function(data) {
            obj = JSON.parse(data);
            if (obj.msg == 'Failure') {
                //$('body').removeClass('ui-loading');

                navigator.notification.alert("Please try again.", onCallback, "Message", "OK");
                $.mobile.loading('hide');
            } else {
                //$('body').removeClass('ui-loading');
                navigator.notification.alert("Deleted Successfully.", onSuccessCallback, "Message", "OK");
                $.mobile.loading('hide');
                $.mobile.changePage("bills.html", {
                    transition: "none"
                });
            }
        });
        serviceCall.fail(function() {
            //$('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    } else if (buttonIndex == 2) {
        $.mobile.loading('hide');
        console.log("alert cancelled");
    }
}

function onCallback() {
    console.log("Alert clicked");
}

function onSuccessCallback() {
    //$.mobile.changePage("managebills.html", { transition:"none" }); 
    console.log("Alert clicked");
}

function onWindowClose() {
    window.localStorage.setItem("key", "viewbills.html");
    window.localStorage.setItem("option", "edit");
    $.mobile.changePage("createbills_employee.html", {
        transition: "none"
    });
}

function BackToManageList() {
    $.mobile.changePage("managebills.html", {
        transition: "none"
    });
}
