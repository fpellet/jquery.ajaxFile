﻿let defaultOption: IOption = {
    data: {},
    files: [],
    desiredResponseDataType: DataType.Json,
    method: 'POST',
    timeoutInSeconds: 60
};

function mergeWithDefaultOption(option: IOption): IOption {
    option = $.extend(true, {}, defaultOption, option);

    if (!option.url) {
        option.url = getCurrentUrlWithoutHash();
    }

    return option;
};
