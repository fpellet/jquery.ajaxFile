/*!
 * jQuery AjaxFile Plugin
 * Project repository: https://github.com/fpellet/jquery.ajaxFile
 * Licensed under the MIT license
 */
(function (factory) {
if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
} else {
    factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto );
}
} (function ($) {
    "use strict";
var ajaxFile = function (option) {
};
//# sourceMappingURL=AjaxFile.js.map

var map = function (data, callback) {
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
//# sourceMappingURL=Utils.js.map

$.fn.ajaxFile = ajaxFile;
}));