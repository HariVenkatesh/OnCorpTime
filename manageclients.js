var offset = 0;
var offset_submit = 0;
var limit_p = 50;
var issubmit = 0;
var flag = 0;
var total = 0;
var clients_array = [];
var search_array = [];

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
    if (states[networkState] === 'No network connection') {
        return false;
    } else {
        return true;
    }
}

$("#manageclient_page").ready(function() {
    window.localStorage.setItem("option", "");
    $("#categorytype").hide();
    $(".options").hide();
    loadAllClients();
    ListallClients();

});

function searchClient() {
    //    $("#categorytype").show();
    //     $("#categorytype").slideToggle();
    var o = $("#categorytype").is(":visible");
    var c = $("#categorytype").is(":hidden");
    if (o) {
        $("#manageclients").css("padding-top", "0%");
    } else {
        $("#manageclients").css("padding-top", "290px");
    }
    $("#categorytype").slideToggle();



}

function addClient() {
    $("#categorytype").hide();
    $.mobile.changePage("addclient.html", {
        transition: "none"
    });
}

function pagination_next() {
    $('[data-type ="search"]').val('');
    //    $.mobile.silentScroll( $("#manageclients").offset().top);
    $('[id="prevmatter"]').removeClass("ui-state-disabled");
    if (issubmit === 1) {
        offset_submit = offset_submit + limit_p;
        var t = flag * limit_p;

        if ((offset_submit === t) || (offset_submit >= total)) {
            $('[id="nextmatter"]').addClass("ui-state-disabled");
            SearchClients(1);

        } else {
            $('[id="nextmatter"]').removeClass("ui-state-disabled");
            SearchClients(0);
        }


    } else {
        issubmit = 0;
        offset = offset + limit_p;
        var t = flag * limit_p;
        if ((offset === t) || (offset >= total)) {

            $('[id="nextmatter"]').addClass("ui-state-disabled");
            ListallClients(1);
        } else {
            $('[id="nextmatter"]').removeClass("ui-state-disabled");
            ListallClients(0);
        }


    }
}

function pagination_prev() {
    $('[data-type="search"]').val('');
    //     $.mobile.silentScroll( $("#manageclients").offset().top);
    $('[id="nextmatter"]').removeClass("ui-state-disabled");

    if (issubmit === 1) {
        if (offset_submit != 0) {
            offset_submit = offset_submit - limit_p;

        } else
            offset_submit = 0;
        if (offset_submit <= 0) {
            $('[id="prevmatter"]').addClass("ui-state-disabled");
        } else {
            $('[id="prevmatter"]').removeClass("ui-state-disabled");

        }

        SearchClients();
    } else {

        issubmit = 0;
        if (offset != 0)
            offset = offset - limit_p;
        else
            offset = 0;

        if (offset <= 0) {

            $('[id="prevmatter"]').addClass("ui-state-disabled");
        } else {
            $('[id="prevmatter"]').removeClass("ui-state-disabled");
        }

        ListallClients();
    }
}

