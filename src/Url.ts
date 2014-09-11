/// <reference path="utils.ts" />
/// <reference path="../libs/jquery.d.ts" />

var getCurrentUrlWithoutHash = (): string => {
    var currentUrl = window.location.href;
    return (currentUrl.match(/^([^#]+)/) || [])[1];
};

var currentPageIsHttpsMode = (): boolean => urlIsHttpsMode(window.location.href);

var urlIsHttpsMode = (url: string): boolean => /^https/i.test(url || '');

interface IData {
    name: string;
    value: string;
}

var decodeUriParameter = (value: string) : string => {
    return decodeURIComponent(value.replace(/\+/g, ' '));
}

var extractParameters = (data: any): IData[]=> {
    if (!data || Object.keys(data).length == 0) {
        return [];
    }

    return map($.param(data).split('&'), (parameter) => {
        var element = parameter.split("=");
        return { name: decodeUriParameter(element[0]), value: decodeUriParameter(element[1]) };
    });
};