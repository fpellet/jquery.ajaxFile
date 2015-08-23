/*!
 * AjaxFile.js - V0.0.2
 * Project repository: https://github.com/fpellet/jquery.ajaxFile
 * Licensed under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'jquery',
            'knockout'
        ], factory);
    } else {
        factory(typeof jQuery != 'undefined' ? jQuery : window.Zepto, ko);
    }
}(function ($, ko) {
    'use strict';
    var AjaxFile;
    (function (AjaxFile) {
        var Knockout;
        (function (Knockout) {
            var FileInputWrapper = function () {
                function FileInputWrapper(input) {
                    this.input = input;
                }
                FileInputWrapper.prototype.getElement = function () {
                    return this.input;
                };
                FileInputWrapper.prototype.fileSelected = function () {
                    return !!this.input.value;
                };
                return FileInputWrapper;
            }();
            function registerBindingHandler(ko, $) {
                ko.bindingHandlers['file'] = {
                    init: function (element, valueAccessor) {
                        $(element).change(function () {
                            var value = valueAccessor();
                            if (this.value) {
                                value(new FileInputWrapper(this));
                            } else {
                                value(undefined);
                            }
                        });
                    },
                    update: function (element, valueAccessor) {
                        var value = valueAccessor();
                        if (!ko.unwrap(value) && element.value) {
                            var $element = $(element);
                            $element.replaceWith($element.clone(true, true));
                        }
                    }
                };
            }
            Knockout.registerBindingHandler = registerBindingHandler;
        }(Knockout = AjaxFile.Knockout || (AjaxFile.Knockout = {})));
    }(AjaxFile || (AjaxFile = {})));
    AjaxFile.Knockout.registerBindingHandler(ko, $);
}));