function ListallClients(b) {

    if (b != 1)
        $('[id="nextmatter"]').removeClass("ui-state-disabled");
    if (offset == 0)
        $('[id="prevmatter"]').addClass("ui-state-disabled");
    $("#filterarea").show();
    clients_array = [];
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        var serviceCall = $.post(window.localStorage.getItem("url") + "/list_all_clients", {
            offset: offset,
            limit: limit_p
        }, "json");
        serviceCall.done(function(data) {
            obj = JSON.parse(data);
            total = obj.totalcount;
            flag = Math.floor(total / limit_p);

            if (total <= limit_p || total === 0) {

                $('[id="nextmatter"]').addClass("ui-state-disabled");
                $('[id="prevmatter"]').addClass("ui-state-disabled");
            }
            if (obj.msg == 'Failure') {

                $('body').removeClass('ui-loading');
                $("#filterarea").hide();
                navigator.notification.alert("No Clients available.", onSuccessCallback, "Message", "OK");
            } else {
                $.each(obj, function(index, item) {
                    clients_array.push([item.id,
                        item.fullname,
                        item.email, item.phone, item.matter
                    ]);
                });
                var resultLists = '';
                // console.log("clients_array.length"+clients_array.length);        
                for (var limit = 0; limit < clients_array.length - 1; limit++) {
                    resultLists += '<li class="listItem" data-theme="d"  id=' + clients_array[limit][0] + '><a href="#"  data-transition="none"><p><font style="font-weight:bold">';
                    resultLists += '' + clients_array[limit][1] + "&nbsp;&nbsp;&nbsp;&nbsp;";
                    resultLists += '</font><br /><span style="color:blue;">';
                    resultLists += clients_array[limit][2] + "</span><br/>";
                    resultLists += "Mobile: " + clients_array[limit][3] + '<br>Matter: ' + clients_array[limit][4] + '</p></a>';
                    //          resultLists += '<li class="listItem" data-icon="false" data-theme="d" id='+clients_array[limit][0]+'><div class="ui-grid-a" ><div class="left-li ui-block-a">\
                    //                <a href="#"  data-transition="none" style="text-decoration:none;">'+clients_array[limit][1]+'</a>\
                    //                  <div class="right-li ui-block-b "></div><br>\
                    //                <a href="tel:"1234" class="ui-shadow ui-btn ui-corner-all ui-icon-phone ui-btn-icon-notext ui-btn-inline" style="background:orange !important;">Button</a>\
                    //                <a href="" onclick="sendmail()" class="ui-shadow ui-btn ui-corner-all ui-icon-mail ui-btn-icon-notext ui-btn-inline" style="background:orange !important;">Button</a>\
                    //            </div></div></li>';
                    //         
                }
                $("#listclient").empty();
                $("#listclient").append(resultLists);
                $("#listclient").trigger('create');
                $('#listclient').listview().listview('refresh');
                $('ul.jqm-custom-list-view').prev().find('input').keyup(function(e, d) {
                    console.log("Test input" + $(this).val());
                    var eltExists = false;
                    var elt_count = 0;
                    $('ul.jqm-custom-list-view li').each(function() {
                        if ($(this).css('display') != 'none') {
                            elt_count++;
                        }
                    });
                    console.log("Count value:" + elt_count);
                    if (elt_count === 0) {

                        navigator.notification.alert("No Clients available!.", onSuccessCallback, "Message", "OK");
                    }
                });
                $('body').removeClass('ui-loading');
            }
        });
        serviceCall.fail(function() {
            $('body').removeClass('ui-loading');
            // navigator.notification.alert("Couldn't connect to server.",onSuccessCallback,"Message","OK");       
        });

    } else {
        navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
    }

}

//List item click
$('#listclient').on('click', '.listItem', function() {
    var customer_id = $(this).attr('id');
    //                    var icon=$(this).jqmData("icon");
    //                    if(icon=='check'){
    //                    $(this).buttonMarkup({ icon: ""});
    //                    $(this).jqmData("icon", "");
    //                    $(".options").hide();
    //                    $(".pagination").show();
    //                    }
    //                    else{
    //                    $(".listItem").buttonMarkup({ icon: ""});
    //                    $(".listItem").jqmData("icon", "");
    //                    $(this).buttonMarkup({ icon: "check" , iconpos:"right",theme:"a"});
    //                    $(this).jqmData("icon", "check");
    //                    $(".pagination").hide();
    //                    $(".options").show();
    //                    }
    //                    $('#listclient').listview('refresh');
    window.localStorage.setItem("c_id", customer_id);


    $.mobile.changePage("viewclient.html", {
        transition: "none"
    }); //,false, true

});

function viewclient() {
    $.mobile.changePage("viewclient.html", {
        transition: "none"
    });
}

function mailtoclient() {
    var to = window.localStorage.getItem("clientmail");
    window.plugin.email.open({
        to: [to],
        subject: 'Subject for Boms',
        body: '<h3><b>Hello,<br/><br/>Client Details.</b></h3><br><b>',
        isHtml: true
    });

}


