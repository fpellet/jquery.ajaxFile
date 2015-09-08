namespace AjaxFileJQuery {
    'use strict';

    function convertAjaxFilePromiseToDeferred<T>(promise: IAjaxFilePromise<T>, queryOption: IJQueryOption, option: IOption): JQueryDeferred<T> {
        const deferred = $.Deferred();

        const eventTrigger = JQueryEventTrigger;

        eventTrigger.send(option, generateJqueryXHR(null, queryOption, option, promise));

        promise.then((result: IAjaxFileResult<T>) => {
            const xhr = generateJqueryXHR(result, queryOption, option, promise);
            deferred.resolve(result.data, result.status && result.status.text, xhr);
            eventTrigger.success(option, xhr);
        }).fail((result: IAjaxFileResult<T>) => {
            const xhr = generateJqueryXHR(result, queryOption, option, promise);
            deferred.reject(xhr, result.status && result.status.text, result.error);
            eventTrigger.error(option, xhr, result.error);
        });

        if (queryOption.error) {
            deferred.fail(queryOption.error);
        }

        if (queryOption.success) {
            deferred.done(queryOption.success);
        }

        if (queryOption.complete) {
            deferred.always(queryOption.complete);
        }

        return deferred;
    };

    function generateOption(jqueryOption: IJQueryOption): IOption {
        const option = convertJqueryOptionToOption(jqueryOption);
        const defaultSettings = convertJqueryOptionToOption($.ajaxSettings);
        return $.extend(true, {}, defaultSettings, defaultOption, option);
    };

    $.fn.ajaxWithFile = (jqueryOption: IJQueryOption): JQueryDeferred<any> => {
        const option = generateOption(jqueryOption);

        const result = AjaxFile.send(option);

        return convertAjaxFilePromiseToDeferred(result, jqueryOption, option);
    };
}
