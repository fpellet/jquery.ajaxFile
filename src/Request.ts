class Request {
    private option: IOption;
    private form: Form.IForm;
    private timeoutHandle: number;
    private isCompleted: boolean;

    private successCallback : IAjaxFileResultCallback;
    private errorCallback: IAjaxFileResultCallback;

    constructor(option: IOption) {
        this.option = option;
    }

    initialize() {
        this.form = Form.createForm(this.option);
    }

    submit(): IAjaxFilePromise {
        var promise = new AjaxFilePromise(() => this.abord(), (successCallback, errorCallback) => {
            this.successCallback = successCallback;
            this.errorCallback = errorCallback;
        });

        setTimeout(() => this.send(), 10);

        if (this.option.timeout) {
            this.timeoutHandle = setTimeout(() => this.onTimeout(), this.option.timeout);
        }

        return promise.always(() => this.dispose());
    }

    private send() {
        if (this.isCompleted) {
            return;
        }

        try {
            this.form.submit(() => this.onStateUpdated());
        } catch (err) {
            this.onError('error', err);
        }
    }

    private onStateUpdated() {
        if (this.isCompleted) {
            return;
        }

        try {
            var documentOfIFrame = this.form.getResponseDocument();
            if (!documentOfIFrame) {
                this.abord('server abort');
                return;
            }

            if (!documentOfIFrame.isLoaded()) {
                setTimeout(() => this.onStateUpdated(), 250);
                return;
            }

            documentOfIFrame.readResponse(this.option.desiredResponseDataType, this.successCallback, this.errorCallback);
        } catch (error) {
            this.onError('error', error);
        }

        this.isCompleted = true;
    }

    private onTimeout() {
        this.abord('timeout');
    }

    abord(reason?: string) {
        if (this.isCompleted) {
            return;
        }
        this.isCompleted = true;

        this.form.abord();

        this.onError(reason || 'cancelled');
    }

    private onError(error: any, status?: IResponseStatus, data?: any) {
        this.errorCallback({ status: status, data: data, error: error });
        this.dispose();
    }

    dispose() {
        this.isCompleted = true;

        if (this.form) {
            this.form.dispose();
            this.form = null;
        }

        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
    }
}