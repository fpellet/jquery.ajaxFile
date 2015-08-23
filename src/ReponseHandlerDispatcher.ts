class ReponseHandlerDispatcher {
    private handlers: IReponseHandler[];

    constructor(id: string) {
        const cookieHandler: IReponseHandler = new CookieReponseHandler(id);
        this.handlers = [
            new TimeoutResponseHandler(),
            new FormResponseHandler(),
            cookieHandler
        ];
    }

    public onReceived(option: IOption, form: Form.IForm, receivedCallback: (response: IResponseDocument) => void): void {
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
