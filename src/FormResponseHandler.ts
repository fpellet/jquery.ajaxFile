class FormResponseHandler {
    private receivedCallback: (response: IResponseDocument) => void;
    private form: Form.IForm;

    public onReceived(option: IOption, form: Form.IForm, receivedCallback: (response: IResponseDocument) => void): void {
        this.form = form;
        this.form.onLoaded(() => this.onStateUpdated());

        this.receivedCallback = receivedCallback;
    }

    private onStateUpdated(): void {
        try {
            const documentOfIFrame = this.form.getResponseDocument();
            if (!documentOfIFrame) {
                this.receivedCallback(createErrorResponseDocument('server abort'));
                return;
            }

            if (!documentOfIFrame.isLoaded()) {
                setTimeout(() => this.onStateUpdated(), 250);
                return;
            }

            this.receivedCallback(documentOfIFrame);
        } catch (error) {
            this.receivedCallback(createErrorResponseDocument(error));
        }
    }

    public dispose(): void {
        if (this.form) {
            this.form.dispose();
            this.form = null;
        }

        this.receivedCallback = null;
    }
}
