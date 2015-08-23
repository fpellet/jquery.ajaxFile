namespace AjaxFile {
    'use strict';

    export function send(option: IOption): IAjaxFilePromise {
        option = mergeWithDefaultOption(option);

        const request = new Request(option);
        request.initialize();
        return request.submit();
    }
}
