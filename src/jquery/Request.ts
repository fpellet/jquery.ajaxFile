namespace AjaxFileJQuery {
    'use strict';

    export function generateJqueryXHR<T>(result: IAjaxFileResult<T>, queryOption: IJQueryOption, option: IOption, promise: IAjaxFilePromise<T>): IJQueryXHR {
        result = result || {};
        const status = result.status;
        return {
            readyState: 0,
            status: (status && status.code) || 0,
            statusText: (status && status.text) || 'n/a',
            responseXML: option.desiredResponseDataType === DataType.Xml ? result.data : null,
            responseText: option.desiredResponseDataType === DataType.Text ? result.data : null,

            abort: (): void => { promise.abord(); },

            setRequestHeader: (): void => { throw 'not supported'; },
            getAllResponseHeaders: (): string => { return ''; },
            getResponseHeader: (header: string): string => header.toLowerCase() === 'content-type' ? queryOption.dataType : undefined
        };
    };
}
