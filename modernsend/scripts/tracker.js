(function (global) {
    var TrackerViewModel,
        app = global.app = global.app || {};

    TrackerViewModel = kendo.data.ObservableObject.extend({

        init: function () {
            var that = this;

            kendo.data.ObservableObject.fn.init.apply(that, []);
            
      
        }
    });

    app.trackerService = {
        viewModel: new TrackerViewModel()
    };
})(window);