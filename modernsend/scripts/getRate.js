(function (global) {
    var GetRateViewModel,
        app = global.app = global.app || {};

    	GetRateViewModel = kendo.data.ObservableObject.extend({
            
  
        	onGetRate:  function () {
                    

          var validator = $('input', "#rateForm").kendoValidator().data("kendoValidator"),
                    status = $(".status");
            
                        if (validator.validate()) {
                            status.text("")
                                .removeClass("invalid")
                                .addClass("valid");
                        } else {
                            status.text("")
                                .removeClass("valid")
                                .addClass("invalid");
                            return;
                        }
           

            var rates = new kendo.data.DataSource({
                serverFiltering: true,
                transport      : {
                    read: {
                        type       : "GET",
                        url        : "http://minlarkapi.aliasmedia.com/api/Rate/GetRates?To=" + $("#to").val() +"&From=" + $("#from").val() + "&Weight=" + $("#txtWeight").val() + "&Length=" + $("#txtLength").val() + "&Height=" + $("#txtHeight").val() + "&Width=" + $("#txtWidth").val(),
                        contentType: "application/json; charset=utf-8",
                        dataType   : "json",
                        error      : function (xhr, ajaxOptions, thrownError) {
                            alert("error " + xhr.responseText);
                        }
                    }
                },
                schema         : {
                    total: function (data) {
                            return data.Count;
                        }, 
                     data: function (data) {
                    return data.Data;
                }
                },
                
                parameterMap   : function (options) {
                    return JSON.stringify(options);
                }
            });
            
              

            $("#rateListView").kendoMobileListView({
                
                dataSource: rates,
                template: $("#rate-list-template").text()
            });


        }
        
        

    });
 
    app.getrateService = {
        viewModel: new GetRateViewModel()
    };
})(window);