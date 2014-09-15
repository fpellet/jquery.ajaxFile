var readCookie = (name: string) => {
    var value = (document.cookie.match('(^|; )' + name + '=([^;]*)') || 0)[2];

    return decodeURIComponent(value) || null;
};

var hasCookie = (name: string): boolean => {
    return document.cookie.indexOf(name + "=") != -1;
};

var clearCookie = (name: string) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

class CookieReponseHandler {
    private cookieName: string;
    private receivedCallback: (response: IResponseDocument) => void;
    private disposed: boolean;

    constructor(id: string) {
        this.cookieName = id;
    }

    onReceived(option: IOption, form: Form.IForm, receivedCallback: (response: IResponseDocument) => void) {
        this.receivedCallback = receivedCallback;

        setTimeout(() => this.checkCookie(), 100);
    }

    private checkCookie() {
        if (this.disposed) {
            return;
        }

        if (!hasCookie(this.cookieName)) {
            setTimeout(() => this.checkCookie(), 100);
            return;
        }

        var value = readCookie(this.cookieName);

        var response = createCookieResponseDocument(value);
        this.receivedCallback(response);
    }

    dispose() {
        this.disposed = true;

        clearCookie(this.cookieName);
        this.receivedCallback = null;
    }
} 