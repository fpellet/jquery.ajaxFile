module AjaxFileJQuery {
    var convertAjaxFilePromiseToDeferred = (promise: IAjaxFilePromise, queryOption: IJqueryOption, option: IOption): JQueryDeferred<any> => {
        var deferred = $.Deferred();

        var eventTrigger = JQueryEventTrigger;

        eventTrigger.send(option, generateJqueryXHR(null, queryOption, option, promise));

        promise.then((result: IAjaxFileResult) => {
            var xhr = generateJqueryXHR(result, queryOption, option, promise);
            deferred.resolve(result.data, result.status && result.status.text, xhr);
            eventTrigger.success(option, xhr);
        }).fail((result: IAjaxFileResult) => {
                var xhr = generateJqueryXHR(result, queryOption, option, promise);
                deferred.reject(xhr, result.status && result.status.text, result.error);
                eventTrigger.error(option, xhr, result.error);
            });

        return deferred;
    };

    var generateOption = (jqueryOption: IJqueryOption): IOption => {
        var option = convertJqueryOptionToOption(jqueryOption);
        var defaultSettings = convertJqueryOptionToOption($.ajaxSettings);
        return $.extend(true, {}, defaultSettings, defaultOption, option);
    };

    $.fn.ajaxWithFile = (jqueryOption: IJqueryOption): JQueryDeferred<any> => {
        var option = generateOption(jqueryOption);

        var result = AjaxFile.send(option);

        return convertAjaxFilePromiseToDeferred(result, jqueryOption, option);
    }
}