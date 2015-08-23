$(function () {
    var api = function() {
        var sendFile = function (input, url) {
            return AjaxFile.send({
                method: "POST",
                url: url,
                desiredResponseDataType: AjaxFile.DataType.Json,
                files: [
                  { name: 'joeFile', element: input.getElement() }
                ],
                data: {
                    name: 'joe',
                    data: {
                        lastname: 'bob',
                        age: 5
                    },
                    list: [
                        { lastname: 'indien1', age: 1 },
                        { lastname: 'indien2', age: 2 }
                    ]
                }
            });
        };

        var sendFileWithJQuery = function (input, url) {
            return $.Deferred(function (defer) {
                $.fn.ajaxWithFile({
                    type: "POST",
                    url: url,
                    dataType: "json",
                    files: [
                        { name: 'joeFile', element: input.getElement() }
                    ],
                    success: function (json) {
                        defer.resolve({ data: json });
                    },
                    error: function (jqXhr, textStatus, errorThrown) {
                        var json = JSON.parse(jqXhr.responseText);
                        defer.reject({ data: json, error: errorThrown });
                    }
                });
            }).promise();
        };

        this.sendFileToWebApi = function (file) {
            return sendFile(file, "/api/file");
        };

        this.sendFileToWebApiWithError = function (file) {
            return sendFile(file, "/api/errorfile");
        };

        this.sendFileToWebApiWithJQuery = function (file) {
            return sendFileWithJQuery(file, "/api/file");
        };

        this.sendFileToNancy = function(file) {
            return sendFile(file, '/sendFile');
        };

        this.downloadFileToNancy = function (file) {
            return sendFile(file, '/downloadFile');
        };

        this.downloadFileToNancyWithError = function (file) {
            return sendFile(file, '/downloadFileWithError');
        };
    };

    var demoMainViewModel = function (api) {
        var rthis = this;

        rthis.selectedFile = ko.observable();
        rthis.result = ko.observable();
        rthis.errorMessages = ko.observableArray();

        var processRequest = function(methodeName) {
            api[methodeName](rthis.selectedFile()).done(function (result) {
                rthis.result(result.data);
                rthis.errorMessages([]);
                rthis.selectedFile(null);
            }).fail(function (errors) {
                rthis.result(null);
                rthis.errorMessages(errors.data || 'error');
            });
        };

        rthis.sendFileToWebApi = function () {
            processRequest('sendFileToWebApi');
        };

        rthis.sendFileToWebApiWithError = function () {
            processRequest('sendFileToWebApiWithError');
        };

        rthis.sendFileToWebApiWithJQuery = function () {
            processRequest('sendFileToWebApiWithJQuery');
        };

        rthis.sendFileToNancy = function () {
            processRequest('sendFileToNancy');
        };

        rthis.downloadFileToNancy = function () {
            processRequest('downloadFileToNancy');
        };

        rthis.downloadFileToNancyWithError = function () {
            processRequest('downloadFileToNancyWithError');
        };
    };

    var mainViewModel = new demoMainViewModel(new api());
    ko.applyBindings(mainViewModel);
});