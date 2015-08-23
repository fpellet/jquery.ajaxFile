'use strict';

var fs = require('fs');
var wrapJs = require("gulp-wrap-js");

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
                 "return ajaxFile;" + "\r\n" +
                 "}));" + "\r\n";

var generateTemplate = function() {
    return generateHead() + preScript + '%= body %' + postScript;
};

exports.wrap = function() {
    return wrapJs(generateTemplate());
};

exports.wrapForKnockoutPlugin = function () {
    var template = generateHead() + "(function (factory) {" + "\r\n" +
                    "if (typeof define === 'function' && define.amd) {" + "\r\n" +
                    "    define(['jquery', 'knockout'], factory);" + "\r\n" +
                    "} else {" + "\r\n" +
                    "   factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto, ko);" + "\r\n" +
                    "}" + "\r\n" +
                "} (function ($, ko) {" + "\r\n" +
                "    \"use strict\";" + "\r\n" + '%= body %' + "\r\n" +
                 "}));" + "\r\n";
    return wrapJs(template);
};