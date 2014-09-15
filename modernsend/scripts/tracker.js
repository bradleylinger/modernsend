(function (global) {
    var TrackerViewModel,
        app = global.app = global.app || {};

    TrackerViewModel = kendo.data.ObservableObject.extend({
        trackerDataSource: null,

        init: function () {
            var that = this,
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);
            
      
                        var userUid = localStorage.getItem('userUid');

               dataSource = new kendo.data.DataSource({
                                   requestStart: _onRequestStart,

                serverFiltering: true,
                transport      : {
                    read: {
                        type       : "GET",
                        url        : "http://minlarkapi.aliasmedia.com/api/Tracking/GetTrackingNumberList?userUid=" + userUid +"",
                        contentType: "application/json; charset=utf-8",
                        dataType   : "json",
                        error      : function (xhr, ajaxOptions, thrownError) {
                            alert("error " + xhr.responseText);
                        }
                    }
                },
                schema         : {
                    data: function (data) {
                    return data.Data;
                }
                },
                type           : "json",
                parameterMap   : function (options) {
                    return JSON.stringify(options);
                }
            });
            

            that.set("trackerDataSource", dataSource);
        }
    });

    app.trackerService = {
        viewModel: new TrackerViewModel()
    };
})(window);