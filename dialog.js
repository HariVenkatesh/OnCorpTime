function timesheetdialog() {


    navigator.notification.confirm(
        'Do you want to Cancel  Timesheet?',
        onConfirm,
        'Timesheet Cancel', ['Yes', 'No']
    );

}

function onConfirm(buttonIndex) {
    if (buttonIndex == 1) {
        $.mobile.navigate("timesheet.html");
    } else if (buttonIndex == 2) {
        $.mobile.navigate("addtimesheet.html");
    }
}



function taskdialog() {

    navigator.notification.confirm(
        'Do you want to Cancel  Task?',
        onConfirmtask,
        'Task Cancel', ['Yes', 'No']
    );
}

function onConfirmtask(buttonIndex) {
    if (buttonIndex == 1) {
        $.mobile.navigate("tasks.html");
    } else if (buttonIndex == 2) {
        $.mobile.navigate("addTask.html");
    }
}
