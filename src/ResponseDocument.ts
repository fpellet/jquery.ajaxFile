interface IResponseDocument {
    read(desiredDataType: DataType) : IAjaxFileResult;
}

var createErrorResponseDocument = (error: string): IResponseDocument => {
    return {
        read: (): IAjaxFileResult => {
            throw error;
        }
    };
};

var createCookieResponseDocument = (value: string): IResponseDocument => {
    return {
        read(desiredDataType: DataType) {
            var data = parse(value, desiredDataType);

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

    isLoaded(): boolean {
        if (!this.hrefHasChanged()) {
            return false;
        }

        if (this.isXml()) {
            return true;
        }

        return this.document.body !== null && !!this.document.body.innerHTML;
    }

    private hrefHasChanged(): boolean {
        return this.document.location.href != this.origineUrl;
    }

    private isXml() {
        return this.document.XMLDocument || $.isXMLDoc(this.document);
    }

    read(desiredDataType: DataType): IAjaxFileResult {
        var container = this.searchContainer();

        var status = extractStatus(container);
        var data = parse(container.val(), desiredDataType);

        return { status: status, data: data };
    }

    private searchContainer(): JQuery {
        var container = this.document.getElementsByTagName('textarea')[0];
        if (!container) {
            throw 'Cannot find textarea in response';
        }

        return $(container);
    }
}

var extractStatus = (container?: JQuery): IResponseStatus => {
    var status: IResponseStatus = {
        code: 200,
        text: 'OK',
        isSuccess: true,
    };

    if (container) {
        var code = Number(container.attr('statusCode')) || status.code;
        status.code = code;
        status.text = container.attr('statusText') || status.text;
        status.isSuccess = code >= 200 && code < 300 || code === 304;
    };

    return status;
};

var parse = (value: string, desiredDataType: DataType) => {
    if (!value) {
        return null;
    }

    if (desiredDataType == DataType.Text) {
        return value;
    }

    if (desiredDataType == DataType.Json) {
        return $.parseJSON(value);
    }

    if (desiredDataType == DataType.Xml) {
        var xml = $.parseXML(value);
        if (xml.documentElement.nodeName === 'parsererror') {
            throw 'parsererror';
        }

        return xml;
    }

    throw 'Invalid datatype : ' + desiredDataType;
};