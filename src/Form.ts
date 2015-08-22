module Form {
    export interface IForm {
        onLoaded(loadCallback: () => void): void;
        submit(): void;
        getResponseDocument(): FormResponseDocument;
        abord(): void;
        dispose(): void;
    }

    interface IFormFragment {
        container: JQuery;
        form: JQuery;
        iframe: JQuery;
    }

    class Form {
        private formFragment: IFormFragment;
        private option: IOption;

        constructor(option: IOption) {
            this.option = option;
        }

        initialize(requestId: string) {
            this.addRequestIdInData(requestId);

            this.formFragment = createFormFragment(this.option, requestId);
            insertFormFragment(this.formFragment);
        }

        private addRequestIdInData(requestId: string) {
            this.option.data.__requestId = requestId;
        }

        onLoaded(loadCallback: () => void) {
            var iframe = this.formFragment.iframe;

            iframe.on('load', loadCallback);
        }

        submit() {
            this.formFragment.form.submit();
        }

        getResponseDocument(): FormResponseDocument {
            var document = getDocumentOfIFrame(this.formFragment.iframe);
            if (!document) {
                throw 'server abort';
            }

            var orgineUrl = this.formFragment.iframe.attr('origineSrc');
            return new FormResponseDocument(document, orgineUrl);
        }

        abord() {
            abordIFrame(this.formFragment.iframe);
        }

        dispose() {
            if (this.formFragment) {
                this.formFragment.container.remove();

                this.formFragment = null;
            }
        }
    }

    var abordIFrame = ($iframe: JQuery) => {
        try { // for ie
            var iframe = <HTMLIFrameElement>$iframe[0];
            var documentOfIFrame = iframe.contentWindow.document;
            if (documentOfIFrame.execCommand) {
                documentOfIFrame.execCommand('Stop');
            }
        } catch (ignore) {
        }

        $iframe.attr('src', $iframe.attr('origineSrc'));
    };

    var createFormFragment = (option: IOption, requestId: string): IFormFragment => {
        option.data.__requestId = requestId;
        var iframe = createIFrame(requestId, currentPageIsHttpsMode());
        var form = createHtmlForm(option, requestId);

        var container = $('<div></div>');
        container.hide();
        container.append(iframe);
        container.append(form);

        return { container: container, form: form, iframe: iframe };
    };

    var insertFormFragment = (formFragment: IFormFragment) => {
        formFragment.container.appendTo('body');
    };

    var getDocumentOfIFrame = ($iframe: JQuery): Document => {
        var iframe = <HTMLIFrameElement>$iframe[0];
        try {
            if (iframe.contentWindow) {
                return iframe.contentWindow.document;
            }
        } catch (ignore) {
            // IE8 access denied under ssl & missing protocol
        }

        try {
            // simply checking may throw in ie8 under ssl or mismatched protocol
            return iframe.contentDocument ? iframe.contentDocument : (<any>iframe).document;
        } catch (ignore) {
        }

        return (<any>iframe).document;
    };

    var createIFrame = (id: string, isHttps: boolean): JQuery => {
        var iframe = $('<iframe name="' + id + '"></iframe>');
        var src = isHttps ? 'javascript:false' : 'about:blank';
        iframe.attr('src', src);
        iframe.attr('origineSrc', src);

        return iframe;
    }

    var createHtmlForm = (option: IOption, iframeId: string): JQuery => {
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

    var cloneAndMoveInputFiles = (form: JQuery, files: IFileData[]) => {
        $.each(files, (num, file) => {
            cloneAndMoveInputFile(form, file);
        });
    };

    var cloneAndMoveInputFile = (form: JQuery, file: IFileData) => {
        var input = $(file.element);

        input.replaceWith(input.clone(true, true));

        input.attr('name', file.name);
        input.off();

        form.append(file.element);
    };

    var urlHasAlreadyParameters = (url: string): boolean => url.indexOf('?') != -1;

    var applyGetMethodOnForm = (form: JQuery, option: IOption): JQuery => {
        var urlParameters = $.param(option.data);

        var url = option.url + (urlHasAlreadyParameters(option.url) ? '&' : '?') + urlParameters;

        form.attr('action', url);

        return form;
    };

    var applyPostMethodOnForm = (form: JQuery, option: IOption): JQuery => {
        form.attr('action', option.url);

        var parameters = JsonToPostDataConverter.convert(option.data);

        $.each(parameters, (num, parameter) => {
            var input = $('<input type="hidden" />');
            input.attr('name', parameter.name);
            input.val(parameter.value);

            input.appendTo(form);
        });

        return form;
    };

    export var createForm = (option: IOption, requestId: string): IForm => {
        var form = new Form(option);
        form.initialize(requestId);

        return form;
    };
}