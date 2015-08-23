declare namespace AjaxFileKnockout {
    interface IFileInputWrapper {
        getElement(): HTMLInputElement;
        fileSelected(): boolean;
    }
}

interface KnockoutBindingHandlers {
    file: KnockoutBindingHandler;
}
