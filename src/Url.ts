/// <reference path="utils.ts" />
var getCurrentUrlWithoutHash = (): string => {
    var currentUrl = window.location.href;
    return (currentUrl.match(/^([^#]+)/) || [])[1];
};

var currentPageIsHttpsMode = (): boolean => urlIsHttpsMode(window.location.href);

var urlIsHttpsMode = (url: string): boolean => /^https/i.test(url || '');

module JsonToPostDataConverter {
    export interface IData {
        name: string;
        value: string;
    }

    var pushParameters = (results: IData[], data: any, prefix?: string) => {
        if (!data) {
            return;
        }

        for (var propertyName in data) {
            var value = data[propertyName];
            if(!value) continue;

            pushParameterOfProperty(results, propertyName, data[propertyName], prefix);
        }
    };

    var pushParameterOfProperty = (results: IData[], propertyName: string, value: any, prefix?: string) => {
        var parameterName = prefix ? prefix + '[' + propertyName + ']' : propertyName;

        var type = Object.prototype.toString.call(value);

        if (type === '[object Array]') {
            value.forEach((item, index) => {
                pushParameters(results, item, parameterName + '[' + index + ']');
            });
            return;
        }

        if (type == '[object Object]') {
            pushParameters(results, value, parameterName);
            return;
        }

        results.push({ name: parameterName, value: value + '' });
    };

    export var convert = (data: any): IData[]=> {
        var result = [];

        pushParameters(result, data);

        return result;
    };
}
