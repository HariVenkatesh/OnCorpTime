var matter = "";
var a;

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

function getmatter() {

    matter = $("#lname").val() + $("#fname").val().charAt(0) + '_' + $("#categorytype").val() + '_' + $("#paymenttype").val();
    $("#matter").val(matter);
}

function validate_fields() {
    var flag = 1;
    if ($("#clienttype").val() == "") {
        navigator.notification.alert("Please Enter Clienttype.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#fname").val() == "") {
        navigator.notification.alert("Please Enter Firstname.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#lname").val() == "") {

        navigator.notification.alert("Please Enter Lastname.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#street").val() == "") {
        navigator.notification.alert("Please Enter Street.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#city").val() == "") {
        navigator.notification.alert("Please Enter City.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#state").val() == "") {
        navigator.notification.alert("Please Select State.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#zip").val() == "") {
        navigator.notification.alert("Please Enter Zipcode.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#phone").val() == "") {
        navigator.notification.alert("Please Enter Phonenumber.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#email").val() == "") {
        navigator.notification.alert("Please Enter Email.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#paymenttype").val() == "") {
        navigator.notification.alert("Please Select Payment Type.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#categorytype").val() == "") {
        navigator.notification.alert("Please Select Category Type.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#installmentdate").val() == "") {
        navigator.notification.alert("Please Select Installmentdate.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#amount").val() == "") {
        navigator.notification.alert("Please Enter Amount.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    } else if ($("#statusdate").val() == "") {
        navigator.notification.alert("Please Select Status Effective Date.", onCallback, "Message", "OK");
        flag = 0;
        return false;
    }
    if (flag == 1) {
        if (validateEmail() && validateZipcode()) {
            return true;
        }
    }
    //       return true;
}

function Saveclients() {

    if (validate_fields()) {
        if (window.localStorage.getItem('option') == "edit") {

            updateclient();
        } else
        if (checkConnection()) {
            var createScheduleCall = $.post(window.localStorage.getItem("url") + "/create_client", {
                client_type: $("#clienttype").val(),
                first_name: $("#fname").val(),
                last_name: $("#lname").val(),
                street: $("#street").val(),
                city: $("#city").val(),
                state: $("#state").val(),
                zip: $("#zip").val(),
                phone: $("#phone").val(),
                email: $("#email").val(),
                payment_type: $("#paymenttype").val(),
                category: $("#categorytype").val(),
                matter: $("#matter").val(),
                installment_effective_date: $("#installmentdate").val(),
                installment_amount: $("#amount").val(),
                status_effective_date: $("#statusdate").val(),
            }, "json");
            createScheduleCall.done(function(data) {
                obj = JSON.parse(data);
                console.log(data);
                // $.mobile.hidePageLoadingMsg();
                if (obj.msg == "Matter already exists")
                    navigator.notification.alert("Matter already exists.", onCallback, "Message", "OK");
                else
                if (obj.msg == 'Success') {
                    navigator.notification.alert("New Client created successfully.", onCallback, "Message", "OK");
                    $.mobile.changePage("manageclients.html", {
                        transition: "none"
                    });;
                } else {
                    navigator.notification.alert("Unable to Create Client.", onCallback, "Message", "OK");
                }
            });
            createScheduleCall.fail(function() {
                // $.mobile.hidePageLoadingMsg();     
                navigator.notification.alert("Unable to Create Client.", onCallback, "Message", "OK");
            });
        } else {
            navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        }
    }

}

$("#addclient_page").ready(function() {
    loadAllClienttypes();
    $("#phone").mask("(999) 999-9999");
    if (window.localStorage.getItem("option") == 'edit') {
        $(".header-title").empty();
        $(".header-title").append("<h1 style='color:#ffffff;'>" + "Edit Client" + "</h1>");
        if (checkConnection()) {
            $('body').addClass('ui-loading');
            var serviceCall = $.post(window.localStorage.getItem("url") + "/view_client", {
                client_id: window.localStorage.getItem("c_id")
            }, "json");
            serviceCall.done(function(data) {
                obj = JSON.parse(data);
                if (obj.msg == 'Failure') {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("No Client available.", onCallback, "Message", "OK");
                } else {


                    $("#fname").val(obj.FirstName);
                    $("#lname").val(obj.LastName);
                    $("#street").val(obj.Street);
                    $("#city").val(obj.City);
                    $("#clienttype").val(obj.courthouse);
                    $('#clienttype option[value=' + obj.courthouse + ']').attr('selected', 'selected');
                    $('#clienttype').selectmenu('refresh', true);
                    //                          $('#clienttype').selectmenu('refresh',true);
                    //                         alert($('#clienttype').selectmenu('refresh',true));
                    $("#state").val(obj.State);
                    $('#state option[value=' + obj.State + ']').attr('selected', 'selected');
                    $('#state').selectmenu('refresh', true);
                    $("#zip").val(obj.Zip);
                    $("#phone").val(obj.Phone);
                    $("#email").val(obj.EMail);
                    $("#paymenttype").val(obj.PaymentType);
                    $('#paymenttype option[value=' + obj.PaymentType + ']').attr('selected', 'selected');
                    $('#paymenttype').selectmenu('refresh', true);
                    $("#categorytype").val(obj.Category);
                    $('#categorytype option[value=' + obj.Category + ']').attr('selected', 'selected');

                    $('#categorytype').selectmenu('refresh', true);
                    $("#matter").val(obj.matter);
                    //                             document.getElementById("installmentdate").=obj.InstallmentEffectiveDate;
                    //                         document.getElementById("installmentdate").value= obj.InstallmentEffectiveDate1;
                    //                         alert(obj.InstallmentEffectiveDate.substr(0,10));
                    $("#installmentdate").val(obj.InstallmentEffectiveDate.substr(0, 10));
                    $("#amount").val(obj.InstallmentAmount);
                    $("#statusdate").val(obj.StatusEffectiveDate.substr(0, 10));
                    $('body').removeClass('ui-loading');
                }
            });
            serviceCall.fail(function() {
                $('body').removeClass('ui-loading');
                //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");         
            });
        } else {
            navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        }

    } else {
        $(".header-title").empty();
        $(".header-title").append("<h1 style='color:#ffffff;'>" + "Create New Client" + "</h1>");

    }

});

function updateclient() {

    if (checkConnection()) {
        var createScheduleCall = $.post(window.localStorage.getItem("url") + "/update_client", {
            client_id: window.localStorage.getItem('c_id'),
            client_type: $("#clienttype").val(),
            first_name: $("#fname").val(),
            last_name: $("#lname").val(),
            street: $("#street").val(),
            city: $("#city").val(),
            state: $("#state").val(),
            zip: $("#zip").val(),
            phone: $("#phone").val(),
            email: $("#email").val(),
            payment_type: $("#paymenttype").val(),
            category: $("#categorytype").val(),
            matter: $("#matter").val(),
            installment_effective_date: $("#installmentdate").val(),
            installment_amount: $("#amount").val(),
            status_effective_date: $("#statusdate").val(),
        }, "json");
        createScheduleCall.done(function(data) {
            obj = JSON.parse(data);
            console.log(data);
            // $.mobile.hidePageLoadingMsg();
            if (obj.msg == 'Success') {
                navigator.notification.alert(" Updated successfully.", onCallback, "Message", "OK");
                window.localStorage.setItem("option", "");
                $.mobile.changePage(window.localStorage.getItem("key"), {
                    transition: "none"
                });

            } else {
                navigator.notification.alert(obj.msg, onCallback, "Message", "OK");
            }
        });
        createScheduleCall.fail(function() {
            $('body').removeClass('ui-loading');
            navigator.notification.alert("Unable to Create Client.", onCallback, "Message", "OK");
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }


}

function onCallback() {
    console.log("alert clieck");
}

function validateEmail() {
    var emailText = $("#email").val();
    var pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    if (pattern.test(emailText)) {
        return true;
    } else {
        navigator.notification.alert("Email Address is not Valid", onCallback, "Message", "OK");
        return false;
    }
}


function validateZipcode() {

    var zipcode = $("#zip").val();
    //   var pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    if (/^\d{5}$/.test(zipcode)) {
        return true;
    } else {
        navigator.notification.alert("Zip Code is not Valid", onCallback, "Message", "OK");
        return false;
    }
}

function closeWindowMethod() {
    console.log("closewindow called");
    navigator.notification.confirm("Are you sure you want to cancel the changes?", onConfirmCancelCallback, "Message", ["OK", "Cancel"]);
}

function onConfirmCancelCallback(buttonIndex) {
    if (buttonIndex == 1 && window.localStorage.getItem("option") == "edit") {
        var value = window.localStorage.getItem("key");
        window.localStorage.setItem("option", "");
        console.log("Session Storage:" + value);
        $.mobile.changePage("viewclient.html", {
            transition: "none"
        });
    } else if (buttonIndex == 1 && window.localStorage.getItem("option") == "") {
        var value = window.localStorage.getItem("key");
        window.localStorage.setItem("option", "");
        console.log("Session Storage:" + value);
        $.mobile.changePage("manageclients.html", {
            transition: "none"
        });
    } else if (buttonIndex == 2) {
        console.log("alert cancelled");
    }
}

function loadAllClienttypes() {

    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });

    if (checkConnection()) {

        var clientnameCall = $.post(window.localStorage.getItem("url") + "/get_client_types", "json");
        clientnameCall.done(function(data) {
            obj = JSON.parse(data);
            listItem = ""
            $.each(obj, function(indexid, item) {
                listItem += "<option value='" + item.id + "'>" + item.type + "</option>";
            });
            $("#clienttype").append(listItem);
            $("#clienttype").selectmenu('refresh');
            $.mobile.loading('hide');

            //$.mobile.hidePageLoadingMsg();
        });
        clientnameCall.fail(function() {
            //$.mobile.hidePageLoadingMsg();
            //navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }



}
