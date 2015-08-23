class TimeoutResponseHandler {
    private timeoutHandle: number;

    public onReceived(option: IOption, form: Form.IForm, receivedCallback: (response: IResponseDocument) => void): void {
        this.dispose();

        if (option.timeoutInSeconds) {
            const timeoutInMilliseconds = option.timeoutInSeconds * 1000;
            this.timeoutHandle = setTimeout(() => {
                receivedCallback(createErrorResponseDocument('Timeout'));
            }, timeoutInMilliseconds);
        }
    }

    public dispose(): void {
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
    }
}
