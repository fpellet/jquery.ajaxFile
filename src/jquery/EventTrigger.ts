namespace AjaxFileJQuery.JQueryEventTrigger {
    'use strict';

    declare var $: any;

    export function send(option: IJQueryOption, xmlHttpRequest: IJQueryXHR): void {
        if ($.active++ === 0) {
            sendGlobalEvent(option, 'ajaxStart');
        }

        sendGlobalEvent(option, 'ajaxSend', [xmlHttpRequest, option]);
    };

    export function error(option: IJQueryOption, xmlHttpRequest: IJQueryXHR, errorThrown?: string): void {
        sendGlobalEvent(option, 'ajaxError', [xmlHttpRequest, option, errorThrown]);
        completed(option, xmlHttpRequest);
    };

    export function success(option: IJQueryOption, xmlHttpRequest: IJQueryXHR): void {
        sendGlobalEvent(option, 'ajaxSuccess', [xmlHttpRequest, option]);
        completed(option, xmlHttpRequest);
    };

    function completed(option: IJQueryOption, xmlHttpRequest: IJQueryXHR): void {
        sendGlobalEvent(option, 'ajaxComplete', [xmlHttpRequest, option]);

        if (!--$.active) {
            sendGlobalEvent(option, 'ajaxStop');
        }
    };

    function sendGlobalEvent(option: IJQueryOption, eventName: string, parameters?: any): void {
        if (!option.global) {
            return;
        }

        $.event.trigger(eventName, parameters);
    };
};
