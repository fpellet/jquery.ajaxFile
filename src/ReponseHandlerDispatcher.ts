class ReponseHandlerDispatcher {
    private handlers: IReponseHandler[];

    constructor(id: string) {
        var cookieHandler: IReponseHandler = new CookieReponseHandler(id);
        this.handlers = [
            new TimeoutResponseHandler(),
            new FormResponseHandler(),
            cookieHandler
        ];
    }

    onReceived(option: IOption, form: Form.IForm, receivedCallback: (response: IResponseDocument) => void) {
        this.handlers.forEach((handler) => {
            handler.onReceived(option, form, receivedCallback);
        });
    }

    dispose() {
        this.handlers.forEach((handler) => {
            handler.dispose();
        });
    }
} 