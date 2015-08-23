interface IResponseDocument {
    read(desiredDataType: DataType): IAjaxFileResult;
}

function createErrorResponseDocument(error: string): IResponseDocument {
    return {
        read: (): IAjaxFileResult => {
            throw error;
        }
    };
};

function createCookieResponseDocument(value: string): IResponseDocument {
    return {
        read(desiredDataType: DataType): IAjaxFileResult {
            const  data = parse(value, desiredDataType);

            return { status: extractStatus(), data: data };
        }
    };
};

class FormResponseDocument {
    private document: any;
    private origineUrl: string;

    constructor(document: Document, origineUrl: string) {
        this.document = document;
        this.origineUrl = origineUrl;
    }

    public isLoaded(): boolean {
        if (!this.hrefHasChanged()) {
            return false;
        }

        if (this.isXml()) {
            return true;
        }

        return this.document.body !== null && !!this.document.body.innerHTML;
    }

    private hrefHasChanged(): boolean {
        return this.document.location.href !== this.origineUrl;
    }

    private isXml(): void {
        return this.document.XMLDocument || $.isXMLDoc(this.document);
    }

    public read(desiredDataType: DataType): IAjaxFileResult {
        const container = this.searchContainer();

        const status = extractStatus(container);
        const data = parse(container.val(), desiredDataType);

        return { status: status, data: data };
    }

    private searchContainer(): JQuery {
        const container = this.document.getElementsByTagName('textarea')[0];
        if (!container) {
            throw 'Cannot find textarea in response';
        }

        return $(container);
    }
}

function extractStatus(container?: JQuery): IResponseStatus {
    const status: IResponseStatus = {
        code: 200,
        text: 'OK',
        isSuccess: true
    };

    if (container) {
        const code = Number(container.attr('statusCode')) || status.code;
        status.code = code;
        status.text = container.attr('statusText') || status.text;
        status.isSuccess = code >= 200 && code < 300 || code === 304;
    }

    return status;
};

function parse(value: string, desiredDataType: DataType): any {
    if (!value) {
        return null;
    }

    switch (desiredDataType) {
        case DataType.Text:
            return value;
        case DataType.Json:
            return $.parseJSON(value);
        case DataType.Xml:
            const xml = $.parseXML(value);
            if (xml.documentElement.nodeName === 'parsererror') {
                throw 'parsererror';
            }

            return xml;
        default:
            throw 'Invalid datatype : ' + desiredDataType;
    }
};
