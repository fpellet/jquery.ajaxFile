class TimeoutResponseHandler {
    private timeoutHandle: number;

    onReceived(option: IOption, form: Form.IForm, receivedCallback: (response: IResponseDocument) => void) {
        this.dispose();

        if (option.timeoutInSeconds) {
            var timeoutInMilliseconds = option.timeoutInSeconds * 1000;
            this.timeoutHandle = setTimeout(() => {
                receivedCallback(createErrorResponseDocument('Timeout'));
            }, timeoutInMilliseconds);
        }
    }

    dispose() {
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
    }
}