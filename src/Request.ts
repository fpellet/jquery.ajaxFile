var generateRequestId = (): string => 'ajaxFile' + (new Date().getTime());

class Request {
    private option: IOption;
    private form: Form.IForm;
    private isCompleted: boolean;
    private responseHandler: IReponseHandler;
    private id: string;

    private successCallback : IAjaxFileResultCallback;
    private errorCallback: IAjaxFileResultCallback;

    constructor(option: IOption) {
        this.option = option;
        this.id = generateRequestId();
        this.responseHandler = new ReponseHandlerDispatcher(this.id);
    }

    initialize() {
        this.form = Form.createForm(this.option, this.id);
    }

    submit(): IAjaxFilePromise {
        var promise = new AjaxFilePromise(() => this.abord(), (successCallback, errorCallback) => {
            this.successCallback = successCallback;
            this.errorCallback = errorCallback;
        });

        setTimeout(() => this.send(), 10);

        return promise.always(() => this.dispose());
    }

    private send() {
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

    private onResponseReceived(response: IResponseDocument) {
        if (this.isCompleted) {
            return;
        }

        try {
            var result = response.read(this.option.desiredResponseDataType);

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

    abord(reason?: string) {
        this.onError(reason || 'cancelled');
    }

    private onError(error: any, status?: IResponseStatus, data?: any) {
        if (this.isCompleted) {
            return;
        }
        this.isCompleted = true;

        this.form.abord();

        this.errorCallback({ status: status, data: data, error: error });
    }

    dispose() {
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