class AjaxFilePromise {
    private abordCallback: () => void;

    private promise: JQueryPromise<IAjaxFileResult>;

    constructor(abordCallback: () => void, register: (success: IAjaxFileResultCallback, error: IAjaxFileResultCallback) => void) {
        const deferred: JQueryDeferred<IAjaxFileResult> = $.Deferred();

        this.promise = deferred.promise();
        this.abordCallback = abordCallback;
        register(result => deferred.resolve(result), result => deferred.reject(result));
    }

    public then(success?: IAjaxFileResultCallback, error?: IAjaxFileResultCallback): IAjaxFilePromise {
        this.promise = this.promise.then(success, error);
        return this;
    }

    public done(success: IAjaxFileResultCallback): IAjaxFilePromise {
        this.promise = this.promise.done(success);

        return this;
    }

    public fail(error: IAjaxFileResultCallback): IAjaxFilePromise {
        this.promise = this.promise.fail(error);

        return this;
    }

    public always(complete: IAjaxFileResultCallback): IAjaxFilePromise {
        this.promise = this.promise.always(complete);

        return this;
    }

    public abord(): void {
        if (!this.abordCallback) {
            this.abordCallback();
        }
    }
}
