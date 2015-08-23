function getCurrentUrlWithoutHash(): string {
    const currentUrl = window.location.href;
    return (currentUrl.match(/^([^#]+)/) || [])[1];
}

function currentPageIsHttpsMode(): boolean {
     return urlIsHttpsMode(window.location.href);
}

function urlIsHttpsMode(url: string): boolean {
    return /^https/i.test(url || '');
}

namespace JsonToPostDataConverter {
    'use strict';

    export interface IData {
        name: string;
        value: string;
    }

    function pushParameters(results: IData[], data: any, prefix?: string): void {
        if (!data) {
            return;
        }

        for (let propertyName in data) {
            if (!data.hasOwnProperty(propertyName)) {
                continue;
            }

            const value = data[propertyName];
            if (!value) {
                continue;
            }

            pushParameterOfProperty(results, propertyName, data[propertyName], prefix);
        }
    };

    function pushParameterOfProperty(results: IData[], propertyName: string, value: any, prefix?: string): void {
        const parameterName = prefix ? prefix + '[' + propertyName + ']' : propertyName;

        const type = Object.prototype.toString.call(value);

        if (type === '[object Array]') {
            value.forEach((item, index) => {
                pushParameters(results, item, parameterName + '[' + index + ']');
            });
            return;
        }

        if (type === '[object Object]') {
            pushParameters(results, value, parameterName);
            return;
        }

        results.push({ name: parameterName, value: value + '' });
    };

    export function convert(data: any): IData[] {
        const result = [];

        pushParameters(result, data);

        return result;
    };
}
