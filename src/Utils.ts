var map = <TOutput, TInput>(data: TInput[], callback: (value: TInput) => TOutput): TOutput[]=> {
    if (typeof callback != "function") {
        throw new TypeError();
    }

    var arrayLength = data.length;
    var result = new Array(arrayLength);
    for (var i = 0; i < arrayLength; i++) {
        if (i in data) {
            result[i] = callback.call(undefined, data[i]);
        }
    }

    return result;
};