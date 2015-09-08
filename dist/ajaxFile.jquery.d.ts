declare enum DataType {
    Json,
    Xml,
    Text
}

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

declare namespace AjaxFileJQuery {
    interface IJQueryXHR {
        readyState: any;
        status: number;
        statusText: string;
        responseXML: Document;
        responseText: string;
        statusCode?: { [key: string]: any; };

        abort(statusText?: string): void;

        setRequestHeader(header: string, value: string): void;
        getAllResponseHeaders(): string;
        getResponseHeader(header: string): string;

        beforeSend?(jqXHR: IJQueryXHR, settings: JQueryAjaxSettings): any;
        dataFilter?(data: any, ty: any): any;
        success?(data: any, textStatus: string, jqXHR: IJQueryXHR): any;
        error?(jqXHR: IJQueryXHR, textStatus: string, errorThrown: string): any;
        complete?(jqXHR: IJQueryXHR, textStatus: string): any;
    }

    interface IJQueryOption {
        type?: string;
        url?: string;

        data?: any;
        files?: IFileData[];
        dataType?: string;

        timeout?: number;

        global?: boolean;

        error?(jqXHR: IJQueryXHR, textStatus: string, errorThrown: string): any;
        success?(data: any, textStatus: string, jqXHR: IJQueryXHR): any;
        complete?(jqXHR: IJQueryXHR, textStatus: string): any;
    }

    interface IAjaxFileJQueryExtension {
        ajaxWithFile(jqueryOption: IJQueryOption): JQueryDeferred<any>;
    }
}
