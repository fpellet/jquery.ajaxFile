namespace AjaxFileJQuery {
    'use strict';

    function convertToDataType(dataType: string): DataType {
        dataType = dataType && dataType.toLowerCase();
        if (dataType === 'xml') {
            return DataType.Xml;
        } else if (dataType === 'text') {
            return DataType.Text;
        }

        return DataType.Json;
    };

    export function convertJqueryOptionToOption(jqueryOption: IJQueryOption): IOption {
        return {
            method: jqueryOption.type,
            url: jqueryOption.url,

            data: jqueryOption.data,
            files: jqueryOption.files,
            desiredResponseDataType: convertToDataType(jqueryOption.dataType),

            timeoutInSeconds: (jqueryOption.timeout || 0) * 10000
        };
    };
}
