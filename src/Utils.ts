function map<TOutput, TInput>(data: TInput[], callback: (value: TInput) => TOutput): TOutput[] {
    if (typeof callback !== 'function') {
        throw new TypeError();
    }

    const arrayLength = data.length;
    const result = new Array(arrayLength);
    for (let i = 0; i < arrayLength; i++) {
        if (i in data) {
            result[i] = callback.call(undefined, data[i]);
        }
    }

    return result;
};

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn: (value: any, index: number, array: any[]) => void, scope: any): void {
        for (let i = 0, len = this.length; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    };
}
