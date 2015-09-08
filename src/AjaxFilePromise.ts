class AjaxFilePromise<T> {
    private abordCallback: () => void;

    private promise: JQueryPromise<IAjaxFileResult<T>>;

    constructor(abordCallback: () => void, register: (success: IAjaxFileResultCallback<T>, error: IAjaxFileResultCallback<T>) => void) {
        const deferred: JQueryDeferred<IAjaxFileResult<T>> = $.Deferred();

        this.promise = deferred.promise();
        this.abordCallback = abordCallback;
        register(result => deferred.resolve(result), result => deferred.reject(result));
    }

    public then(success?: IAjaxFileResultCallback<T>, error?: IAjaxFileResultCallback<T>): IAjaxFilePromise<T> {
        this.promise = this.promise.then(success, error);
        return this;
    }

    public done(success: IAjaxFileResultCallback<T>): IAjaxFilePromise<T> {
        this.promise = this.promise.done(success);

        return this;
    }

    public fail(error: IAjaxFileResultCallback<T>): IAjaxFilePromise<T> {
        this.promise = this.promise.fail(error);

        return this;
    }

    public always(complete: IAjaxFileResultCallback<T>): IAjaxFilePromise<T> {
        this.promise = this.promise.always(complete);

        return this;
    }

    public abord(): void {
        if (!this.abordCallback) {
            this.abordCallback();
        }
    }
}
