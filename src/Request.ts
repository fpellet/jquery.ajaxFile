function generateRequestId(): string {
    return 'ajaxFile' + (new Date().getTime());
}

class Request<T> {
    private option: IOption;
    private form: Form.IForm<T>;
    private isCompleted: boolean;
    private responseHandler: IReponseHandler<T>;
    private id: string;

    private successCallback: IAjaxFileResultCallback<T>;
    private errorCallback: IAjaxFileResultCallback<T>;

    constructor(option: IOption) {
        this.option = option;
        this.id = generateRequestId();
        this.responseHandler = new ReponseHandlerDispatcher(this.id);
    }

    public initialize(): void {
        this.form = Form.createForm(this.option, this.id);
    }

    public submit(): IAjaxFilePromise<T> {
        const promise = new AjaxFilePromise<T>(() => this.abord(), (successCallback, errorCallback) => {
            this.successCallback = successCallback;
            this.errorCallback = errorCallback;
        });

        setTimeout(() => this.send(), 10);

        return promise.always(() => this.dispose());
    }

    private send(): void {
        if (this.isCompleted) {
            return;
        }

        this.responseHandler.onReceived(this.option, this.form, (response) => this.onResponseReceived(response));

        try {
            this.form.submit();
        } catch (err) {
            this.onError('error', err);
        }
    }

    private onResponseReceived(response: IResponseDocument<T>): void {
        if (this.isCompleted) {
            return;
        }

        try {
            const result = response.read(this.option.desiredResponseDataType);

            if (result.status.isSuccess) {
                this.successCallback(result);
            } else {
                this.errorCallback(result);
            }
        } catch (error) {
            this.onError('error', error);
        }

        this.isCompleted = true;
    }

    public abord(reason?: string): void {
        this.onError(reason || 'cancelled');
    }

    private onError(error: any, status?: IResponseStatus, data?: any): void {
        if (this.isCompleted) {
            return;
        }
        this.isCompleted = true;

        this.form.abord();

        this.errorCallback({ status: status, data: data, error: error });
    }

    public dispose(): void {
        this.isCompleted = true;

        if (this.form) {
            this.form.dispose();
            this.form = null;
        }

        if (this.responseHandler) {
            this.responseHandler.dispose();
            this.responseHandler = null;
        }
    }
}
