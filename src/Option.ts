/// <reference path="../libs/jquery.d.ts" />
/// <reference path="url.ts" />

interface IFileData {
    name: string;
    element: HTMLInputElement;
}

interface IAjaxFileOption {
    type?: string;
    url?: string;

    data?: any;
    files?: IFileData[];
    dataType?: string;

    timeout?: number;

    error? (jqXHR: JQueryXHR, textStatus: string, errorThrown: string): any;
    success? (data: any, textStatus: string, jqXHR: JQueryXHR): any;
    complete? (jqXHR: JQueryXHR, textStatus: string): any;

    global?: boolean;
}

var defaultOption: IAjaxFileOption = {
    data: {},
    files: [],
    dataType: "json",
    type: 'POST'
};

var mergeWithDefaultOption = (option: IAjaxFileOption): IAjaxFileOption => {
    option = $.extend(true, {}, $.ajaxSettings, defaultOption, option);

    if (!option.url) {
        option.url = getCurrentUrlWithoutHash();
    }

    return option;
};