
$(function () {
    

     showError = function (message, error) {
    console.log(message, error);
    try {
        var errorMessage = message + (error === undefined ? "" : "\n" + error.status + ": " + error.statusText);
        $("#error-view .error-header").show();
        $("#error-view .message").text(errorMessage);
        $("#error-view").show().data().kendoMobileModalView.open();
    } catch (e) {
        console.log(e);
    }
};
    
        closeError =  function () {
        $("#error-view").data().kendoMobileModalView.close();
            showRegistration();
    };
    
    isOnline = function () {
    return navigator.connection.type != Connection.NONE;
};
    
    onOpenBrowser =  function (url) {
if (kendo.support.mobileOS.android) {
        navigator.app.loadUrl(url, { openExternal:true } );
    }
    if (kendo.support.mobileOS.ios) {
        window.open(url, '_system');
    }
    };
            
        
    
        _onRequestStart = function (event) {
    if ( !isOnline() ) {
        showError("No network connection available. Please try again when online.");
        //event.preventDefault();
        return false;
    }
            else
            {
            return true;
            }
};
    
    showRegistration = function () {
     var userUid = localStorage.getItem('userUid');
            if(userUid == null)
            {
            $("#userRegistration").kendoMobileModalView("open");
        }
};

        });

