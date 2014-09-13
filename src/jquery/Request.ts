var generateJqueryXHR = (result: IAjaxFileResult, queryOption: IJqueryOption, option: IOption, promise: IAjaxFilePromise): IJQueryXHR => {
    result = result || { };
    var status = result.status;
    return {
        readyState: 0,
        status: (status && status.code) || 0,
        statusText: (status && status.text) || 'n/a',
        responseXML: option.desiredResponseDataType == DataType.Xml ? result.data : null,
        responseText: option.desiredResponseDataType == DataType.Text ? result.data : null,

        abort: () => { promise.abord(); },

        setRequestHeader: () => { throw 'not supported'; },
        getAllResponseHeaders: (): string => { return ''; },
        getResponseHeader: header => header.toLowerCase() == 'content-type' ? queryOption.dataType : undefined,
    };
}; 