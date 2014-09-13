var convertToDataType = (dataType: string) => {
    dataType = dataType && dataType.toLowerCase();
    if (dataType == 'xml') {
        return DataType.Xml;
    } else if (dataType == 'text') {
        return DataType.Text;
    }

    return DataType.Json;
};

var convertJqueryOptionToOption = (jqueryOption: IJqueryOption): IOption => {
    return {
        method: jqueryOption.type,
        url: jqueryOption.url,

        data: jqueryOption.data,
        files: jqueryOption.files,
        desiredResponseDataType: convertToDataType(jqueryOption.dataType),

        timeout: jqueryOption.timeout,
    };
};