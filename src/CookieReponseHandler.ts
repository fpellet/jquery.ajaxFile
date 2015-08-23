function readCookie(name: string): string {
    const value = (document.cookie.match(`(^|; )${name}=([^;]*)`) || 0)[2];

    return decodeURIComponent(value) || null;
};

function hasCookie(name: string): boolean {
    return document.cookie.indexOf(name + '=') !== -1;
};

function clearCookie(name: string): void {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

class CookieReponseHandler {
    private cookieName: string;
    private receivedCallback: (response: IResponseDocument) => void;
    private disposed: boolean;

    constructor(id: string) {
        this.cookieName = id;
    }

    public onReceived(option: IOption, form: Form.IForm, receivedCallback: (response: IResponseDocument) => void): void {
        this.receivedCallback = receivedCallback;

        setTimeout(() => this.checkCookie(), 100);
    }

    private checkCookie(): void {
        if (this.disposed) {
            return;
        }

        if (!hasCookie(this.cookieName)) {
            setTimeout(() => this.checkCookie(), 100);
            return;
        }

        const value = readCookie(this.cookieName);

        const response = createCookieResponseDocument(value);
        this.receivedCallback(response);
    }

    public dispose(): void {
        this.disposed = true;

        clearCookie(this.cookieName);
        this.receivedCallback = null;
    }
}
