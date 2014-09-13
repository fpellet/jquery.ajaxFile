interface IJqueryOption {
    type?: string;
    url?: string;

    data?: any;
    files?: IFileData[];
    dataType?: string;

    timeout?: number;

    error? (jqXHR: JQueryXHR, textStatus: string, errorThrown: string): any;
    success? (data: any, textStatus: string, jqXHR: JQueryXHR): any;
    complete? (jqXHR: JQueryXHR, textStatus: string): any;

    global?: boolean;
}

interface IJQueryXHR {
    readyState: any;
    status: number;
    statusText: string;
    responseXML: Document;
    responseText: string;

    abort(statusText?: string): void;

    setRequestHeader(header: string, value: string): void;
    getAllResponseHeaders(): string;
    getResponseHeader(header: string): string;

    beforeSend? (jqXHR: JQueryXHR, settings: JQueryAjaxSettings): any;
    dataFilter? (data: any, ty: any): any;
    statusCode?: { [key: string]: any; };
    success? (data: any, textStatus: string, jqXHR: IJQueryXHR): any;
    error? (jqXHR: IJQueryXHR, textStatus: string, errorThrown: string): any;
    complete? (jqXHR: IJQueryXHR, textStatus: string): any;
}