function SearchClients(a) {
    if (a != 1)
        $('[id="nextmatter"]').removeClass("ui-state-disabled");

    if (offset_submit === 0)
        $('[id="prevmatter1"]').addClass("ui-state-disabled");
    $("#filterarea").show();
    $.mobile.silentScroll($("#manageclients").offset().top);
    issubmit = 1;
    search_array = [];
    if (checkConnection()) {
        $('body').addClass('ui-loading');
        var searchcall = $.post(window.localStorage.getItem("url") + "/list_all_clients", {
            clientname: $("#clientname").val(),
            payment_type: $("#paymenttype").val(),
            category: $("#category_type").val(),
            offset: offset_submit,
            limit: limit_p
        }, "json");
        searchcall.done(function(data) {
            obj = JSON.parse(data);
            total = obj.totalcount;
            flag = Math.floor(total / limit_p);
            if (total <= limit_p || total === 0) {
                $('[id="nextmatter"]').addClass("ui-state-disabled");
                $('[id="prevmatter"]').addClass("ui-state-disabled");
            }
            if (obj.msg === 'Failure') {
                $('#listclient').listview().listview('refresh');

                $('body').removeClass('ui-loading');
                $("#filterarea").hide();
                navigator.notification.alert("No Clients available.", onSuccessCallback, "Message", "OK");
            } else {
                $.each(obj, function(index, item) {
                    search_array.push([item.id,
                        item.fullname,
                        item.email, item.phone, item.matter
                    ]);
                });
                var resultLists = '';
                console.log(search_array);
                console.log("search_array.length" + search_array.length);
                for (var limit = 0; limit < search_array.length - 1; limit++) {
                    resultLists += '<li class="listItem" data-theme="d" data-icon="false" id=' + search_array[limit][0] + '><a href="#"  data-transition="none"><p><font style="font-weight:bold">';
                    resultLists += search_array[limit][1] + "&nbsp;&nbsp;&nbsp;&nbsp;";
                    resultLists += '</font><br /><span style="color:blue;">';
                    resultLists += search_array[limit][2] + "</span></br>";
                    resultLists += "Mobile: " + clients_array[limit][3] + '<br>Matter: ' + clients_array[limit][4] + '</p></a>';
                }
                $("#listclient").empty();
                $("#listclient").append(resultLists);
                $("#listclient").trigger('create');
                $('#listclient').listview().listview('refresh');
                $('ul.jqm-custom-list-view').prev().find('input').keyup(function(e, d) {
                    console.log("Test input" + $(this).val());
                    var eltExists = false;
                    var elt_count = 0;
                    $('ul.jqm-custom-list-view li').each(function() {
                        if ($(this).css('display') != 'none') {
                            elt_count++;
                        }
                    });
                    console.log("Count value:" + elt_count);
                    if (elt_count === 0) {

                        navigator.notification.alert("No Clients available!.", onSuccessCallback, "Message", "OK");
                    }
                });
                $('body').removeClass('ui-loading');
            }
        });
        searchcall.fail(function() {
            $('body').removeClass('ui-loading');
            //navigator.notification.alert("Couldn't connect to server.",onSuccessCallback,"Message","OK");      
        });

    } else {
        navigator.notification.alert("Please check internet connection.", onSuccessCallback, "Message", "OK");
    }
    $("#listclient").empty();
    $("#listclient").append(resultLists);
    $("#listclient").trigger('create');
    $('#listclient').listview().listview('refresh');
    $("#categorytype").slideToggle();
    $('body').removeClass('ui-loading');
}


function onSuccessCallback() {
    console.log("alert cancellled.");
}
//Change the button color based on the dropdown changes
$(document).ready(function() {
    $("#categorytype").hide();
    $('.manageclient').change(function() {
        var isSelected = false;
        $('.manageclient').each(function() {
            console.log($(this).val());
            if (($(this).val() != '') && ($(this).val() != '')) {
                isSelected = isSelected || true;
            }
        });
        console.log(isSelected);
        //console.log($('.managebillsyear').val());
        if (isSelected) {
            $("#submit_btn").addClass("ui-btn-up-e").removeClass("ui-btn-up-c");
        } else {
            $("#submit_btn").removeClass("ui-btn-up-e").addClass("ui-btn-up-c");
        }
    });
});


function sendmail(to) {
    //    var to=to;
    //  window.plugin.email.open({
    //     to:[to],
    //     subject:'',
    //     body:'',
    //     isHtml:true
    // });

}

function loadAllClients() {
    $.mobile.loading('show', {
        text: 'Loading..',
        textVisible: true,
        theme: 'a',
        html: ""
    });

    if (checkConnection()) {

        var clientnameCall = $.post(window.localStorage.getItem("url") + "/get_clients", "json");
        clientnameCall.done(function(data) {
            obj = JSON.parse(data);
            listItem = ""
            $.each(obj, function(indexid, item) {
                listItem += "<option value='" + item.fullname + "'>" + item.fullname + "</option>";
            });

            $("#clientname").append(listItem);
            $("#clientname").selectmenu('refresh');
            $.mobile.loading('hide');

            //$.mobile.hidePageLoadingMsg();
        });
        clientnameCall.fail(function() {
            //$.mobile.hidePageLoadingMsg();
            // navigator.notification.alert("Couldn't connect to server.",onCallback,"Message","OK");
            $.mobile.loading('hide');
        });
    } else {
        navigator.notification.alert("Please check internet connection.", onCallback, "Message", "OK");
        $.mobile.loading('hide');
    }



}
