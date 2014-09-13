var defaultOption: IOption = {
    data: {},
    files: [],
    desiredResponseDataType: DataType.Json,
    method: 'POST',
    timeout: 60000
};

var mergeWithDefaultOption = (option: IOption): IOption => {
    option = $.extend(true, {}, defaultOption, option);

    if (!option.url) {
        option.url = getCurrentUrlWithoutHash();
    }

    return option;
};