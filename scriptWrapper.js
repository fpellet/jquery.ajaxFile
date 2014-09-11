'use strict';

var es = require('event-stream');

var licence = "/*!" + "\r\n" +
    " * jQuery AjaxFile Plugin" + "\r\n" +
    " * Project repository: https://github.com/fpellet/jquery.ajaxFile" + "\r\n" +
    " * Licensed under the MIT license" + "\r\n" +
    " */" + "\r\n";
var preScript = "(function (factory) {" + "\r\n" +
                    "if (typeof define === 'function' && define.amd) {" + "\r\n" +
                    "    define(['jquery'], factory);" + "\r\n" +
                    "} else {" + "\r\n" +
                    "    factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto );" + "\r\n" +
                    "}" + "\r\n" +
                "} (function ($) {" + "\r\n" +
                "    \"use strict\";" + "\r\n";

var postScript = "\r\n$.fn.ajaxFile = ajaxFile;" + "\r\n" +
                 "}));";

module.exports.wrap = function () {
    return es.map(function (file, gulpCallback) {
        file.contents = Buffer.concat([
            new Buffer(licence + preScript),
            file.contents,
            new Buffer(postScript)
        ]);

        gulpCallback(null, file);
    });
};