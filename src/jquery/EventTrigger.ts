namespace JQueryEventTrigger {
    'use strict';

    declare var $: any;

    export function send(option: IJqueryOption, xmlHttpRequest: IJQueryXHR): void {
        if ($.active++ === 0) {
            sendGlobalEvent(option, 'ajaxStart');
        }

        sendGlobalEvent(option, 'ajaxSend', [xmlHttpRequest, option]);
    };

    export function error(option: IJqueryOption, xmlHttpRequest: IJQueryXHR, errorThrown?: string): void {
        sendGlobalEvent(option, 'ajaxError', [xmlHttpRequest, option, errorThrown]);
        completed(option, xmlHttpRequest);
    };

    export function success(option: IJqueryOption, xmlHttpRequest: IJQueryXHR): void {
        sendGlobalEvent(option, 'ajaxSuccess', [xmlHttpRequest, option]);
        completed(option, xmlHttpRequest);
    };

    function completed(option: IJqueryOption, xmlHttpRequest: IJQueryXHR): void {
        sendGlobalEvent(option, 'ajaxComplete', [xmlHttpRequest, option]);

        if (!--$.active) {
            sendGlobalEvent(option, 'ajaxStop');
        }
    };

    function sendGlobalEvent(option: IJqueryOption, eventName: string, parameters?: any): void {
        if (!option.global) {
            return;
        }

        $.event.trigger(eventName, parameters);
    };
};
