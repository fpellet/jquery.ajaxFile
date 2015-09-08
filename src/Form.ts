namespace Form {
    'use strict';

    export interface IForm<T> {
        onLoaded(loadCallback: () => void): void;
        submit(): void;
        getResponseDocument(): FormResponseDocument<T>;
        abord(): void;
        dispose(): void;
    }

    interface IFormFragment {
        container: JQuery;
        form: JQuery;
        iframe: JQuery;
    }

    class Form<T> {
        private formFragment: IFormFragment;
        private option: IOption;

        constructor(option: IOption) {
            this.option = option;
        }

        public initialize(requestId: string): void {
            this.addRequestIdInData(requestId);

            this.formFragment = createFormFragment(this.option, requestId);
            insertFormFragment(this.formFragment);
        }

        private addRequestIdInData(requestId: string): void {
            this.option.data.__requestId = requestId;
        }

        public onLoaded(loadCallback: () => void): void {
            const iframe = this.formFragment.iframe;

            iframe.on('load', loadCallback);
        }

        public submit(): void {
            this.formFragment.form.submit();
        }

        public getResponseDocument(): FormResponseDocument<T> {
            const document = getDocumentOfIFrame(this.formFragment.iframe);
            if (!document) {
                throw 'server abort';
            }

            const orgineUrl = this.formFragment.iframe.attr('origineSrc');
            return new FormResponseDocument<T>(document, orgineUrl);
        }

        public abord(): void {
            abordIFrame(this.formFragment.iframe);
        }

        public dispose(): void {
            if (this.formFragment) {
                this.formFragment.container.remove();

                this.formFragment = null;
            }
        }
    }

    function abordIFrame($iframe: JQuery): void {
        try { // for ie
            const iframe = <HTMLIFrameElement>$iframe[0];
            const documentOfIFrame = iframe.contentWindow.document;
            if (documentOfIFrame.execCommand) {
                documentOfIFrame.execCommand('Stop');
            }
        } catch (ignore) {
        }

        $iframe.attr('src', $iframe.attr('origineSrc'));
    };

    function createFormFragment(option: IOption, requestId: string): IFormFragment {
        option.data.__requestId = requestId;
        const iframe = createIFrame(requestId, currentPageIsHttpsMode());
        const form = createHtmlForm(option, requestId);

        const container = $('<div></div>');
        container.hide();
        container.append(iframe);
        container.append(form);

        return { container: container, form: form, iframe: iframe };
    };

    function insertFormFragment(formFragment: IFormFragment): void {
        formFragment.container.appendTo('body');
    };

    function getDocumentOfIFrame($iframe: JQuery): Document {
        const iframe = <HTMLIFrameElement>$iframe[0];
        try {
            if (iframe.contentWindow) {
                return iframe.contentWindow.document;
            }
        } catch (ignore) {
            // ie8 access denied under ssl & missing protocol
        }

        try {
            // simply checking may throw in ie8 under ssl or mismatched protocol
            return iframe.contentDocument ? iframe.contentDocument : (<any>iframe).document;
        } catch (ignore) {
        }

        return (<any>iframe).document;
    };

    function createIFrame(id: string, isHttps: boolean): JQuery {
        const iframe = $('<iframe name="' + id + '"></iframe>');
        const src = isHttps ? 'javascript:false' : 'about:blank';
        iframe.attr('src', src);
        iframe.attr('origineSrc', src);

        return iframe;
    }

    function createHtmlForm(option: IOption, iframeId: string): JQuery {
        const form = $('<form></form>');
        form.attr('method', option.method);
        form.attr('action', option.url);
        form.attr('target', iframeId);
        form.attr('encoding', 'multipart/form-data');
        form.attr('enctype', 'multipart/form-data');

        if (option.method.toLowerCase() === 'GET') {
            applyGetMethodOnForm(form, option);
        } else {
            applyPostMethodOnForm(form, option);
        }

        cloneAndMoveInputFiles(form, option.files);

        return form;
    };

    function cloneAndMoveInputFiles(form: JQuery, files: IFileData[]): void {
        $.each(files, (num, file) => {
            cloneAndMoveInputFile(form, file);
        });
    };

    function cloneAndMoveInputFile(form: JQuery, file: IFileData): void {
        const input = $(file.element);

        input.replaceWith(input.clone(true, true));

        input.attr('name', file.name);
        input.off();

        form.append(file.element);
    };

    function urlHasAlreadyParameters(url: string): boolean {
        return url.indexOf('?') !== -1;
    }

    function applyGetMethodOnForm(form: JQuery, option: IOption): JQuery {
        const urlParameters = $.param(option.data);

        const url = option.url + (urlHasAlreadyParameters(option.url) ? '&' : '?') + urlParameters;

        form.attr('action', url);

        return form;
    };

    function applyPostMethodOnForm(form: JQuery, option: IOption): JQuery {
        form.attr('action', option.url);

        const parameters = JsonToPostDataConverter.convert(option.data);

        $.each(parameters, (num, parameter) => {
            const input = $('<input type="hidden" />');
            input.attr('name', parameter.name);
            input.val(parameter.value);

            input.appendTo(form);
        });

        return form;
    };

    export function createForm<T>(option: IOption, requestId: string): IForm<T> {
        const form = new Form<T>(option);
        form.initialize(requestId);

        return form;
    };
}
