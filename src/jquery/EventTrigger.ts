module JQueryEventTrigger {
    declare var $: any;

    export var send = (option: IJqueryOption, xmlHttpRequest: IJQueryXHR) => {
        if ($.active++ === 0) {
            sendGlobalEvent(option, 'ajaxStart');
        }

        sendGlobalEvent(option, 'ajaxSend', [xmlHttpRequest, option]);
    };

    export var error = (option: IJqueryOption, xmlHttpRequest: IJQueryXHR, errorThrown?: string) => {
        sendGlobalEvent(option, 'ajaxError', [xmlHttpRequest, option, errorThrown]);
        completed(option, xmlHttpRequest);
    };

    export var success = (option: IJqueryOption, xmlHttpRequest: IJQueryXHR) => {
        sendGlobalEvent(option, 'ajaxSuccess', [xmlHttpRequest, option]);
        completed(option, xmlHttpRequest);
    };

    var completed = (option: IJqueryOption, xmlHttpRequest: IJQueryXHR) => {
        sendGlobalEvent(option, 'ajaxComplete', [xmlHttpRequest, option]);

        if (!--$.active) {
            sendGlobalEvent(option, 'ajaxStop');
        }
    };

    var sendGlobalEvent = (option: IJqueryOption, eventName: string, parameters?: any) => {
        if (!option.global) {
            return;
        }

        $.event.trigger(eventName, parameters);
    };
};