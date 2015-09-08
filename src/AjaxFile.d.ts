interface IFileData {
    name: string;
    element: HTMLInputElement;
}

interface IOption {
    method?: string;
    url?: string;

    data?: any;
    files?: IFileData[];
    desiredResponseDataType?: DataType;

    timeoutInSeconds?: number;
}

interface IResponseStatus {
    code: number;
    text: string;
    isSuccess: boolean;
}

interface IAjaxFileResult<T> {
    error?: any;
    data?: any;
    status?: IResponseStatus;
}

interface IAjaxFileResultCallback<T> {
    (result: IAjaxFileResult<T>);
}

interface IAjaxFilePromise<T> {
    then(success: IAjaxFileResultCallback<T>, error?: IAjaxFileResultCallback<T>): IAjaxFilePromise<T>;
    done(success: IAjaxFileResultCallback<T>): IAjaxFilePromise<T>;
    fail(error: IAjaxFileResultCallback<T>): IAjaxFilePromise<T>;
    always(error: IAjaxFileResultCallback<T>): IAjaxFilePromise<T>;

    abord(): void;
}

interface IAjaxFileStatic {
    DataType: typeof DataType;
    send<T>(option: IOption): IAjaxFilePromise<T>;
}

declare var AjaxFile: IAjaxFileStatic;

declare module 'ajaxfile' {
    export = AjaxFile;
}
