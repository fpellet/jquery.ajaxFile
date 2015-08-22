'use strict';

var es = require('event-stream');
var fs = require('fs');

var getCurrentVersion = function () {
    var packageConfig = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    return packageConfig.version;
};

var generateHead = function() {
    return "/*!" + "\r\n" +
        " * AjaxFile.js - V" + getCurrentVersion() + "\r\n" +
        " * Project repository: https://github.com/fpellet/jquery.ajaxFile" + "\r\n" +
        " * Licensed under the MIT license" + "\r\n" +
        " */" + "\r\n";
};

var preScript = "(function (factory) {" + "\r\n" +
                    "if (typeof define === 'function' && define.amd) {" + "\r\n" +
                    "    define(['jquery'], factory);" + "\r\n" +
                    "} else {" + "\r\n" +
                    "    window.AjaxFile = factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto );" + "\r\n" +
                    "}" + "\r\n" +
                "} (function ($) {" + "\r\n" +
                "    \"use strict\";" + "\r\n";
var postScript = "\r\n" +
                 "return AjaxFile;" + "\r\n" +
                 "}));";

module.exports.generateTemplate = function() {
    return generateHead() + preScript + '%= body %' + postScript;
};

module.exports.wrap = function () {
    return es.map(function (file, gulpCallback) {
        file.contents = Buffer.concat([
            new Buffer(generateHead() + preScript),
            file.contents,
            new Buffer(postScript)
        ]);

        gulpCallback(null, file);
    });
};