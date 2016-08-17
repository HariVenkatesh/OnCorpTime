$(function() {
    $('body').append("<div class='ui-loader-background'> </div>");
});
$("#login-page").on("pagebeforeshow", function(event) { // alert(localStorage.getItem("colortheme"));

    var fileref = document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", "css/" + localStorage.getItem("colortheme") + ".css");
    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
    //                      alert(window.localStorage.getItem("url")+"/get_logo");
    //                      var logo=document.getElementsByClassName("logo");
    //                      logo.src=window.localStorage.getItem("url")+"/get_logo";

});
$("#login-page").ready(function() {
    if (localStorage.getItem('sname') !== null && localStorage.getItem('spass') !== null) {
        if ((localStorage.getItem('sname').length > 0) && (localStorage.getItem('spass').length > 0)) {
            $.mobile.changePage("TempScreen.html", {
                transition: "slide"
            });
            $("#user_name").val(localStorage.getItem('sname'));
            $("#password").val(localStorage.getItem('spass'));
            $("#remCheck").attr("checked", "true");

        } else console.log("Not Remembered");
    }

});
//Network check method
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

//onClick 'Login' button
function loginClick() {
    var username = $("#user_name").val();
    var password = $("#password").val();
    var ResponseArray = [];
    username = jQuery.trim(username);
    password = jQuery.trim(password);
    if (username == "" && password == "") {
        navigator.notification.alert("Enter Username and Password.", onCallback, "Message", "OK");
    } else if (username == "" && password != "") {
        navigator.notification.alert("Please enter Username.", onCallback, "Message", "OK");
    } else if (username != "" && password == "") {
        navigator.notification.alert("Please enter Password.", onCallback, "Message", "OK");
    } else {
        $.mobile.loading('show', {
            text: 'Loading..',
            textVisible: true,
            theme: 'a',
            html: ""
        });

        if (checkConnection()) {
            var serviceCall = $.post(window.localStorage.getItem("url") + "/signin", {
                username: $("#user_name").val(),
                password: $("#password").val()
            }, "json");
            serviceCall.done(function(data) {
                obj = JSON.parse(data);
                if (obj.user_id == undefined) {
                    $.mobile.loading('hide');
                    navigator.notification.alert("Invalid credentials.", onCallback, "Message", "OK");
                } else {
                    if ($("#remCheck").is(":checked")) {
                        localStorage.setItem('sname', $("#user_name").val());
                        localStorage.setItem('spass', $("#password").val());
                    } else {
                        localStorage.setItem('sname', '');
                        localStorage.setItem('spass', '');
                    }
                    console.log("Data Loaded: " + obj.user_id + "/n ms:" + obj.msg);
                    localStorage.setItem('Modules', JSON.stringify(obj.Modules));
                    localStorage.setItem('Permissions', JSON.stringify(obj.permissions));
                    // alert(JSON.stringify(obj.Modules));
                    console.log(JSON.stringify(obj.permissions));
                    // if(obj.Modules.Bill===1) $(".billsli").css({"visibility":"hidden"});
                    localStorage.setItem('suname', $("#user_name").val());
                    localStorage.setItem('supass', $("#password").val());
                    window.localStorage.setItem("emptype", obj.employeetype);
                    //  alert(obj.user_id);
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
                    //$.mobile.changePage("managebills.html", { transition:"slide" });
                    $.mobile.loading('hide');
                    $.mobile.changePage("TempScreen.html", {
                        transition: "slide"
                    });

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
    }
}

function onCallback() {
    console.log("alert cancellled.");
}
