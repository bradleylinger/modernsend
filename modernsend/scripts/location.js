(function (global) {
    var map,
        geocoder,
        LocationViewModel,
        app = global.app = global.app || {};

    LocationViewModel = kendo.data.ObservableObject.extend({
              

        _lastMarker: null,
        _isLoading: false,
        address: "",
        isGoogleMapsInitialized: false,

        onNavigateHome: function () {
            var that = this,
                pin;

            that._isLoading = true;
            that.toggleLoading();

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    pin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.panTo(pin);
                    that._putMarker(pin);
					
                     $("#map-address").val(position.coords.latitude + "," + position.coords.longitude);
                    that._isLoading = false;
                    that.toggleLoading();
                },
                function (error) {
                    //default map coordinates
                    pin = new google.maps.LatLng(43.459336, -80.462494);
                    map.panTo(pin);
                     $("#map-address").val("43.459336" + "," + "-80.462494");

                    that._isLoading = false;
                    that.toggleLoading();

                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function () { }, "Location failed", 'OK');
                },
                {
                    timeout: 30000,
                    enableHighAccuracy: true
                }
            );
        },
        
        

        onSearchAddress: function () {
            var that = this;

            geocoder.geocode(
                {
                    'address': that.get("address")
                },
                function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        navigator.notification.alert("Unable to find address.",
                            function () { }, "Search failed", 'OK');

                        return;
                    }

                    map.panTo(results[0].geometry.location);
                    that._putMarker(results[0].geometry.location);
                    
                     //$("#map-address").val(results[0].geometry.location.k + "," + results[0].geometry.location.B);

                });
        },

        toggleLoading: function () {
            if (this._isLoading) {
                kendo.mobile.application.showLoading();
            } else {
                kendo.mobile.application.hideLoading();
            }
        },

        _putMarker: function (position) {
            var that = this;

            if (that._lastMarker !== null && that._lastMarker !== undefined) {
                if(that._lastMarker.setMap != null)
                {
                	that._lastMarker.setMap(null);
                }
            }

            that._lastMarker = new google.maps.Marker({
                map: map,
                position: position
            });
            
            
            
        },
        toggleProvider: function(index) {
            var that = this;

            that._isLoading = true;
            that.toggleLoading();
            
            var provider = "";
            if($("#map-address").val() == "")
                return;
            if(index == 0)
                provider = "FedEx";
            else if(index == 1)
                provider = "UPS";
            else
                provider = "USPS";
            
            var  dataSource = new kendo.data.DataSource({
                serverFiltering: true,
                transport      : {
                    read: {
                        type       : "GET",
                        url        : "http://minlarkapi.aliasmedia.com/api/Dropoff/Get" + provider + "Locations?address=" + $("#map-address").val(),
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
                     requestEnd: function (e) {
                        
                         app.locationService.viewModel.initializeNewMap();

                         var locationValues = $.parseJSON(e.response.Data);

                        $.each(locationValues.Locations, function() {
                         	position = new google.maps.LatLng(this.Latitude, this.Longitude);
                            that._lastMarker = new google.maps.Marker({
                                map: map,
                              url: 'maps://?q=dallas',

                                position: position
                            });
                        });
                         
                       position = new google.maps.LatLng(locationValues.ValidatedSearchAddress.Latitude, locationValues.ValidatedSearchAddress.Longitude);
                        map.panTo(position);
						$("#map-address").val(locationValues.ValidatedSearchAddress.FormattedAddress)
            },
                type           : "json",
                parameterMap   : function (options) {
                    return JSON.stringify(options);
                }
            });
            
            dataSource.read();
            
            that._isLoading = false;
           that.toggleLoading();
		},
        initializeNewMap: function() {
            var mapOptions;

            if (typeof google === "undefined") {
                return;
            }
            
            var zoom = 15;
            if(map != undefined)
                zoom = map.zoom;

            app.locationService.viewModel.set("isGoogleMapsInitialized", true);

            mapOptions = {
                zoom: zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },

                mapTypeControl: false,
                streetViewControl: false
            };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            geocoder = new google.maps.Geocoder();
        }
    });
    
    _private = {
    	
    };
    
   

    app.locationService = {
        initLocation: function () {
            
            app.locationService.viewModel.initializeNewMap();
            
            app.locationService.viewModel.onNavigateHome.apply(app.locationService.viewModel, []);
            
            
			

			$("#btnProviderToggle").data("kendoMobileButtonGroup")
			.bind("select", function(e) {
				app.locationService.viewModel.toggleProvider(e.sender.selectedIndex);
			});
		
        },

        show: function () {
            if (!app.locationService.viewModel.get("isGoogleMapsInitialized")) {
                return;
            }

            //resize the map in case the orientation has been changed while showing other tab
            google.maps.event.trigger(map, "resize");
        },

        hide: function () {
            //hide loading mask if user changed the tab as it is only relevant to location tab
            kendo.mobile.application.hideLoading();
        },
        
        	

        viewModel: new LocationViewModel()
    };
}
)(window);