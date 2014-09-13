/// <reference path="../libs/jquery.d.ts" />

module AjaxFile {
    export var send = (option: IOption): IAjaxFilePromise => {
        option = mergeWithDefaultOption(option);

        var request = new Request(option);
        request.initialize();
        return request.submit();
    }
}