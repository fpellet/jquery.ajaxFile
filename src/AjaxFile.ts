let ajaxFile: IAjaxFileStatic = {
    send<T>(option: IOption): IAjaxFilePromise<T> {
        option = mergeWithDefaultOption(option);

        const request = new Request(option);
        request.initialize();
        return request.submit();
    },
    DataType: DataType
};
