/*!
 * AjaxFile.js
 * Project repository: https://github.com/fpellet/jquery.ajaxFile
 * Licensed under the MIT license
 */
(function (factory) {
if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
} else {
    window.AjaxFile = factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto );
}
} (function ($) {
    "use strict";
/// <reference path="../libs/jquery.d.ts" />
var AjaxFile;
(function (AjaxFile) {
    AjaxFile.send = function (option) {
        option = mergeWithDefaultOption(option);

        var request = new Request(option);
        request.initialize();
        return request.submit();
    };
})(AjaxFile || (AjaxFile = {}));
//# sourceMappingURL=AjaxFile.js.map

var AjaxFilePromise = (function () {
    function AjaxFilePromise(abordCallback, register) {
        var deferred = $.Deferred();

        this.promise = deferred.promise();
        this.abordCallback = abordCallback;
        register(function (result) {
            return deferred.resolve(result);
        }, function (result) {
            return deferred.reject(result);
        });
    }
    AjaxFilePromise.prototype.then = function (success, error) {
        this.promise = this.promise.then(success, error);
        return this;
    };

    AjaxFilePromise.prototype.done = function (success) {
        this.promise = this.promise.done(success);

        return this;
    };

    AjaxFilePromise.prototype.fail = function (error) {
        this.promise = this.promise.fail(error);

        return this;
    };

    AjaxFilePromise.prototype.always = function (complete) {
        this.promise = this.promise.always(complete);

        return this;
    };

    AjaxFilePromise.prototype.abord = function () {
        if (!this.abordCallback) {
            this.abordCallback();
        }
    };
    return AjaxFilePromise;
})();
//# sourceMappingURL=AjaxFilePromise.js.map

var Form;
(function (_Form) {
    var Form = (function () {
        function Form(option) {
            this.option = option;
        }
        Form.prototype.initialize = function () {
            this.formFragment = createFormFragment(this.option);
            this.htmlHack = insertFormFragment(this.formFragment.fragment);
        };

        Form.prototype.submit = function (loadCallback) {
            var iframe = this.formFragment.iframe;

            iframe.on('load', loadCallback);

            this.formFragment.form.submit();
        };

        Form.prototype.isUninitialized = function () {
            var state = getDocumentOfIFrame(this.formFragment.iframe).readyState;
            return state && state.toLowerCase() == 'uninitialized';
        };

        Form.prototype.getResponseDocument = function () {
            var document = getDocumentOfIFrame(this.formFragment.iframe);
            if (!document) {
                throw 'server abort';
            }

            var orgineUrl = this.formFragment.iframe.attr('origineSrc');
            return new ResponseDocument(document, orgineUrl);
        };

        Form.prototype.abord = function () {
            abordIFrame(this.formFragment.iframe);
        };

        Form.prototype.dispose = function () {
            if (this.htmlHack) {
                $(this.htmlHack).remove();
                this.htmlHack = null;
            }

            this.formFragment = null;
            this.option = null;
        };
        return Form;
    })();

    var abordIFrame = function ($iframe) {
        try  {
            var iframe = $iframe[0];
            var documentOfIFrame = iframe.contentWindow.document;
            if (documentOfIFrame.execCommand) {
                documentOfIFrame.execCommand('Stop');
            }
        } catch (ignore) {
        }

        $iframe.attr('src', $iframe.attr('origineSrc'));
    };

    var createFormFragment = function (option) {
        var fragment = document.createDocumentFragment();

        var frameId = generateIFrameId();
        var iframe = createIFrame(frameId, currentPageIsHttpsMode());
        var form = createHtmlForm(option, frameId);

        var container = $('<div></div>');
        container.hide();
        container.append(iframe);
        container.append(form);

        fragment.appendChild(container[0]);

        return { fragment: fragment, form: form, iframe: iframe };
    };

    var insertFormFragment = function (fragment) {
        return document.getElementsByTagName('body')[0].appendChild(fragment);
    };

    var getDocumentOfIFrame = function ($iframe) {
        var iframe = $iframe[0];
        try  {
            if (iframe.contentWindow) {
                return iframe.contentWindow.document;
            }
        } catch (ignore) {
            // IE8 access denied under ssl & missing protocol
        }

        try  {
            // simply checking may throw in ie8 under ssl or mismatched protocol
            return iframe.contentDocument ? iframe.contentDocument : iframe.document;
        } catch (ignore) {
        }

        return iframe.document;
    };

    var generateIFrameId = function () {
        return 'jqFormIO' + (new Date().getTime());
    };

    var createIFrame = function (id, isHttps) {
        var iframe = $('<iframe name="' + id + '"></iframe>');
        var src = isHttps ? 'javascript:false' : 'about:blank';
        iframe.attr('src', src);
        iframe.attr('origineSrc', src);

        return iframe;
    };

    var createHtmlForm = function (option, iframeId) {
        var form = $('<form></form>');
        form.attr('method', option.method);
        form.attr('action', option.url);
        form.attr('target', iframeId);
        form.attr('encoding', "multipart/form-data");
        form.attr('enctype', "multipart/form-data");

        if (option.method.toLowerCase() == 'GET') {
            applyGetMethodOnForm(form, option);
        } else {
            applyPostMethodOnForm(form, option);
        }

        cloneAndMoveInputFiles(form, option.files);

        return form;
    };

    var cloneAndMoveInputFiles = function (form, files) {
        $.each(files, function (num, file) {
            cloneAndMoveInputFile(form, file);
        });
    };

    var cloneAndMoveInputFile = function (form, file) {
        var input = $(file.element);

        input.replaceWith(input.clone(true, true));

        form.append(file.element);
    };

    var urlHasAlreadyParameters = function (url) {
        return url.indexOf('?') != -1;
    };

    var applyGetMethodOnForm = function (form, option) {
        var urlParameters = $.param(option.data);

        var url = option.url + (urlHasAlreadyParameters(option.url) ? '&' : '?') + urlParameters;

        form.attr('action', url);

        return form;
    };

    var applyPostMethodOnForm = function (form, option) {
        form.attr('action', option.url);

        var parameters = JsonToPostDataConverter.convert(option.data);

        $.each(parameters, function (num, parameter) {
            var input = $('<input type="hidden" />');
            input.attr('name', parameter.name);
            input.val(parameter.value);

            input.appendTo(form);
        });

        return form;
    };

    _Form.createForm = function (option) {
        var form = new Form(option);
        form.initialize();

        return form;
    };
})(Form || (Form = {}));
//# sourceMappingURL=Form.js.map

var DataType;
(function (DataType) {
    DataType[DataType["Json"] = 0] = "Json";
    DataType[DataType["Xml"] = 1] = "Xml";
    DataType[DataType["Text"] = 2] = "Text";
})(DataType || (DataType = {}));
//# sourceMappingURL=Interfaces.js.map

var defaultOption = {
    data: {},
    files: [],
    desiredResponseDataType: DataType.Json,
    method: 'POST',
    timeoutInSeconds: 60
};

var mergeWithDefaultOption = function (option) {
    option = $.extend(true, {}, defaultOption, option);

    if (!option.url) {
        option.url = getCurrentUrlWithoutHash();
    }

    return option;
};
//# sourceMappingURL=Option.js.map

var Request = (function () {
    function Request(option) {
        this.option = option;
    }
    Request.prototype.initialize = function () {
        this.form = Form.createForm(this.option);
    };

    Request.prototype.submit = function () {
        var _this = this;
        var promise = new AjaxFilePromise(function () {
            return _this.abord();
        }, function (successCallback, errorCallback) {
            _this.successCallback = successCallback;
            _this.errorCallback = errorCallback;
        });

        setTimeout(function () {
            return _this.send();
        }, 10);

        if (this.option.timeoutInSeconds) {
            var timeoutInMilliseconds = this.option.timeoutInSeconds * 1000;
            this.timeoutHandle = setTimeout(function () {
                return _this.onTimeout();
            }, timeoutInMilliseconds);
        }

        return promise.always(function () {
            return _this.dispose();
        });
    };

    Request.prototype.send = function () {
        var _this = this;
        if (this.isCompleted) {
            return;
        }

        try  {
            this.form.submit(function () {
                return _this.onStateUpdated();
            });
        } catch (err) {
            this.onError('error', err);
        }
    };

    Request.prototype.onStateUpdated = function () {
        var _this = this;
        if (this.isCompleted) {
            return;
        }

        try  {
            var documentOfIFrame = this.form.getResponseDocument();
            if (!documentOfIFrame) {
                this.abord('server abort');
                return;
            }

            if (!documentOfIFrame.isLoaded()) {
                setTimeout(function () {
                    return _this.onStateUpdated();
                }, 250);
                return;
            }

            documentOfIFrame.readResponse(this.option.desiredResponseDataType, this.successCallback, this.errorCallback);
        } catch (error) {
            this.onError('error', error);
        }

        this.isCompleted = true;
    };

    Request.prototype.onTimeout = function () {
        this.abord('timeout');
    };

    Request.prototype.abord = function (reason) {
        if (this.isCompleted) {
            return;
        }
        this.isCompleted = true;

        this.form.abord();

        this.onError(reason || 'cancelled');
    };

    Request.prototype.onError = function (error, status, data) {
        this.errorCallback({ status: status, data: data, error: error });
        this.dispose();
    };

    Request.prototype.dispose = function () {
        this.isCompleted = true;

        if (this.form) {
            this.form.dispose();
            this.form = null;
        }

        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
    };
    return Request;
})();
//# sourceMappingURL=Request.js.map

var ResponseDocument = (function () {
    function ResponseDocument(document, origineUrl) {
        this.document = document;
        this.origineUrl = origineUrl;
    }
    ResponseDocument.prototype.isLoaded = function () {
        if (!this.hrefHasChanged()) {
            return false;
        }

        if (this.isXml()) {
            return true;
        }

        return this.document.body !== null && !!this.document.body.innerHTML;
    };

    ResponseDocument.prototype.hrefHasChanged = function () {
        return this.document.location.href != this.origineUrl;
    };

    ResponseDocument.prototype.isXml = function () {
        return this.document.XMLDocument || $.isXMLDoc(this.document);
    };

    ResponseDocument.prototype.readResponse = function (desiredDataType, onSuccess, onError) {
        var container = this.searchContainer();

        var status = extractStatus(container);
        var data = parse(container.value, desiredDataType);

        try  {
            if (status.isSuccess) {
                onSuccess({ status: status, data: data });
            } else {
                onError({ status: status, data: data, error: 'server error' });
            }
        } catch (e) {
            onError({ status: status, data: data, error: e });
        }
    };

    ResponseDocument.prototype.searchContainer = function () {
        var container = this.document.getElementsByTagName('textarea')[0];
        if (!container) {
            throw 'Cannot find textarea in response';
        }

        return container;
    };
    return ResponseDocument;
})();

var extractStatus = function (container) {
    var status = {
        code: 200,
        text: '',
        isSuccess: true
    };

    if (container) {
        var code = Number(container.getAttribute('statusCode')) || status.code;
        status.code = code;
        status.text = container.getAttribute('statusText') || status.text;
        status.isSuccess = code >= 200 && code < 300 || code === 304;
    }
    ;

    return status;
};

var parse = function (value, desiredDataType) {
    if (desiredDataType == DataType.Text) {
        return value;
    }

    if (desiredDataType == DataType.Json) {
        return $.parseJSON(value);
    }

    if (desiredDataType == DataType.Xml) {
        var xml = $.parseXML(value);
        if (xml.documentElement.nodeName === 'parsererror') {
            throw 'parsererror';
        }

        return xml;
    }

    throw 'Invalid datatype : ' + desiredDataType;
};
//# sourceMappingURL=ResponseDocument.js.map

/// <reference path="utils.ts" />
var getCurrentUrlWithoutHash = function () {
    var currentUrl = window.location.href;
    return (currentUrl.match(/^([^#]+)/) || [])[1];
};

var currentPageIsHttpsMode = function () {
    return urlIsHttpsMode(window.location.href);
};

var urlIsHttpsMode = function (url) {
    return /^https/i.test(url || '');
};

var JsonToPostDataConverter;
(function (JsonToPostDataConverter) {
    var pushParameters = function (results, data, prefix) {
        if (!data) {
            return;
        }

        for (var propertyName in data) {
            var value = data[propertyName];
            if (!value)
                continue;

            pushParameterOfProperty(results, propertyName, data[propertyName], prefix);
        }
    };

    var pushParameterOfProperty = function (results, propertyName, value, prefix) {
        var parameterName = prefix ? prefix + '[' + propertyName + ']' : propertyName;

        var type = Object.prototype.toString.call(value);

        if (type === '[object Array]') {
            value.forEach(function (item, index) {
                pushParameters(results, item, parameterName + '[' + index + ']');
            });
            return;
        }

        if (type == '[object Object]') {
            pushParameters(results, value, parameterName);
            return;
        }

        results.push({ name: parameterName, value: value + '' });
    };

    JsonToPostDataConverter.convert = function (data) {
        var result = [];

        pushParameters(result, data);

        return result;
    };
})(JsonToPostDataConverter || (JsonToPostDataConverter = {}));
//# sourceMappingURL=Url.js.map

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

return AjaxFile;
}));