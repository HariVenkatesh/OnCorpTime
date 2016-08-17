function onBackConfirmSuccess(buttonIndex) {
    if (buttonIndex == 1) {
        window.history.back();

    } else {
        console.log("Clicked No");
    }

}

function changer() {

    navigator.notification.confirm(
        'Are you sure you want to cancel the changes?',
        onBackConfirmSuccess,
        'Navigating Back', ['Yes', 'Cancel']
    );
}

$(".backer").tap(changer);
