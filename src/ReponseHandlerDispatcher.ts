interface IReponseHandler<T> {
    onReceived(option: IOption, form: Form.IForm<T>, receivedCallback: (response: IResponseDocument<T>) => void): void;

    dispose(): void;
}

class ReponseHandlerDispatcher<T> {
    private handlers: IReponseHandler<T>[];

    constructor(id: string) {
        const cookieHandler: IReponseHandler<T> = new CookieReponseHandler(id);
        this.handlers = [
            new TimeoutResponseHandler(),
            new FormResponseHandler(),
            cookieHandler
        ];
    }

    public onReceived(option: IOption, form: Form.IForm<T>, receivedCallback: (response: IResponseDocument<T>) => void): void {
        this.handlers.forEach((handler) => {
            handler.onReceived(option, form, receivedCallback);
        });
    }

    public dispose(): void {
        this.handlers.forEach((handler) => {
            handler.dispose();
        });
    }
}
