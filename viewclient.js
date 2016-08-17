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

$("#viewclient_page").ready(function() {
    viewClient();

});

function viewClient() {
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        var serviceCall = $.post(window.localStorage.getItem("url") + "/view_client", {
            client_id: window.localStorage.getItem("c_id")
        }, "json");
        serviceCall.done(function(data) {
            var obj = JSON.parse(data);
            if (obj.msg == 'Failure') {
                $('body').removeClass('ui-loading');
                navigator.notification.alert("No Client available.", onCallback, "Message", "OK");

            } else {
                //              console.log(data);
                if (obj.maxid == window.localStorage.getItem("c_id")) {
                    $('[id="nextclient"]').addClass("ui-state-disabled");

                } else if (obj.minid == window.localStorage.getItem("c_id")) {
                    $('[id="prevclient"]').addClass("ui-state-disabled");

                }
                $("#clienttype").text(obj.clienttype);
                $("#fname").text(obj.FirstName);
                $("#lname").text(obj.LastName);
                $("#street").text(obj.Street);
                $("#city").text(obj.City);
                $("#state").text(obj.State);
                $("#zip").text(obj.Zip);
                $("#phone").text(obj.Phone);
                $("#email").text(obj.EMail);
                $("#paymenttype").text(obj.PaymentType);
                $("#categorytype").text(obj.Category);
                $("#matter").text(obj.matter);
                $("#installmentdate").text(obj.InstallmentEffectiveDate1);
                $("#amount").text(obj.InstallmentAmount);
                $("#statusdate").text(obj.StatusEffectiveDate1);
                window.localStorage.setItem("mnumber", obj.Phone);
                window.localStorage.setItem("clientmail", obj.EMail);
                $("#calltoclient").attr("href", "tel:" + window.localStorage.getItem("mnumber") + "");

                $('body').removeClass('ui-loading');
            }
        });
        serviceCall.fail(function() {
            $('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");                
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }

}

function onWindowClose() {
    window.localStorage.setItem("key", "manageclients.html");
    window.localStorage.setItem("option", "edit");
    $.mobile.changePage("addclient.html", {
        transition: "none"
    });
}

function BackToManageClient() {
    $.mobile.changePage("manageclients.html", {
        transition: "none"
    });
}



function onCallback() {

}

function delete_client() {

    navigator.notification.confirm("Are you sure you want to delete this client?", onConfirmCallback, "Message", ["OK", "Cancel"]);


}

function mailtoclient() {
    var to = window.localStorage.getItem("clientmail");
    cordova.plugins.email.isAvailable(
    function (isAvailable) {
    cordova.plugins.email.open({
    to:      [to],
    subject: 'Subject for Boms',
    body: '<h3><b>Hello,<br/><br/>Client Details.</b></h3><br><b>',
    isHtml:  true
});
        // alert('Service is not available') unless isAvailable; 
    }
);
    // window.plugin.email.open({
    //     to: [to],
    //     subject: 'Subject for Boms',
    //     body: '<h3><b>Hello,<br/><br/>Client Details.</b></h3><br><b>',
    //     isHtml: true
    // });

}

function onConfirmCallback(buttonIndex) {

    if (buttonIndex === 1) {
        if (checkConnection()) {
            $('body').addClass('ui-loading');
            var serviceCall = $.post(window.localStorage.getItem("url") + "/delete_client", {
                client_id: window.localStorage.getItem("c_id")
            }, "json");
            serviceCall.done(function(data) {
                obj = JSON.parse(data);
                if (obj.msg == 'Failure') {
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Please try again.", onCallback, "Message", "OK");
                } else {
                    console.log(data);
                    $('body').removeClass('ui-loading');
                    navigator.notification.alert("Deleted Successfully.", onSuccessCallback, "Message", "OK");
                    $.mobile.changePage("manageclients.html", {
                        transition: "none"
                    });
                }
            });
            serviceCall.fail(function() {
                $('body').removeClass('ui-loading');
                navigator.notification.alert("Couldn't connect to server.", onCallback, "Message", "OK");
            });
        }
    } else if (buttonIndex == 2) {
        console.log("alert cancelled");
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }
}


function get_prev_client() {
    $('[id="nextclient"]').removeClass("ui-state-disabled");
    $('body').addClass('ui-loading');
    var cid = window.localStorage.getItem("c_id");
    if (checkConnection()) {
        var serviceCall = $.post(window.localStorage.getItem("url") + "/get_prev_client", {
            client_id: cid
        }, "json");
        serviceCall.done(function(data) {
            obj = JSON.parse(data);
            if (obj.msg == 'Failure') {
                $('body').removeClass('ui-loading');
                navigator.notification.alert("Please try again.", onCallback, "Message", "OK");
            } else {
                if (obj[0].previd != null) {
                    window.localStorage.setItem("c_id", obj[0].previd);
                    $('body').removeClass('ui-loading');

                    viewClient();


                } else {
                    $('body').removeClass('ui-loading');
                    $('[id="prevclient"]').addClass("ui-state-disabled");
                }
            }
        });
        serviceCall.fail(function() {
            $('body').removeClass('ui-loading');
            navigator.notification.alert("Couldn't connect to server.", onCallback, "Message", "OK");
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }

}


function get_next_client() {
    $('[id="prevclient"]').removeClass("ui-state-disabled");
    $('body').addClass('ui-loading');
    var cid = window.localStorage.getItem("c_id");
    if (checkConnection()) {
        var serviceCall = $.post(window.localStorage.getItem("url") + "/get_next_client", {
            client_id: cid
        }, "json");
        serviceCall.done(function(data) {
            obj = JSON.parse(data);
            if (obj.msg == 'Failure') {
                $('body').removeClass('ui-loading');
                navigator.notification.alert("Please try again.", onCallback, "Message", "OK");
            } else {
                if (obj[0].nextid != null) {
                    window.localStorage.setItem("c_id", obj[0].nextid);
                    $('body').removeClass('ui-loading');

                    viewClient();


                } else {
                    $('body').removeClass('ui-loading');

                    $('[id="nextclient"]').addClass("ui-state-disabled");
                }

            }

        });
        serviceCall.fail(function() {
            $('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
    }

}
