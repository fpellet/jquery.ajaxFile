class FormResponseHandler {
    private receivedCallback: (response: IResponseDocument) => void;
    private form: Form.IForm;

    onReceived(option: IOption, form: Form.IForm, receivedCallback: (response: IResponseDocument) => void) {
        this.form = form;
        this.form.onLoaded(() => this.onStateUpdated());

        this.receivedCallback = receivedCallback;
    }

    private onStateUpdated() {
        try {
            var documentOfIFrame = this.form.getResponseDocument();
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

    dispose() {
        if (this.form) {
            this.form.dispose();
            this.form = null;
        }

        this.receivedCallback = null;
    }
}